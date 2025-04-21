DROP DATABASE IF EXISTS test_db;
CREATE DATABASE test_db;
USE test_db;

CREATE TABLE Producto(
    idProducto INTEGER AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion VARCHAR(150),
    Categoria VARCHAR(100),
    Precio_compra DECIMAL(10,2),
    Precio_venta DECIMAL(10,2),
    Stock INTEGER NOT NULL,
    Imagen_producto LONGBLOB
);

CREATE TABLE Cliente(
    idCliente BIGINT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Edad INTEGER CHECK (Edad >= 0),
    Token_contrasena VARCHAR(255)
);

CREATE TABLE Roles(
    idRoles INTEGER AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Empleados(
    CUI BIGINT PRIMARY KEY,
    Roles_id INTEGER,
    Nombre VARCHAR(150) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Telefono VARCHAR(20),
    Edad INTEGER CHECK (Edad >= 18),
    Genero VARCHAR(20),
    Fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estado ENUM ('Contratado', 'Despedido') NOT NULL,
    Foto BLOB,
    FOREIGN KEY (Roles_id) REFERENCES Roles(idRoles)
);

CREATE TABLE Lista_deseos(
    idLista INTEGER AUTO_INCREMENT PRIMARY KEY,
    Producto_idProducto INTEGER,
    Cliente_idCliente BIGINT,
    FOREIGN KEY (Producto_idProducto) REFERENCES Producto(idProducto),
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Libros(
    idLibros INTEGER AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(100) NOT NULL,
    Autor VARCHAR(150) NOT NULL,
    Fecha_lanzamiento DATE,
    Descripcion VARCHAR(255),
    Genero VARCHAR(30),
    Stock INTEGER CHECK (Stock >= 0),
    Precio DECIMAL(10,2) NOT NULL,
    Estado ENUM ('Disponible', 'No Disponible') NOT NULL
);

CREATE TABLE Lista_deseos_Libros(
    idLista INTEGER AUTO_INCREMENT PRIMARY KEY,
    Libros_idLibros INTEGER,
    Cliente_idCliente BIGINT,
    FOREIGN KEY (Libros_idLibros) REFERENCES Libros(idLibros),
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Opiniones(
    idOpinion INTEGER AUTO_INCREMENT PRIMARY KEY,
    Libro_idLibros INTEGER,
    Calificacion INTEGER CHECK (Calificacion BETWEEN 1 AND 5),
    Comentario VARCHAR(255),
    Fecha_opinion DATETIME,
    FOREIGN KEY (Libro_idLibros) REFERENCES Libros(idLibros)
);

CREATE TABLE Facturas(
    idFactura INTEGER AUTO_INCREMENT PRIMARY KEY,
    Empleado_CUI BIGINT,
    Cliente_idCliente BIGINT,
    Fecha_compra DATE,
    Precio_total DECIMAL(10,2) NOT NULL,
    Metodo_pago ENUM('Efectivo','Contra Entrega') NOT NULL,
    Direccion VARCHAR(255),
    PDF varchar(255),
    FOREIGN KEY (Empleado_CUI) REFERENCES Empleados(CUI),
    FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE Detalle_factura(
    idDetalle INTEGER AUTO_INCREMENT PRIMARY KEY,
    Factura_idFactura INTEGER,
    Libros_idLibros INTEGER,
    Producto_idProducto INTEGER,
    Cantidad INTEGER CHECK (Cantidad > 0),
    Precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Factura_idFactura) REFERENCES Facturas(idFactura),
    FOREIGN KEY (Libros_idLibros) REFERENCES Libros(idLibros),
    FOREIGN KEY (Producto_idProducto) REFERENCES Producto(idProducto)
);

CREATE TABLE Login(
    Usuario VARCHAR(50) PRIMARY KEY,
    Contrasena VARCHAR(255) NOT NULL,
    Empleado_CUI BIGINT,
    FOREIGN KEY (Empleado_CUI) REFERENCES Empleados(CUI)
);

CREATE TABLE Despedidos(
    Empleados_CUI BIGINT PRIMARY KEY,
    Causa VARCHAR(255),
    Fecha_despido DATETIME,
    FOREIGN KEY (Empleados_CUI) REFERENCES Empleados(CUI)
);
CREATE TABLE TicketSoporte(
idTicket INT AUTO_INCREMENT PRIMARY KEY,
Cliente_idCliente BIGINT,
Asunto VARCHAR(255) NOT NULL,
Descripcion TEXT NOT NULL,
Estado ENUM('Pendiente', 'En proceso', 'Resuelto', 'Cancelado') DEFAULT 'Pendiente',
Fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
Fecha_resolucion DATETIME,
FOREIGN KEY (Cliente_idCliente) REFERENCES Cliente(idCliente)
);

CREATE TABLE ArchivoAdjunto (
    idArchivo INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_idTicket INT,
    NombreArchivo VARCHAR(255),
    TipoArchivo VARCHAR(50),
    Contenido LONGBLOB,
    FOREIGN KEY (Ticket_idTicket) REFERENCES TicketSoporte(idTicket)
);


CREATE TABLE ConversacionTicket (
    idMensaje INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_idTicket INT,
    Remitente ENUM('Cliente', 'Empleado', 'Supervisor'),
    Empleado_CUI BIGINT,
    Mensaje TEXT NOT NULL,
    FechaMensaje DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Ticket_idTicket) REFERENCES TicketSoporte(idTicket),
    FOREIGN KEY (Empleado_CUI) REFERENCES Empleados(CUI)
);

CREATE TABLE AsignacionTicket (
    idAsignacion INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_idTicket INT,
    Empleado_CUI BIGINT,
    FechaAsignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    AsignadoPorSupervisor BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (Ticket_idTicket) REFERENCES TicketSoporte(idTicket),
    FOREIGN KEY (Empleado_CUI) REFERENCES Empleados(CUI)
);

CREATE TABLE CancelacionTicket (
    idCancelacion INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_idTicket INT,
    Razon TEXT NOT NULL,
    FechaCancelacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    Supervisor_CUI BIGINT,
    FOREIGN KEY (Ticket_idTicket) REFERENCES TicketSoporte(idTicket),
    FOREIGN KEY (Supervisor_CUI) REFERENCES Empleados(CUI)
);


CREATE TABLE SolicitudesResolucion (
    idSolicitud INT AUTO_INCREMENT PRIMARY KEY,
    Ticket_idTicket INT,
    Empleado_CUI BIGINT,
    FechaSolicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    Aprobado BOOLEAN DEFAULT FALSE,
    FechaAprobacion DATETIME,
    Supervisor_CUI BIGINT,
    FOREIGN KEY (Ticket_idTicket) REFERENCES TicketSoporte(idTicket),
    FOREIGN KEY (Empleado_CUI) REFERENCES Empleados(CUI),
    FOREIGN KEY (Supervisor_CUI) REFERENCES Empleados(CUI)
);

ALTER TABLE Facturas
MODIFY COLUMN PDF VARCHAR(255);

-- Inserción de roles
INSERT INTO Roles (Nombre) VALUES ('gerente'), ('supervisor'), ('empleado'), ('cliente');

-- Inserción de empleados
INSERT INTO Empleados (CUI, Roles_id, Nombre, Correo, Telefono, Edad, Genero, Estado)
VALUES 
    (10000001, 1, 'Juan Pérez', 'juan.perez@email.com', '555-1234', 45, 'Masculino', 'Contratado'),
    (10000002, 2, 'María Gómez', 'maria.gomez@email.com', '555-5678', 38, 'Femenino', 'Contratado'),
    (10000003, 3, 'Carlos Rodríguez', 'carlos.rodriguez@email.com', '555-8765', 28, 'Masculino', 'Contratado'),
    (9999999999999, 1, 'Admin', 'Admin@email.com', '555-1234', 45, 'Masculino', 'Contratado'),
    (10000004, 3, 'Sofía Martínez', 'sofia.martinez@email.com', '555-4321', 26, 'Femenino', 'Contratado');


-- Inserción de clientes
INSERT INTO Cliente (Nombre, Correo, Contrasena, Edad, Token_contrasena)
VALUES 
    ('Ana López', 'ana.lopez@email.com', '$2b$12$/m6oOmqwpFctzB1.jw9p7.6KgFEq9TMY/WoNmrKeVq.k0Ncs4qZyC', 25, 'Confirmado'),
    ('Pedro Castillo', 'pedro.castillo@email.com', '$2b$12$/m6oOmqwpFctzB1.jw9p7.6KgFEq9TMY/WoNmrKeVq.k0Ncs4qZyC', 32, 'Confirmado'),
    ('Laura Fernández', 'laura.fernandez@email.com', '$2b$12$/m6oOmqwpFctzB1.jw9p7.6KgFEq9TMY/WoNmrKeVq.k0Ncs4qZyC', 29, 'Confirmado');

-- Inserción de productos
INSERT INTO Producto (Nombre, Descripcion, Categoria, Precio_compra, Precio_venta, Stock)
VALUES 
    ('Cuaderno', 'Cuaderno de 100 hojas', 'Papelería', 10.00, 15.00, 50),
    ('Bolígrafo', 'Bolígrafo azul de tinta gel', 'Papelería', 2.00, 3.50, 100),
    ('Mochila', 'Mochila escolar resistente', 'Accesorios', 25.00, 40.00, 20);

-- Inserción de libros
INSERT INTO Libros (Titulo, Autor, Fecha_lanzamiento, Descripcion, Genero, Stock, Precio)
VALUES 
    ('Cien años de soledad', 'Gabriel García Márquez', '1967-06-05', 'Novela clásica de realismo mágico', 'Ficción', 10, 30.00),
    ('1984', 'George Orwell', '1949-06-08', 'Distopía sobre una sociedad totalitaria', 'Ciencia ficción', 15, 25.00),
    ('El Principito', 'Antoine de Saint-Exupéry', '1943-04-06', 'Cuento filosófico sobre la vida', 'Infantil', 20, 18.00);

-- Inserción de opiniones
INSERT INTO Opiniones (Libro_idLibros, Calificacion, Comentario, Fecha_opinion)
VALUES 
    (1, 5, 'Una obra maestra de la literatura.', '2025-02-17 10:00:00'),
    (2, 4, 'Un libro interesante con un mensaje fuerte.', '2025-02-16 15:30:00'),
    (3, 5, 'Perfecto para niños y adultos por igual.', '2025-02-15 09:45:00');

-- Inserción de facturas
INSERT INTO Facturas (Empleado_CUI, Cliente_idCliente, Fecha_compra, Precio_total, Metodo_pago, Direccion)
VALUES 
    (10000001, 1, '2025-02-10', 55.00, 'Efectivo', 'Calle 123, Ciudad'),
    (10000002, 2, '2025-02-11', 78.50, 'Contra Entrega', 'Avenida 456, Ciudad');

-- Inserción de detalle de facturas
INSERT INTO Detalle_factura (Factura_idFactura, Libros_idLibros, Producto_idProducto, Cantidad, Precio)
VALUES 
    (1, 1, NULL, 1, 30.00),
    (1, NULL, 2, 2, 7.00),
    (2, 2, NULL, 1, 25.00),
    (2, NULL, 3, 1, 40.00);

-- Inserción en lista de deseos
INSERT INTO Lista_deseos (Producto_idProducto, Cliente_idCliente)
VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (1, 1),
    (2, 1),
    (3, 1);
    
-- Inserción en lista de deseos
INSERT INTO Lista_deseos_Libros (Libros_idLibros, Cliente_idCliente)
VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (1, 1),
    (2, 1),
    (3, 1);

-- Inserción en login
INSERT INTO Login (Usuario, Contrasena, Empleado_CUI)
VALUES 
    ('admin', '$2b$12$SOzIbWAANvT0lhab3ZJrD.U7ORbdBt981z90lb7JKVO5qCmeWEMdm', 10000001),
    ('supervisor', '$2b$12$SOzIbWAANvT0lhab3ZJrD.U7ORbdBt981z90lb7JKVO5qCmeWEMdm', 10000002),
    ('empleado', '$2b$12$SOzIbWAANvT0lhab3ZJrD.U7ORbdBt981z90lb7JKVO5qCmeWEMdm', 10000003);

-- Inserción en despedidos
INSERT INTO Despedidos (Empleados_CUI, Causa, Fecha_despido)
VALUES 
    (10000003, 'Bajo rendimiento', '2025-01-15 14:00:00');


    -- Inserción en TicketSoporte
INSERT INTO TicketSoporte (Cliente_idCliente, Estado, Asunto, Descripcion, Fecha_creacion)
VALUES 
    (1, 'En proceso', 'Problema con la entrega', 'El pedido no llegó a tiempo.', '2025-04-18 10:00:00'),
    (2, 'Pendiente', 'Producto defectuoso', 'El bolígrafo no escribe.', '2025-04-18 11:30:00');

-- Inserción en ArchivoAdjunto
INSERT INTO ArchivoAdjunto (Ticket_idTicket, NombreArchivo, TipoArchivo, Contenido)
VALUES 
    (1, 'captura_envio.png', 'imagen/png', NULL),
    (2, 'foto_producto.png', 'imagen/png', NULL);

-- Inserción en ConversacionTicket
INSERT INTO ConversacionTicket (Ticket_idTicket, Remitente, Empleado_CUI, Mensaje, FechaMensaje)
VALUES 
    (1, 'Empleado', 10000001, 'Estamos investigando el problema de entrega.', '2025-04-18 10:15:00'),
    (2, 'Empleado', 10000002, 'Solicitamos una foto del producto defectuoso.', '2025-04-18 11:45:00');

-- Inserción en AsignacionTicket
INSERT INTO AsignacionTicket (Ticket_idTicket, Empleado_CUI, FechaAsignacion, AsignadoPorSupervisor)
VALUES
    (1, 10000001, '2025-04-18 10:30:00', TRUE),
    (2, 10000002, '2025-04-18 11:50:00', TRUE);
-- Inserción en CancelacionTicket
INSERT INTO CancelacionTicket (Ticket_idTicket, Razon, FechaCancelacion, Supervisor_CUI)
VALUES
    (1, 'Problema logístico con la entrega.', '2025-04-18 11:00:00', 10000002),
    (2, 'Producto defectuoso fuera de garantía.', '2025-04-18 12:00:00', 10000001);
-- Inserción en SolicitudesResolucion
INSERT INTO SolicitudesResolucion (Ticket_idTicket, Empleado_CUI, FechaSolicitud, Aprobado, Supervisor_CUI)
VALUES
    (1, 10000001, '2025-04-18 10:20:00', FALSE, 10000002),
    (2, 10000002, '2025-04-18 11:40:00', TRUE, 10000001);
