def test_crear_usuario_y_login(client, db):
    # Datos del nuevo usuario
    usuario_data = {
        "CUI": "123456789",
        "Roles_id": 2,  # Asegurate que este rol exista
        "Nombre": "Test Usuario",
        "Correo": "testusuario@example.com",
        "Telefono": "1234567890",
        "Edad": 30,
        "Genero": "Masculino"
    }

    # 1. Crear el usuario
    response = client.post("/agregar_usuario", json=usuario_data)
    assert response.status_code == 200
    assert "Usuario agregado correctamente" in response.get_json()["message"]

    # 2. Obtener la contraseña generada en la BD (simulamos esto en pruebas)
    cursor = db
    cursor.execute("SELECT Contrasena FROM Login WHERE Usuario = %s", (usuario_data["CUI"],))
    login_data = cursor.fetchone()
    assert login_data is not None

    # Como no tenemos acceso al token plano enviado por email, simulamos el login con una contraseña falsa
    # en un caso real podríamos usar un "mock" de `enviar_correo_credenciales` para capturar la contraseña enviada

    # Simulación: en pruebas locales podrías modificar la lógica para usar una contraseña conocida
    # pero aquí forzamos una contraseña para hacer la prueba:
    from app.db.bd import db_singleton
    import bcrypt

    contrasena_test = "MiTest1234!"
    contrasena_hash = bcrypt.hashpw(contrasena_test.encode("utf-8"), bcrypt.gensalt())
    cursor.execute("UPDATE Login SET Contrasena = %s WHERE Usuario = %s", (contrasena_hash, usuario_data["CUI"]))
    db_singleton.get_connection().commit()

    # 3. Login
    response = client.post("/login", json={
        "Correo": usuario_data["Correo"],
        "Contrasena": contrasena_test
    })
    assert response.status_code == 200
    data = response.get_json()
    assert "token" in data
    assert data["message"] == "Login exitoso"