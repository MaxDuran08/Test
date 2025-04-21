from flask import Blueprint, request, jsonify
from app.db import db_singleton  # Importar el Singleton
from datetime import datetime
from contextlib import closing

ver_supervisor_bp = Blueprint("ver_supervisor", __name__)
reporte_factura_bp = Blueprint("reporte_factura", __name__)
reporte_ventas_bp = Blueprint("reporte_ventas", __name__)
reporte_ventas_periodo_bp = Blueprint("reporte_ventas_periodo", __name__)
reporte_ganancias_bp =  Blueprint("reporte_ganancias_bp",__name__)

alerta_general_bp =  Blueprint("alerta_general_bp",__name__)



@alerta_general_bp.route('/alerta_general', methods=['GET'])
def alerta_general():
    connection = None
    cursor = None
    try:
        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()
        
        # Agregar condición de estado 'Contratado' a la consulta SQL
        cursor.execute('''
            SELECT p.idProducto, p.Nombre, p.Stock
            FROM Producto p; ''')
        
        # Obtener todos los resultados de la consulta
        productosStock = cursor.fetchall()
        
        claves = ["idProducto", "Nombre", "Stock"]
        
        productosStock_data = []
        for Stock in productosStock:
            productosStock_data.append(dict(zip(claves, Stock)))
        
        # Convertir a JSON
        return jsonify({'Stock en productos obtenidos': productosStock_data}), 200
    
    except Exception as e:
        connection.rollback()  # Revertir cambios en caso de error
        return jsonify({"error": str(e)}), 500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

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
        FROM Facturas f
        INNER JOIN Empleados e ON f.Empleado_CUI = e.CUI
        INNER JOIN Cliente c ON f.Cliente_idCliente = c.idCliente
        LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
        LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
        LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto
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
    connection = None
    cursor = None
    try:
        # Obtener conexión y cursor desde el Singleton
        connection = db_singleton.get_connection()
        cursor = connection.cursor()
        
        # Agregar condición de estado 'Contratado' a la consulta SQL
        cursor.execute('''
            SELECT e.CUI, e.Nombre, e.Correo, e.Telefono, e.Edad, e.Genero, e.Fecha_ingreso, e.Estado, r.Nombre
            FROM Empleados e
            INNER JOIN Roles r ON e.Roles_id = r.idRoles
            WHERE r.Nombre = %s;
        ''', ('Supervisor','Contratado',))  # Pasar 'Contratado' como parámetro de la consulta
        
        # Obtener todos los resultados de la consulta
        supervisores = cursor.fetchall()
        
        claves = ["CUI", "Nombre", "Correo", "Telefono", "Edad", "Genero", "Fecha_ingreso", "Estado", "Puesto"]
        
        supervisores_data = []
        for supervisor in supervisores:
            supervisores_data.append(dict(zip(claves, supervisor)))
        
        # Convertir a JSON
        return jsonify({'Supervisores obtenidos': supervisores_data}), 200
    
    except Exception as e:
        connection.rollback()  # Revertir cambios en caso de error
        return jsonify({"error": str(e)}), 500
    
    finally:
        if cursor:
            cursor.close()
        if connection:
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
                FROM Facturas f
                LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto
                WHERE p.idProducto IS NOT NULL
                AND f.Fecha_compra BETWEEN %s AND %s
                GROUP BY p.Nombre
            )
            UNION ALL
            (
                SELECT 
                    l.Titulo AS Producto,
                    COUNT(DISTINCT f.idFactura) AS TotalFacturas
                FROM Facturas f
                LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
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
                FROM Facturas f
                LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto
                WHERE p.idProducto IS NOT NULL
                AND f.Fecha_compra BETWEEN %s AND %s
                GROUP BY p.Categoria
            )
            UNION ALL
            (
                SELECT 
                    l.Genero AS Categoria,
                    SUM(d.Precio * d.Cantidad) AS VentasTotales
                FROM Facturas f
                LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
                LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
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



@reporte_ganancias_bp.route('/ganancias', methods=['GET'])
def reporte_ganancias():
    try:
        query_ganancias = '''
            SELECT 
                COALESCE(SUM(
                    (CASE WHEN d.Libros_idLibros IS NOT NULL THEN l.Precio ELSE 0 END) * d.Cantidad +
                    (CASE WHEN d.Producto_idProducto IS NOT NULL THEN p.Precio_venta ELSE 0 END) * d.Cantidad
                ), 0) AS GananciasTotales
            FROM Detalle_factura d
            LEFT JOIN Facturas f ON d.Factura_idFactura = f.idFactura
            LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
            LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto;
        '''

        with closing(db_singleton.get_connection()) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                cursor.execute(query_ganancias)
                ganancias_data = cursor.fetchone()

        # Si no se obtuvo resultado, devolver 0
        if ganancias_data is None or ganancias_data['GananciasTotales'] is None:
            return jsonify({"total_ganancias": 0.0}), 200

        return jsonify({"total_ganancias": float(ganancias_data['GananciasTotales'])}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reporte_ganancias_bp.route('/margen_ganancia_producto', methods=['GET'])
def margen_ganancia_producto():
    try:
        query = '''
                    SELECT 
    Datos.Producto,
    Datos.Precio_venta,
    Datos.Precio_compra,
    SUM(Datos.Total_Vendido) AS Total_Vendido,
    SUM((Datos.Precio_venta - Datos.Precio_compra) * Datos.Total_Vendido) AS Margen_Ganancia
FROM (
    -- Parte de Productos
    SELECT 
        p.Nombre AS Producto,
        p.Precio_venta,
        p.Precio_compra,
        COALESCE(SUM(d.Cantidad), 0) AS Total_Vendido
    FROM Detalle_factura d
    LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto
    WHERE p.idProducto IS NOT NULL
    GROUP BY p.Nombre, p.Precio_venta, p.Precio_compra

    UNION ALL

    -- Parte de Libros
    SELECT 
        l.Titulo AS Producto,
        l.Precio AS Precio_venta,
        0 AS Precio_compra, -- No existe en tabla Libros, asumimos 0
        COALESCE(SUM(d.Cantidad), 0) AS Total_Vendido
    FROM Detalle_factura d
    LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
    WHERE l.idLibros IS NOT NULL
    GROUP BY l.Titulo, l.Precio
) AS Datos
GROUP BY Datos.Producto, Datos.Precio_venta, Datos.Precio_compra
ORDER BY Margen_Ganancia DESC
        '''

        with closing(db_singleton.get_connection()) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                cursor.execute(query)
                data = cursor.fetchall()

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": f"Error en la consulta SQL: {str(e)}"}), 500


@reporte_ganancias_bp.route('/comparacion_ganancias_periodos', methods=['GET'])
def comparacion_ganancias_periodos():
    try:
        query = '''
        SELECT 
            DATE_FORMAT(f.Fecha_compra, '%Y-%m') AS Periodo,
            SUM(d.Cantidad * (CASE WHEN d.Libros_idLibros IS NOT NULL THEN l.Precio ELSE p.Precio_venta END)) AS Ganancias
        FROM Facturas f
        LEFT JOIN Detalle_factura d ON f.idFactura = d.Factura_idFactura
        LEFT JOIN Libros l ON d.Libros_idLibros = l.idLibros
        LEFT JOIN Producto p ON d.Producto_idProducto = p.idProducto
        GROUP BY Periodo
        ORDER BY Periodo;

        '''
        
        with closing(db_singleton.get_connection()) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                cursor.execute(query)
                data = cursor.fetchall()

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@reporte_ganancias_bp.route('/ganancias_categoria', methods=['GET'])
def ganancias_categoria():
    try:
        query = '''
        SELECT 
    Datos.Producto,
    SUM(Datos.Ganancia) AS Ganancia_Neta
FROM (
    -- Parte de Productos
    SELECT 
        p.Nombre AS Producto,
        (p.Precio_venta - p.Precio_compra) * d.Cantidad AS Ganancia
    FROM Detalle_factura d
    JOIN Producto p ON d.Producto_idProducto = p.idProducto

    UNION ALL

    -- Parte de Libros
    SELECT 
        l.Titulo AS Producto,
        (l.Precio * d.Cantidad) AS Ganancia
    FROM Detalle_factura d
    JOIN Libros l ON d.Libros_idLibros = l.idLibros
) AS Datos
GROUP BY Datos.Producto
ORDER BY Ganancia_Neta DESC;


        '''

        with closing(db_singleton.get_connection()) as connection:
            with closing(connection.cursor(dictionary=True)) as cursor:
                cursor.execute(query)
                data = cursor.fetchall()

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



    except Exception as e:
        print(f"Error: {str(e)}")  # Log del error para depuración
        return jsonify({"error": "Error procesando la solicitud"}), 500