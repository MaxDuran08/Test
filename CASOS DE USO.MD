# Gerente 


### Agregar Supervisor:
| ID Caso de Uso | CU 001 |
|---------------|--------|
| Módulo | Gestión de Supervisores|
| Actor Principal |Gerente|
| Precondiciones | El gerente debe estar autenticado en el sistema <br> Validar que el  supervisor a agregar no debe existir en el sistema   |
| Postcondiciones | Nuevo supervisor registrado en el sistema<br>Credenciales enviadas por correo al supervisor.
| Escenario Principal |1. El gerente selecciona la opción "Agregar Supervisor" <br> 2. El sistema muestra el formulario de registro <br> 3. El gerente ingresa los datos requeridos (nombre, correo, teléfono, fecha ingreso)<br>4. El sistema valida los datos ingresados<br>5. Se crea la cuenta del supervisor en el sistema <br>6. El sistema envía correo con credenciales|
| Escenario Alternativo |Datos incorrectos o invalidos <br> Sistema muestra mensaje de error <br> Correo ya existente <br> Sistema notifica que el correo ya está registrado|
| Requerimientos Especiales | Se debe encriptar las credenciales<br> El correo debe enviarse de forma automática |
| Sistema | Librería Don Héctor |

### Ver Reportes:
| ID Caso de Uso | CU 002 |
|---------------|--------|
| Módulo | Reportes |
| Actor Principal |Gerente|
| Precondiciones | Gerente debe estar autenticado en el sistema<br> Deben de existir datos registrados de ventas  |
| Postcondiciones | Reporte Generado con exito y mostrado al gerente |
| Escenario Principal |1. El gerente selecciona la opcion "Ver Reportes "<br> 2. El sistema muestra opciones de reportes<br> 3. El gerente selecciona el tipo de reporte<br> 4. El gerente configura filtros <br> 5. El sistema genera y muestra el reporte gráfico |
| Escenario Alternativo | No hay datos para el período seleccionado respecto  fechas <br> Se muestra mensaje indicando que no hay datos o registros <br> Permite seleccionar otro período |
| Requerimientos Especiales |  Los reportes incluyen gráficos<br> Permite exportar en diferentes formatos |
| Sistema | Librería Don Héctor |


### Eliminar supervisor

| ID Caso de Uso | CU 003 |
|---------------|--------|
| Módulo |Gestión de Supervisores |
| Actor Principal |Gerente|
| Precondiciones | Es necesario que el gerente esté autenticado en el sistema<br>  El supervisor a eliminar debe existir en el sistema se debe validar    |
| Postcondiciones | Supervisor eliminado del sistema<br> Registro actualizado de la auditoría |
| Escenario Principal |1. El gerente selecciona la opcion "Eliminar Supervisor" <br> 2. El sistema muestra lista de supervisores activos o disponibles <br>3. El gerente selecciona el supervisor a eliminar<br> 4. El gerente ingresa razón de desvinculación <br> 5. El sistema solicita confirmación para eliminar <br>6. El gerente confirma la eliminación <br> 7. El sistema registra la baja y actualiza el registro de auditoría|
| Escenario Alternativo |Datos inválidos o erroneos <br> Sistema muestra mensaje de error<br> Retorna al paso 5<br> Correo ya existente <br>  Sistema notifica que el correo está en uso|
| Requerimientos Especiales |Registrar historial de cambios<br>  Validar formato de datos |
| Sistema | Librería Don Héctor |


### Modificar Supervisor:

| ID Caso de Uso | CU 004 |
|---------------|--------|
| Módulo |Gestión de Supervisores |
| Actor Principal |Gerente|
| Precondiciones | El gerente debe estar autenticado en el sistema<br> El supervisor a modificar debe existir en el sistema  |
| Postcondiciones |El gerente debe estar autenticado en el sistema<br> El supervisor a modificar debe existir en el sistema |
| Escenario Principal |1. El gerente selecciona la opcion "Modificar Supervisor"<br> 2. El sistema enlista a los supervisores  <br> 3. El gerente selecciona el supervisor a modificar <br> 4. El sistema muestra formulario con datos actuales <br> 5. El gerente modifica la información del supervisor <br>6. El sistema valida los cambios <br>7. El sistema actualiza la información |
| Escenario Alternativo |Datos inválidos o erroneos. <br> Sistema muestra mensaje de error<b> Correo existente  <br> Sistema notifica que el correo está en uso|
| Requerimientos Especiales | Registrar historial de cambios<br> Validar formato de datos |
| Sistema |Librería Don Héctor|

### Ver Facturas:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-005 |
| Módulo | Gestión de Facturas |
| Actor Principal | Gerente,supervisor |
| Precondiciones | El gerente debe estar autenticado en el sistema <br> Deben existir registros de facturas en el sistema |
| Postcondiciones |Facturas mostradas según criterios de búsqueda |
| Escenario Principal | 1. El gerente selecciona la opcion "Ver Facturas" <br> 2. El sistema muestra interfaz de búsqueda <br> 3. El gerente aplica filtros (fecha, empleado, cliente )<br> 4. El sistema muestra facturas que tienen coincidencia <br> 5. El gerente puede seleccionar una factura para ver detalles |
| Escenario Alternativo | No hay facturas con coincidencia. <br> Sistema muestra mensaje "No se encontraron resultados" <br> Modificación de filtros de busqueda|
| Requerimientos Especiales | Exportar facturas en formato PDF <br> Facilitar la identificación de diversos criterios de hayazgo |
| Sistema | Librería Don Héctor |

### Ver Ganancias:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-006 |
| Módulo | Reportes Financieros |
| Actor Principal | Gerente |
| Precondiciones | El gerente debe estar autenticado en el sistema<br> Deben existir registros de costos y ventas |
| Postcondiciones | Reporte de ganancias generado y mostrado |
| Escenario Principal | 1. El gerente selecciona la opción "Ver Ganancias" <br> 2. El sistema muestra opciones de períodos <br> 3. El gerente selecciona período de análisis <br> 4. Se muestran:  Margen de ganancia por producto <br>  Comparación de períodos<br> Ganancias por categoría<br>5. El gerente puede interactuar con el reporte |
| Escenario Alternativo | Período sin datos: <br> Sistema muestra mensaje de "Para el período seleccionado no hay datos" <br> Permite seleccionar otro período |
| Requerimientos Especiales | Mostrar gráficos interactivos<br>  Permitir exportar reportes <br> Cálculos precisos de márgenes |
| Sistema | Librería Don Héctor |


# SUPERVISOR

### Agregar Producto 

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-007|
| Módulo | Gestión de Inventario |
| Actor Principal | Supervisor |
| Precondiciones | El supervisor debe estar autenticado en el sistema |
| Postcondiciones | Nuevo producto registrado en el inventario<br>  Stock actualizado (inventario) |
| Escenario Principal | 1. El supervisor selecciona la opción "Agregar Producto" <br> 2. El sistema muestra formulario de registro <br> 3. El supervisor ingresa datos del producto (nombre, descripción, código, categoría, precios, cantidad, imagen) <br> 4. El sistema realiza la validación de los datos <br> 5. El sistema registra el nuevo producto |
| Escenario Alternativo | Código de producto ya existente :<br> Sistema notifica duplicidad.<br> Datos incompletos: Sistema señala campos faltantes |
| Requerimientos Especiales | Debe permitir subir imágenes del producto<br> Realiza validación de formato de códigos |
| Sistema | Librería Don Héctor |


## Agregar Empleado

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-008 |
| Módulo | Gestión de Empleados |
| Actor Principal | Supervisor |
| Precondiciones | El supervisor debe estar autenticado en el sistema |
| Postcondiciones | Un nuevo empleado registrado en el sistema <br>  Correo de confirmación enviado al empleado <br> Credenciales generadas |
| Escenario Principal | 1. El supervisor selecciona la opción "Agregar Empleado" <br> 2. El sistema muestra formulario de registro <br> 3. El supervisor ingresa datos (nombre, apellido, CUI, teléfono, correo, edad, género, fecha contratación, fotografía) <br> 4. El sistema valida los datos <br> 5. El sistema crea la cuenta <br> 6. El sistema envía correo con credenciales |
| Escenario Alternativo | CUI duplicado: <br>Sistema notifica que el empleado ya existe con ese registro. <br>  Correo inválido: Sistema solicita verificar el correo<br>|
| Requerimientos Especiales | Validación formato de CUI<br>  Almacenar fotografía del empleado<br>  Generar contraseña segura |
| Sistema | Librería Don Héctor |


###  Eliminar Empleado

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-009 |
| Módulo | Gestión de Empleados |
| Actor Principal | Supervisor |
| Precondiciones | El supervisor debe estar autenticado<br>  El empleado a eliminar debe existir en el sistema |
| Postcondiciones |  Empleado dado de baja <br> Registro histórico actualizado |
| Escenario Principal | 1. El supervisor selecciona la opción "Eliminar Empleado" <br>2 . El sistema muestra lista de empleados activos<br>3. El supervisor selecciona empleado<br>4. El supervisor ingresa causa de baja<br>5. El sistema solicita confirmación<br>6. El supervisor confirma<br>7. El sistema registra la baja y guarda el historial |
| Escenario Alternativo | Empleado con ventas pendientes:<br>Sistema muestra advertencia<br>  Permite cerrar ventas antes de eliminar |
| Requerimientos Especiales | Mantiene el registro de desempeño <br> Guardar causa de baja |
| Sistema | Librería Don Héctor |


### Modificar Empleado

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-010 |
| Módulo | Gestión de Empleados |
| Actor Principal | Supervisor |
| Precondiciones |  El supervisor debe estar autenticado <br> Validación, El empleado debe existir en el sistema |
| Postcondiciones |Información del empleado actualizada |
| Escenario Principal | 1. El supervisor selecciona "Modificar Empleado" <br>2. El sistema muestra lista de empleados<br>3. El supervisor selecciona empleado<br>4. El sistema muestra formulario con datos actuales<br>5. El supervisor modifica información necesaria<br>6. El sistema valida cambios<br>7. El sistema actualiza información |
| Escenario Alternativo | Teléfono inválido: <br> Sistema muestra error<br> Correo duplicado o repetido: Sistema notifica que esta repetido o duplicado.|
| Requerimientos Especiales | Validación formato de datos<br> Registrar historial de cambios |
| Sistema | Librería Don Héctor |


###  Ver productos

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-011|
| Módulo | Gestión de Inventario |
| Actor Principal | Supervisor |
| Precondiciones | El supervisor debe estar autenticado |
| Postcondiciones | Información de productos mostrada |
| Escenario Principal | 1. El supervisor selecciona la opción "Ver Productos"<br>2. El sistema muestra interfaz de búsqueda<br>3. El supervisor puede aplicar filtros<br>4. El sistema muestra lista de productos<br>5. El supervisor puede ver detalles de cada producto |
| Escenario Alternativo | No hay productos :<br> Sistema muestra mensaje "No hay productos"<br> Ofrece opción de agregar productos |
| Requerimientos Especiales | Mostrar estado del inventario o stock <br>- Alertas de stock bajo |
| Sistema | Librería Don Héctor |


### Ver opiniones y comentarios

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-012 |
| Módulo | Gestión de Feedback |
| Actor Principal | Supervisor |
| Precondiciones | El supervisor debe estar autenticado<br> Deben existir comentarios en el sistema |
| Postcondiciones |  Comentarios mostrados, opiniones mostrados|
| Escenario Principal | 1. El supervisor selecciona la opción "Ver opiniones y comentarios"<br>2. El sistema muestra interfaz de búsqueda<br>3. El supervisor puede filtrar por libro<br>4. El sistema muestra comentarios con calificaciones<br>5. El supervisor puede ver detalles de cada opinión |
| Escenario Alternativo | No hay comentarios:<br> Sistema muestra "No hay comentarios"<br> Permite buscar otro libro |
| Requerimientos Especiales | Mostrar promedio de calificaciones<br>Ordenar por fecha/calificación |
| Sistema | Librería Don Héctor |


###  Agregar Libros

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-013 |
| Módulo | Gestión de Catálogo |
| Actor Principal | Supervisor |
| Precondiciones |  El supervisor debe estar autenticado |
| Postcondiciones |  Nuevo libro agregado al catálogo |
| Escenario Principal | 1. El supervisor selecciona la opción "Agregar Libro"<br>2. El sistema muestra formulario<br>3. El supervisor ingresa datos (título, autor, fecha, descripción, género, stock, precio)<br>4. El sistema valida datos<br>5. El sistema registra el libro |
| Escenario Alternativo | Libro duplicado:<br> Sistema notifica duplicidad<br> Permite actualizar existente<br> Datos incompletos:<br> Sistema señala campos faltantes |
| Requerimientos Especiales | Validar ISBN si aplica<br> Distinguir entre libros físicos o digitales |
| Sistema | Librería Don Héctor |


# Empleado 

### Ver artículos:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-014 |
| Módulo | Gestión de Inventario |
| Actor Principal | Empleado |
| Precondiciones | El empleado debe estar autenticado en el sistema |
| Postcondiciones | Información de artículos mostrada al empleado |
| Escenario Principal | 1. El empleado selecciona la opción "Ver artículos" <br>2. El sistema muestra interfaz de búsqueda<br>3. El empleado puede buscar por nombre, categoría o código<br> 4. El sistema muestra lista de artículos que tienen coincidencias. <br>5. El empleado puede ver detalles de cada artículo |
| Escenario Alternativo | No hay artículos coincidentes: <br> Sistema muestra mensaje "No se encontraron artículos"<br> Permite modificar criterios de búsqueda |
| Requerimientos Especiales | - Mostrar disponibilidad en tiempo real<br>- Indicar ubicación del artículo si aplica |
| Sistema | Librería Don Héctor |

### Consultar artículos:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-015 |
| Módulo | Gestión de Inventario |
| Actor Principal | Empleado |
| Precondiciones | El empleado debe estar autenticado <br>Deben existir artículos en el sistema |
| Postcondiciones | Detalles del artículo mostrados |
| Escenario Principal | 1. El empleado selecciona la opción "Consultar artículos" <br> 2. El empleado ingresa código o nombre del artículo <br>3. El sistema busca el artículo<br>4. El sistema muestra descripción, precio y stock disponible<br>5. El empleado puede ver información detallada |
| Escenario Alternativo |Artículo no encontrado:<br> Sistema notifica que el artículo no tiene existencia.<br> Permite nueva búsqueda |
| Requerimientos Especiales | Acceso a información de precios <br> Mostrar alternativas. |
| Sistema | Librería Don Héctor |

### Generar factura:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-016 |
| Módulo | Facturación |
| Actor Principal | Empleado |
| Precondiciones | El empleado debe estar autenticado<br> Debe existir una venta en proceso |
| Postcondiciones | Factura generada y almacenada <br> Inventario actualizado |
| Escenario Principal | 1. El empleado selecciona la opción "Generar factura" <br> 2. El sistema solicita datos del cliente<br>3. El empleado ingresa productos y cantidades<br>4. El sistema calcula totales<br>5. El empleado confirma la venta<br>6. El sistema genera factura en PDF<br>7. El sistema actualiza inventario |
| Escenario Alternativo |Stock insuficiente:<br> Sistema notifica falta de stock<br> Permite ajustar cantidad<br> Error en cálculos:<br> Sistema permite corrección |
| Requerimientos Especiales | Generar ID único de factura<br> Incluir todos los datos requeridos legalmente |
| Sistema | Librería Don Héctor |

### Ver facturas:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-017 |
| Módulo | Facturación |
| Actor Principal | Empleado |
| Precondiciones | El empleado debe estar autenticado<br>Deben existir facturas emitidas |
| Postcondiciones | Facturas mostradas según criterios |
| Escenario Principal | 1. El empleado selecciona la opción "Ver facturas"<br>2. El sistema muestra opciones de filtrado<br>3. El empleado puede filtrar por fecha o cliente<br>4. El sistema muestra facturas coincidentes<br>5. El empleado puede ver detalles o reimprimir |
| Escenario Alternativo | 4a. No hay facturas:<br>- Sistema muestra que "No hay facturas" <br> Permite modificar filtros |
| Requerimientos Especiales | Permitir reimpresión de facturas<br>  Muestra cada factura con su estado|
| Sistema | Librería Don Héctor |

### Realizar compra:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-018 |
| Módulo | Ventas |
| Actor Principal | Empleado |
| Precondiciones | El empleado debe estar autenticado<br> Debe haber productos disponibles o stock disponible |
| Postcondiciones | Venta registrada<br> Inventario actualizado<br> Factura generada |
| Escenario Principal | 1. El empleado inicia nueva venta<br>2. El sistema muestra interfaz de venta<br>3. El empleado agrega productos<br>4. El sistema calcula total<br>5. El empleado registra pago en efectivo<br>6. El sistema procesa la venta<br>7. Se genera factura |
| Escenario Alternativo | Producto no encontrado: <br> Sistema permite búsqueda alternativa<br>  Error en monto:<br>Sistema permite corrección |
| Requerimientos Especiales | Validar stock en tiempo real, consultas. <br> Calcular cambio automáticamente |
| Sistema | Librería Don Héctor |



### Usuario

### Ver libros disponibles:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-019 |
| Módulo | Catálogo de Libros |
| Actor Principal | Usuario |
| Precondiciones | No requiere autenticación |
| Postcondiciones | Catálogo de libros mostrado al usuario |
| Escenario Principal | 1. El usuario accede al catálogo de libros<br>2. El sistema muestra interfaz de navegación<br>3. El usuario puede explorar libros por categorías<br>4. El sistema muestra información básica (título, autor, precio, descripción)<br>5. El usuario puede ver detalles sin iniciar sesión |
| Escenario Alternativo | No hay libros disponibles:<br> Sistema muestra mensaje que  "No hay disponibles libros"<br>- Sugiere otras categorías |
| Requerimientos Especiales |  Interfaz sencilla de entender <br>  Carga rápida de imágenes<br>- Previsualización de libros |
| Sistema | Librería Don Héctor |

### Registrarse:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-020 |
| Módulo | Gestión de Usuarios |
| Actor Principal | Usuario |
| Precondiciones | Usuario no registrado en el sistema |
| Postcondiciones | Cuenta de usuario creada<br> Correo de confirmación enviado |
| Escenario Principal | 1. Usuario selecciona  la opción "Registrarse"<br>2. Formulario de registro<br>3. Usuario ingresa datos (correo, contraseña, nombre, edad)<br>4. Validación de datos<br>5. Creación de cuenta<br>6. Sistema envía correo de confirmación |
| Escenario Alternativo | Correo ya registrado:<br> Sistema notifica duplicidad<br> Permite recuperar contraseña<br> Datos inválidos: <br> Sistema señala campos incorrectos |
| Requerimientos Especiales | Encriptación de contraseña<br> Validación de correo electrónico<br> Verificación de edad |
| Sistema | Librería Don Héctor |

### Inicio de sesión:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-021 |
| Módulo | Autenticación |
| Actor Principal | Usuario |
| Precondiciones | Usuario registrado y verificado |
| Postcondiciones |Usuario autenticado en el sistema |
| Escenario Principal | 1. Usuario selecciona la opción "Iniciar Sesión"<br>2. Ingreso Formulario de login<br>3. Usuario ingresa correo y contraseña<br>4. Validación de credenciales<br>5. Sistema permite acceso |
| Escenario Alternativo | Credenciales incorrectas:<br> Sistema muestra error<br>  Permite reintento<br> Cuenta no verificada:<br> Sistema solicita verificación |
| Requerimientos Especiales | "Recordar contraseña" opción <br> Bloqueo tras intentos fallidos |
| Sistema | Librería Don Héctor |

### Calificar y comentar:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-022 |
| Módulo | Valoraciones |
| Actor Principal | Usuario |
| Precondiciones | Usuario autenticado<br> Debe haber comprado el libro |
| Postcondiciones | Comentario y calificación registrados |
| Escenario Principal | 1. Usuario selecciona "Calificar libro" <br>2. Se muestra formulario <br>3. Usuario ingresa calificación y comentario <br> 4.Validación de entrada<br>5. Sistema registra valoración |
| Escenario Alternativo |  Contenido inapropiado:<br> Sistema rechaza comentario (lo ideal)<br> Solicita modificación |
| Requerimientos Especiales |  Moderación de comentarios |
| Sistema | Librería Don Héctor |

### Buscar libros:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-023 |
| Módulo | Búsqueda |
| Actor Principal | Usuario,empleado |
| Precondiciones | No requiere autenticación |
| Postcondiciones | Resultados de búsqueda mostrados |
| Escenario Principal | 1. Usuario accede a búsqueda<br>2. Sistema muestra filtros disponibles<br>3. Usuario ingresa criterios de filtros (título, autor, género, precio)<br>4. Se muestran resultados<br>5. Usuario puede ordenar resultados |
| Escenario Alternativo | Sin resultados:<br> Sistema sugiere términos similares<br> Muestra recomendaciones |
| Requerimientos Especiales |  Filtros combinados |
| Sistema | Librería Don Héctor |

### Agregar al carrito:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-024 |
| Módulo | Carrito de Compras |
| Actor Principal | Usuario |
| Precondiciones |  Usuario autenticado<br>- Libro disponible |
| Postcondiciones | Libro agregado al carrito |
| Escenario Principal | 1. Usuario selecciona la opción "Agregar al carrito"<br>2. Sistema verifica disponibilidad<br>3. Sistema agrega libro al carrito<br>4. Actualiza total<br>5. S muestra confirmación |
| Escenario Alternativo |Libro no disponible:<br> Sistema notifica indisponibilidad<br> Ofrece alternativas |
| Requerimientos Especiales | Persistencia del carrito<br> Actualización en tiempo real |
| Sistema | Librería Don Héctor |

### Ver más votados:

| Campo | Descripción |
|-------|-------------|
| ID Caso de Uso | CU-025 |
| Módulo | Recomendaciones |
| Actor Principal | Usuario |
| Precondiciones |  No requiere autenticación |
| Postcondiciones |  Lista de libros más votados mostrada |
| Escenario Principal | 1. Usuario selecciona "Más votados"<br>2. Sistema calcula populares <br>3. Sistema muestra libros ordenados por calificación<br>4. Usuario puede filtrar por categoría<br>5. Usuario puede ver detalles de cada libro |
| Escenario Alternativo |No hay valoraciones:<br> Sistema muestra libros destacados<br> Sugiere nuevos lanzamientos |
| Requerimientos Especiales | Mostrar promedio de calificaciones |
| Sistema | Librería Don Héctor |




## Matriz

# a. Stakeholders vs Requerimientos

| Requerimiento | Gerente | Supervisor | Empleado | Usuario |
|--------------|---------|------------|-----------|----------|
| RF01.1 - Registro de usuarios | X | X | X | X |
| RF01.2 - Verificación de cuenta | X | X | X | X |
| RF01.3 - Inicio de sesión | X | X | X | X |
| RF01.4 - Almacenamiento de contraseñas | X | X | X | X |
| RF02.1 - Registro de supervisores | X | | | |
| RF02.2 - Registro de empleados | | X | | |
| RF02.3 - Eliminación de personal | X | X | | |
| RF02.4 - Modificación de información | X | X | | |
| RF02.5 - Envío de credenciales | X | X | | |
| RF03.1 - Registro de productos | | X | X | |
| RF03.2 - Actualización de productos | | X | X | |
| RF03.3 - Baja de productos | | X | | |
| RF03.4 - Consulta de inventario | X | X | X | |
| RF04.1 - Registro de libros digitales | | X | | |
| RF04.2 - Visualización de catálogo | | | | X |
| RF04.3 - Buscador con filtros | | | | X |
| RF04.4 - Listas de deseos | | | | X |
| RF05.1 - Registro de ventas | | | X | |
| RF05.2 - Gestión de compras digitales | | | | X |
| RF05.3 - Métodos de pago | | | X | X |
| RF05.4 - Generación de facturas | | | X | |
| RF05.5 - Historial de facturas | X | X | X | X |
| RF06.1 - Reportes de ventas | X | | | |
| RF06.2 - Reportes de ganancias | X | | | |
| RF07.1 - Registro de calificaciones | | | | X |
| RF07.2 - Gestión de comentarios | | | | X |
| RF07.3 - Gestión de valoraciones | | X | | |

# b. Stakeholders vrs CDU

| Stakeholder | CDU | Descripción |
|-------------|-----|-------------|
| Gerente | CU-001 | Agregar Supervisor |
| | CU-002 | Ver Reportes |
| | CU-003 | Ver Ganancias |
| | CU-004 | Eliminar Supervisor |
| | CU-005 | Modificar Supervisor |
| | CU-006 | Ver Facturas |
| | CU-007 | Ver Ganancias |
| Supervisor | CU-008 | Agregar Empleado |
| | CU-009 | Eliminar Empleado |
| | CU-010 | Modificar Empleado |
| | CU-011 | Ver productos |
| | CU-012 | Ver opiniones y comentarios |
| | CU-013 | Agregar Libros |
| Empleado | CU-015 | Ver artículos |
| | CU-015 | Consultar artículos |
| | CU-016 | Generar factura |
| | CU-017 | Ver facturas |
| | CU-018 | Realizar compra |
| | CU-019 | Buscar libros |
| Usuario | CU-021 | Ver libros disponibles |
| | CU-020 | Registrarse |
| | CU-021 | Inicio de sesión |
| | CU-022 | Calificar y comentar |
| | CU-023 | Buscar libros |
| | CU-024 | Agregar al carrito |
| | CU-025 | Ver más votados |


| CDU/Stakeholder | Gerente | Supervisor | Empleado | Usuario |
|-----------------|---------|------------|----------|---------|
| CU-001 | X |  |  |  |
| CU-002 | X |  |  |  |
| CU-003 | X |  |  |  |
| CU-004 | X |  |  |  |
| CU-005 | X |  |  |  |
| CU-006 | X |  |  |  |
| CU-007 | X |  |  |  |
| CU-008 |  | X |  |  |
| CU-009 |  | X |  |  |
| CU-010 |  | X |  |  |
| CU-011 |  | X |  |  |
| CU-012 |  | X |  |  |
| CU-013 |  | X |  | |
| CU-014 |  |  | X |  |
| CU-015 |  |  | X |  |
| CU-016 |  |  | X |  |
| CU-017 |  |  | X |  |
| CU-018 |  |  | X |  |
| CU-019 |  |  |  | X |
| CU-020 |  |  |  | X |
| CU-021 |  |  |  | X |
| CU-022 |  |  |  | X |
| CU-023 |  |  |  | X |
| CU-024 |  |  |  | X |
| CU-025 |  |  |  | X |



# C. Requerimientos vs CDU

| Requirement ID | Description | Related Use Cases |
|---------------|-------------|-------------------|
| RF01.1 | Registro de usuarios con datos personales | CU-020 |
| RF01.2 | Verificación de cuenta por email | CU-021 |
| RF01.3 | Inicio de sesión según rol | CU-021 |
| RF01.4 | Almacenamiento encriptado de contraseñas | CU-021, CU-022 |
| RF02.1 | Registro de supervisores por gerente | CU-001 |
| RF02.2 | Registro de empleados por supervisores | CU-008 |
| RF02.3 | Eliminación de supervisores/empleados | CU-004, CU-008 |
| RF02.4 | Modificación de información de contacto | CU-005, CU-010 |
| RF02.5 | Envío automático de credenciales | CU-001, CU-008 |
| RF03.1 | Registro de nuevos productos | CU-011 |
| RF03.2 | Actualización de información de productos | CU-011 |
| RF03.3 | Dar de baja productos | CU-011 |
| RF03.4 | Consulta de productos en inventario | CU-015, CU-016 |
| RF04.1 | Registro de libros digitales | CU-013 |
| RF04.2 | Visualización de catálogo sin autenticación | CU-018 |
| RF04.3 | Buscador con filtros | CU-021 |
| RF04.4 | Gestión de listas  | CU-023 |
| RF05.1 | Registro de ventas por empleados | CU-017 |
| RF05.2 | Gestión de compras de libros digitales | CU-024 |
| RF05.3 | Registro de métodos de pago | CU-017, CU-022 |
| RF05.4 | Generación de facturas PDF | CU-016 - CU-006 |
| RF05.5 | Historial de facturas consultable | CU-006, CU-016 |
| RF06.1 | Reportes de ventas | CU-002 |
| RF06.2 | Reportes de ganancias | CU-003, CU-007 |
| RF07.1 | Registro de calificaciones y comentarios | CU-022 |
| RF07.2 | Modificación/eliminación de comentarios | CU-022 |
| RF07.3 | Gestión de valoraciones por supervisores | CU-012 |
