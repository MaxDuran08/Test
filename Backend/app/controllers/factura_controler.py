from flask import Blueprint, request, jsonify
from app.db import db_singleton  # Importar el Singleton
from datetime import datetime
from contextlib import closing

ver_supervisor_bp = Blueprint("ver_supervisor", __name__)
reporte_factura_bp = Blueprint("reporte_factura", __name__)
reporte_ventas_bp = Blueprint("reporte_ventas", __name__)
reporte_ventas_periodo_bp = Blueprint("reporte_ventas_periodo", __name__)



@reporte_factura_bp.route('/facturas', methods=['POST'])
def filtrar_facturas():
    try:
        # Obtener parámetros del cuerpo de la solicitud
        filtros = request.get_json()
        
        # Validar parámetros
        fecha_inicio = filtros.get('fecha_inicio')
        fecha_fin = filtros.get('fecha_fin')
        empleado_cui = filtros.get('empleado_cui')
        cliente_id = filtros.get('cliente_id')

        # Construir consulta SQL dinámica
        query = '''
        SELECT 
            f.idFactura,
            e.Nombre AS empleado_nombre,
            f.Empleado_CUI,
            c.Nombre AS cliente_nombre,
            c.idCliente AS cliente_id,
            c.Correo AS cliente_correo,
            f.Fecha_compra,
            f.Precio_total,
            f.Metodo_pago,
            f.Direccion,
            d.Cantidad,
            d.Precio AS detalle_precio,
            l.Titulo AS libro_titulo,
            p.Nombre AS producto_nombre
        FROM facturas f
        INNER JOIN Empleados e ON f.Empleado_CUI = e.CUI
        INNER JOIN cliente c ON f.Cliente_idCliente = c.idCliente
        LEFT JOIN detalle_factura d ON f.idFactura = d.Factura_idFactura
        LEFT JOIN libros l ON d.Libros_idLibros = l.idLibros
        LEFT JOIN producto p ON d.Producto_idProducto = p.idProducto
        '''
        params = []


        # Filtro por rango de fechas
        if fecha_inicio and fecha_fin:
            try:
                datetime.strptime(fecha_inicio, '%Y-%m-%d')
                datetime.strptime(fecha_fin, '%Y-%m-%d')
                query += " AND f.Fecha_compra BETWEEN %s AND %s"
                params.extend([fecha_inicio, fecha_fin])
            except ValueError:
                return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

        # Filtro por empleado
        if empleado_cui:
            if not str(empleado_cui).isdigit():
                return jsonify({"error": "CUI de empleado debe ser numérico"}), 400
            query += " AND f.Empleado_CUI = %s"
            params.append(empleado_cui)

        # Filtro por cliente
        if cliente_id:
            if not str(cliente_id).isdigit():
                return jsonify({"error": "ID de cliente debe ser numérico"}), 400
            query += " AND f.Cliente_idCliente = %s"
            params.append(cliente_id)

        query += " ORDER BY f.idFactura ASC"

        # Ejecutar consulta
        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params)
        facturas_data = cursor.fetchall()

        # Procesamiento de resultados (igual al anterior)
        facturas = {}
        for row in facturas_data:
            factura_id = row['idFactura']
            
            if factura_id not in facturas:
                facturas[factura_id] = {
                    "id_factura": factura_id,
                    "Nombre": row['empleado_nombre'],
                    "Empleado_CUI": row['Empleado_CUI'],
                    "Nombre_Cliente": row['cliente_nombre'],
                    "Cliente_ID": row['cliente_id'],
                    "Correo_Cliente": row['cliente_correo'],
                    "Fecha_compra": row['Fecha_compra'],
                    "Precio_total": float(row['Precio_total']), 
                    "Metodo_pago": row['Metodo_pago'],
                    "Direccion": row['Direccion'],
                    "Detalle_Factura": []
                }
            
            # Agregar detalle si existe
            if row['Cantidad'] is not None:
                detalle = {
                    "Cantidad": row['Cantidad'],
                    "Precio": float(row['detalle_precio']),  # Conversión explícita
                    "Titulo_libro": row['libro_titulo'],
                    "Nombre_producto": row['producto_nombre']
                }
                facturas[factura_id]['Detalle_Factura'].append(detalle)

        return jsonify({'facturas': list(facturas.values())}), 200

    except Exception as e:
        return jsonify({"error": "Error procesando la solicitud"}), 500
    finally:
        cursor.close()

@ver_supervisor_bp.route('/supervisores', methods=['GET'])
def ver_datos_supervisores():

    try:
        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()
        cursor.execute('''SELECT e.CUI, e.Nombre, e.Correo, e.Telefono, e.Edad, e.Genero, e.Fecha_ingreso, e.Estado, r.Nombre
            FROM Empleados e
            INNER JOIN Roles r ON e.Roles_id = r.idRoles
            ''')
        #fetchone/fetchall
        supervisores = cursor.fetchall()
        
        claves = ["CUI","Nombre","Correo","Telefono","Edad","Genero", "Fecha_ingreso", "Estado", "Puesto"]
        
        supervisores_data = []
        for supervisor in supervisores:
            supervisores_data.append(dict(zip(claves, supervisor)))
        

        # Convertir a JSON
        return jsonify({'Supervisores obtenidos':supervisores_data}), 200
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        connection.close()


@reporte_factura_bp.route('/ventas', methods=['POST'])
def filtrar_ventas():
    try:
        # Obtener parámetros del cuerpo de la solicitud
        filtros = request.get_json()
        
        # Validar parámetros
        fecha_inicio = filtros.get('fecha_inicio')
        fecha_fin = filtros.get('fecha_fin')

        # Validar que ambas fechas estén presentes
        if not fecha_inicio or not fecha_fin:
            return jsonify({"error": "Se requieren ambas fechas (fecha_inicio y fecha_fin)"}), 400

        # Validar formato de fechas
        try:
            fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
            fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

        # Construir consultas SQL con filtro de fechas
        query_productos = '''
            (
                SELECT 
                    p.Nombre AS Producto,
                    COUNT(DISTINCT f.idFactura) AS TotalFacturas
                FROM facturas f
                LEFT JOIN detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN producto p ON d.Producto_idProducto = p.idProducto
                WHERE p.idProducto IS NOT NULL
                AND f.Fecha_compra BETWEEN %s AND %s
                GROUP BY p.Nombre
            )
            UNION ALL
            (
                SELECT 
                    l.Titulo AS Producto,
                    COUNT(DISTINCT f.idFactura) AS TotalFacturas
                FROM facturas f
                LEFT JOIN detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN libros l ON d.Libros_idLibros = l.idLibros
                WHERE l.idLibros IS NOT NULL
                AND f.Fecha_compra BETWEEN %s AND %s
                GROUP BY l.Titulo
            )
            ORDER BY TotalFacturas DESC;
        '''

        query_categorias = '''
            (
                SELECT 
                    p.Categoria AS Categoria,
                    SUM(d.Precio * d.Cantidad) AS VentasTotales
                FROM facturas f
                LEFT JOIN detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN producto p ON d.Producto_idProducto = p.idProducto
                WHERE p.idProducto IS NOT NULL
                AND f.Fecha_compra BETWEEN %s AND %s
                GROUP BY p.Categoria
            )
            UNION ALL
            (
                SELECT 
                    l.Genero AS Categoria,
                    SUM(d.Precio * d.Cantidad) AS VentasTotales
                FROM facturas f
                LEFT JOIN detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN libros l ON d.Libros_idLibros = l.idLibros
                WHERE l.idLibros IS NOT NULL
                AND f.Fecha_compra BETWEEN %s AND %s
                GROUP BY l.Genero
            )
            ORDER BY VentasTotales DESC;
        '''

        # Ejecutar consultas
        with closing(db_singleton.get_connection()) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                # Ejecutar consulta de productos más vendidos
                cursor.execute(query_productos, (fecha_inicio, fecha_fin, fecha_inicio, fecha_fin))
                productos_vendidos = cursor.fetchall()

                # Ejecutar consulta de volumen de ventas por categoría
                cursor.execute(query_categorias, (fecha_inicio, fecha_fin, fecha_inicio, fecha_fin))
                volumen_categorias = cursor.fetchall()

        # Preparar respuesta
        response_data = {
            "productos_vendidos": productos_vendidos,
            "volumen_Ventas_categorias": volumen_categorias
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {str(e)}")  # Log del error para depuración
        return jsonify({"error": f"Error procesando la solicitud: {str(e)}"}), 500



@reporte_ventas_periodo_bp.route('/ventas_periodo', methods=['POST'])
def ventas_periodo():
    try:
        # Obtener parámetros del cuerpo de la solicitud
        filtros = request.get_json()
        
        # Validar parámetros
        fecha_inicio = filtros.get('fecha_inicio')
        fecha_fin = filtros.get('fecha_fin')

        # Validar que ambas fechas estén presentes
        if not fecha_inicio or not fecha_fin:
            return jsonify({"error": "Se requieren ambas fechas (fecha_inicio y fecha_fin)"}), 400

        # Validar formato de fechas
        try:
            fecha_inicio = datetime.strptime(fecha_inicio, '%Y-%m-%d')
            fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d')
        except ValueError:
            return jsonify({"error": "Formato de fecha inválido. Use YYYY-MM-DD"}), 400

        # Construir consulta SQL
        query = '''
            SELECT 
                COUNT(F.idFactura) AS Total_Facturas,
                SUM(F.Precio_total) AS Total_Ventas
            FROM Facturas F
            WHERE F.Fecha_compra BETWEEN %s AND %s;
        '''
        params = [fecha_inicio, fecha_fin]

        # Ejecutar consulta
        with closing(db_singleton.get_connection()) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                cursor.execute(query, params)
                facturas_data = cursor.fetchone()  # Usamos fetchone porque esperamos un solo registro

        # Procesar resultados
        if not facturas_data:
            return jsonify({"error": "No se encontraron facturas en el período especificado"}), 404

        # Preparar respuesta
        response_data = {
            "total_facturas": facturas_data['Total_Facturas'],
            "total_ventas": float(facturas_data['Total_Ventas']) if facturas_data['Total_Ventas'] else 0
        }

        return jsonify(response_data), 200

    except Exception as e:
        print(f"Error: {str(e)}")  # Log del error para depuración
        return jsonify({"error": "Error procesando la solicitud"}), 500