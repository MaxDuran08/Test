DROP DATABASE IF EXISTS Libreria;
CREATE DATABASE Libreria;
USE Libreria;

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


