from flask import Blueprint, request, jsonify
import mysql
from app.db import db_singleton  # Importar el Singleton
import base64
import random
from app.services.s3 import S3Service


mod_producto_bp = Blueprint("mod_producto", __name__)
eliminar_producto_bp = Blueprint("eliminar_producto",__name__)
ver_Empleados_bp = Blueprint("ver_empleados",__name__)
agregar_libro_bp = Blueprint("agregar_libro",__name__)
ver_producto_bp = Blueprint("ver_producto_bp",__name__)
ver_facturas_bp = Blueprint("ver_facturas_bp",__name__)
agregar_producto_bp = Blueprint('agregar_producto_bp', __name__)
ver_todas_opiniones_bp = Blueprint("ver_todas_opiniones_bp",__name__)
obtener_empleado_bp = Blueprint("obtener_empleado_bp",__name__)
eliminar_libro_bp = Blueprint("eliminar_libro",__name__)
modificar_libro_bp = Blueprint("modificar_libro",__name__)
obtener_libro_bp = Blueprint("obtener_libro",__name__)
agregar_empleado_bp = Blueprint("agregar_empleado",__name__)
modificar_empleado_bp = Blueprint("modificar_empleado",__name__)
tickets_supervisor_bp = Blueprint("tickets_supervisor_bp", __name__)


# Agregar y ver nuevos productos
import base64
from flask import request, jsonify
from app.config.config import Config
import smtplib
from email.mime.text import MIMEText
from email.header import Header
import secrets

def enviar_correo_credenciales(correo, usuario, contrasena):
    """Envía un correo con las credenciales de acceso."""
    try:
        smtp_obj = smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT)
        smtp_obj.starttls()
        smtp_obj.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)

        mensaje = f"""
        <html>
            <body>
                <p>Hola,</p>
                <p>Se ha creado tu cuenta en el sistema. Estas son tus credenciales de acceso:</p>
                <p><b>Usuario:</b> {usuario}</p>
                <p><b>Contraseña:</b> {contrasena}</p>
                <p>Por favor, cambia tu contraseña después de iniciar sesión.</p>
            </body>
        </html>
        """

        email_message = MIMEText(mensaje, "html")
        email_message["From"] = Config.SMTP_USERNAME
        email_message["To"] = correo
        email_message["Subject"] = Header("Credenciales de acceso")

        smtp_obj.sendmail(Config.SMTP_USERNAME, correo, email_message.as_string())
        smtp_obj.quit()

        print("Correo de credenciales enviado")
    except Exception as e:
        print(f"Error al enviar correo: {str(e)}")

@agregar_empleado_bp.route('/agregar_empleado', methods=['POST'])
def agregar_empleado():
    data = request.get_json()

    # Mapeo de los campos recibidos a los campos de la base de datos
    mapped_data = {
        "CUI": data.get("cui"),
        "Nombre": data.get("nombre"),
        "Correo": data.get("email"),
        "Telefono": data.get("telefono"),
        "Edad": data.get("edad"),
        "Genero": data.get("genero"),
        "Fecha_ingreso": data.get("fecha"),
        "Foto": data.get("foto", ""),  # Usamos un valor predeterminado vacío si 'foto' no está presente
        "Roles_id": "3"  # Asegúrate de que "roles_id" se pase correctamente en la solicitud
    }
    # Campos requeridos
    required_fields = ["CUI", "Nombre", "Correo", "Telefono", "Edad", "Genero", "Fecha_ingreso", "Foto","Roles_id"]
    if not all(field in mapped_data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si ya existe un empleado con el mismo CUI
        cursor.execute("SELECT COUNT(*) FROM Empleados WHERE CUI = %s", (mapped_data["CUI"],))
        result = cursor.fetchone()

        if result[0] > 0:
            return jsonify({"error": "El empleado ya existe"}), 409  # Código 409 (conflicto)

        datos = (mapped_data["CUI"], mapped_data["Roles_id"], mapped_data["Nombre"], 
                 mapped_data["Correo"], mapped_data["Telefono"], 
                 mapped_data["Edad"], mapped_data["Genero"], mapped_data["Fecha_ingreso"], mapped_data["Foto"]
                 )
        cursor.execute("INSERT INTO Empleados (CUI,Roles_id, Nombre, Correo, Telefono, Edad, Genero, Fecha_ingreso, Foto) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",datos )
        connection.commit()

        usuario = str(mapped_data["CUI"])  # El CUI es el nombre de usuario
        contrasena_plana = secrets.token_urlsafe(10)  # Genera una contraseña aleatoria
        
        enviar_correo_credenciales(mapped_data["Correo"], usuario, contrasena_plana)

        return jsonify({"message": "Empleado agregado correctamente"}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        print("Error en el backend:", str(e))  # Esto te dará más detalles sobre el error
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@modificar_empleado_bp.route('/modificar_empleado', methods=['PUT'])
def modificar_empleado():
    data = request.get_json()
    # Campos requeridos, incluyendo CUI
    required_fields = ["cui", "correo", "telefono"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL para actualizar el empleado
        query = """
            UPDATE Empleados
            SET 
                Correo = %s,
                Telefono = %s
            WHERE CUI = %s
        """
        # Parámetros para la consulta
        params = (
            data["correo"],
            data["telefono"],
            data["cui"]
        )

        # Ejecutar la consulta
        cursor.execute(query, params)
        connection.commit()

        return jsonify({"message": "Empleado modificado correctamente"}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        print("Error en el backend:", str(e))  # Esto te dará más detalles sobre el error
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



@agregar_libro_bp.route('/agregar_libro', methods=['POST'])
def agregar_usuario():
    data = request.get_json()
    
    # Campos requeridos
    required_fields = ["titulo", "autor", "fecha_lanzamiento", "descripcion", "genero", "stock", "precio"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400
    print("paso")
    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si ya existe un libro con el mismo título
        cursor.execute("SELECT COUNT(*) FROM Libros WHERE Titulo = %s", (data["titulo"],))
        result = cursor.fetchone()

        if result[0] > 0:
            return jsonify({"error": "El libro ya existe"}), 409  # Código 409 (conflicto)

        # Insertar el nuevo libro si no existe
        query = ("INSERT INTO Libros "
                 "(Titulo, Autor, Fecha_lanzamiento, Descripcion, Genero, Stock, Precio, Estado) "
                 "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)")
        datos = (data["titulo"], data["autor"], data["fecha_lanzamiento"], data["descripcion"], data["genero"], data["stock"], data["precio"], 'Disponible')

        cursor.execute(query, datos)
        connection.commit()

        return jsonify({"message": "Libro agregado correctamente"}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        print("Error en el backend:", str(e))  # Esto te dará más detalles sobre el error
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()




@mod_producto_bp.route('/producto', methods=['PUT'])
def modificar_producto():
    data = request.get_json()
    print(data)
    
    # Campos requeridos, incluyendo idProducto
    required_fields = ["idProducto", "Nombre", "Descripcion", "Categoria", "Precio_compra", "Precio_venta", "Stock", "Imagen_producto"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    # Convertir la imagen de base64 a bytes (BLOB)
    try:
        imagen_bytes = base64.b64decode(data["Imagen_producto"])
    except Exception as e:
        return jsonify({"error": "La imagen en base64 no es válida"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL para actualizar el producto
        query = """
            UPDATE Producto
            SET 
                Nombre = %s,
                Descripcion = %s,
                Categoria = %s,
                Precio_compra = %s,
                Precio_venta = %s,
                Stock = %s,
                Imagen_producto = %s
            WHERE idProducto = %s
        """
        # Parámetros para la consulta
        params = (
            data["Nombre"],
            data["Descripcion"],
            data["Categoria"],
            data["Precio_compra"],
            data["Precio_venta"],
            data["Stock"],
            imagen_bytes,  # Imagen en formato BLOB
            data["idProducto"]  # Filtro para actualizar el producto correcto
        )

        # Ejecutar la consulta
        cursor.execute(query, params)
        connection.commit()



        return jsonify({"message": "Producto modificado correctamente"}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@eliminar_producto_bp.route('/eliminar_producto', methods=['DELETE'])
def eliminar_producto():
    cursor = None
    connection = None
    try:
        data = request.json
        id_productos = data.get('idProducto')
        
        if not id_productos:
            return jsonify({'error': 'Falta el ID del producto'}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si existe un producto con el ID proporcionado
        cursor.execute('SELECT idProducto FROM Producto WHERE idProducto = %s', (id_productos,))
        producto_existente = cursor.fetchone()

        if not producto_existente:
            return jsonify({'error': 'Producto no encontrado'}), 404

        # Desvincular el producto de detalle_factura (establecer Producto_idProducto a NULL)
        cursor.execute('UPDATE Detalle_factura SET Producto_idProducto = NULL WHERE Producto_idProducto = %s', (id_productos,))

        # Desvincular el producto de lista_deseos (establecer Producto_idProducto a NULL)
        cursor.execute('UPDATE Lista_deseos SET Producto_idProducto = NULL WHERE Producto_idProducto = %s', (id_productos,))

        # Eliminar el producto
        cursor.execute('DELETE FROM Producto WHERE idProducto = %s', (id_productos,))
        connection.commit()

        return jsonify({'message': 'Producto eliminado exitosamente y desvinculado de tablas dependientes'}), 200

    except Exception as e:
        print(f"Error al eliminar el producto: {e}")
        connection.rollback()  # Revertir cambios en caso de error
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@ver_Empleados_bp.route('/empleados', methods=['GET'])
def ver_datos_empleados():

    try:
        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()
        cursor.execute('''SELECT e.CUI, e.Nombre, e.Correo, e.Telefono, e.Edad, e.Genero, e.Fecha_ingreso, e.Estado, r.Nombre
            FROM Empleados e
            INNER JOIN Roles r ON e.Roles_id = r.idRoles
            where r.Nombre ='Empleado' ;
            ''')
        #fetchone/fetchall
        empleados = cursor.fetchall()
        
        claves = ["CUI","Nombre","Correo","Telefono","Edad","Genero", "Fecha_ingreso", "Estado", "Puesto"]
        
        empleados_data = []
        for supervisor in empleados:
            empleados_data.append(dict(zip(claves, supervisor)))
        

        # Convertir a JSON
        return jsonify({'empleados obtenidos':empleados_data}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()

## Ver productos

@ver_producto_bp.route('/ver_productos', methods=['GET'])
def ver_productos():
    try:
        # Conexión con la base de datos
        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Consulta para obtener todos los productos
        query_productos = "SELECT * FROM Producto;"
        cursor.execute(query_productos)
        productos = cursor.fetchall()

        # Consulta para obtener todos los libros
        query_libros = "SELECT * FROM Libros;"
        cursor.execute(query_libros)
        libros = cursor.fetchall()

        # Si no se encuentran productos ni libros, devolver mensaje adecuado
        if not productos and not libros:
            return jsonify({"mensaje": "No se encontraron productos ni libros"}), 404

        # Convertir BLOB a Base64 en productos
        for producto in productos:
            if producto["Imagen_producto"]:  # Verifica si el campo no es NULL
                producto["Imagen_producto"] = base64.b64encode(producto["Imagen_producto"]).decode("utf-8")
            else:
                producto["Imagen_producto"] = ""

        # Devolver la lista de productos y libros
        return jsonify({"productos": productos, "libros": libros}), 200

    except Exception as e:
        print(f"Error al obtener los productos y libros: {e}")
        return jsonify({"error": str(e)}), 500

    finally:
        # Cerrar la conexión y el cursor para liberar recursos
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@ver_facturas_bp.route('/ver_facturas', methods=['GET'])
def ver_facturas():
    connection = None
    cursor = None
    try:
        # Conectar a la base de datos
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL para obtener la información de las facturas y detalles asociados
        query = """
            SELECT 
                f.idFactura, 
                f.Fecha_compra, 
                c.Nombre AS Cliente, 
                e.Nombre AS Empleado, 
                f.Precio_total, 
                f.Metodo_pago, 
                f.Direccion,
                f.PDF,
                d.idDetalle, 
                p.idProducto, 
                p.Nombre AS Producto, 
                l.idLibros, 
                l.Titulo AS Libro, 
                d.Cantidad, 
                d.Precio
            FROM Facturas f
            JOIN Empleados e ON f.Empleado_CUI = e.CUI
            JOIN Cliente c ON f.Cliente_idCliente = c.idCliente
            LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
            LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto
            LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
            ORDER BY f.Fecha_compra DESC;
        """

        # Ejecutar la consulta
        cursor.execute(query)
        facturas = cursor.fetchall()

        # Diccionario para agrupar facturas
        facturas_dict = {}
        
        for factura in facturas:
            factura_id = factura[0]
            if factura_id not in facturas_dict:
                facturas_dict[factura_id] = {
                    "id_factura": factura_id,
                    "fecha_emision": factura[1],
                    "cliente": factura[2],
                    "empleado": factura[3],
                    "total": factura[4],
                    "metodo_pago": factura[5],
                    "direccion": factura[6],
                    "pdf": factura[7],   
                    "detalles": {}
                }
            
            # Agrupar productos/libros por ID
            producto_id = factura[9]
            libro_id = factura[11]
            detalle_id = producto_id if producto_id else libro_id
            detalle_nombre = factura[10] if producto_id else factura[12]

            if detalle_id:
                if detalle_id not in facturas_dict[factura_id]["detalles"]:
                    facturas_dict[factura_id]["detalles"][detalle_id] = {
                        "nombre": detalle_nombre,
                        "cantidad": 0,
                        "precio_total": 0
                    }
                facturas_dict[factura_id]["detalles"][detalle_id]["cantidad"] += factura[13]
                facturas_dict[factura_id]["detalles"][detalle_id]["precio_total"] += factura[13] * factura[14]
        
        # Convertir el diccionario a lista y formatear detalles
        facturas_data = []
        for factura in facturas_dict.values():
            factura["detalles"] = list(factura["detalles"].values())
            facturas_data.append(factura)

        # Responder con la lista de facturas
        return jsonify(facturas_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



# @agregar_producto_bp.route('/agregarP', methods=['POST'])
# def agregar_producto1():
#     ## Agregar un nuevo producto a la base de datos PERO SOLO IMAGEN
#     data = request.get_json()
#     # Campos requeridos
#     image = data.get("image")
#     nombre = data.get("nombre")
#     if not image or not nombre:
#         return jsonify({"error": "Faltan campos requeridos"}), 400
#     # Verificar que la imagen esté en base64
#     if not image.startswith("data:image/"):
#         return jsonify({"error": "La imagen no está en formato base64"}), 400
    
#     try:
        
#         url, error = S3Service.upload_base64(image)
#         print(url)
#         return jsonify({"url": url}), 200
            

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
    
    


@agregar_producto_bp.route('/agregar_producto', methods=['POST'])            
def agregar_producto():
    connection = None
    cursor = None
    try:
        data = request.get_json()

        if not data.get('nombre') or not data.get('precio_compra') or not data.get('precio_venta') or not data.get('stock'):
            return jsonify({"error": "Faltan datos obligatorios"}), 400

        nombre = data.get('nombre')
        descripcion = data.get('descripcion', '')
        categoria = data.get('categoria', '')
        precio_compra = data.get('precio_compra')
        precio_venta = data.get('precio_venta')
        stock = data.get('stock')
        imagen_producto = data.get('imagen_producto', None)  

        if imagen_producto:
            try:
                imagen_producto = base64.b64decode(imagen_producto)
            except Exception as e:
                print(f"Error al decodificar la imagen: {e}")
                return jsonify({"error": "Imagen en Base64 no válida"}), 400

        # Conectar a la base de datos
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Insertar el producto en la base de datos
        cursor.execute(
            'INSERT INTO Producto (Nombre, Descripcion, Categoria, Precio_compra, Precio_venta, Stock, Imagen_producto) VALUES (%s, %s, %s, %s, %s, %s, %s)',
            (nombre, descripcion, categoria, precio_compra, precio_venta, stock, mysql.connector.Binary(imagen_producto) if imagen_producto else None)
        )
        connection.commit()

        # Verifica inmediatamente si la imagen se guardó correctamente
        cursor.execute("SELECT LAST_INSERT_ID();")
        id_producto = cursor.fetchone()[0]

        cursor.execute("SELECT OCTET_LENGTH(Imagen_producto) FROM Producto WHERE idProducto = %s;", (id_producto,))
        imagen_size = cursor.fetchone()[0]

        return jsonify({"message": "Producto agregado correctamente"}), 200
    
    except Exception as e:
        print(f"Error al agregar el producto: {e}")
        connection.rollback()
        return jsonify({"error": str(e)}), 500
        
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@ver_todas_opiniones_bp.route('/opiniones', methods=['GET'])
def ver_todas_opiniones():
    connection = None
    cursor = None
    try:
        # Conectar a la base de datos
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Recuperar todas las opiniones de los libros
        query = """
            SELECT o.idOpinion, o.Calificacion, o.Comentario, o.Fecha_opinion, l.Titulo
            FROM Opiniones o
            JOIN Libros l ON o.Libro_idLibros = l.idLibros
        """
        cursor.execute(query)
        opiniones = cursor.fetchall()

        # Formatear la respuesta en un diccionario
        opiniones_data = []
        for opinion in opiniones:
            opinion_data = {
                "id_opinion": opinion[0],
                "calificacion": opinion[1],
                "comentario": opinion[2],
                "fecha_opinion": opinion[3],
                "libro_titulo": opinion[4]
            }
            opiniones_data.append(opinion_data)

        # Responder con la lista de todas las opiniones
        return jsonify(opiniones_data), 200

    except Exception as e:
        # Si ocurre un error, devolver el error con código 500
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@obtener_empleado_bp.route('/obtener_empleado', methods=['GET'])
def obtener_empleado():
    id_empleado = request.args.get('id_empleado', type=int)  # Obtener el ID desde la URL

    if id_empleado is None:
        return jsonify({"error": "ID de empleado no proporcionado"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL para obtener los datos del empleado con el ID proporcionado
        query = """
            SELECT e.CUI, e.Nombre, e.Correo, e.Telefono, e.Edad, e.Estado, e.Fecha_ingreso
            FROM Empleados e 
            WHERE Roles_id = %s;
        """
        cursor.execute(query, (id_empleado,))
        empleados = cursor.fetchall()

        if not empleados:
            return jsonify({"error": "No hay empleados"}), 404

        claves = ["CUI", "Nombre", "Correo", "Telefono", "Edad", "Estado", "Fecha_ingreso"]
        empleados_data = [dict(zip(claves, empleado)) for empleado in empleados]

        return jsonify(empleados_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
        

@eliminar_libro_bp.route('/eliminar_libro', methods=['PUT'])
def eliminar_libro():
    cursor = None
    connection = None
    try:
        # Obtener el id_libro del cuerpo de la solicitud
        id_libro = request.json.get('id_libro')
        print(id_libro)

        if not id_libro:
            return jsonify({'error': 'Falta el ID del libro'}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si existe un libro con el ID proporcionado
        cursor.execute('SELECT idLibros FROM Libros WHERE idLibros = %s', (id_libro,))
        libro_existente = cursor.fetchone()

        if not libro_existente:
            return jsonify({'error': 'Libro no encontrado'}), 404

        # Actualizar el estado del libro a 'No Disponible'
        cursor.execute('UPDATE Libros SET Estado = %s WHERE idLibros = %s', ("No Disponible", id_libro))
        connection.commit()

        return jsonify({'message': 'Libro marcado como No Disponible exitosamente'}), 200

    except Exception as e:
        print(f"Error al eliminar el libro: {e}")
        connection.rollback()
        return jsonify({'error': 'Error interno del servidor'}), 500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()



@obtener_libro_bp.route('/obtener_libro', methods=['GET'])
def obtener_libro():
    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL para obtener los datos del empleado con el ID proporcionado
        query = """
            SELECT * FROM Libros;
        """
        cursor.execute(query)
        libros = cursor.fetchall()

        if not libros:
            return jsonify({"error": "No hay libros"}), 404
        
        claves = ["idLibros", "Titulo", "Autor", "Fecha_lanzamiento", "Descripcion", "Genero", "Stock", "Precio"]
        libros_data = [dict(zip(claves, libro)) for libro in libros]

        return jsonify(libros_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@modificar_libro_bp.route('/modificar_libro', methods=['PUT'])
def modificar_libro():
    data = request.get_json()

    # Verificar que el ID esté presente
    if not data.get("idLibros"):
        return jsonify({"error": "Falta el ID del libro"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Inicializar la consulta y los parámetros
        query = "UPDATE Libros SET "
        params = []
        update_fields = []

        # Verificar y agregar campos que deben actualizarse
        if "titulo" in data:
            update_fields.append("Titulo = %s")
            params.append(data["titulo"])

        if "autor" in data:
            update_fields.append("Autor = %s")
            params.append(data["autor"])

        if "fecha" in data:
            update_fields.append("Fecha_lanzamiento = %s")
            # Convertir la fecha al formato adecuado si es necesario
            params.append(data["fecha"].split('T')[0])  # Fecha en formato YYYY-MM-DD

        if "descripcion" in data:
            update_fields.append("Descripcion = %s")
            params.append(data["descripcion"])

        if "genero" in data:
            update_fields.append("Genero = %s")
            params.append(data["genero"])

        if "stock" in data:
            update_fields.append("Stock = %s")
            params.append(data["stock"])

        if "precio" in data:
            update_fields.append("Precio = %s")
            params.append(data["precio"])

        # Si no se proporciona ningún campo para actualizar
        if not update_fields:
            return jsonify({"error": "No hay campos para actualizar"}), 400

        # Agregar la cláusula WHERE
        query += ", ".join(update_fields) + " WHERE idLibros = %s"
        params.append(data["idLibros"])

        # Ejecutar la consulta de actualización
        cursor.execute(query, params)
        connection.commit()

        return jsonify({"message": "Libro modificado correctamente"}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        print("Error en el backend:", str(e))
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@tickets_supervisor_bp.route('/asignar_ticket', methods=['POST']) 
def asignar_ticket():
    data = request.get_json()
    ticket_id = data.get('ticket_id')
    empleado_cui = data.get('empleado_cui')
    supervisor_cui = data.get('supervisor_cui')

    if not ticket_id or not empleado_cui or not supervisor_cui:
        return jsonify({"error": "Faltan campos requeridos (ticket_id, empleado_cui o supervisor_cui)"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Insertar o actualizar en AsignacionTicket
        cursor.execute("""
            INSERT INTO AsignacionTicket (Ticket_idTicket, Empleado_CUI)
            VALUES (%s, %s)
            ON DUPLICATE KEY UPDATE Empleado_CUI = VALUES(Empleado_CUI)
        """, (ticket_id, empleado_cui))

        # Cambiar estado del ticket a "En proceso"
        cursor.execute("""
            UPDATE TicketSoporte
            SET Estado = 'En proceso'
            WHERE idTicket = %s
        """, (ticket_id,))

        # Insertar en SolicitudesResolucion con Aprobado = FALSE
        cursor.execute("""
            INSERT INTO SolicitudesResolucion (Ticket_idTicket, Empleado_CUI, Supervisor_CUI, Aprobado)
            VALUES (%s, %s, %s, FALSE)
        """, (ticket_id, empleado_cui, supervisor_cui))

        connection.commit()

        return jsonify({"message": "Ticket asignado y solicitud de resolución creada correctamente"}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": f"Error al asignar el ticket: {str(e)}"}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@tickets_supervisor_bp.route('/cancelar_ticket', methods=['POST'])
def cancelar_ticket():
    data = request.get_json()
    ticket_id = data.get('ticket_id')
    razon = data.get('razon')
    supervisor_cui = data.get('supervisor_cui')  # Necesario aquí

    if not ticket_id or not razon or not supervisor_cui:
        return jsonify({"error": "Faltan campos requeridos (ticket_id, razon o supervisor_cui)"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Actualizar estado
        cursor.execute("""
            UPDATE TicketSoporte
            SET Estado = 'Cancelado'
            WHERE idTicket = %s
        """, (ticket_id,))

        # Insertar en CancelacionTicket
        cursor.execute("""
            INSERT INTO CancelacionTicket (Ticket_idTicket, Razon, Supervisor_CUI)
            VALUES (%s, %s, %s)
        """, (ticket_id, razon, supervisor_cui))
        
        connection.commit()

        return jsonify({"message": "Ticket cancelado correctamente"}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            

@tickets_supervisor_bp.route('/aceptar_resolucion', methods=['POST'])
def aceptar_resolucion():
    data = request.get_json()
    ticket_id = data.get('ticket_id')
    supervisor_cui = data.get('supervisor_cui')  # Quien aprueba

    if not ticket_id or not supervisor_cui:
        return jsonify({"error": "Faltan campos requeridos (ticket_id o supervisor_cui)"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Cambiar estado a Resuelto
        cursor.execute("""
            UPDATE TicketSoporte
            SET Estado = 'Resuelto', Fecha_resolucion = NOW()
            WHERE idTicket = %s
        """, (ticket_id,))

        # Actualizar solicitud de resolución
        cursor.execute("""
            UPDATE SolicitudesResolucion
            SET Aprobado = TRUE, FechaAprobacion = NOW(), Supervisor_CUI = %s
            WHERE Ticket_idTicket = %s
        """, (supervisor_cui, ticket_id))

        connection.commit()

        return jsonify({"message": "Resolución aceptada correctamente"}), 200

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@tickets_supervisor_bp.route('/tickets_supervisor', methods=['GET'])
def listar_tickets_supervisor():
    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Primero obtengo los tickets principales
        cursor.execute("""
            SELECT 
                ts.idTicket,
                ts.Asunto,
                ts.Descripcion,
                ts.Estado,
                ts.Fecha_creacion,
                ts.Fecha_resolucion,
                c.Nombre AS NombreCliente
            FROM TicketSoporte ts
            LEFT JOIN Cliente c ON ts.Cliente_idCliente = c.idCliente
            ORDER BY ts.Fecha_creacion DESC
        """)
        tickets = cursor.fetchall()

        for ticket in tickets:
            ticket_id = ticket['idTicket']

            # Último empleado asignado
            cursor.execute("""
                SELECT Empleado_CUI
                FROM AsignacionTicket
                WHERE Ticket_idTicket = %s
                ORDER BY FechaAsignacion DESC
                LIMIT 1
            """, (ticket_id,))
            asignacion = cursor.fetchone()
            ticket['EmpleadoAsignado'] = asignacion['Empleado_CUI'] if asignacion else None

            # Mensajes de la conversación
            cursor.execute("""
                SELECT Remitente, Mensaje, FechaMensaje
                FROM ConversacionTicket
                WHERE Ticket_idTicket = %s
                ORDER BY FechaMensaje ASC
            """, (ticket_id,))
            mensajes = cursor.fetchall()
            ticket['Conversacion'] = mensajes

            # Si tiene solicitud de resolución pendiente
            cursor.execute("""
                SELECT Aprobado
                FROM SolicitudesResolucion
                WHERE Ticket_idTicket = %s
                ORDER BY FechaSolicitud DESC
                LIMIT 1
            """, (ticket_id,))
            solicitud = cursor.fetchone()
            ticket['SolicitudResolucionPendiente'] = (solicitud and not solicitud['Aprobado'])

            # Si tiene cancelación
            cursor.execute("""
                SELECT Razon
                FROM CancelacionTicket
                WHERE Ticket_idTicket = %s
                LIMIT 1
            """, (ticket_id,))
            cancelacion = cursor.fetchone()
            ticket['RazonCancelacion'] = cancelacion['Razon'] if cancelacion else None

        return jsonify(tickets), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
