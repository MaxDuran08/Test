import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app import create_app
from app.db import db_singleton 

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
    connection =  db_singleton.get_connection()
    cursor = connection.cursor()
    yield cursor
    connection.commit()
    cursor.close()
