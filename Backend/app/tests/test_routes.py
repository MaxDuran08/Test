def test_crear_usuario(client, db):
    # Datos del nuevo usuario de prueba
    usuario_data = {
        "CUI": "9999999999998",
        "Roles_id": 2,  # Asegúrate de que este rol existe en tu base de datos
        "Nombre": "Prueba Usuario",
        "Correo": "test.ayd2.g6.s1.2025@gmail.com",
        "Telefono": "123456789",
        "Edad": 25,
        "Genero": "Masculino"
    }

    # 1. Hacemos el POST al endpoint
    response = client.post("/agregar_usuario", json=usuario_data)
    json_data = response.get_json()

    # 2. Verificamos la respuesta
    assert response.status_code == 200
    assert "Usuario agregado correctamente" in json_data["message"]

    # 3. Verificamos que el usuario fue insertado en la tabla Login
    db.execute("SELECT Usuario FROM Login WHERE Empleado_CUI = %s", (usuario_data["CUI"],))
    login_entry = db.fetchone()

    assert login_entry is not None
    assert login_entry["Usuario"] == usuario_data["CUI"]