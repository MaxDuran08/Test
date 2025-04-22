def test_login_admin(client, db):
    # Datos del nuevo usuario de prueba
    usuario_data = {
        "Correo": "admin",
        "Contrasena": "admin"
    }

    # 1. Hacemos el POST al endpoint
    response = client.post("/login", json=usuario_data)
    json_data = response.get_json()

    # 2. Verificamos la respuesta
    assert response.status_code == 200
    assert "Login exitoso" in json_data["message"]
