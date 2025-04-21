import pytest
from app import create_app
from app.db.bd import get_db_connection

@pytest.fixture(scope="session")
def app():
    app = create_app()
    app.config["TESTING"] = True
    return app

@pytest.fixture(scope="session")
def client(app):
    return app.test_client()

@pytest.fixture(scope="function")
def db():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    yield cursor
    # Limpieza después de cada test (si querés reiniciar estado)
    conn.commit()
    cursor.close()
