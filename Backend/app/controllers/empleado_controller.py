from flask import Blueprint, request, jsonify
from app.db import db_singleton  # Importar el Singleton
import base64  # Para codificar bytes a string
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from io import BytesIO
from app.services.s3 import S3Service

ver_articulo_bp = Blueprint("ver_articulo", __name__)
generar_factura_bp = Blueprint("generar_factura", __name__)
venta_bp = Blueprint("venta", __name__)
ticket_bp = Blueprint("ticket", __name__)


from flask import request, jsonify


@ticket_bp.route('/ticket_aprobacion', methods=['PUT'])
def aprobacion_ticket():
    try:
        # Obtener datos del cuerpo en formato JSON
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo de solicitud vacío"}), 400

        ticket_id = data.get('ticket_id')

        # Validación de campos
        if not ticket_id or not isinstance(ticket_id, int):
            return jsonify({"error": "ticket_id inválido"}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar existencia del ticket
        cursor.execute('''
            SELECT idAsignacion FROM AsignacionTicket
            WHERE Ticket_idTicket = %s
        ''', (ticket_id,))
        
        if not cursor.fetchone():
            return jsonify({
                "error": "Ticket no encontrado"
            }), 404

        # Actualizar solicitud de resolución
        try:
            cursor.execute('''
                UPDATE SolicitudesResolucion
                SET Aprobado = TRUE,
                    FechaAprobacion = NOW()
                WHERE Ticket_idTicket = %s 
                AND Aprobado = FALSE
            ''', (ticket_id,))

            if cursor.rowcount == 0:
                return jsonify({
                    "error": "No se encontró solicitud pendiente para aprobar"
                }), 404

            # Actualizar estado del ticket a Resuelto
            cursor.execute('''
                UPDATE TicketSoporte
                SET Estado = 'Resuelto',
                    Fecha_resolucion = NOW()
                WHERE idTicket = %s
            ''', (ticket_id,))

            connection.commit()
            return jsonify({
                "mensaje": "Ticket aprobado exitosamente",
                "idTicket": ticket_id,
                "timestamp": datetime.now().isoformat()
            }), 200

        except Exception as db_error:
            connection.rollback()
            return jsonify({
                "error": "Error en base de datos",
                "details": str(db_error)
            }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "details": str(e)
        }), 500

    finally:
        if 'cursor' in locals(): cursor.close()
        if 'connection' in locals(): connection.close()



@ticket_bp.route('/ticket_conversacion', methods=['POST'])
def agregar_mensaje_ticket():
    try:
        # Obtener datos del cuerpo en formato JSON
        data = request.get_json()
        if not data:
            return jsonify({"error": "Cuerpo de solicitud vacío"}), 400
            
        ticket_id = data.get('ticket_id')
        empleado_cui = data.get('empleado_cui')
        mensaje = data.get('mensaje')

        # Validación robusta de campos
        if not ticket_id or not isinstance(ticket_id, int):
            return jsonify({"error": "ticket_id inválido"}), 400
            
        if not empleado_cui or not str(empleado_cui).isdigit():
            return jsonify({"error": "empleado_cui inválido"}), 400
            
        if not mensaje or len(mensaje.strip()) == 0:
            return jsonify({"error": "Mensaje vacío"}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar asignación del ticket
        cursor.execute('''
            SELECT idAsignacion FROM AsignacionTicket
            WHERE Ticket_idTicket = %s AND Empleado_CUI = %s
        ''', (ticket_id, empleado_cui))
        
        if not cursor.fetchone():
            return jsonify({
                "error": "Ticket no asignado o empleado no válido",
                "details": f"Ticket: {ticket_id} - Empleado: {empleado_cui}"
            }), 403

        # Insertar mensaje con transacción
        try:
            cursor.execute('''
                INSERT INTO ConversacionTicket 
                (Ticket_idTicket, Remitente, Empleado_CUI, Mensaje, FechaMensaje)
                VALUES (%s, 'Empleado', %s, %s, NOW())
            ''', (ticket_id, empleado_cui, mensaje.strip()))
            
            connection.commit()
            return jsonify({
                "mensaje": "Mensaje enviado",
                "idTicket": ticket_id,
                "timestamp": datetime.now().isoformat()
            }), 201
            
        except Exception as db_error:
            connection.rollback()
            return jsonify({
                "error": "Error en base de datos",
                "details": str(db_error)
            }), 500

    except Exception as e:
        return jsonify({
            "error": "Error interno del servidor",
            "details": str(e)
        }), 500
        
    finally:
        if 'cursor' in locals(): cursor.close()
        if 'connection' in locals(): connection.close()


@ticket_bp.route('/ticket_chat/<int:ticket_id>', methods=['GET'])
def chat_tickets_empleado(ticket_id):
    try:
        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()
        
        # Consulta SQL para obtener el ticket y sus conversaciones
        cursor.execute('''
            SELECT 
                ts.idTicket, 
                ts.Asunto, 
                ts.Descripcion, 
                ts.Estado, 
                ts.Fecha_creacion, 
                ts.Fecha_resolucion,
                ct.idMensaje,
                ct.Remitente,
                ct.Empleado_CUI,
                ct.Mensaje,
                ct.FechaMensaje
            FROM 
                TicketSoporte ts
            LEFT JOIN 
                ConversacionTicket ct ON ts.idTicket = ct.Ticket_idTicket
            WHERE 
                ts.idTicket = %s
            ORDER BY 
                ct.FechaMensaje DESC
        ''', (ticket_id,))
        
        resultados = cursor.fetchall()
        
        if not resultados:
            return jsonify({"error": "Ticket no encontrado"}), 404
        
        # Procesar los resultados
        ticket_data = {
            "idTicket": resultados[0][0],
            "Asunto": resultados[0][1],
            "Descripcion": resultados[0][2],
            "Estado": resultados[0][3],
            "Fecha_creacion": str(resultados[0][4]),
            "Fecha_resolucion": str(resultados[0][5]) if resultados[0][5] else None,
            "Mensajes": []
        }
        
        for row in resultados:
            if row[6] is not None:  # Si hay un mensaje
                mensaje = {
                    "idMensaje": row[6],
                    "Remitente": row[7],
                    "Empleado_CUI": row[8],
                    "Mensaje": row[9],
                    "FechaMensaje": str(row[10])
                }
                ticket_data["Mensajes"].append(mensaje)
        
        return jsonify(ticket_data), 200
    
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


@ticket_bp.route('/ticket', methods=['GET'])
def ver_tickets_empleado():
    # Obtener el parámetro empleado_cui de la solicitud
    empleado_cui = request.args.get('empleado_cui')
    
    # Validar que se haya proporcionado el parámetro
    if not empleado_cui:
        return jsonify({"error": "Se requiere el parámetro empleado_cui"}), 400
    
    try:
        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()
        
        # Consulta SQL para obtener los tickets asignados al empleado
        cursor.execute('''
            SELECT ts.idTicket, ts.Asunto, ts.Descripcion, ts.Estado, ts.Fecha_creacion, ts.Fecha_resolucion
            FROM TicketSoporte ts
            INNER JOIN AsignacionTicket at ON ts.idTicket = at.Ticket_idTicket
            WHERE at.Empleado_CUI = %s
        ''', (empleado_cui,))
        
        # Obtener todos los resultados
        tickets = cursor.fetchall()
        
        # Definir las claves para el formato JSON
        claves = ["idTicket", "Asunto", "Descripcion", "Estado", "Fecha_creacion", "Fecha_resolucion"]
        
        # Convertir los resultados en una lista de diccionarios
        tickets_data = [dict(zip(claves, ticket)) for ticket in tickets]
        
        # Retornar los tickets en formato JSON
        return jsonify({'Tickets obtenidos': tickets_data}), 200
    
    except Exception as e:
        # En caso de error, hacer rollback y retornar el mensaje
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    
    finally:
        # Cerrar cursor y conexión
        cursor.close()
        connection.close()

def generar_pdf_factura(factura_id, fecha_compra, empleado_cui, cliente_id, metodo_pago, direccion, productos, total):
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=letter)
    
    # Establecer título
    pdf.setTitle(f"Factura {factura_id}")

    # Nombre de la librería
    pdf.setFont("Helvetica-Bold", 24)
    pdf.drawString(100, 750, "Librería de Don Héctor")  # Nombre en la parte superior

    # Títulos y Datos generales de la factura
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, 720, f"Factura No: {factura_id}")
    
    pdf.setFont("Helvetica", 12)
    pdf.drawString(100, 705, f"Fecha de Compra: {fecha_compra}")
    pdf.drawString(100, 690, f"Empleado CUI: {empleado_cui}")
    pdf.drawString(100, 675, f"Cliente ID: {cliente_id}")
    pdf.drawString(100, 660, f"Método de Pago: {metodo_pago}")
    pdf.drawString(100, 645, f"Dirección: {direccion or 'No proporcionada'}")



    # Agregar productos en una tabla
    y = 570
    data = [["ID Producto", "Cantidad", "Nombre", "Precio Unitario", "Subtotal"]]

    # Agregar filas de productos
    for item in productos:
        subtotal = item['cantidad'] * item['precio_unitario']
        data.append([item['id'], item['cantidad'], item['nombre'], f"Q{item['precio_unitario']:.2f}", f"Q{subtotal:.2f}"])

    # Crear la tabla
    table = Table(data, colWidths=[80, 60, 150, 100, 100])
    table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkgray),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Ajustar tabla y dibujarla en el PDF
    table.wrapOn(pdf, 50, y)
    table.drawOn(pdf, 50, y - 15)

    # Total de la factura
    y -= (len(productos) * 20) + 40  # Ajustar el espacio para el total
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(100, y, f"Total: Q{total:.2f}")

    # Agregar pie de página
    pdf.setFont("Helvetica", 10)
    pdf.drawString(100, 100, "Gracias por su compra. Para cualquier consulta, comuníquese con nosotros.")

    # Guardar el PDF
    pdf.save()

    buffer.seek(0)
    return buffer




@ver_articulo_bp.route('/descripcion_articulo', methods=['POST'])
def ver_articulo():
    connection = None
    cursor = None
    try:
        # Obtener los datos del cuerpo de la solicitud
        data = request.get_json()
        if not data:
            return jsonify({"error": "Se requiere un cuerpo JSON con 'idProducto'"}), 400

        # Verificar si se proporcionó un ID
        id_producto = data.get('idProducto')

        if not id_producto:
            return jsonify({"error": "Debe proporcionar 'idProducto' del producto"}), 400

        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL con WHERE fijo para idProducto
        query = ''' 
            SELECT p.Nombre, p.Descripcion, p.Categoria, p.Precio_venta, p.Stock, p.Imagen_producto 
            FROM Producto p 
            WHERE p.idProducto = %s
        '''
        params = [id_producto]

        # Ejecutar la consulta con parámetros
        cursor.execute(query, params)
        
        # Obtener el resultado
        articulo = cursor.fetchone()
        
        if not articulo:
            return jsonify({"error": "Producto no encontrado"}), 404

        # Definir las claves para el diccionario
        claves = ["Nombre", "Descripcion", "Categoria", "Precio_venta", "Stock", "Imagen_producto"]
        
        # Convertir la fila en un diccionario
        articulo_dict = dict(zip(claves, articulo))
        
        # Convertir bytes a cadena base64 si Imagen_producto es binario
        if isinstance(articulo_dict["Imagen_producto"], bytes):
            articulo_dict["Imagen_producto"] = base64.b64encode(articulo_dict["Imagen_producto"]).decode('utf-8')
        
        # Convertir a JSON
        return jsonify({'Articulo obtenido': articulo_dict}), 200

    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@generar_factura_bp.route('/generar_factura', methods=['POST'])
def generar_factura():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Se requiere un cuerpo JSON con la información de la factura"}), 400

        # Extraer datos del JSON
        empleado_cui = data.get('Empleado_CUI')
        cliente_id = data.get('Cliente_idCliente')
        metodo_pago = data.get('Metodo_pago')
        direccion = data.get('Direccion', None)
        productos = data.get('Productos', [])

        if not (empleado_cui and cliente_id and metodo_pago and productos):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Obtener fecha actual
        fecha_compra = datetime.date.today()

        # Calcular precio total
        precio_total = 0
        for item in productos:
            id_producto = item.get('id')
            cantidad = item.get('cantidad')

            # Buscar precio en Producto
            cursor.execute("SELECT Precio_venta, Stock FROM Producto WHERE idProducto = %s", (id_producto,))
            producto = cursor.fetchone()

            # Si no es un producto, buscar en Libros
            if not producto:
                cursor.execute("SELECT Precio, Stock FROM Libros WHERE idLibros = %s", (id_producto,))
                producto = cursor.fetchone()

            if not producto:
                return jsonify({"error": f"Producto o libro con id {id_producto} no encontrado"}), 404

            precio_unitario, stock_disponible = producto

            # Validar stock
            if cantidad > stock_disponible:
                return jsonify({"error": f"Stock insuficiente para id {id_producto}"}), 400

            precio_total += precio_unitario * cantidad

        # Insertar factura
        query_factura = '''
            INSERT INTO Facturas (Empleado_CUI, Cliente_idCliente, Fecha_compra, Precio_total, Metodo_pago, Direccion)
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query_factura, (empleado_cui, cliente_id, fecha_compra, precio_total, metodo_pago, direccion))
        factura_id = cursor.lastrowid  # Obtener el ID de la nueva factura

        # Insertar detalles de factura y actualizar stock
        for item in productos:
            id_producto = item.get('id')
            cantidad = item.get('cantidad')

            # Buscar en Producto
            cursor.execute("SELECT Precio_venta FROM producto WHERE idProducto = %s", (id_producto,))
            producto = cursor.fetchone()
            
            if producto:
                precio_unitario = producto[0]
                cursor.execute("UPDATE Producto SET Stock = Stock - %s WHERE idProducto = %s", (cantidad, id_producto))
            else:
                cursor.execute("SELECT Precio FROM Libros WHERE idLibros = %s", (id_producto,))
                libro = cursor.fetchone()
                if libro:
                    precio_unitario = libro[0]
                    cursor.execute("UPDATE Libros SET Stock = Stock - %s WHERE idLibros = %s", (cantidad, id_producto))

            query_detalle = '''
                INSERT INTO Detalle_factura (Factura_idFactura, Libros_idLibros, Producto_idProducto, Cantidad, Precio)
                VALUES (%s, %s, %s, %s, %s)
            '''
            cursor.execute(query_detalle, (factura_id, id_producto if producto else None, None if producto else id_producto, cantidad, precio_unitario))

        connection.commit()  # Confirmar cambios
        # Añadir nombre a productos antes de crear el PDF
        for item in productos:
            id_producto = item['id']
            cursor.execute("SELECT Nombre FROM Producto WHERE idProducto = %s", (id_producto,))
            result = cursor.fetchone()
            if result:
                item['nombre'] = result[0]
                cursor.execute("SELECT Precio_venta FROM Producto WHERE idProducto = %s", (id_producto,))
                item['precio_unitario'] = cursor.fetchone()[0]
            else:
                cursor.execute("SELECT Titulo FROM Libros WHERE idLibros = %s", (id_producto,))
                result = cursor.fetchone()
                if result:
                    item['nombre'] = result[0]
                    cursor.execute("SELECT Precio FROM Libros WHERE idLibros = %s", (id_producto,))
                    item['precio_unitario'] = cursor.fetchone()[0]

        # Crear PDF

        pdf_buffer = generar_pdf_factura(factura_id, fecha_compra, cliente_id, empleado_cui, metodo_pago, direccion, productos, precio_total)
        pdf_buffer.seek(0)
        encoded_pdf = base64.b64encode(pdf_buffer.read()).decode('utf-8')
        base64_pdf_string = f"data:application/pdf;base64,{encoded_pdf}"

        link, error_upload = S3Service.upload_base64_pdf(base64_pdf_string)
        # Actualizar URL del PDF en la base de datos
        try:
            update_pdf_query = "UPDATE Facturas SET PDF = %s WHERE idFactura = %s"
            cursor.execute(update_pdf_query, (link, factura_id))
            connection.commit()
        except Exception as e:
            connection.rollback()
            return jsonify({"error": "Error al guardar el PDF en la base de datos", "details": str(e)}), 500
        
        # Guardar PDF en S3 (aquí se asume que S3Service.upload_base64_pdf devuelve la URL del PDF)
        return jsonify({"mensaje": "Factura generada correctamente","idFactura": factura_id, "total": precio_total}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

from datetime import date






@venta_bp.route('/registrar_venta', methods=['POST'])
def registrar_venta():
    connection = None
    cursor = None
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Se requiere un cuerpo JSON con los datos de la venta"}), 400
        
        empleado_cui = data.get('Empleado_CUI')
        cliente_id = data.get('Cliente_idCliente')
        metodo_pago = data.get('Metodo_pago')
        direccion = data.get('Direccion')
        detalles = data.get('Detalles')
        
        if not (empleado_cui and cliente_id and metodo_pago and direccion and detalles):
            return jsonify({"error": "Faltan datos obligatorios: Empleado_CUI, Cliente_idCliente, Metodo_pago, Direccion y Detalles"}), 400
        
        total = 0.0
        for item in detalles:
            cantidad = item.get('Cantidad')
            precio = item.get('Precio')
            if cantidad is None or precio is None:
                return jsonify({"error": "Cada detalle debe incluir 'Cantidad' y 'Precio'"}), 400
            total += float(cantidad) * float(precio)
        
        connection = db_singleton.get_connection()
        connection.autocommit = False
        cursor = connection.cursor()
        
        # Validar si el empleado existe
        consulta_empleado = "SELECT CUI FROM Empleados WHERE CUI = %s"
        cursor.execute(consulta_empleado, [empleado_cui])
        empleado = cursor.fetchone()
        if not empleado:
            return jsonify({"error": f"Empleado con CUI {empleado_cui} no existe"}), 400
        
        # Validar stock y preparar actualización
        for item in detalles:
            cantidad = int(item['Cantidad'])
            if 'Libros_idLibros' in item:
                libro_id = item['Libros_idLibros']
                cursor.execute("SELECT Stock FROM Libros WHERE idLibros = %s", [libro_id])
                stock = cursor.fetchone()
                if not stock or stock[0] < cantidad:
                    raise Exception(f"Stock insuficiente para el libro {libro_id}")
            elif 'Producto_idProducto' in item:
                producto_id = item['Producto_idProducto']
                cursor.execute("SELECT Stock FROM Producto WHERE idProducto = %s", [producto_id])
                stock = cursor.fetchone()
                if not stock or stock[0] < cantidad:
                    raise Exception(f"Stock insuficiente para el producto {producto_id}")

        # Insertar la factura
        fecha_actual = date.today().strftime("%Y-%m-%d")
        insert_factura = """
            INSERT INTO Facturas (Empleado_CUI, Cliente_idCliente, Fecha_compra, Precio_total, Metodo_pago, Direccion)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        factura_params = [empleado_cui, cliente_id, fecha_actual, total, metodo_pago, direccion]
        cursor.execute(insert_factura, factura_params)
        id_factura = cursor.lastrowid
        
        # Insertar detalles y actualizar stock
        for item in detalles:
            cantidad = item['Cantidad']
            precio = item['Precio']
            producto_id = item.get('Producto_idProducto', None)
            libro_id = item.get('Libros_idLibros', None)
            
            insert_detalle = """
                INSERT INTO Detalle_factura (Factura_idFactura, Libros_idLibros, Producto_idProducto, Cantidad, Precio)
                VALUES (%s, %s, %s, %s, %s)
            """
            detalle_params = [id_factura, libro_id, producto_id, cantidad, precio]
            cursor.execute(insert_detalle, detalle_params)
            
            # Actualizar stock
            if libro_id:
                cursor.execute("UPDATE Libros SET Stock = Stock - %s WHERE idLibros = %s", [cantidad, libro_id])
            elif producto_id:
                cursor.execute("UPDATE Producto SET Stock = Stock - %s WHERE idProducto = %s", [cantidad, producto_id])
        
        connection.commit()
        
        return jsonify({
            "mensaje": "Venta registrada exitosamente",
            "idFactura": id_factura,
            "Precio_total": total,
            "Fecha_compra": fecha_actual
        }), 200
        
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
