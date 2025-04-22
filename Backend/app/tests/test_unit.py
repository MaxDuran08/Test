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

# Test para mockear el envío de correo
@patch("smtplib.SMTP")
def test_enviar_correo_mockeado(mock_smtp):
    mock_instance = MagicMock()
    mock_smtp.return_value = mock_instance

    correo = "test@example.com"
    token = "fake_token"

    # Llamada a la función para enviar el correo
    enviar_correo_confirmacion(correo, token)

    # Verificamos que la clase SMTP se haya llamado correctamente
    mock_smtp.assert_called_with('smtp.gmail.com', 587)
    mock_instance.sendmail.assert_called()

# Test para la función de registro (completo, con creación de usuario y correo)
def test_register_user(client):
    data = {
        "Nombre": "Juan Perez",
        "Correo": "juan.perez@example.com",
        "Contrasena": "12345678",
        "Edad": 30
    }

    # Simulamos una petición POST a la ruta '/register'
    response = client.post("/register", json=data)

    assert response.status_code == 201
    assert response.json.get("message") == "Usuario registrado. Verifique su correo para confirmar la cuenta"

# Test para la función de login (completo, con verificación de token)
def test_login_user(client):
    # Datos de usuario para login
    login_data = {
        "Correo": "juan.perez@example.com",
        "Contrasena": "12345678"
    }

    # Simulamos una petición POST a la ruta '/login'
    response = client.post("/login", json=login_data)

    assert response.status_code == 200
    assert "token" in response.json
    assert response.json["message"] == "Login exitoso"

# Test para la función de confirmación de cuenta (con token válido)
def test_confirm_account(client):
    # Simulamos un token de confirmación válido
    valid_token = "valid_fake_token"

    # Simulamos una petición GET a la ruta '/auth/confirmar/<token>'
    response = client.get(f"/auth/confirmar/{valid_token}")

    assert response.status_code == 200
    assert response.json.get("message") == "Cuenta confirmada exitosamente"

# Test para verificar que el rol del usuario se obtenga correctamente (token requerido)
def test_get_user_role(client):
    token = "valid_token"  # Deberías simular un token JWT válido aquí

    # Simulamos una petición GET a la ruta '/auth/role' con el token en los headers
    response = client.get("/auth/role", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert "rol" in response.json
    assert response.json["rol"] == "user"

# Test para verificar el id del usuario autenticado
def test_get_user_id(client):
    token = "valid_token"  # Deberías simular un token JWT válido aquí

    # Simulamos una petición GET a la ruta '/auth/user_id' con el token en los headers
    response = client.get("/auth/user_id", headers={"Authorization": f"Bearer {token}"})

    assert response.status_code == 200
    assert "id" in response.json
    assert response.json["id"] == 123  # Debe coincidir con el ID en el payload del token
