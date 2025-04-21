- [Manual Técnico](#manual-tecnico)
  - [Antecedentes](#antecedentes)
  - [Propósito](#proposito)
  - [Retos Técnicos](#retos-tecnicos)
  - [Core del Negocio](#core-del-negocio)
    - [Descripción](#descripcion)
    - [CDU primera descomposición](#cdu-primera-descomposicion)
  - [StakeHolders](#stakeholders)
  - [Requerimientos Funcionales](#requerimientos-funcionales)
    - [1. Módulo de Gestión de Usuarios y Autenticación](#1-módulo-de-gestión-de-usuarios-y-autenticación)
    - [2. Módulo de Gestión de Personal](#2-módulo-de-gestión-de-personal)
    - [3. Módulo de Inventario y Productos](#3-módulo-de-inventario-y-productos)
    - [4. Módulo de Ventas y Facturación](#4-módulo-de-ventas-y-facturación)
    - [5. Módulo de Reportes y Análisis](#5-módulo-de-reportes-y-análisis)
  - [Requerimientos No Funcionales](#requerimientos-no-funcionales)
    - [1. Seguridad](#rnf1---seguridad)
    - [2. Usabilidad](#rnf2---usabilidad)
    - [3. Rendimiento](#rnf3---rendimiento)
    - [4. Mantenibilidad y Escalabilidad](#rnf4---mantenibilidad-y-escalabilidad)
    - [5. Disponibilidad y Confiabilidad](#rnf5---disponibilidad-y-confiabilidad)
    - [6. Compatibilidad](#rnf6---compatibilidad)
  - [Diagramas de CDU Expandidos](#diagramas-de-cdu-expandidos)
    - [Gerente](#gerente)
    - [Supervisor](#supervisor)
    - [Empleado](#empleado)
    - [Usuario](#usuario)
  - [Arquitectura Cliente-Servidor](#arquitectura-cliente-servidor)
  - [Matriz de Trazabilidad](#matriz-de-trazabilidad)
    -  [a. Stakeholders vs Requerimientos](#a-stakeholders-vs-requerimientos)
    - [b. Stakeholders vrs CDU](#b-stakeholders-vrs-cdu)
    - [c. Requerimientos vs CDU](#c-requerimientos-vs-cdu)
  - [Diagrama de Bloques](#diagrama-de-bloques)
  - [Diagrama Entidad-Relación](#diagrama-entidad-relación)
  - [Diagrama de Despliegue](#diagrama-de-despliegue)
  - [Diagrama de Componentes](#diagrama-de-componentes)
  - [Diagramas de Prototipos](#diagramas-de-prototipos)
    - [Login](#login)
    - [Home](#home)
    - [Funcionalidades](#funcionalidades)
  - [Tablero Jira](#tablero-jira)
  - [Tablero Backlog](#tablero-backlog)


## Antecedentes

La Librería de Don Héctor, se ha consolidado como un negocio familiar que ofrece una experiencia de compra personalizada y acogedora. Su enfoque principal es la venta de artículos escolares y de oficina, diferenciándose por su atención al cliente y precios competitivos. A pesar de su éxito, enfrenta desafíos como la gestión ineficiente del inventario y la competencia del comercio electrónico, lo que impulsa la necesidad de modernización mediante la digitalización del negocio.

## Proposito <a name="proposito"></a>

- Optimizar la gestión del inventario mediante un sistema digitalizado que facilite el control de stock y reduzca errores.
- Expandir el negocio al entorno digital, implementando una plataforma en línea para la compra de libros y artículos de oficina.
- Mejorar la experiencia del cliente con atención personalizada tanto en tienda como en el canal digital.
- Fortalecer la fidelización de clientes a través de programas de recompensas y promociones dirigidas.

## Retos Técnicos <a name="retos"></a>

1. Escalabilidad:

   - Diseñar una plataforma que soporte el crecimiento del catálogo de productos y la incorporación de nuevas sucursales.
   - Implementar bases de datos optimizadas para manejar un volumen creciente de transacciones y usuarios.
2. Gestión de Inventario:

   - Digitalizar los procesos de inventario, reduciendo errores y optimizando el reabastecimiento de productos.
   - Implementar alertas y reportes en tiempo real para evitar quiebres de stock o sobreacumulación de artículos de temporada.
3. Experiencia del Usuario:

   - Diseñar una interfaz intuitiva y accesible para facilitar la compra en línea.
   - Incorporar filtros avanzados para la búsqueda de productos por categorías, autor o popularidad.
4. Seguridad y Privacidad:

   - Proteger la información del cliente mediante cifrado y autenticación segura.
   - Garantizar la integridad de las transacciones en línea mediante métodos de pago confiables.

## Core del Negocio <a name="core-del-negocio"></a>

### Descripción <a name="descripción"></a>

Para modernizar la Librería de Don Héctor, se desarrollará una plataforma digital integral que optimice la gestión del inventario, automatice procesos clave y expanda el negocio al comercio electrónico. Esta solución permitirá una administración eficiente de productos, ventas y empleados, reduciendo errores y mejorando la disponibilidad del stock.

La plataforma de ventas en línea brindará una experiencia de compra accesible y personalizada, permitiendo a los clientes explorar, comprar productos y acceder a programas de fidelización. Además, la arquitectura del sistema será escalable y segura, garantizando la adaptación a futuras necesidades del negocio y fortaleciendo su competitividad en el mercado digital.

![AltoNivel](imagen/AltoNivel.png)

### CDU primera descomposición <a name="cdu"></a>

![PrimeraDescompo](imagen/Primera%20_Descompsicion.JPG)

![PrimeraDescompo](imagen/CDU_Primera%20Descomposicon.png)




## CDU1_Expandidos  Compra_ Venta

![PrimeraDescompo](imagen/CDU1_Compra_Venta.JPG)

## CDU2_Expandido  Manejo de personal

![PrimeraDescompo](imagen/CDU2_ManejoDePersonal.JPG)

## CDU3_Proveedor
![PrimeraDescompo](imagen/CDU3_OrdenesDeProveedor.JPG)

## CDU4_Manejo de inventario
![PrimeraDescompo](imagen/CDU4_ManejoDeInventario.JPG)
# CDU1 - Compras/Ventas
Actores:
•	Cliente: Usuario que navega en la plataforma para buscar, comprar y calificar libros.
•	Empleado: Usuario que gestiona artículos y facturas dentro del sistema.
# Casos de Uso Expandidos
1. Iniciar sesión
Descripción: El cliente introduce sus credenciales para acceder al sistema.
Actores: Cliente
Flujo Principal:
1.	El usuario ingresa su correo.
2.	El usuario introduce su contraseña.
3.	El sistema valida los datos.
4.	Si son correctos, se concede acceso.
### Flujos Alternativos:
•	1A. Si el correo o la contraseña son incorrectos, se muestra un mensaje de error.

2. Buscar libro
Descripción: El cliente busca libros disponibles en el sistema.
Actores: Cliente
Flujo Principal:
1.	El usuario introduce un criterio de búsqueda.
2.	El sistema permite buscar por: 
o	Título
o	Autor
o	Género
o	Precio
3.	Se muestran los resultados.
Flujos Alternativos:
•	2A. Si no hay coincidencias, se informa al usuario.

##3. Ver libros disponibles
Descripción: El cliente consulta la lista de libros en stock.
Actores: Cliente
Flujo Principal:
1.	El usuario solicita ver los libros disponibles.
2.	El sistema muestra la lista de libros con detalles.

## 4. Añadir al carrito
Descripción: El usuario selecciona un libro para comprarlo después.
Actores: Cliente
Flujo Principal:
1.	El usuario selecciona un libro.
2.	El sistema añade el libro al carrito de compras.
3.	Se confirma la acción.

## 5. Ver más votados
Descripción: Permite al usuario ver los libros con mejor calificación.
Actores: Cliente
Flujo Principal:
1.	El usuario accede a la sección de libros más votados.
2.	El sistema muestra un ranking de los libros con mejores calificaciones.

## 6. Realizar compra
Descripción: El usuario finaliza la compra de los libros seleccionados.
Actores: Cliente
Flujo Principal:
1.	El usuario revisa su carrito.
2.	Selecciona método de pago.
3.	Confirma la compra.
4.	El sistema genera una orden de compra.
Flujos Alternativos:
•	3A. Si el pago falla, se notifica al usuario.

## 7. Calificar y comentar
Descripción: El cliente deja una reseña sobre un libro comprado.
Actores: Cliente
Flujo Principal:
1.	El usuario selecciona un libro que compró.
2.	Introduce una calificación y un comentario.
3.	El sistema guarda la reseña.

# Casos de Uso del Empleado
## 8. Ver artículo
Descripción: Permite al empleado consultar detalles de un libro.
Actores: Empleado
Flujo Principal:
1.	El empleado busca un libro.
2.	Se muestran los detalles del libro.

## 9. Consultar artículo
Descripción: El empleado puede verificar si un artículo está en stock.
Actores: Empleado
Flujo Principal:
1.	El empleado introduce un criterio de búsqueda.
2.	Se muestra la información del artículo.

## 10. Generar artículo
Descripción: Permite a un empleado agregar un nuevo libro al sistema.
Actores: Empleado
Flujo Principal:
1.	El empleado introduce los datos del libro (título, autor, género, precio).
2.	El sistema guarda la información.

## 11. Ver factura
Descripción: Permite a un empleado consultar detalles de una factura.
Actores: Empleado
Flujo Principal:
1.	El empleado busca una factura.
2.	Se muestran los detalles de la transacción.




# CDU2 - Manejo de Personal
Actores:
 •	Gerente: Administra supervisores y empleados dentro del sistema. 
•	Supervisor: Gestiona empleados y productos dentro del sistema.

## Casos de Uso Expandidos
1. Agregar supervisor
Descripción: El gerente añade un nuevo supervisor al sistema.
Actores: Gerente
Flujo Principal:
1.	El gerente selecciona la opción "Agregar supervisor".
2.	Ingresa los datos del supervisor: 
o	Nombre completo
o	Correo
o	Teléfono
o	Fecha de ingreso
3.	El sistema valida y almacena la información.
4.	Se confirma la acción al gerente.

## 2. Eliminar supervisor
Descripción: El gerente elimina a un supervisor del sistema.
Actores: Gerente
Flujo Principal:
1.	El gerente selecciona la opción "Eliminar supervisor".
2.	Se muestra la lista de supervisores.
3.	El gerente selecciona el supervisor a eliminar.
4.	El sistema elimina al supervisor y muestra un mensaje de confirmación.
Flujos Alternativos:
•	3A. Si el supervisor tiene empleados asignados, se muestra una advertencia y se requiere reasignación antes de eliminarlo.

## 3. Modificar supervisor
Descripción: El gerente actualiza la información de un supervisor.
Actores: Gerente
Flujo Principal:
1.	El gerente selecciona "Modificar supervisor".
2.	Se muestra la lista de supervisores.
3.	El gerente elige el supervisor a modificar.
4.	Se permite editar datos como: 
o	Nombre completo
o	Correo
o	Teléfono
o	Fecha de ingreso
5.	El sistema guarda los cambios.

## 4. Agregar empleado
Descripción: Un supervisor registra a un nuevo empleado en el sistema.
Actores: Supervisor
Flujo Principal:
1.	El supervisor selecciona "Agregar empleado".
2.	Ingresa los datos del empleado: 
o	Nombre
o	Apellido
o	Correo
o	Teléfono
o	CUI
o	Edad
3.	El sistema valida y almacena la información.
4.	Se confirma la acción.

## 5. Eliminar empleado
Descripción: Un supervisor elimina a un empleado del sistema.
Actores: Supervisor
Flujo Principal:
1.	El supervisor selecciona "Eliminar empleado".
2.	Se muestra la lista de empleados.
3.	Selecciona al empleado a eliminar.
4.	El sistema confirma y ejecuta la acción.

## 6. Modificar empleado
Descripción: Un supervisor actualiza la información de un empleado.
Actores: Supervisor
Flujo Principal:
1.	El supervisor selecciona "Modificar empleado".
2.	Se muestra la lista de empleados.
3.	Selecciona al empleado a modificar.
4.	Se pueden editar los siguientes datos: 
o	Nombre
o	Apellido
o	Correo
o	Teléfono
o	CUI
o	Edad
5.	El sistema guarda los cambios.

## 7. Ver producto
Descripción: Permite a los supervisores consultar productos en el sistema.
Actores: Supervisor
Flujo Principal:
1.	El supervisor accede a la opción "Ver producto".
2.	Se muestran los productos registrados en el sistema.

## 8. Agregar producto
Descripción: Un supervisor añade un nuevo producto al sistema.
Actores: Supervisor
Flujo Principal:
1.	El supervisor selecciona "Agregar producto".
2.	Ingresa los detalles del producto.
3.	El sistema guarda la información.

## 9. Ver opiniones y comentarios
Descripción: Un supervisor revisa comentarios sobre productos o libros.
Actores: Supervisor
Flujo Principal:
1.	El supervisor accede a "Ver opiniones y comentarios".
2.	Se muestran los comentarios de clientes sobre productos o libros.

## 10. Agregar libros
Descripción: Un supervisor registra nuevos libros en el sistema.
Actores: Supervisor
Flujo Principal:
1.	El supervisor selecciona "Agregar libros".
2.	Ingresa la información del libro.
3.	El sistema almacena la información.




## StakeHolders <a name="Stakeholders"></a>


| ID | Stakeholer |
| -- | ---------- |
| 1  | Gerentes   |
| 2  | Supervisor |
| 3  | Empleado   |
| 4  | Usuario    |

## Requerimientos Funcionales <a name="requerimientos-funcionales"></a>

### 1. Módulo de Gestión de Usuarios y Autenticación

### RF01 - Gestión de Credenciales

- **RF01.1**: El sistema debe permitir el registro de usuarios con los siguientes datos personales: nombre completo, correo electrónico, edad y contraseña. Los roles pueden ser cliente, empleado, supervisor o gerente.
- **RF01.2**: El sistema debe implementar un proceso de verificación de cuenta mediante correo electrónico.
- **RF01.3**: El sistema debe permitir el inicio de sesión de usuarios mediante correo y contraseña, dependiendo de su rol:

  - Los clientes solo pueden autenticarse para comprar libros digitales.
  - Los empleados, supervisores y el gerente deben autenticarse para gestionar el sistema.
- **RF01.4**: El sistema debe almacenar las contraseñas de forma encriptada en la base de datos.

### 2. Módulo de Gestión de Personal

### RF02 - Gestión de Supervisores y Empleados

- **RF02.1**: El sistema debe permitir al gerente registrar supervisores proporcionando la siguiente información: nombre completo, correo, teléfono y fecha de ingreso.
- **RF02.2**: El sistema debe permitir a los supervisores registrar empleados con la siguiente información: nombre, apellido, CUI, teléfono, correo, edad, género, fecha de contratación y fotografía.
- **RF02.3**: El sistema debe permitir al gerente eliminar supervisores, y a los supervisores eliminar empleados, manteniendo un registro histórico con la fecha de baja y el motivo.
- **RF02.4**: El sistema debe permitir la modificación de información de contacto de supervisores y empleados.
- **RF02.5**: El sistema debe enviar automáticamente credenciales de acceso a los supervisores y empleados al momento de su registro.

### 3. Módulo de Inventario y Productos

### RF03 - Gestión de Productos Físicos

- **RF03.1**: El sistema debe permitir registrar nuevos productos con la siguiente información: nombre, descripción, código, categoría, precio de compra, precio de venta, cantidad en inventario e imagen.
- **RF03.2**: El sistema debe permitir actualizar la información de los productos existentes, incluyendo su precio y stock.
- **RF03.3**:  El sistema debe permitir dar de baja productos del inventario, asegurando que la información histórica no se pierda.
- **RF03.4**: El sistema debe permitir consultar el detalle completo de los productos disponibles en el inventario.

### RF04 - Gestión de Libros Digitales

- **RF04.1**: El sistema debe permitir registrar libros digitales con la siguiente información: título, autor, fecha de lanzamiento, descripción, género y precio.
- **RF04.2**: El sistema debe permitir visualizar el catálogo de libros sin necesidad de autenticación.
- **RF04.3**: El sistema debe implementar un buscador con filtros por título, autor, género y precio.
- **RF04.4**: El sistema debe permitir a usuarios crear y gestionar listas de deseos.

### 4. Módulo de Ventas y Facturación

### RF05 - Gestión de Ventas

- **RF05.1**: El sistema debe permitir a los empleados registrar ventas seleccionando productos y calculando el total.
- **RF05.2**: El sistema debe permitir a los clientes gestionar una compra de libros digitales.
- **RF05.3**: El sistema debe registrar los métodos de pago disponibles:

  - Tienda física: Solo efectivo.
  - Libros digitales: Pago contra entrega.
- **RF05.4**: El sistema debe generar facturas en formato PDF con información completa de la venta.
- **RF05.5**: El sistema debe mantener un historial de facturas consultable mediante filtros de búsqueda.

### 5. Módulo de Reportes y Análisis

### RF06 - Reportes Gerenciales

- **RF06.1**: El sistema debe generar reportes de ventas incluyendo:

  - Productos más vendidos
  - Comparativas entre períodos
  - Volumen por categoría
- **RF06.2**: El sistema debe generar reportes de ganancias incluyendo:

  - Margen por producto
  - Comparativas entre períodos
  - Ganancias por categoría

### RF07 - Gestión de Feedback

- **RF07.1**: El sistema debe permitir a usuarios registrar calificaciones y comentarios sobre libros.
- **RF07.2**: El sistema debe permitir a usuarios modificar o eliminar sus comentarios.
- **RF07.3**: El sistema debe permitir a supervisores visualizar y gestionar las valoraciones recibidas.

## Requerimientos No Funcionales <a name="requerimientos-no-funcionales"></a>

Estos requisitos garantizan la calidad, seguridad y rendimiento de la plataforma.

### RNF1 - Seguridad

- **RNF1.1**: Las contraseñas deben almacenarse en la base de datos mediante un algoritmo de hashing seguro (ej. bcrypt, Argon2 o PBKDF2).
- **RNF1.2**: El sistema debe validar correos electrónicos para la activación de cuentas y prevenir accesos no autorizados.
- **RNF1.3**: El acceso a módulos debe estar restringido según los roles asignados (gerente, supervisor, empleado, cliente).
- **RNF1.4**: Se debe implementar un sistema de auditoría para registrar acciones críticas como eliminaciones, modificaciones y accesos administrativos.

### RNF2 - Usabilidad

- **RNF2.1**: La interfaz debe ser intuitiva y accesible para usuarios con distintos niveles de experiencia en tecnología.
- **RNF2.2**: La navegación debe ser coherente, con menús organizados y accesibles desde cualquier sección del sistema.
- **RNF2.3**: Se deben mostrar mensajes de error y confirmación claros para todas las acciones realizadas por el usuario.
- **RNF2.4**: La interfaz debe ser responsiva y adaptarse a diferentes tamaños de pantalla (móviles, tabletas y computadoras).

### RNF3 - Rendimiento

- **RNF3.1**: El tiempo de carga de la plataforma no debe exceder los 3 segundos en condiciones normales de red.
- **RNF3.2**: El sistema debe soportar al menos 100 usuarios concurrentes sin degradación del rendimiento.
- **RNF3.3**: La generación de reportes debe completarse en menos de 5 segundos con volúmenes de datos de hasta 100,000 registros.

### RNF4 - Mantenibilidad y Escalabilidad

- **RNF4.1**: La plataforma debe permitir la fácil incorporación de nuevas funcionalidades sin afectar el rendimiento o estabilidad del sistema.
- **RNF4.2**: Se debe proporcionar documentación detallada para desarrolladores y usuarios finales.
- **RNF4.3**: El sistema debe ser modular para facilitar su mantenimiento y actualización.

### RNF5 - Disponibilidad y Confiabilidad

- **RNF5.1**: La plataforma debe garantizar una disponibilidad del 99% durante los horarios de operación.
- **RNF5.2**: Se deben realizar respaldos automáticos diarios de la base de datos para evitar pérdida de información.
- **RNF5.3**: En caso de fallos críticos, el sistema debe recuperarse en un tiempo máximo de 2 horas.

### RNF6 - Compatibilidad

- **RNF6.1**: El sistema debe ser accesible desde los navegadores modernos más utilizados (Google Chrome, Mozilla Firefox, Microsoft Edge y Safari).
- **RNF6.2**: La plataforma debe ser completamente funcional en dispositivos móviles, tabletas y computadoras sin pérdida de características clave.

## Diagramas de CDU Expandidos

## Gerente

### Agregar Supervisor:


| ID Caso de Uso            | CU 001                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Módulo                   | Gestión de Supervisores                                                                                                                                                                                                                                                                                                                                   |
| Actor Principal           | Gerente                                                                                                                                                                                                                                                                                                                                                    |
| Precondiciones            | El gerente debe estar autenticado en el sistema<br> Validar que el  supervisor a agregar no debe existir en el sistema                                                                                                                                                                                                                                     |
| Postcondiciones           | Nuevo supervisor registrado en el sistema<br>Credenciales enviadas por correo al supervisor.                                                                                                                                                                                                                                                               |
| Escenario Principal       | 1. El gerente selecciona la opción "Agregar Supervisor"<br> 2. El sistema muestra el formulario de registro <br> 3. El gerente ingresa los datos requeridos (nombre, correo, teléfono, fecha ingreso)<br>4. El sistema valida los datos ingresados<br>5. Se crea la cuenta del supervisor en el sistema <br>6. El sistema envía correo con credenciales |
| Escenario Alternativo 1     | Datos incorrectos o invalidos<br> 1. Sistema muestra mensaje de error registrado                                                                                                                                                                                                        |
| Escenario Alternativo 2     | Correo ya existente <br> 1. Sistema notifica que el correo ya está registrado                                                                                                                                                                                                        |
| Escenario Alternativo 3     | Error en el envío del correo<br> 1. Sistema notifica error en el campo de correo ya no cumple con las especificaciones<br>                                                                                                               |
| Requerimientos Especiales | Se debe encriptar las credenciales<br> El correo debe enviarse de forma automática                                                                                                                                                                                                                                                                        |
| Sistema                   | Librería Don Héctor                |                                                                                                                                                                                                                                                                                                                      |

### Ver Reportes:


| ID Caso de Uso            | CU-002                                                                                                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Módulo                   | Reportes                                                                                                                                                                                                                                      |
| Actor Principal           | Gerente                                                                                                                                                                                                                                       |
| Precondiciones            | Gerente debe estar autenticado en el sistema<br> Deben de existir datos registrados de ventas                                                                                                                                                 |
| Postcondiciones           | Reporte Generado con exito y mostrado al gerente                                                                                                                                                                                              |
| Escenario Principal       | 1. El gerente selecciona la opcion "Ver Reportes "<br> 2. El sistema muestra opciones de reportes<br> 3. El gerente selecciona el tipo de reporte<br> 4. El gerente configura filtros <br> 5. El sistema genera y muestra el reporte gráfico |
| Escenario Alternativo     | No hay datos para el período seleccionado respecto  fechas<br>1.  Se muestra mensaje indicando que no hay datos o registros <br> 2. Permite seleccionar otro período         
| Escenario Alternativo     |Error en la generación del reporte<br> 1. Sistema muestra mensaje de error técnico<br> técnico                                                                    |
| Requerimientos Especiales | Los reportes incluyen gráficos<br> Permite exportar en diferentes formatos  |
| Sistema                   | Librería Don Héctor                    |                                                                                                                                                                                                 

### Eliminar supervisor


| ID Caso de Uso            | CU 003                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Módulo                   | Gestión de Supervisores                                                                                                                                                                                                                                                                                                                                                                                              |
| Actor Principal           | Gerente                                                                                                                                                                                                                                                                                                                                                                                                               |
| Precondiciones            | Es necesario que el gerente esté autenticado en el sistema<br>  El supervisor a eliminar debe existir en el sistema se debe validar                                                                                                                                                                                                                                                                                  |
| Postcondiciones           | Supervisor eliminado del sistema<br> Registro actualizado de la auditoría                                                                                                                                                                                                                                                                                                                                            |
| Escenario Principal       | 1. El gerente selecciona la opcion "Eliminar Supervisor"<br> 2. El sistema muestra lista de supervisores activos o disponibles <br>3. El gerente selecciona el supervisor a eliminar<br> 4. El gerente ingresa razón de desvinculación <br> 5. El sistema solicita confirmación para eliminar <br>6. El gerente confirma la eliminación <br> 7. El sistema registra la baja y actualiza el registro de auditoría |
| Escenario Alternativo 1     | Datos inválidos o erroneos<br> 1. Sistema muestra mensaje de error<br> 2. Retorna al paso 5uso                                                                                                                                                                                                                                                      |
| Escenario Alternativo 2     | Correo ya existente <br>  1. Sistema notifica que el correo está en uso                                                                                                      
| Escenario Alternativo  3    | Errores tenicos <br> 1. Muestra mensaje de error tecnico al momento de registrar la baja                                                                                                                                                                        |
| Requerimientos Especiales | Registrar historial de cambios<br>  Validar formato de datos                                                                                                                                                                                                                                                                                                                                                          |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                                                                                                                 |

### Modificar Supervisor:


| ID Caso de Uso            | CU 004                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Módulo                   | Gestión de Supervisores                                                                                                                                                                                                                                                                                                                                             |
| Actor Principal           | Gerente                                                                                                                                                                                                                                                                                                                                                              |
| Precondiciones            | El gerente debe estar autenticado en el sistema<br> El supervisor a modificar debe existir en el sistema                                                                                                                                                                                                                                                             |
| Postcondiciones           | El gerente debe estar autenticado en el sistema<br> El supervisor a modificar debe existir en el sistema                                                                                                                                                                                                                                                             |
| Escenario Principal       | 1. El gerente selecciona la opcion "Modificar Supervisor"<br> 2. El sistema enlista a los supervisores  <br> 3. El gerente selecciona el supervisor a modificar <br> 4. El sistema muestra formulario con datos actuales <br> 5. El gerente modifica la información del supervisor <br>6. El sistema valida los cambios <br>7. El sistema actualiza la información |
| Escenario Alternativo 1     | Datos inválidos o erroneos.<br> 1. Sistema muestra mensaje de error                                                                                                                                                                                                                              |
| Escenario Alternativo 2     | Correo existente  <br> 1. Sistema notifica que el correo está en uso                                                                                                                       |
| Escenario Alternativo 3     | Fallo en la actualización<br> 1. Sistema notifica error técnico durante la actualización<br>                                                                                    |
| Requerimientos Especiales | Registrar historial de cambios<br> Validar formato de datos                                                                                                                                                                                                                                                                                                          |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                                                                |

### Ver Facturas:


| Campo                     | Descripción                                                                                                                                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-005                                                                                                                                                                                                                                                                                        |
| Módulo                   | Gestión de Facturas                                                                                                                                                                                                                                                                          |
| Actor Principal           | Gerente                                                                                                                                                                                                                                                                                       |
| Precondiciones            | El gerente debe estar autenticado en el sistema<br> Deben existir registros de facturas en el sistema                                                                                                                                                                                         |
| Postcondiciones           | Facturas mostradas según criterios de búsqueda                                                                                                                                                                                                                                              |
| Escenario Principal       | 1. El gerente selecciona la opcion "Ver Facturas"<br> 2. El sistema muestra interfaz de búsqueda <br> 3. El gerente aplica filtros (fecha, empleado, cliente )<br> 4. El sistema muestra facturas que tienen coincidencia <br> 5. El gerente puede seleccionar una factura para ver detalles |
| Escenario Alternativo 1    | No hay facturas con coincidencia.<br> 1. Sistema muestra mensaje "No se encontraron resultados"                                                                                                                                                     |
| Escenario Alternativo 2    |Modificación de filtros de busqueda                                                                                                                  |
| Escenario Alternativo 3    |Error en la carga de facturas<br> 1. Sistema muestra mensaje de error técnico<br> 2. No se encontraron datos en la tabla de facturas                                     |
| Requerimientos Especiales | Exportar facturas en formato PDF<br> Facilitar la identificación de diversos criterios de hayazgo                                                                                                                                                                                            |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                         |

### Ver Ganancias:


| Campo                     | Descripción                                                                                                                                                                                                                                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-006                                                                                                                                                                                                                                                                                                                       |
| Módulo                   | Reportes Financieros                                                                                                                                                                                                                                                                                                         |
| Actor Principal           | Gerente                                                                                                                                                                                                                                                                                                                      |
| Precondiciones            | El gerente debe estar autenticado en el sistema<br> Deben existir registros de costos y ventas                                                                                                                                                                                                                               |
| Postcondiciones           | Reporte de ganancias generado y mostrado                                                                                                                                                                                                                                                                                     |
| Escenario Principal       | 1. El gerente selecciona la opción "Ver Ganancias"<br> 2. El sistema muestra opciones de períodos <br> 3. El gerente selecciona período de análisis <br> 4. Se muestran:  Margen de ganancia por producto <br>  Comparación de períodos<br> Ganancias por categoría<br>5. El gerente puede interactuar con el reporte |
| Escenario Alternativo 1    | Período sin datos:<br> 1. Sistema muestra mensaje de "Para el período seleccionado no hay datos" <br> 2. Permite seleccionar otro período  |
| Escenario Alternativo 2    | Error en  ganancias<br> 1. Sistema notifica un error en los datos de la tabla de ventas                                                                                                                                                                                |
| Requerimientos Especiales | Mostrar gráficos interactivos<br>  Permitir exportar reportes <br> Cálculos precisos de márgenes                                                                                                                                                                                                                          |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                        |

## SUPERVISOR

### Agregar Producto


| Campo                     | Descripción                                                                                                                                                                                                                                                                                                                            |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-007                                                                                                                                                                                                                                                                                                                                  |
| Módulo                   | Gestión de Inventario                                                                                                                                                                                                                                                                                                                  |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                                                                                              |
| Precondiciones            | El supervisor debe estar autenticado en el sistema                                                                                                                                                                                                                                                                                      |
| Postcondiciones           | Nuevo producto registrado en el inventario<br>  Stock actualizado (inventario)                                                                                                                                                                                                                                                          |
| Escenario Principal       | 1. El supervisor selecciona la opción "Agregar Producto"<br> 2. El sistema muestra formulario de registro <br> 3. El supervisor ingresa datos del producto (nombre, descripción, código, categoría, precios, cantidad, imagen) <br> 4. El sistema realiza la validación de los datos <br> 5. El sistema registra el nuevo producto |
| Escenario Alternativo 1    | Código de producto ya existente :<br> 1. Sistema notifica duplicidad.                                                                                                                                                                                                      |
| Escenario Alternativo 2    | Datos incompletos: <br> 1. Sistema señala campos faltantes                                                                                                                                                                                                             |
| Escenario Alternativo 3    | Error al cargar imagen<br> 1. Sistema notifica que la imagen no se pudo cargar<br>                                                                                                                                                                                   |
| Requerimientos Especiales | Debe permitir subir imágenes del producto<br> Realiza validación de formato de códigos                                                                                                                                                                                                                                               |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                                   |

### Agregar Empleado


| Campo                     | Descripción                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-008                                                                                                                                                                                                                                                                                                                                                             |
| Módulo                   | Gestión de Empleados                                                                                                                                                                                                                                                                                                                                              |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                                                                                                                         |
| Precondiciones            | El supervisor debe estar autenticado en el sistema                                                                                                                                                                                                                                                                                                                 |
| Postcondiciones           | Un nuevo empleado registrado en el sistema<br>  Correo de confirmación enviado al empleado <br> Credenciales generadas                                                                                                                                                                                                                                            |
| Escenario Principal       | 1. El supervisor selecciona la opción "Agregar Empleado"<br> 2. El sistema muestra formulario de registro <br> 3. El supervisor ingresa datos (nombre, apellido, CUI, teléfono, correo, edad, género, fecha contratación, fotografía) <br> 4. El sistema valida los datos <br> 5. El sistema crea la cuenta <br> 6. El sistema envía correo con credenciales |
| Escenario Alternativo 1    | CUI duplicado:<br>1. Sistema notifica que el empleado ya existe con ese registro.                                                                                                                                                                                                                    |
| Escenario Alternativo 2    | Correo inválido: 1. Sistema solicita verificar el correo<br>                                                                                                                                                                                                                    |
| Escenario Alternativo 3    | Error en el envío del correo<br> 1. Sistema notifica fallo en el envío del correo con credenciales<br>                                                                                                                                                                             |
| Requerimientos Especiales | Validación formato de CUI<br>  Almacenar fotografía del empleado<br>  Generar contraseña segura                                                                                                                                                                                                                                                                 |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                                                              |

### Eliminar Empleado


| Campo                     | Descripción                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-009                                                                                                                                                                                                                                                                                                                         |
| Módulo                   | Gestión de Empleados                                                                                                                                                                                                                                                                                                          |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                                                                                     |
| Precondiciones            | El supervisor debe estar autenticado<br>  El empleado a eliminar debe existir en el sistema                                                                                                                                                                                                                                    |
| Postcondiciones           | Empleado dado de baja<br> Registro histórico actualizado                                                                                                                                                                                                                                                                      |
| Escenario Principal       | 1. El supervisor selecciona la opción "Eliminar Empleado"<br>2 . El sistema muestra lista de empleados activos<br>3. El supervisor selecciona empleado<br>4. El supervisor ingresa causa de baja<br>5. El sistema solicita confirmación<br>6. El supervisor confirma<br>7. El sistema registra la baja y guarda el historial |
| Escenario Alternativo  1   | Empleado con ventas pendientes:<br>1. Sistema muestra advertencia<br>  2. Permite cerrar ventas antes de eliminar                                                                                                                                                                                                                    |
| Escenario Alternativo  2   |Error en el registro de auditoría<br> 1. Sistema notifica fallo en la actualización del historial<br>                                                                                                                                                                      |
| Requerimientos Especiales | Mantiene el registro de desempeño<br> Guardar causa de baja                                                                                                                                                                                                                                                                   |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                          |

### Modificar Empleado


| Campo                     | Descripción                                                                                                                                                                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-010                                                                                                                                                                                                                                                                                                                  |
| Módulo                   | Gestión de Empleados                                                                                                                                                                                                                                                                                                   |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                                                                              |
| Precondiciones            | El supervisor debe estar autenticado<br> Validación, El empleado debe existir en el sistema                                                                                                                                                                                                                            |
| Postcondiciones           | Información del empleado actualizada                                                                                                                                                                                                                                                                                   |
| Escenario Principal       | 1. El supervisor selecciona "Modificar Empleado"<br>2. El sistema muestra lista de empleados<br>3. El supervisor selecciona empleado<br>4. El sistema muestra formulario con datos actuales<br>5. El supervisor modifica información necesaria<br>6. El sistema valida cambios<br>7. El sistema actualiza información |
| Escenario Alternativo 1    | Teléfono inválido:<br> 1. Sistema muestra error                                                                                                                                                                                         |
| Escenario Alternativo 2    | Correo duplicado o repetido:<br> 1. Sistema notifica que esta repetido o duplicado.                                                                                                                                                                                         |
| Escenario Alternativo 3    |Fallo en la actualización<br> 1. Sistema notifica error técnico durante la actualización<br>                                                                                                                                                           |
| Requerimientos Especiales | Validación formato de datos<br> Registrar historial de cambios                                                                                                                                                                                                                                                         |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                                   |

### Ver productos


| Campo                     | Descripción                                                                                                                                                                                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-011                                                                                                                                                                                                                                              |
| Módulo                   | Gestión de Inventario                                                                                                                                                                                                                              |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                          |
| Precondiciones            | El supervisor debe estar autenticado                                                                                                                                                                                                                |
| Postcondiciones           | Información de productos mostrada                                                                                                                                                                                                                  |
| Escenario Principal       | 1. El supervisor selecciona la opción "Ver Productos"<br>2. El sistema muestra interfaz de búsqueda<br>3. El supervisor puede aplicar filtros<br>4. El sistema muestra lista de productos<br>5. El supervisor puede ver detalles de cada producto |
| Escenario Alternativo  1   | No hay productos :<br> 1. Sistema muestra mensaje "No hay productos"<br> 2. Ofrece opción de agregar productos                                                                                                                                           |
| Escenario Alternativo  2   |Error en la carga de productos<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                    |
| Requerimientos Especiales | Mostrar estado del inventario o stock<br>- Alertas de stock bajo                                                                                                                                                                                    |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                               |

### Ver opiniones y comentarios


| Campo                     | Descripción                                                                                                                                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-012                                                                                                                                                                                                                                                                          |
| Módulo                   | Gestión de Feedback                                                                                                                                                                                                                                                            |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                                      |
| Precondiciones            | El supervisor debe estar autenticado<br> Deben existir comentarios en el sistema                                                                                                                                                                                                |
| Postcondiciones           | Comentarios mostrados, opiniones mostrados                                                                                                                                                                                                                                      |
| Escenario Principal       | 1. El supervisor selecciona la opción "Ver opiniones y comentarios"<br>2. El sistema muestra interfaz de búsqueda<br>3. El supervisor puede filtrar por libro<br>4. El sistema muestra comentarios con calificaciones<br>5. El supervisor puede ver detalles de cada opinión |
| Escenario Alternativo 1    | No hay comentarios:<br> 1. Sistema muestra "No hay comentarios"<br> 2. Permite buscar otro libro                                                                                                                                                                                      |
| Escenario Alternativo 2    | Error en la carga de comentarios<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                                                             |
| Requerimientos Especiales | Mostrar promedio de calificaciones<br>Ordenar por fecha/calificación                                                                                                                                                                                                           |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                           |

### Agregar Libros


| Campo                     | Descripción                                                                                                                                                                                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-013                                                                                                                                                                                                                                                      |
| Módulo                   | Gestión de Catálogo                                                                                                                                                                                                                                       |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                  |
| Precondiciones            | El supervisor debe estar autenticado                                                                                                                                                                                                                        |
| Postcondiciones           | Nuevo libro agregado al catálogo                                                                                                                                                                                                                           |
| Escenario Principal       | 1. El supervisor selecciona la opción "Agregar Libro"<br>2. El sistema muestra formulario<br>3. El supervisor ingresa datos (título, autor, fecha, descripción, género, stock, precio)<br>4. El sistema valida datos<br>5. El sistema registra el libro |
| Escenario Alternativo 1    | Libro duplicado:<br> 1. Sistema notifica duplicidad<br> 2. Permite actualizar existente<br> Datos incompletos:<br> Sistema señala campos faltantes                                                                                                               |
| Escenario Alternativo 2    | Datos incompletos:<br>1.  Sistema señala campos faltantes                                                                                                               |
| Escenario Alternativo 3    | Error en la tecnico<br> 1. Sistema notifica que no se pudo agregar libro a la base de datos<br>
| Requerimientos Especiales | Validar ISBN si aplica<br> Distinguir entre libros físicos o digitales                                                                                                                                                                                     |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                       |

### Ver Factura


| Campo                     | Descripción                                                                                                                                                                                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-014                                                                                                                                                                                                                                                                  |
| Módulo                   | Gestión de Facturas                                                                                                                                                                                                                                                    |
| Actor Principal           | Supervisor                                                                                                                                                                                                                                                              |
| Precondiciones            | El supervisor debe estar autenticado<br> Deben existir facturas en el sistema                                                                                                                                                                                           |
| Postcondiciones           | Facturas mostradas según criterios                                                                                                                                                                                                                                     |
| Escenario Principal       | 1. El supervisor selecciona la opción "Ver Factura"<br>2. El sistema muestra opciones de búsqueda<br>3. El supervisor aplica filtros (fecha, empleado, cliente)<br>4. El sistema muestra facturas coincidentes<br>5. El supervisor puede ver detalles de cada factura |
| Escenario Alternativo 1    | No hay coincidencias:<br> 1. Sistema muestra "No se encontraron facturas"<br>  2. Permite modificar filtros                                                                                                                                                                   |
| Escenario Alternativo 2    | Error en la carga de facturas<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                                               |
| Requerimientos Especiales | Exportar facturas en PDF<br> Búsqueda por múltiples criterios                                                                                                                                                                                                         |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                   |

## Empleado

### Ver artículos:


| Campo                     | Descripción                                                                                                                                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-015                                                                                                                                                                                                                                                                                               |
| Módulo                   | Gestión de Inventario                                                                                                                                                                                                                                                                               |
| Actor Principal           | Empleado                                                                                                                                                                                                                                                                                             |
| Precondiciones            | El empleado debe estar autenticado en el sistema                                                                                                                                                                                                                                                     |
| Postcondiciones           | Información de artículos mostrada al empleado                                                                                                                                                                                                                                                      |
| Escenario Principal       | 1. El empleado selecciona la opción "Ver artículos"<br>2. El sistema muestra interfaz de búsqueda<br>3. El empleado puede buscar por nombre, categoría o código<br> 4. El sistema muestra lista de artículos que tienen coincidencias. <br>5. El empleado puede ver detalles de cada artículo |
| Escenario Alternativo  1   | No hay artículos coincidentes:<br> 1. Sistema muestra mensaje "No se encontraron artículos"<br> 2. Permite modificar criterios de búsqueda                                                                                                                                                              |
| Escenario Alternativo  2   | Error en la carga de artículos<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                           |
| Requerimientos Especiales | - Mostrar disponibilidad en tiempo real<br>- Indicar ubicación del artículo si aplica                                                                                                                                                                                                              |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                |

### Consultar artículos:


| Campo                     | Descripción                                                                                                                                                                                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-016                                                                                                                                                                                                                                                                         |
| Módulo                   | Gestión de Inventario                                                                                                                                                                                                                                                         |
| Actor Principal           | Empleado                                                                                                                                                                                                                                                                       |
| Precondiciones            | El empleado debe estar autenticado<br>Deben existir artículos en el sistema                                                                                                                                                                                                   |
| Postcondiciones           | Detalles del artículo mostrados                                                                                                                                                                                                                                               |
| Escenario Principal       | 1. El empleado selecciona la opción "Consultar artículos"<br> 2. El empleado ingresa código o nombre del artículo <br>3. El sistema busca el artículo<br>4. El sistema muestra descripción, precio y stock disponible<br>5. El empleado puede ver información detallada |
| Escenario Alternativo 1    | Artículo no encontrado:<br> 1. Sistema notifica que el artículo no tiene existencia.<br> 2. Permite nueva búsqueda                                                                                                                                                                |
| Escenario Alternativo 2    | Alternativo 2	Error en la búsqueda<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                                |
| Requerimientos Especiales | Acceso a información de precios<br> Mostrar alternativas.                                                                                                                                                                                                                     |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                          |

### Generar factura:


| Campo                     | Descripción                                                                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-017                                                                                                                                                                                                                                                                                                 |
| Módulo                   | Facturación                                                                                                                                                                                                                                                                                           |
| Actor Principal           | Empleado                                                                                                                                                                                                                                                                                               |
| Precondiciones            | El empleado debe estar autenticado<br> Debe existir una venta en proceso                                                                                                                                                                                                                               |
| Postcondiciones           | Factura generada y almacenada<br> Inventario actualizado                                                                                                                                                                                                                                               |
| Escenario Principal       | 1. El empleado selecciona la opción "Generar factura"<br> 2. El sistema solicita datos del cliente<br>3. El empleado ingresa productos y cantidades<br>4. El sistema calcula totales<br>5. El empleado confirma la venta<br>6. El sistema genera factura en PDF<br>7. El sistema actualiza inventario |
| Escenario Alternativo 1    | Stock insuficiente:<br> 1. Sistema notifica falta de stock<br> 2. Permite ajustar cantidad                                                                                                                                                     |
| Escenario Alternativo 2    | Error en cálculos:<br> 1. Sistema permite corrección                                                                                                                                                           |
| Escenario Alternativo 3    | Fallo en la generación de PDF<br> 1. Sistema notifica error en la creación del PDF<br>                                                                                                                     |
| Requerimientos Especiales | Generar ID único de factura<br> Incluir todos los datos requeridos legalmente                                                                                                                                                                                                                         |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                                  |

### Ver facturas:


| Campo                     | Descripción                                                                                                                                                                                                                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-018                                                                                                                                                                                                                                                 |
| Módulo                   | Facturación                                                                                                                                                                                                                                           |
| Actor Principal           | Empleado                                                                                                                                                                                                                                               |
| Precondiciones            | El empleado debe estar autenticado<br>Deben existir facturas emitidas                                                                                                                                                                                  |
| Postcondiciones           | Facturas mostradas según criterios                                                                                                                                                                                                                    |
| Escenario Principal       | 1. El empleado selecciona la opción "Ver facturas"<br>2. El sistema muestra opciones de filtrado<br>3. El empleado puede filtrar por fecha o cliente<br>4. El sistema muestra facturas coincidentes<br>5. El empleado puede ver detalles o reimprimir |
| Escenario Alternativo 1    | 4a. No hay facturas:<br>1.  Sistema muestra que "No hay facturas" <br> 2. Permite modificar filtros                                                                                                                                                         |
| Escenario Alternativo 2    | Error en la carga de facturas<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                            |
| Requerimientos Especiales | Permitir reimpresión de facturas<br>  Muestra cada factura con su estado                                                                                                                                                                              |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                  |

### Realizar compra:


| Campo                     | Descripción                                                                                                                                                                                                                                         |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-019                                                                                                                                                                                                                                               |
| Módulo                   | Ventas                                                                                                                                                                                                                                               |
| Actor Principal           | Empleado                                                                                                                                                                                                                                             |
| Precondiciones            | El empleado debe estar autenticado<br> Debe haber productos disponibles o stock disponible                                                                                                                                                           |
| Postcondiciones           | Venta registrada<br> Inventario actualizado<br> Factura generada                                                                                                                                                                                     |
| Escenario Principal       | 1. El empleado inicia nueva venta<br>2. El sistema muestra interfaz de venta<br>3. El empleado agrega productos<br>4. El sistema calcula total<br>5. El empleado registra pago en efectivo<br>6. El sistema procesa la venta<br>7. Se genera factura |
| Escenario Alternativo 1    | Producto no encontrado:<br> 1. Sistema permite búsqueda alternativa                                                                                                                              |
| Escenario Alternativo 2    |  Error en monto:<br>1. Sistema permite corrección                                                                                                                                |
| Escenario Alternativo 3    |  Fallo en el procesamiento de la venta<br> 1. Sistema notifica error técnico<br>                                                                                                        |
| Requerimientos Especiales | Validar stock en tiempo real, consultas.<br> Calcular cambio automáticamente                                                                                                                                                                        |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                |

### Buscar libros:


| Campo                     | Descripción                                                                                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-020                                                                                                                                                                                                                                                     |
| Módulo                   | Gestión de Libros                                                                                                                                                                                                                                         |
| Actor Principal           | Empleado                                                                                                                                                                                                                                                   |
| Precondiciones            | El empleado debe estar autenticado                                                                                                                                                                                                                         |
| Postcondiciones           | Resultados de búsqueda mostrados                                                                                                                                                                                                                          |
| Escenario Principal       | 1. El empleado selecciona la opción "Buscar libros"<br> 2. El sistema muestra opciones de búsqueda <br>3. El empleado ingresa criterios (título, autor, género)<br>4. El sistema muestra resultados<br>5. El empleado puede ver detalles de cada libro |
| Escenario Alternativo 1    | No hay coincidencias:<br> 1. Sistema sugiere búsqueda alternativa<br>  2. Permite modificar criterios                                                                                                                                                           |
| Escenario Alternativo 2   |Error en la búsqueda<br> 1. Sistema muestra mensaje de error técnico<br>                                          |
| Requerimientos Especiales | Búsqueda basada en varios criterios<br> Mostrar disponibilidad                                                                                                                                                                                            |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                      |

## Usuario

### Ver libros disponibles:


| Campo                     | Descripción                                                                                                                                                                                                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-021                                                                                                                                                                                                                                                                                           |
| Módulo                   | Catálogo de Libros                                                                                                                                                                                                                                                                              |
| Actor Principal           | Usuario                                                                                                                                                                                                                                                                                          |
| Precondiciones            | No requiere autenticación                                                                                                                                                                                                                                                                       |
| Postcondiciones           | Catálogo de libros mostrado al usuario                                                                                                                                                                                                                                                          |
| Escenario Principal       | 1. El usuario accede al catálogo de libros<br>2. El sistema muestra interfaz de navegación<br>3. El usuario puede explorar libros por categorías<br>4. El sistema muestra información básica (título, autor, precio, descripción)<br>5. El usuario puede ver detalles sin iniciar sesión |
| Escenario Alternativo  1   | No hay libros disponibles:<br> 1. Sistema muestra mensaje que  "No hay disponibles libros"<br>- 2. Sugiere otras categorías                                                                                                                                                                           |
| Escenario Alternativo  2   | Error en la carga del catálogo<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                                                    |
| Requerimientos Especiales | Interfaz sencilla de entender<br>  Carga rápida de imágenes<br>- Previsualización de libros                                                                                                                                                                                                   |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                                                                            |

### Registrarse:


| Campo                     | Descripción                                                                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-022                                                                                                                                                                                                                                         |
| Módulo                   | Gestión de Usuarios                                                                                                                                                                                                                           |
| Actor Principal           | Usuario                                                                                                                                                                                                                                        |
| Precondiciones            | Usuario no registrado en el sistema                                                                                                                                                                                                            |
| Postcondiciones           | Cuenta de usuario creada<br> Correo de confirmación enviado                                                                                                                                                                                   |
| Escenario Principal       | 1. Usuario selecciona  la opción "Registrarse"<br>2. Formulario de registro<br>3. Usuario ingresa datos (correo, contraseña, nombre, edad)<br>4. Validación de datos<br>5. Creación de cuenta<br>6. Sistema envía correo de confirmación |
| Escenario Alternativo 1    | Correo ya registrado:<br> 1.  Sistema notifica duplicidad<br> 2. Permite recuperar contraseña                                                                                   |
| Escenario Alternativo 2    |  Datos inválidos: <br> 1. Sistema señala campos incorrectos                                                                                          |
| Escenario Alternativo 3    |  Error en el envío del correo<br> 1. Sistema notifica fallo en el envío del correo de confirmación<br>                                           |
| Requerimientos Especiales | Encriptación de contraseña<br> Validación de correo electrónico<br> Verificación de edad                                                                                                                                                  |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                                          |

### Inicio de sesión:


| Campo                     | Descripción                                                                                                                                                                                   |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-023                                                                                                                                                                                         |
| Módulo                   | Autenticación                                                                                                                                                                                 |
| Actor Principal           | Usuario                                                                                                                                                                                        |
| Precondiciones            | Usuario registrado y verificado                                                                                                                                                                |
| Postcondiciones           | Usuario autenticado en el sistema                                                                                                                                                              |
| Escenario Principal       | 1. Usuario selecciona la opción "Iniciar Sesión"<br>2. Ingreso Formulario de login<br>3. Usuario ingresa correo y contraseña<br>4. Validación de credenciales<br>5. Sistema permite acceso |
| Escenario Alternativo 1    | Credenciales incorrectas:<br> 1. Sistema muestra error<br>  2. Permite reintento                                                        |
| Escenario Alternativo 2    | Cuenta no verificada:<br> 1. Sistema solicita verificación                                                        |
| Escenario Alternativo 3    | Error en la autenticación<br> 1. Sistema muestra mensaje de error técnico con problemas en la base de datos<br>                                 |
| Requerimientos Especiales | "Recordar contraseña" opción<br> Bloqueo tras intentos fallidos                                                                                                                              |
| Sistema                   | Librería Don Héctor                                                                                                                                                                          |

### Calificar y comentar:


| Campo                     | Descripción                                                                                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-024                                                                                                                                                                                 |
| Módulo                   | Valoraciones                                                                                                                                                                           |
| Actor Principal           | Usuario                                                                                                                                                                                |
| Precondiciones            | Usuario autenticado<br> Debe haber comprado el libro                                                                                                                                   |
| Postcondiciones           | Comentario y calificación registrados                                                                                                                                                 |
| Escenario Principal       | 1. Usuario selecciona "Calificar libro"<br>2. Se muestra formulario <br>3. Usuario ingresa calificación y comentario <br> 4.Validación de entrada<br>5. Sistema registra valoración <br> 6. El usuario puede modificar o eliminar su comentario |
| Escenario Alternativo 1    | Contenido inapropiado:<br> 1. Sistema rechaza comentario (lo ideal)<br> 2. Solicita modificación                                                                                            |
| Escenario Alternativo 2   | Error en el registro de la valoración<br> 1. Sistema notifica error técnico<br>                                                                       |
| Requerimientos Especiales | Moderación de comentarios                                                                                                                                                             |
| Sistema                   | Librería Don Héctor                                                                                                                                                                  |

### Buscar libros:


| Campo                     | Descripción                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-025                                                                                                                                                                                                                   |
| Módulo                   | Búsqueda                                                                                                                                                                                                                |
| Actor Principal           | Usuario                                                                                                                                                                                                                  |
| Precondiciones            | No requiere autenticación                                                                                                                                                                                               |
| Postcondiciones           | Resultados de búsqueda mostrados                                                                                                                                                                                        |
| Escenario Principal       | 1. Usuario accede a búsqueda<br>2. Sistema muestra filtros disponibles<br>3. Usuario ingresa criterios de filtros (título, autor, género, precio)<br>4. Se muestran resultados<br>5. Usuario puede ordenar resultados |
| Escenario Alternativo 1    | Sin resultados:<br> 1. Sistema sugiere términos similares<br> 2. Muestra recomendaciones                                                                                                                                      |
| Escenario Alternativo 2    | Error en la búsqueda<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                                     |
| Requerimientos Especiales | Filtros combinados                                                                                                                                                                                                       |
| Sistema                   | Librería Don Héctor                                                                                                                                                                                                    |

### Agregar al carrito:


| Campo                     | Descripción                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID Caso de Uso            | CU-026                                                                                                                                                                                |
| Módulo                   | Carrito de Compras                                                                                                                                                                    |
| Actor Principal           | Usuario                                                                                                                                                                               |
| Precondiciones            | Usuario autenticado<br>- Libro disponible                                                                                                                                             |
| Postcondiciones           | Libro agregado al carrito                                                                                                                                                             |
| Escenario Principal       | 1. Usuario selecciona la opción "Agregar al carrito"<br>2. Sistema verifica disponibilidad<br>3. Sistema agrega libro al carrito<br>4. Actualiza total<br>5. S muestra confirmación |
| Escenario Alternativo 1    | Libro no disponible:<br> 1. Sistema notifica indisponibilidad<br> 2. Ofrece alternativas                                                                                                    |
| Escenario Alternativo 2    | Error en la actualización del carrito<br> 1. Sistema notifica error técnico<br> 2. Permite al usuario reintentar la operación                                                                                 |
| Requerimientos Especiales | Persistencia del carrito<br> Actualización en tiempo real                                                                                                                            |
| Sistema                   | Librería Don Héctor                                                                                                                                                                 |

### Ver más votados:


| Campo                     | Descripción                                                                                                                                                                                                             |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ID Caso de Uso            | CU-027                                                                                                                                                                                                                   |
| Módulo                   | Recomendaciones                                                                                                                                                                                                          |
| Actor Principal           | Usuario                                                                                                                                                                                                                  |
| Precondiciones            | No requiere autenticación                                                                                                                                                                                               |
| Postcondiciones           | Lista de libros más votados mostrada                                                                                                                                                                                    |
| Escenario Principal       | 1. Usuario selecciona "Más votados"<br>2. Sistema calcula populares <br>3. Sistema muestra libros ordenados por calificación<br>4. Usuario puede filtrar por categoría<br>5. Usuario puede ver detalles de cada libro |
| Escenario Alternativo  1   | No hay valoraciones:<br> 1. Sistema muestra libros destacados<br> 2. Sugiere nuevos lanzamientos                                                                                                                               |
| Escenario Alternativo  2   | Error en la carga de libros<br> 1. Sistema muestra mensaje de error técnico<br>                                                                                                       |
| Requerimientos Especiales | Mostrar promedio de calificaciones                                                                                                                                                                                       |
| Sistema                   | Librería Don Héctor         |


# Arquitectura Cliente-Servidor

La rquitectura Cliente-Servidor es un modelo fundamental en el diseño de software que divide un sistema en dos roles principales:

- **Cliente**: Solicita servicios o recursos (interfaz de usuario).
- **Servidor**: Proporciona servicios o recursos (procesamiento y almacenamiento).

## Razon de uso:

- Centralización y consistencia de datos Todos los datos se almacenan en el servidor, lo que evita redundancias y garantiza coherencia.
- Simplifica actualizaciones (solo se modifica el servidor).
- Escalabilidad horizontal del servidor puede replicarse o distribuirse para manejar más solicitudes.
- Seguridad centralizada ya que el servidor actúa como guardián único
- Independencia tecnológica cliente y servidor pueden usar tecnologías distintas React (frontend) se comunica con un servidor en Flask Python (backend) y una base de datos en Mysql.
- Flexibilidad para elegir herramientas adecuadas a cada capa.
- Permite evolucionar cliente y servidor por separado.
- Equipos pueden trabajar en paralelo (frontend vs backend).
- Actualizaciones en el cliente no afectan al servidor, y viceversa.
- El servidor maneja tareas intensivas (procesamiento, almacenamiento), mientras el cliente se enfoca en la experiencia de usuario.

## Matriz de Trazabilidad

### a. Stakeholders vs Requerimientos

| ID RF   | Requerimiento                                    | Gerente | Supervisor | Empleado | Usuario |
|---------|--------------------------------------------------|---------|-----------|----------|---------|
| RF01.1  | Registro de usuarios                            | x       | x         | x        | x       |
| RF01.2  | Verificación de cuenta por correo               | x       | x         | x        | x       |
| RF01.3  | Inicio de sesión según rol                      | x       | x         | x        | x       |
| RF01.4  | Almacenamiento seguro de contraseñas            | x       | x         | x        | x       |
| RF02.1  | Registro de supervisores                        | x       |           |          |         |
| RF02.2  | Registro de empleados                           |         | x         |          |         |
| RF02.3  | Eliminación de supervisores y empleados        | x       | x         |          |         |
| RF02.4  | Modificación de información de supervisores y empleados |        | x         | x         |         |
| RF02.5  | Envío de credenciales automáticas              |        | x         | x         |         |
| RF03.1  | Registro de productos                          |         | x         |          |         |
| RF03.2  | Actualización de productos                     |         | x         | x        |         |
| RF03.3  | Baja de productos del inventario               |         | x         |         |         |
| RF03.4  | Consulta de productos                          |         | x         | x        |         |
| RF04.1  | Registro de libros digitales                   |         | x         |          |         |
| RF04.2  | Visualización del catálogo sin autenticación   |         |           |          | x       |
| RF04.3  | Búsqueda con filtros                           |         |           | x        | x       |
| RF04.4  | Creación y gestión de listas de deseos         |         |           |          | x       |
| RF05.1  | Registro de ventas                             |         |           | x        |         |
| RF05.2  | Compra de libros digitales                     |         |           |          | x       |
| RF05.3  | Métodos de pago                                |         |           | x        | x       |
| RF05.4  | Generación de facturas en PDF                  | x       | x         | x        |         |
| RF05.5  | Historial de facturas con filtros              | x       | x         | x        |         |
| RF06.1  | Reportes de ventas                             | x       |           |          |         |
| RF06.2  | Reportes de ganancias                          | x       |           |          |         |
| RF07.1  | Registro de calificaciones y comentarios       |         |           |          | x       |
| RF07.2  | Modificación y eliminación de comentarios      |         |           |          | x       |
| RF07.3  | Supervisión y gestión de valoraciones         |         | x         |          |         |


### b. Stakeholders vrs CDU

| ID CDU  | Nombre del Caso de Uso              | Gerente | Supervisor | Empleado | Usuario |
|---------|-------------------------------------|---------|-----------|----------|---------|
| CU-001  | Agregar Supervisor                 | x       |           |          |         |
| CU-002  | Ver Reportes                       | x       |           |          |         |
| CU-003  | Eliminar Supervisor                | x       |           |          |         |
| CU-004  | Modificar Supervisor               | x       |           |          |         |
| CU-005  | Ver Facturas                       | x       |           |          |         |
| CU-006  | Ver Ganancias                      | x       |           |          |         |
| CU-007  | Agregar Producto                   |         | x         |          |         |
| CU-008  | Agregar Empleado                   |         | x         |          |         |
| CU-009  | Eliminar Empleado                  |         | x         |          |         |
| CU-010  | Modificar Empleado                 |         | x         |          |         |
| CU-011  | Ver Productos                      |         | x         |          |         |
| CU-012  | Ver Opiniones y Comentarios        |         | x         |          |         |
| CU-013  | Agregar Libros                     |         | x         |          |         |
| CU-014  | Ver Factura                        |         | x         |          |         |
| CU-015  | Ver Artículos                      |         |           | x        |         |
| CU-016  | Consultar Artículos                |         |           | x        |         |
| CU-017  | Generar Factura                    |         |           | x        |         |
| CU-018  | Ver Facturas                       |         |           | x        |         |
| CU-019  | Realizar Compra                    |         |           | x        |         |
| CU-020  | Buscar Libros                      |         |           | x        |         |
| CU-021  | Ver Libros Disponibles             |         |           |          | x       |
| CU-022  | Registrarse                        |         |           |          | x       |
| CU-023  | Inicio de Sesión                   |         |           |          | x       |
| CU-024  | Calificar y Comentar               |         |           |          | x       |
| CU-025  | Buscar Libros                      |         |           |          | x       |
| CU-026  | Agregar al Carrito                 |         |           |          | x       |
| CU-027  | Ver Más Votados                    |         |           |          | x       |


### C. Requerimientos vs CDU

| ID RF   | Requerimiento                               | CDU Relacionados                          |
|---------|--------------------------------------------|-------------------------------------------|
| RF01    | Gestión de Credenciales                   | CU-022, CU-023                           |
| RF01.1  | Registro de usuarios                      | CU-022                                   |
| RF01.2  | Verificación de cuenta por correo        | CU-022                                   |
| RF01.3  | Inicio de sesión según rol               | CU-023                                   |
| RF01.4  | Almacenamiento seguro de contraseñas     | CU-022, CU-023                           |
| RF02    | Gestión de Supervisores y Empleados      | CU-001, CU-003, CU-004, CU-008, CU-009, CU-010 |
| RF02.1  | Registro de supervisores                 | CU-001                                   |
| RF02.2  | Registro de empleados                    | CU-008                                   |
| RF02.3  | Eliminación de supervisores y empleados  | CU-003, CU-009                           |
| RF02.4  | Modificación de información de supervisores y empleados | CU-004, CU-010  |
| RF02.5  | Envío de credenciales automáticas        | CU-001, CU-008                           |
| RF03    | Gestión de Productos Físicos             | CU-007, CU-011                           |
| RF03.1  | Registro de productos                    | CU-007                                   |
| RF03.2  | Actualización de productos               | CU-007                                   |
| RF03.3  | Baja de productos del inventario         | CU-007                                   |
| RF03.4  | Consulta de productos                    | CU-011                                   |
| RF04    | Gestión de Libros Digitales              | CU-013, CU-020, CU-021, CU-025           |
| RF04.1  | Registro de libros digitales             | CU-013                                   |
| RF04.2  | Visualización del catálogo sin autenticación | CU-021                            |
| RF04.3  | Búsqueda con filtros                     | CU-020, CU-025                           |
| RF04.4  | Creación y gestión de listas de deseos   | CU-027                                   |
| RF05    | Gestión de Ventas                        | CU-017, CU-018, CU-019                   |
| RF05.1  | Registro de ventas                       | CU-019                                   |
| RF05.2  | Compra de libros digitales               | CU-019                                   |
| RF05.3  | Métodos de pago                          | CU-019                                   |
| RF05.4  | Generación de facturas en PDF            | CU-017, CU-018                           |
| RF05.5  | Historial de facturas con filtros        | CU-005, CU-014, CU-018                   |
| RF06    | Reportes Gerenciales                     | CU-002, CU-006                           |
| RF06.1  | Reportes de ventas                       | CU-002                                   |
| RF06.2  | Reportes de ganancias                    | CU-006                                   |
| RF07    | Gestión de Feedback                      | CU-012                           |
| RF07.1  | Registro de calificaciones y comentarios | CU-024                                   |
| RF07.2  | Modificación y eliminación de comentarios | CU-024                                  |
| RF07.3  | Supervisión y gestión de valoraciones    | CU-012                                   |

# Diagrama de bloques

Diagrama de bloques sobre la arquitectura implementada (Cliente-servidor)
![DiagramaBloque](imagen/DiagramaBloque.png)

## Diagrama Entidad-Relación

![Diagrama Entidad-Relacion](DataBase/Librerira-ER.png)

# Diagrama de Despliegue

### Diagrama de despliegue sobre la arquitectura implementada (Cliente-servidor)
![DiagramaDespliegue](imagen/DiagramaDespliegue.png)



## Diagramas de Prototipos

### Login

![1740322907095](imagen/1740322907095.png)

![1740323065709](imagen/1740323065709.png)

### Home

![1740322923614](imagen/1740322923614.png)

![1740323044292](imagen/1740323044292.png)

![1740323080879](imagen/1740323080879.png)

### Funcionalidades

![1740322932879](imagen/1740322932879.png)

![1740354144210](imagen/1740354144210.png)

![1740354438218](imagen/1740354438218.png)

![1740354566994](imagen/1740354566994.png)

![1740322944040](imagen/1740322944040.png)

![1740322956472](imagen/1740322956472.png)

![1740322982284](imagen/1740322982284.png)

![1740323012891](imagen/1740323012891.png)

![1740354712410](imagen/1740354712410.png)

![1740354873355](imagen/1740354873355.png)

![1740354970337](imagen/1740354970337.png)

![1740355399933](imagen/1740355399933.png)

![1740355454546](imagen/1740355454546.png)

![1740355591727](imagen/1740355591727.png)

### Tablero Jira

![Tablero](imagen/TableroKanban.png)

### Tablero Backlog

![Backlog](imagen/Backlog.png)

