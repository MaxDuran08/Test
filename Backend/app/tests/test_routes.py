def test_login_admin(client):

    usuario_data = {
        "Correo": "admin",
        "Contrasena": "admin"
    }

    response = client.post("/login", json=usuario_data)
    json_data = response.get_json()
    print("STATUS:", response.status_code)
    print("BODY:", response.data)

    assert response.status_code == 200
    assert "Login exitoso" in json_data["message"]

def test_login_supervisor(client):

    usuario_data = {
        "Correo": "supervisor",
        "Contrasena": "admin"
    }

    response = client.post("/login", json=usuario_data)
    json_data = response.get_json()
    print("STATUS:", response.status_code)
    print("BODY:", response.data)

    assert response.status_code == 200
    assert "Login exitoso" in json_data["message"]

def test_login_empleado(client):
    usuario_data = {
        "Correo": "empleado",
        "Contrasena": "admin"
    }

    response = client.post("/login", json=usuario_data)
    json_data = response.get_json()
    print("STATUS:", response.status_code)
    print("BODY:", response.data)

    assert response.status_code == 200
    assert "Login exitoso" in json_data["message"]

def test_agregar_usuario(client):
    usuario_data = {    
    "CUI": 9999999999998,
    "Correo": "test.ayd2.g6.s1.2025@gmail.com",
    "Roles_id": 2,
    "Edad": 38,
    "Estado": "Contratado",
    "Genero": "Femenino",
    "Nombre": "Max",
    "Telefono": "555-5678"
    }

    response = client.post("/agregar_usuario", json=usuario_data)
    json_data = response.get_json()

    assert response.status_code == 200
    assert "Usuario agregado correctamente. Se enviaron las credenciales por correo" in json_data["message"]

def test_modificar_usuario(client):
    usuario_data = {    
    "CUI": 9999999999998,
    "Correo": "test.ayd2.g6.s1.2025@gmail.com",
    "Roles_id": 1,
    "Edad": 20,
    "Estado": "Contratado",
    "Genero": "Masculino",
    "Nombre": "Test",
    "Telefono": "555-5678"
    }

    response = client.put("/modificar_usuario", json=usuario_data)
    json_data = response.get_json()

    assert response.status_code == 200
    assert "Usuario modificado correctamente" in json_data["message"]

def test_eliminar_usuario(client):
    usuario_data = {
        "data": {
            "CUI": 9999999999998,
            "Causa": "Test"
        }
    }

    response = client.post("/eliminar_usuario", json=usuario_data)
    json_data = response.get_json()

    assert response.status_code == 200
    assert "Usuario eliminado exitosamente" in json_data["message"]

def test_roles(client):

    response = client.get("/roles")

    assert response.status_code == 200