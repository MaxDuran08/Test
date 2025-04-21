import mysql.connector
from app.config.config import Config
import threading

class DatabaseSingleton:
    _instance = None  # Única instancia de la clase
    _lock = threading.Lock()  # Lock para thread-safety
    _connection = None  # Almacena la conexión a MySQL
    _initialized = False  # Controla si ya se inicializó

    def __new__(cls):
        # Garantiza que solo exista una instancia (thread-safe)
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        # Inicializa la conexión solo una vez
        if not DatabaseSingleton._initialized:
            try:
                self._connection = mysql.connector.connect(
                    host=Config.MYSQL_HOST,
                    user=Config.MYSQL_USER,
                    password=Config.MYSQL_PASSWORD,
                    database=Config.MYSQL_DATABASE,
                    port=Config.MYSQL_PORT

                )
                DatabaseSingleton._initialized = True
            except Exception as e:
                raise RuntimeError(f"Error al conectar a MySQL: {str(e)}")

    def get_connection(self):
        # Devuelve la conexión existente
        if self._connection.is_connected():
            return self._connection
        else:
            # Reconecta si la conexión está caída
            self._connection.reconnect()
            return self._connection

    def close_connection(self):
        # Cierra la conexión (útil para pruebas o reinicios)
        if self._connection.is_connected():
            self._connection.close()
            DatabaseSingleton._initialized = False

# Instancia global del Singleton
db_singleton = DatabaseSingleton()


def get_db_connection():
    return db_singleton.get_connection()