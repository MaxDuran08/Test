# Modulo Gerente

## 1. Crear Usuario

### POST

http://127.0.0.1:5000/agregar\_usuario

El `Roles_Id` queda de manera que se pueda crear cualquier tipo, no ncesariamente puede ir 2, badandonos en el dml:

```sql
-- Inserción de roles
INSERT INTO Roles (Nombre) VALUES ('gerente'), ('supervisor'), ('empleado'), ('cliente');
```

por lo que para gerente seria 1, para supervisor 2, empleado 3, cliente 4.
Se envia un json asi:

```

{
    "CUI": 10000007,
    "Correo": "max@email.com",
    "Roles_id": 2,
    "Edad": 38,
    "Estado": "Contratado",
    "Genero": "Femenino",
    "Nombre": "Max",
    "Telefono": "555-5678"
}
```

## 4. Revisar información del supervisor

### GET

http://127.0.0.1:5000/supervisores

## 5. Ver facturas con detalle

### POST

http://127.0.0.1:5000/facturas

```sh
{
    "fecha_inicio": "2023-10-06",
    "fecha_fin": "2023-10-07",
    "empleado_cui":1234567890123,
    "cliente_id": 2
}
```

## 6.1 Productos más vendidos y Volumen de ventas por categoría

### POST

http://127.0.0.1:5000/ventas

```sh
{
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-31"
}
```

## 6.2 Comparación de ventas en distintos periodos

### POST

http://127.0.0.1:5000/ventas_periodo

```sh
{
    "fecha_inicio": "2025-01-01",
    "fecha_fin": "2025-12-31"
}
```

## Reporte de ganancias 
### POST
http://127.0.0.1:5000/ganancias

```sh
{
  "fecha_inicio": "2025-02-01",
  "fecha_fin": "2025-03-31"
}
```
response 

```sh
{
  "total_ganancias": 320.0
}

```
# Modulo supervisor 

## 4 Ver empleados

### GET

http://127.0.0.1:5000/empleados

## 6 Actualizar  productos

### PUT

http://127.0.0.1:5000/producto

```sh
{
    "idProducto": 2,
    "Nombre": "Lpz B Premium",
    "Descripcion": "Lápiz de grafito de alta calidad para escritura profesional",
    "Categoria": "Utiles escolares",
    "Precio_compra": 0.75,
    "Precio_venta": 1.50,
    "Stock": 150,
    "Imagen_producto": "iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## 7 eliminar producto

### delete

http://127.0.0.1:5000/eliminar_producto

```sh
{
    "idProducto": 15
}
```

## 11 Agregar libros

### post

http://127.0.0.1:5000/agregar_libro

```sh
{
  "Titulo": "El nombre del viento",
  "Autor": "Patrick Rothfuss",
  "Fecha_lanzamiento": "2007-03-27",
  "Descripcion": "Una novela de fantasía épica que narra la historia de Kvothe.",
  "Genero": "Fantasía",
  "Stock": 10,
  "Precio": 19.99
}
```

<<<<<<< HEAD
### ver productos
http://127.0.0.1:5000/ver_productos
### get

```sh
[
  {
    "Autor": "Autor A",
    "Descripcion": "Un libro fascinante sobre ciencia ficción",
    "Fecha_lanzamiento": "Mon, 01 Jan 2024 00:00:00 GMT",
    "Genero": "Ciencia Ficción",
    "Precio": "100.00",
    "Stock": 20,
    "Titulo": "El Gran Libro"
  },
  {
    "Autor": "Autor B",
    "Descripcion": "Un thriller que te mantendrá en suspense",
    "Fecha_lanzamiento": "Wed, 15 Nov 2023 00:00:00 GMT",
    "Genero": "Suspenso",
    "Precio": "120.00",
    "Stock": 15,
    "Titulo": "El Misterio del Bosque"
  }
]
```
## ver facturas emitidas
http://127.0.0.1:5000/ver_facturas
## get

```sh
[
  {
    "cliente": "Juan Pérez",
    "detalles": [
      {
        "cantidad": 2,
        "id_detalle": 1,
        "libro": "El Gran Libro",
        "precio": "100.00",
        "producto": "Libro A"
      }
    ],
    "direccion": "Calle Ficticia 123",
    "empleado": "Carlos López",
    "fecha_emision": "Fri, 14 Mar 2025 00:00:00 GMT",
    "id_factura": 1,
    "metodo_pago": "Efectivo",
    "total": "300.00"
  },
  {
    "cliente": "Ana Gómez",
    "detalles": [
      {
        "cantidad": 1,
        "id_detalle": 2,
        "libro": "El Misterio del Bosque",
        "precio": "120.00",
        "producto": "Libro B"
      }
    ],
    "direccion": "Avenida Siempre Viva 456",
    "empleado": "María Torres",
    "fecha_emision": "Fri, 14 Mar 2025 00:00:00 GMT",
    "id_factura": 2,
    "metodo_pago": "Contra Entrega",
    "total": "250.00"
  }
]

```

## agregar producto

http://127.0.0.1:5000/agregar_producto
## post

BODY
=======
# Modulo Empleado

## 2 información de u n articulo

### POST
>>>>>>> origin/Develop

```sh
{
    "nombre": "Producto de Ejemplo",
    "descripcion": "Este es un producto de ejemplo",
    "categoria": "Categoría A",
    "precio_compra": 50.00,
    "precio_venta": 80.00,
    "stock": 100,
    "imagen_producto": "base64_encoded_image_data"
}
```
<<<<<<< HEAD

Response

```sh
{
  "idProducto": 3,
  "mensaje": "Producto agregado correctamente"
}

```
## ver opiniones

http://127.0.0.1:5000/opiniones

```sh
[
  {
    "calificacion": 5,
    "comentario": "Excelente libro, muy recomendable",
    "fecha_opinion": "Fri, 14 Mar 2025 00:12:51 GMT",
    "id_opinion": 1,
    "libro_titulo": "El Gran Libro"
  },
  {
    "calificacion": 4,
    "comentario": "Buen libro, aunque un poco predecible",
    "fecha_opinion": "Fri, 14 Mar 2025 00:12:51 GMT",
    "id_opinion": 2,
    "libro_titulo": "El Misterio del Bosque"
  }
]
```
=======
>>>>>>> origin/Develop



##  
## GET 
http://localhost:5000/margen_ganancia_producto

## response
``` sh
[
  {
    "Margen_Ganancia": "0.00",
    "Precio_compra": null,
    "Precio_venta": null,
    "Producto": null,
    "Total_Vendido": "2"
  },
  {
    "Margen_Ganancia": "3.00",
    "Precio_compra": "2.00",
    "Precio_venta": "3.50",
    "Producto": "Bolígrafo",
    "Total_Vendido": "2"
  },
  {
    "Margen_Ganancia": "15.00",
    "Precio_compra": "25.00",
    "Precio_venta": "40.00",
    "Producto": "Mochila",
    "Total_Vendido": "1"
  }
]
```
## GET
http://localhost:5000/comparacion_ganancias_periodos



RESPONSE
```sh
[
  {
    "Ganancias": "102.00",
    "Periodo": "2022-02"
  },
    {
    "Ganancias": "102.00",
    "Periodo": "2025-02"
  }
]
```
## GET
http://localhost:5000/ganancias_categoria

## RESPONSE
```sh
[
  {
    "Categoria": null,
    "Ganancia_Neta": null
  },
  {
    "Categoria": "Papelería",
    "Ganancia_Neta": "3.00"
  },
  {
    "Categoria": "Accesorios",
    "Ganancia_Neta": "15.00"
  }
]

```