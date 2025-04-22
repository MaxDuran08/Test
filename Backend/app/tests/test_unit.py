import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
import bcrypt
import jwt
from unittest.mock import patch, MagicMock
from datetime import datetime, timedelta
from app.controllers.usuario_controller import enviar_correo_confirmacion

# Test para encriptar y verificar contraseñas con bcrypt
def test_bcrypt_encryption_and_verification():
    password = "mi_clave_segura"
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    assert bcrypt.checkpw(password.encode('utf-8'), hashed)
    assert not bcrypt.checkpw("otra_clave".encode('utf-8'), hashed)

# Test para crear y verificar tokens JWT
def test_jwt_token_creation_and_validation():
    payload = {
        "id": 123,
        "tipo": "cliente",
        "rol": "user",
        "exp": int((datetime.utcnow() + timedelta(hours=1)).timestamp())
    }

    token = jwt.encode(payload, "mi_clave_segura", algorithm="HS256")

    decoded = jwt.decode(token, "mi_clave_segura", algorithms=["HS256"])

    assert decoded["id"] == 123
    assert decoded["tipo"] == "cliente"
    assert decoded["rol"] == "user"

# Test para verificar si un token ha expirado
def test_jwt_expired_token():
    expired_payload = {
        "id": 1,
        "exp": int((datetime.utcnow() - timedelta(seconds=1)).timestamp())
    }

    token = jwt.encode(expired_payload, "mi_clave_segura", algorithm="HS256")

    with pytest.raises(jwt.ExpiredSignatureError):
        jwt.decode(token, "mi_clave_segura", algorithms=["HS256"])

# Test para verificar un token inválido
def test_jwt_invalid_token():
    fake_token = "abc.def.ghi"
    with pytest.raises(jwt.InvalidTokenError):
        jwt.decode(fake_token, "mi_clave_segura", algorithms=["HS256"])

# Test para la función de registro (completo, con creación de usuario y correo)
def test_register_user(client):
    data = {
        "Nombre": "Juan Perez",
        "Correo": "juan.perez@example.com",
        "Contrasena": "12345678",
        "Edad": 30
    }

    response = client.post("/register", json=data)

    assert response.status_code == 201
    assert response.json.get("message") == "Usuario registrado. Verifique su correo para confirmar la cuenta"