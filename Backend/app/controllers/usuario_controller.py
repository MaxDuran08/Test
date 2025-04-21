from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, send_file
from app.db import db_singleton  # Importar el Singleton
from app.config.config import Config
import bcrypt
import jwt
from functools import wraps
import secrets
import smtplib
from email.mime.text import MIMEText
from email.header import Header
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from io import BytesIO
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
import base64

agregar_usuario_bp = Blueprint("agregar_usuario", __name__)
eliminar_usuario_bp = Blueprint("eliminar_usuario", __name__)
modificar_usuario_bp = Blueprint("modificar_usuario", __name__)

# Agregar usuario
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

@agregar_usuario_bp.route('/agregar_usuario', methods=['POST'])
def agregar_usuario():
    data = request.get_json()
    
    required_fields = ["CUI", "Roles_id", "Nombre", "Correo", "Telefono", "Edad", "Genero"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Insertar el nuevo empleado
        query = """
            INSERT INTO Empleados (CUI, Roles_id, Nombre, Correo, Telefono, Edad, Genero, Estado)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        valores = (data["CUI"], data["Roles_id"], data["Nombre"], data["Correo"], data["Telefono"], data["Edad"], data["Genero"], "Contratado")
        cursor.execute(query, valores)

        # Generar usuario y contraseña
        usuario = str(data["CUI"])  # El CUI es el nombre de usuario
        contrasena_plana = secrets.token_urlsafe(10)  # Genera una contraseña aleatoria

        # Encriptar la contraseña para la BD
        salt = bcrypt.gensalt()
        contrasena_encriptada = bcrypt.hashpw(contrasena_plana.encode('utf-8'), salt)

        # Insertar credenciales en la tabla Login
        query_login = """
            INSERT INTO Login (Usuario, Contrasena, Empleado_CUI)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query_login, (usuario, contrasena_encriptada, data["CUI"]))

        connection.commit()

        # Enviar correo con las credenciales
        enviar_correo_credenciales(data["Correo"], usuario, contrasena_plana)

        return jsonify({"message": "Usuario agregado correctamente. Se enviaron las credenciales por correo"}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Eliminar usuario
@eliminar_usuario_bp.route('/eliminar_usuario', methods=['POST'])
def eliminar_usuario():
    cursor = None
    connection = None
    try:
        # Obtener los datos correctamente
        data = request.json.get('data', {})
        cui_usuario = int(data.get('CUI'))  # Acceder a CUI dentro de 'data'
        causa = data.get('Causa')  # Acceder a Causa dentro de 'data'
        fecha_despido = datetime.now()
        if not cui_usuario:
            return jsonify({'error': 'Falta el CUI del usuario'}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si existe un usuario con el CUI proporcionado
        cursor.execute('SELECT CUI FROM Empleados WHERE CUI = %s', (cui_usuario,))
        usuario_existente = cursor.fetchone()

        if not usuario_existente:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        # Modificar estado empleado
        cursor.execute('UPDATE Empleados SET Estado = %s WHERE CUI = %s', ('Despedido', cui_usuario))

        # Agregar registro de despido
        cursor.execute('INSERT INTO Despedidos (Empleados_CUI, Causa, Fecha_despido) VALUES (%s, %s, %s)', (cui_usuario, causa, fecha_despido))

        connection.commit()

        return jsonify({'message': 'Usuario eliminado exitosamente'}), 200

    except Exception as e:
        if connection:
            connection.rollback()  # Revertir cambios en caso de error
        return jsonify({'error': 'Error interno del servidor'}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# Modificar usuario
@modificar_usuario_bp.route('/modificar_usuario', methods=['PUT'])
def modificar_usuario():
    data = request.get_json()
    
    # Campos requeridos, excluyendo CUI y Fecha_ingreso
    required_fields = ["Roles_id", "Nombre", "Correo", "Telefono", "Edad", "Genero", "Estado"]
    if not all(field in data for field in required_fields) or "CUI" not in data:
        return jsonify({"error": "Faltan campos requeridos"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Consulta SQL para actualizar el usuario
        query = """
            UPDATE Empleados
            SET 
                Roles_id = %s,
                Nombre = %s,
                Correo = %s,
                Telefono = %s,
                Edad = %s,
                Genero = %s,
                Estado = %s
            WHERE CUI = %s
        """
        # Parámetros para la consulta
        params = (
            data["Roles_id"],
            data["Nombre"],
            data["Correo"],
            data["Telefono"],
            data["Edad"],
            data["Genero"],
            data["Estado"],
            data["CUI"]  # Se mantiene solo para filtrar qué usuario modificar
        )

        # Ejecutar la consulta
        cursor.execute(query, params)
        connection.commit()

        return jsonify({"message": "Usuario modificado correctamente"}), 200
    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# Obtener roles
@agregar_usuario_bp.route('/roles', methods=['GET'])
def obtener_roles():
    roles_lista = [
        {"id": 4, "nombre": "cliente"},
        {"id": 3, "nombre": "empleado"},
        {"id": 1, "nombre": "gerente"},
        {"id": 2, "nombre": "supervisor"}
    ]
    return jsonify({"Roles obtenidos": roles_lista}), 200

usuario_bp = Blueprint("usuario_bp", __name__)
def enviar_correo_confirmacion(correo, token):
    """Envía un correo con el enlace de confirmación."""
    try:
        smtp_obj = smtplib.SMTP(Config.SMTP_SERVER, Config.SMTP_PORT)
        smtp_obj.starttls()
        smtp_obj.login(Config.SMTP_USERNAME, Config.SMTP_PASSWORD)

        # Crear el enlace de confirmación
        link_confirmacion = f"{Config.SERVER_URL}/auth/confirmar/{token}"

        # Crear el mensaje
        mensaje = f"""
        <html>
            <body>
                <p>Hola,</p>
                <p>Gracias por registrarte. Por favor, confirma tu cuenta haciendo clic en el siguiente enlace:</p>
                <p><a href="{link_confirmacion}">Confirmar Cuenta</a></p>
            </body>
        </html>
        """

        email_message = MIMEText(mensaje, "html")
        email_message["From"] = Config.SMTP_USERNAME
        email_message["To"] = correo
        email_message["Subject"] = Header("Confirmación de cuenta")

        # Enviar correo
        smtp_obj.sendmail(Config.SMTP_USERNAME, correo, email_message.as_string())
        smtp_obj.quit()

        print("Correo de confirmación enviado")
    except Exception as e:
        print(f"Error al enviar correo: {str(e)}")

@usuario_bp.route('/register', methods=['POST'])
def register():
    """Registra un usuario y envía un correo de confirmación."""
    data = request.get_json()
    required_fields = ["Nombre", "Correo", "Contrasena", "Edad"]
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Faltan campos requeridos"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si el correo ya está registrado
        cursor.execute("SELECT Correo FROM Cliente WHERE Correo = %s", (data["Correo"],))
        if cursor.fetchone():
            return jsonify({"error": "El correo ya está en uso"}), 400

        # Encriptar la contraseña con bcrypt
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(data["Contrasena"].encode('utf-8'), salt)

        # Generar un token de confirmación
        token_confirmacion = secrets.token_hex(16)  

        # Insertar el usuario en la base de datos
        query = """
            INSERT INTO Cliente (Nombre, Correo, Contrasena, Edad, Token_contrasena)
            VALUES (%s, %s, %s, %s, %s)
        """
        valores = (data["Nombre"], data["Correo"], hashed_password, data["Edad"], token_confirmacion)
        cursor.execute(query, valores)
        connection.commit()

        # Enviar correo de confirmación
        enviar_correo_confirmacion(data["Correo"], token_confirmacion)

        return jsonify({"message": "Usuario registrado. Verifique su correo para confirmar la cuenta"}), 201

    except Exception as e:
        if connection:
            connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/auth/confirmar/<token>', methods=['GET'])
def confirmar_cuenta(token):
    """Confirma la cuenta del usuario con el token."""
    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Buscar el usuario con el token
        cursor.execute("SELECT idCliente FROM Cliente WHERE Token_contrasena = %s", (token,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Token inválido o cuenta ya confirmada"}), 400

        # Actualizar el estado de la cuenta a "Confirmado"
        cursor.execute("UPDATE Cliente SET Token_contrasena = 'Confirmado' WHERE idCliente = %s", (user[0],))
        connection.commit()

        return jsonify({"message": "Cuenta confirmada exitosamente"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if not data or "Correo" not in data or "Contrasena" not in data:
        return jsonify({"error": "Correo y contraseña son obligatorios"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        usuario_input = data["Correo"]  # Puede ser correo o CUI

        # 1. Buscar en la tabla Cliente (Solo por correo)
        cursor.execute("""
            SELECT idCliente, Contrasena, 'cliente' as Tipo, Token_contrasena 
            FROM Cliente 
            WHERE Correo = %s
        """, (usuario_input,))
        user = cursor.fetchone()

        cui = None  # Inicializamos cui en None

        if user:
            user_id, hashed_password, user_type, token_estado = user

            if token_estado != "Confirmado":
                return jsonify({"error": "Cuenta no confirmada. Verifica tu correo."}), 403

            user_role = "cliente"

        else:
            # 2. Buscar en Empleados (puede ser por CUI o correo)
            cursor.execute("""
                SELECT Empleados.CUI, Login.Contrasena, 'Empleado' as Tipo, Roles.Nombre as Rol 
                FROM Login
                JOIN Empleados ON Login.Empleado_CUI = Empleados.CUI
                JOIN Roles ON Empleados.Roles_id = Roles.idRoles
                WHERE Login.Usuario = %s OR Empleados.Correo = %s
            """, (usuario_input, usuario_input))
            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "Usuario no encontrado"}), 404

            cui, hashed_password, user_type, user_role = user
            user_id = cui  # Para los empleados usamos el cui como "id"

        # Verificar contraseña
        if not bcrypt.checkpw(data["Contrasena"].encode('utf-8'), hashed_password.encode('utf-8')):
            return jsonify({"error": "Contraseña incorrecta"}), 401

        # Generar token
        payload = {
            "id": user_id,
            "tipo": user_type,
            "exp": datetime.utcnow() + timedelta(hours=2)
        }

        if user_role:
            payload["rol"] = user_role

        token = jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

        # Construir respuesta
        response = {
            "token": token,
            "message": "Login exitoso",
            "tipo": user_type,
            "rol": user_role
        }

        # Solo si es Supervisor, agregar cui
        if user_role.lower() == "supervisor":
            response["cui"] = cui

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


def token_required(f):
    """ Decorador para verificar si el token JWT es válido """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token requerido"}), 401

        try:
            # Eliminar "Bearer " del token si está presente
            token = token.split(" ")[1] if " " in token else token
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Token inválido"}), 401

        return f(data, *args, **kwargs)
    
    return decorated

@usuario_bp.route("/auth/role", methods=["GET"])
@token_required
def get_user_role(user_data):
    """ Retorna el rol del usuario autenticado """
    return jsonify({"rol": user_data.get("rol")}), 200

@usuario_bp.route("/auth/user_id", methods=["GET"])
@token_required
def get_user_id(user_data):
    """ Retorna el id del usuario autenticado """
    return jsonify({"id": user_data.get("id")}), 200


@usuario_bp.route('/obtener_productos_libros', methods=['GET'])
def obtener_productos_libros():
    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Obtener productos
        query_productos = "SELECT * FROM Producto"
        cursor.execute(query_productos)
        productos = cursor.fetchall()
        
        # Obtener libros
        query_libros = "SELECT * FROM Libros"
        cursor.execute(query_libros)
        libros = cursor.fetchall()

        # Convertir BLOB a Base64 en productos
        for producto in productos:
            if producto["Imagen_producto"]:  # Verifica si el campo no es NULL
                producto["Imagen_producto"] = base64.b64encode(producto["Imagen_producto"]).decode("utf-8")
            else:
                producto["Imagen_producto"] = ""
        
        return jsonify({"productos": productos, "libros": libros}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/verificar_lista_deseos', methods=['POST'])
def verificar_lista_deseos():
    """
    Verifica todos los productos y libros que están en la lista de deseos de un cliente.
    Los datos se reciben en formato JSON con el idCliente.
    """
    data = request.get_json()
    id_cliente = data.get("idCliente")

    if not id_cliente:
        return jsonify({"error": "Se requiere idCliente"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Query para obtener los productos en la lista de deseos
        query_productos = """
            SELECT p.idProducto, p.Nombre, p.Descripcion, p.Categoria, p.Precio_compra, 
                   p.Precio_venta, p.Stock, p.Imagen_producto
            FROM Lista_deseos ld
            JOIN Producto p ON ld.Producto_idProducto = p.idProducto
            WHERE ld.Cliente_idCliente = %s
        """
        cursor.execute(query_productos, (id_cliente,))
        productos = [
            {
                "idProducto": row[0], "Nombre": row[1], "Descripcion": row[2],
                "Categoria": row[3], "Precio_compra": str(row[4]), "Precio_venta": str(row[5]),
                "Stock": row[6], "Imagen_producto": row[7]
            }
            for row in cursor.fetchall()
        ]

        # Query para obtener los libros en la lista de deseos
        query_libros = """
            SELECT l.idLibros, l.Titulo, l.Autor, l.Descripcion, l.Genero, 
                   l.Precio, l.Stock, l.Fecha_lanzamiento
            FROM Lista_deseos_Libros ld
            JOIN Libros l ON ld.Libros_idLibros = l.idLibros
            WHERE ld.Cliente_idCliente = %s
        """
        cursor.execute(query_libros, (id_cliente,))
        libros = [
            {
                "idLibros": row[0], "Titulo": row[1], "Autor": row[2], "Descripcion": row[3],
                "Genero": row[4], "Precio": str(row[5]), "Stock": row[6], "Fecha_lanzamiento": row[7]
            }
            for row in cursor.fetchall()
        ]
        # Convertir BLOB a Base64 en productos
        for producto in productos:
            if producto["Imagen_producto"]:  # Verifica si el campo no es NULL
                producto["Imagen_producto"] = base64.b64encode(producto["Imagen_producto"]).decode("utf-8")
            else:
                producto["Imagen_producto"] = ""

        return jsonify({"productos": productos, "libros": libros}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/obtener_productos_libros_lista_deseos', methods=['POST'])
def obtener_productos_libros_lista_deseos():
    """
    Obtiene todos los productos y libros.
    Si se proporciona un idCliente en el JSON, también verifica los que están en la lista de deseos.
    """
    data = request.get_json()
    id_cliente = data.get("idCliente") if data else None

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Obtener todos los productos
        cursor.execute("SELECT * FROM Producto")
        productos = cursor.fetchall()

        # Obtener todos los libros
        cursor.execute("SELECT * FROM Libros")
        libros = cursor.fetchall()

        # Convertir BLOB a Base64 en productos
        for producto in productos:
            if producto["Imagen_producto"]:  # Verifica si el campo no es NULL
                producto["Imagen_producto"] = base64.b64encode(producto["Imagen_producto"]).decode("utf-8")
            else:
                producto["Imagen_producto"] = ""
        if id_cliente:
            # Obtener productos en la lista de deseos
            query_productos_lista = """
                SELECT p.idProducto, p.Nombre, p.Descripcion, p.Categoria, p.Precio_compra, 
                       p.Precio_venta, p.Stock
                FROM Lista_deseos ld
                JOIN Producto p ON ld.Producto_idProducto = p.idProducto
                WHERE ld.Cliente_idCliente = %s
            """
            cursor.execute(query_productos_lista, (id_cliente,))
            productos_lista_deseos = cursor.fetchall()

            # Obtener libros en la lista de deseos
            query_libros_lista = """
                SELECT l.idLibros, l.Titulo, l.Autor, l.Descripcion, l.Genero, 
                       l.Precio, l.Stock, l.Fecha_lanzamiento
                FROM Lista_deseos_Libros ld
                JOIN Libros l ON ld.Libros_idLibros = l.idLibros
                WHERE ld.Cliente_idCliente = %s
            """
            cursor.execute(query_libros_lista, (id_cliente,))
            libros_lista_deseos = cursor.fetchall()

            return jsonify({
                "productos": productos,
                "libros": libros,
                "productos_lista_deseos": productos_lista_deseos,
                "libros_lista_deseos": libros_lista_deseos
            }), 200

        return jsonify({"productos": productos, "libros": libros}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/obtener_libros_mejor_calificacion', methods=['POST'])
def obtener_libros_mejor_calificacion():
    """
    Obtiene los libros con mejor calificación promedio.
    Si se proporciona un idCliente, también devuelve los libros de su lista de deseos.
    """
    data = request.get_json()
    id_cliente = data.get("idCliente") if data else None

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)

        # Obtener libros con mejor calificación promedio
        query_libros_top = """
            SELECT l.idLibros, l.Titulo, l.Autor, l.Descripcion, l.Genero, l.Precio, l.Stock, l.Fecha_lanzamiento,
                   COALESCE(AVG(o.Calificacion), 0) AS CalificacionPromedio
            FROM Libros l
            LEFT JOIN Opiniones o ON l.idLibros = o.Libro_idLibros
            GROUP BY l.idLibros
            ORDER BY CalificacionPromedio DESC
            LIMIT 10
        """
        cursor.execute(query_libros_top)
        libros_top = cursor.fetchall()

        libros_lista_deseos = []
        if id_cliente:
            # Obtener libros en la lista de deseos del cliente
            query_libros_lista = """
                SELECT l.idLibros, l.Titulo, l.Autor, l.Descripcion, l.Genero, 
                       l.Precio, l.Stock, l.Fecha_lanzamiento
                FROM Lista_deseos_Libros ld
                JOIN Libros l ON ld.Libros_idLibros = l.idLibros
                WHERE ld.Cliente_idCliente = %s
            """
            cursor.execute(query_libros_lista, (id_cliente,))
            libros_lista_deseos = cursor.fetchall()

        return jsonify({
            "libros_mejor_calificados": libros_top,
            "libros_lista_deseos": libros_lista_deseos
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/agregar_producto_lista_deseos', methods=['POST'])
def agregar_producto_lista_deseos():
    data = request.get_json()
    id_cliente = data.get("idCliente")
    id_producto = data.get("idProducto")

    if not id_cliente or not id_producto:
        return jsonify({"error": "Se requieren idCliente y idProducto"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si ya está en la lista
        cursor.execute("""
            SELECT 1 FROM Lista_deseos WHERE Cliente_idCliente = %s AND Producto_idProducto = %s
        """, (id_cliente, id_producto))
        if cursor.fetchone():
            return jsonify({"message": "El producto ya está en la lista de deseos"}), 200

        # Agregar a la lista de deseos
        cursor.execute("""
            INSERT INTO Lista_deseos (Cliente_idCliente, Producto_idProducto) VALUES (%s, %s)
        """, (id_cliente, id_producto))
        connection.commit()

        return jsonify({"message": "Producto agregado a la lista de deseos"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@usuario_bp.route('/eliminar_producto_lista_deseos', methods=['DELETE'])
def eliminar_producto_lista_deseos():
    data = request.get_json()
    id_cliente = data.get("idCliente")
    id_producto = data.get("idProducto")

    if not id_cliente or not id_producto:
        return jsonify({"error": "Se requieren idCliente y idProducto"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Eliminar de la lista de deseos
        cursor.execute("""
            DELETE FROM Lista_deseos WHERE Cliente_idCliente = %s AND Producto_idProducto = %s
        """, (id_cliente, id_producto))
        connection.commit()

        return jsonify({"message": "Producto eliminado de la lista de deseos"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@usuario_bp.route('/agregar_libro_lista_deseos', methods=['POST'])
def agregar_libro_lista_deseos():
    data = request.get_json()
    id_cliente = data.get("idCliente")
    id_libros = data.get("idLibros")

    if not id_cliente or not id_libros:
        return jsonify({"error": "Se requieren idCliente y idLibros"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Verificar si ya está en la lista
        cursor.execute("""
            SELECT 1 FROM Lista_deseos_Libros WHERE Cliente_idCliente = %s AND Libros_idLibros = %s
        """, (id_cliente, id_libros))
        if cursor.fetchone():
            return jsonify({"message": "El libro ya está en la lista de deseos"}), 200

        # Agregar a la lista de deseos
        cursor.execute("""
            INSERT INTO Lista_deseos_Libros (Cliente_idCliente, Libros_idLibros) VALUES (%s, %s)
        """, (id_cliente, id_libros))
        connection.commit()

        return jsonify({"message": "Libro agregado a la lista de deseos"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@usuario_bp.route('/eliminar_libro_lista_deseos', methods=['DELETE'])
def eliminar_libro_lista_deseos():
    data = request.get_json()
    id_cliente = data.get("idCliente")
    id_libros = data.get("idLibros")

    if not id_cliente or not id_libros:
        return jsonify({"error": "Se requieren idCliente y idLibros"}), 400

    connection = None
    cursor = None
    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Eliminar de la lista de deseos
        cursor.execute("""
            DELETE FROM Lista_deseos_Libros WHERE Cliente_idCliente = %s AND Libros_idLibros = %s
        """, (id_cliente, id_libros))
        connection.commit()

        return jsonify({"message": "Libro eliminado de la lista de deseos"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/registrar_factura', methods=['POST'])
def registrar_factura():
    data = request.get_json()

    factura_data = data.get("facturaData")
    detalles_libros = data.get("detallesLibros")
    detalles_productos = data.get("detallesProductos")
    # Validación de datos
    if not factura_data:
        return jsonify({"error": "Datos de factura inválidos"}), 400
    
    # Validar que al menos uno de los dos detalles (libros o productos) esté presente
    if not detalles_libros and not detalles_productos:
        return jsonify({"error": "Debe enviar al menos un libro o un producto en los detalles"}), 400

    connection = None
    cursor = None

    try:
        connection = db_singleton.get_connection()
        cursor = connection.cursor()

        # Insertar la factura
        cursor.execute("""
            INSERT INTO Facturas (Empleado_CUI, Cliente_idCliente, Fecha_compra, Precio_total, Metodo_pago, Direccion)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            factura_data['Empleado_CUI'],
            factura_data['Cliente_idCliente'],
            factura_data['Fecha_compra'],
            factura_data['Precio_total'],
            factura_data['Metodo_pago'],
            factura_data['Direccion']
        ))
        connection.commit()

        # Obtener el ID de la factura recién creada
        factura_id = cursor.lastrowid

        # Insertar los detalles de los libros
        for detalle in detalles_libros:
            cursor.execute("""
                INSERT INTO Detalle_factura (Factura_idFactura, Libros_idLibros, Producto_idProducto, Cantidad, Precio)
                VALUES (%s, %s, NULL, %s, %s)
            """, (
                factura_id,
                detalle['Libros_idLibros'],
                detalle['Cantidad'],
                detalle['Precio']
            ))

            # Actualizar el stock de los libros
            cursor.execute("""
                UPDATE Libros
                SET Stock = Stock - %s
                WHERE idLibros = %s
            """, (
                detalle['Cantidad'],
                detalle['Libros_idLibros']
            ))

        # Insertar los detalles de los productos
        for detalle in detalles_productos:
            cursor.execute("""
                INSERT INTO Detalle_factura (Factura_idFactura, Libros_idLibros, Producto_idProducto, Cantidad, Precio)
                VALUES (%s, NULL, %s, %s, %s)
            """, (
                factura_id,
                detalle['Producto_idProducto'],
                detalle['Cantidad'],
                detalle['Precio']
            ))

            # Actualizar el stock de los productos
            cursor.execute("""
                UPDATE Producto
                SET Stock = Stock - %s
                WHERE idProducto = %s
            """, (
                detalle['Cantidad'],
                detalle['Producto_idProducto']
            ))

        connection.commit()

        # Crear el PDF de la factura con ReportLab
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter)

        elements = []

        # Nueva estructura del encabezado
        encabezado = [
            ['Factura ID: {}'.format(factura_id), 'Fecha: {}'.format(factura_data["Fecha_compra"])],  # Primera fila
            ['Método: {}'.format(factura_data["Metodo_pago"]), 'Cliente ID: {}'.format(factura_data["Cliente_idCliente"])],  # Segunda fila
            ['Dirección: {}'.format(factura_data["Direccion"]), '']  # Fila completa para la dirección
        ]

        # Creación de la tabla del encabezado con ancho fijo de 520 px
        encabezado_table = Table(encabezado, colWidths=[260, 260])
        encabezado_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('BACKGROUND', (0, 0), (-1, 0), colors.blue),  # Fondo azul para la primera fila
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),  # Texto blanco en la primera fila
            ('GRID', (0, 0), (-1, -1), 1, colors.black),  # Bordes en toda la tabla
        ]))

        elements.append(encabezado_table)

        # Crear la tabla de detalles (libros y productos) con el mismo número de columnas
        detalles_header = ['ID', 'Descripción', 'Cantidad', 'Precio', 'Subtotal']

        detalles_table_data = [detalles_header]
        total = 0

        # Agregar detalles de los libros
        for detalle in detalles_libros:
            subtotal = detalle['Cantidad'] * detalle['Precio']
            total += subtotal
            detalles_table_data.append([
                detalle['Libros_idLibros'],
                detalle['Nombre'],
                detalle['Cantidad'],
                '${}'.format(detalle['Precio']),
                '${}'.format(subtotal)
            ])

        # Agregar detalles de los productos
        for detalle in detalles_productos:
            subtotal = detalle['Cantidad'] * detalle['Precio']
            total += subtotal
            detalles_table_data.append([
                detalle['Producto_idProducto'],
                detalle['Nombre'],
                detalle['Cantidad'],
                '${}'.format(detalle['Precio']),
                '${}'.format(subtotal)
            ])

        # Agregar la fila de total
        detalles_table_data.append(['', '', '', 'Total', '${}'.format(total)])

        # Creamos la tabla de detalles con el total
        detalles_table = Table(detalles_table_data, colWidths=[80, 200, 80, 80, 80])
        detalles_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
            ('BACKGROUND', (-1, -1), (-1, -1), colors.green),
            ('TEXTCOLOR', (-1, -1), (-1, -1), colors.white),
            ('ALIGN', (-1, -1), (-1, -1), 'CENTER'),
        ]))

        elements.append(detalles_table)

        # Crear el PDF con los elementos definidos
        doc.build(elements)

        # Mover el cursor al inicio del buffer
        pdf_buffer.seek(0)

        # Cerrar la conexión a la base de datos
        cursor.close()
        connection.close()

        # Devolver el PDF al frontend
        return send_file(
            pdf_buffer,
            as_attachment=True,
            download_name="factura.pdf",
            mimetype="application/pdf"
        )

    except Exception as e:
        if connection:
            connection.rollback()  # Si algo falla, hacemos un rollback
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@usuario_bp.route('/obtener_productos_libros_deseados', methods=['GET'])
def obtener_productos_libros_deseados():
    connection = None
    cursor = None
    try:
        # Obtener el Cliente_idCliente desde los parámetros de la URL
        cliente_id = request.args.get('Cliente_idCliente')
        if not cliente_id:
            return jsonify({"error": "Cliente_idCliente es requerido"}), 400

        connection = db_singleton.get_connection()
        cursor = connection.cursor(dictionary=True)
        
        # Obtener productos de la lista de deseos
        query_productos = """
        SELECT p.idProducto, p.Nombre, p.Descripcion, p.Categoria, p.Precio_compra, p.Precio_venta, p.Stock, p.Imagen_producto 
        FROM Producto p
        INNER JOIN Lista_deseos ld ON p.idProducto = ld.Producto_idProducto
        WHERE ld.Cliente_idCliente = %s
        """
        cursor.execute(query_productos, (cliente_id,))
        productos = cursor.fetchall()
        
        # Obtener libros de la lista de deseos
        query_libros = """
        SELECT l.idLibros, l.Titulo, l.Autor, l.Fecha_lanzamiento, l.Descripcion, l.Genero, l.Stock, l.Precio 
        FROM Libros l
        INNER JOIN Lista_deseos_Libros ldl ON l.idLibros = ldl.Libros_idLibros
        WHERE ldl.Cliente_idCliente = %s
        """
        cursor.execute(query_libros, (cliente_id,))
        libros = cursor.fetchall()

        # Convertir BLOB a Base64 en productos
        for producto in productos:
            if producto["Imagen_producto"]:  # Verifica si el campo no es NULL
                producto["Imagen_producto"] = base64.b64encode(producto["Imagen_producto"]).decode("utf-8")
            else:
                producto["Imagen_producto"] = ""
        
        return jsonify({"productos": productos, "libros": libros}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()