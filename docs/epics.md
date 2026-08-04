# Epics — Shady Meadows B&B QA Project

> Documentación de testing por epic. Cada epic incluye alcance, estrategia de pruebas, riesgos conocidos y bugs relacionados, además de los campos originales de Jira.

---

## SMB-1 — Public Homepage & Room Discovery

**Prioridad:** High
**Etiquetas:** `SMB-Homepage` `SMB-Smoke` `SMB-UI`
**Componente:** Homepage

### Descripción
Cubre todas las funcionalidades públicas disponibles para los visitantes en la homepage, incluyendo la información del hotel, las habitaciones disponibles, imágenes, precios, servicios, navegación general y el punto de entrada al flujo de reservas.

### Objetivo
Garantizar que los usuarios puedan acceder a la homepage y visualizar correctamente toda la información necesaria antes de iniciar una reserva.

### Valor de Negocio
La homepage representa el principal punto de entrada para clientes potenciales. Su correcto funcionamiento impacta directamente en la confianza del usuario, la experiencia de navegación y la conversión hacia una reserva.

### Alcance
**Incluye:** 

- Carga de la homepage. 
- Información pública del hotel (nombre, descripción, dirección, teléfono, email, mapa y logo). 
- Catálogo inicial de habitaciones. 
- Información mostrada para cada habitación (precio, imagen, descripción y características). 
- Navegación entre las secciones públicas. 
- Widget de búsqueda de disponibilidad como punto de entrada al proceso de reserva. 
- Actualización del listado de habitaciones disponibles después de realizar una búsqueda.

**Fuera de alcance:**

- Flujo completo de reservas (SMB-3). 
- Formulario de contacto y envío de mensajes (SMB-2). 
- Panel de administración.

### Estrategia de Pruebas

- **UI E2E (smoke):**
- La homepage carga correctamente. 
- Los elementos principales son visibles (header, hero section, habitaciones, footer). 
- La navegación entre las secciones públicas funciona correctamente.

**API / Cross-check UI:** 

- `GET /api/branding` devuelve correctamente la información pública del hotel (nombre, descripción, dirección, contacto, logo y ubicación), y la UI refleja esos datos. 
- `GET /api/room` devuelve el catálogo inicial de habitaciones mostrado al cargar la homepage. 
- Al buscar disponibilidad, `GET /api/room?checkin={date}&checkout={date}` devuelve únicamente las habitaciones disponibles para el rango seleccionado, y la UI muestra exactamente los mismos resultados.

**Cross-browser:**

- Ejecutar las pruebas al menos en Chrome y Safari para verificar una experiencia consistente entre navegadores. 
- Validar especialmente la carga inicial de la homepage, las imágenes, la navegación y el widget de búsqueda de disponibilidad, ya que este componente es el punto de entrada al flujo de reservas.

### Riesgos / Supuestos

- La disponibilidad de habitaciones puede variar durante la ejecución debido a datos dinámicos del backend; las pruebas deben validar la estructura y consistencia de la información, evitando depender de valores temporales como disponibilidad.
- El contenido informativo del hotel puede cambiar con el tiempo (texto, imágenes o precios), por lo que las validaciones deben centrarse en la presencia y consistencia de los datos más que en valores completamente hardcodeados.


### Bugs relacionados
Ninguno reportado hasta la fecha.

### Definition of Done

- Homepage carga sin errores de consola
- Información del hotel visible y correcta
- Habitaciones listadas coinciden con datos del backend
- Navegación funcional
- Smoke test automatizado corriendo en pipeline

---

## SMB-2 — Contact Form Submission

**Prioridad:** Medium
**Etiquetas:** `SMB-Contact` `SMB-Smoke` `SMB-Form` `SMB-UX`
**Componente:** Contact

### Descripción
Cubre el formulario de contacto utilizado por los visitantes para comunicarse con el hotel, incluyendo validaciones de entrada, envío del formulario y verificación de que el mensaje queda registrado correctamente en el sistema.

### Objetivo
Garantizar que los usuarios puedan enviar consultas correctamente y que estas se almacenen para que el personal del hotel pueda revisarlas desde el panel de administración.

### Valor de Negocio
Facilita la comunicación con clientes potenciales, asegura que las consultas no se pierdan y mejora la experiencia de usuario.

### Alcance
**Incluye:**

- Envío del formulario con datos válidos.
- Validaciones de campos (vacíos, formato, límites de caracteres).
- Mensaje de confirmación tras un envío exitoso.
- Verificación de que el mensaje queda registrado en el backend y es visible desde el panel de administración.

**Fuera de alcance:**

- Procesamiento posterior de la consulta por parte del hotel.
- Integración con servicios reales de correo electrónico o notificaciones.

### Estrategia de Pruebas
**UI E2E:**  happy path (envío exitoso), negative tests (campos vacíos, formatos inválidos y límites de caracteres)

**API:** 

- `POST /api/message` para crear el mensaje enviado desde el formulario de contacto. 
- `GET /api/message` para recuperar todos los mensajes y verificar que el mensaje recién enviado fue almacenado correctamente. 
- La validación debe buscar el mensaje utilizando un conjunto de datos únicos (nombre, email, asunto y contenido), evitando depender de IDs fijos o de la posición del mensaje dentro de la respuesta.
- Admin UI:  verificar que el mensaje también aparece correctamente en el panel de administración con toda la información enviada por el usuario (From, Phone, Email, Subject y Message).
- Edge cases: límites exactos de caracteres ya documentados (Subject 5–100, Message 20–2000, Phone 11–21)

### Riesgos / Supuestos

- Los mensajes de validación actuales son técnicos y poco claros (bug ya reportado); las pruebas deben verificar únicamente que la validación ocurre correctamente. 
- El endpoint `GET /api/message` devuelve todos los mensajes registrados, por lo que las comprobaciones deben identificar únicamente el mensaje creado durante la ejecución del test.

### Bugs relacionados

- **BUG-003** — Mensajes de validación técnicos y poco claros (Media)

### Definition of Done

- Envío exitoso validado end-to-end (UI + API + Admin).
- Validaciones de todos los campos cubiertas (vacío, formato y límites).
- Mensaje de confirmación visible para el usuario. 
- Mensaje recuperado mediante `GET /api/message`.
- Mensaje visible en el panel de administración con la información correcta. 
- Automatización ejecutándose correctamente en el pipeline.

---

## SMB-3 — Booking Management

**Prioridad:** highest
**Etiquetas:** `SMB-Booking` `SMB-Reservation` `SMB-Smoke` `SMB-Regression`
**Componente:** Booking

### Descripción
Cubre el flujo completo de reserva de habitaciones, desde la búsqueda de disponibilidad hasta la creación de la reserva, incluyendo la selección de fechas, filtrado de habitaciones disponibles, captura de los datos del huésped, validaciones del formulario y confirmación de la reserva.


### Objetivo
Garantizar que los huéspedes puedan realizar reservas correctamente y que estas se registren de forma consistente tanto en la interfaz como en el backend.

### Valor de Negocio
La gestión de reservas constituye la funcionalidad principal de la aplicación y representa el proceso mediante el cual el negocio genera ingresos.

### Alcance
**Incluye:**

- Selección de fechas de check-in y check-out. 
- Búsqueda de disponibilidad de habitaciones. 
- Filtrado dinámico de habitaciones disponibles. 
- Selección de una habitación. 
- Formulario de reserva del huésped. 
- Validaciones de los datos del formulario. 
- Confirmación de la reserva. 
- Persistencia de la reserva en el backend.

**Fuera de alcance:** 

- Procesamiento de pagos (no implementado en la aplicación).
- Modificación o cancelación de reservas existentes (SMB-6). 
- Gestión administrativa de reservas.

### Estrategia de Pruebas
**UI E2E:**

- Happy Path completo desde la búsqueda hasta la confirmación. 
- Negative tests con datos inválidos del huésped.
- Validación de mensajes de error y comportamiento del formulario.

**API / Cross-check UI:** 

- `GET /api/room?checkin={date}&checkout={date}` para verificar que la disponibilidad mostrada en la UI coincide con el backend.
- `POST /api/booking` para crear la reserva desde el formulario de la aplicación.
- `GET /api/booking?roomid={roomId}` para confirmar que la reserva fue almacenada correctamente en el backend utilizando los datos enviados durante la prueba.

**Edge cases:**

- Check-in igual al check-out.
- Fechas invertidas.
- Fechas en el pasado.
- Reserva de una única noche.
- Solapamiento de reservas (SMB-72).
- Conflictos de creación de reserva (HTTP 409).

### Dependencias
- Depende de SMB-1 para la carga correcta de habitaciones y la búsqueda de disponibilidad.
- Las reservas creadas en este flujo sirven como datos de prueba para SMB-6, donde son gestionadas desde el panel de administración.

### Riesgos / Supuestos

- El entorno de pruebas es público y compartido, por lo que otros usuarios pueden crear reservas simultáneamente y modificar la disponibilidad.
- Las reservas creadas en el entorno de pruebas son temporales y permanecen disponibles durante aproximadamente 8–9 minutos antes de ser eliminadas automáticamente. Las pruebas que validen la reserva en el backend o en el panel de administración deben realizar estas comprobaciones inmediatamente después de crear la reserva.
- Para reducir la inestabilidad de las pruebas, se utilizan fechas dinámicas y búsqueda automática de ventanas de disponibilidad antes de crear una reserva.
- La selección de habitaciones utiliza el `roomId` obtenido dinámicamente desde la interfaz, evitando depender de la posición de la habitación dentro del listado.

### Bugs relacionados

- **SMB-38** — La aplicación muestra una pantalla de error al intentar reservar con fechas inválidas. (**Critical**)
- **SMB-46** — La aplicación permite crear reservas con datos inválidos en el formulario. (**Critical**)
- **SMB-53** — El sistema permite crear reservas con fechas inválidas, generando precios negativos. (**Critical**)
- **SMB-72** — Una habitación con una reserva solapada continúa apareciendo como disponible en la búsqueda. (**High**)
- **SMB-73** — La aplicación no gestiona correctamente una respuesta `HTTP 409` al crear una reserva y termina mostrando un error de ejecución. (**High**)

### Definition of Done

- Flujo completo de reserva validado end-to-end (UI + API).
- Disponibilidad validada contra el backend.
- Reserva persistida y verificada mediante `GET /api/booking`.
- Validaciones del formulario cubiertas (happy path y escenarios negativos).
- Casos límite de fechas ejecutados.
- Escenarios conocidos de conflictos documentados y automatizados.
- Suite de automatización ejecutándose correctamente en el pipeline.

---

## SMB-4 — Admin Authentication

**Prioridad:** Highest
**Etiquetas:** `SMB-Admin` `SMB-Authentication` `SMB-Security` `SMB-Smoke`
**Componente:** Admin - Auth

### Descripción
Cubre la autenticación de administradores, incluyendo el inicio y cierre de sesión, la validación del acceso a rutas protegidas y la autenticación mediante UI y API.

### Objetivo
Garantizar que únicamente usuarios autenticados puedan acceder a las funcionalidades administrativas del sistema.

### Valor de Negocio
Protege la información administrativa, evita accesos no autorizados y asegura la integridad de las operaciones internas del hotel.

### Alcance
**Incluye:**

- Inicio de sesión desde la interfaz de usuario.
- Autenticación mediante `POST /api/auth/login`.
- Validación de la estructura de la respuesta del login (token y código de estado).
- Acceso a rutas protegidas con sesión válida.
- Verificación del cierre de sesión.
- Validación de acceso a rutas protegidas sin autenticación

**Fuera de alcance:**

- Registro de nuevos administradores.
- Recuperación o cambio de contraseña.
- Gestión de usuarios.
- Roles y permisos diferenciados.

### Estrategia de Pruebas
**UI E2E:** 

- Login exitoso.
- Login con credenciales inválidas.
- Acceso al panel administrativo.
- Verificación del comportamiento después del logout.

**API:** 

- `POST /api/auth/login` para autenticar usuarios y comprobar que devuelve un token valido.
- `POST /api/auth/logout` para validar el cierre de sesión y detectar errores del endpoint.

**Seguridad:** 

- Acceso directo a rutas administrativas sin autenticación.
- Acceso a rutas protegidas después del logout.
- Validación de redirección al login cuando no existe una sesión válida.

### Riesgos / Supuestos
El endpoint POST /api/auth/logout presenta actualmente un comportamiento inestable y devuelve HTTP 500, lo que impide validar correctamente la invalidación de la sesión mediante API. Las pruebas deben documentar este comportamiento mientras el defecto permanezca abierto.

### Bugs relacionados
- **SMB-58** — El endpoint POST /api/auth/logout devuelve HTTP 500 al cerrar sesión - (**Critical**)

### Definition of Done

- Login exitoso validado mediante UI y API.
- El acceso con credenciales inválidas está correctamente bloqueado.
- El login devuelve correctamente el token de autenticación.
- Las rutas protegidas solo son accesibles con una sesión válida.
- El comportamiento del logout está validado y documentado según el estado actual de la aplicación.
- La suite automatizada se ejecuta correctamente en el pipeline.

---

## SMB-5 — Room Administration

**Prioridad:** High
**Etiquetas:** `SMB-Admin` `SMB-Crud` `SMB-Rooms` `SMB-Management`
**Componente:** Room Management

### Descripción
Cubre la administración de habitaciones desde el panel de administración, incluyendo la creación, edición, eliminación y visualización del catálogo de habitaciones.

### Objetivo
Permitir a los administradores gestionar correctamente las habitaciones disponibles para los huéspedes.

### Valor de Negocio
Mantiene actualizado el catálogo de habitaciones, asegurando que la información mostrada a los clientes sea correcta y facilitando la gestión de la oferta del hotel.

### Alcance
**Incluye:** 

- Crear nuevas habitaciones.
- Editar habitaciones existentes.
- Eliminar habitaciones.
- Visualizar el listado de habitaciones en el panel administrativo.
- Gestionar los datos de la habitación (nombre, tipo, precio, descripción, características e imagen).

**Fuera de alcance:** 

- Gestión de disponibilidad o calendario de reservas por habitación.
- Carga real de imágenes al servidor (se valida únicamente la referencia o URL de la imagen, salvo que la aplicación implemente un sistema de subida de archivos).

### Estrategia de Pruebas
**UI E2E:**

- Crear una habitación.
- Editar una habitación existente.
- Eliminar una habitación.
- Verificar que los cambios se reflejan correctamente en el panel de administración.

**API:** 

- Validar las operaciones CRUD mediante POST /api/room, PUT /api/room/{id}, DELETE /api/room/{id} y GET /api/room para comprobar que los cambios se guardan correctamente en el sistema.

**Negative / edge:** 

- Campos obligatorios vacíos.
- Precio negativo o no numérico.
- Valores fuera de los límites permitidos.
- Intentar eliminar una habitación que tenga reservas asociadas 

### Riesgos / Supuestos
**Entorno compartido:** El entorno es compartido y las habitaciones existentes (roomId 1–3) son utilizadas por otras suites de pruebas, especialmente SMB-3 (Booking Management) y SMB-5 (Homepage & Public Experience). Las pruebas deben crear habitaciones específicas para testing, identificarlas claramente y eliminarlas al finalizar la ejecución para evitar interferencias con otros escenarios.

### Bugs relacionados
Ninguno reportado hasta la fecha.

### Definition of Done
- Creación de habitaciones funcionando correctamente.
- Edición de habitaciones funcionando correctamente.
- Eliminación de habitaciones funcionando correctamente.
- Los cambios permanecen después de recargar la aplicación.
- Los datos de prueba no afectan a otras suites de pruebas.
- Suite automatizada ejecutándose correctamente en el pipeline.

---

## SMB-6 — Reservation Administration

**Prioridad:** High
**Etiquetas:** `SMB-Admin` `SMB-Booking` `SMB-Calendar` `SMB-Management`
**Componente:** Reservation Management

### Descripción
Cubre la visualización y administración de las reservas realizadas por los huéspedes desde el panel de administración.

### Objetivo
Permitir a los administradores consultar y gestionar las reservas del hotel de forma correcta.

### Valor de Negocio
Facilita el control de la ocupación del hotel, permitiendo consultar las reservas existentes y gestionar la disponibilidad de las habitaciones.

### Alcance
**Incluye:**

- Visualizar el listado de reservas en el panel de administración.
- Verificar la información de cada reserva.
- Visualizar las reservas en el calendario de ocupación.
- Editar o eliminar reservas desde el panel administrativo (si la aplicación lo permite).
- Comprobar que las reservas creadas por los huéspedes aparecen correctamente en el panel de administración.

**Fuera de alcance:** 

- Crear reservas manualmente desde el panel administrativo (salvo que la funcionalidad exista).
- Facturación o gestión de pagos.

### Estrategia de Pruebas
**UI E2E:** 

- Verificar que una reserva creada por un huésped aparece correctamente en el panel de administración.
- Comprobar que la información mostrada coincide con la reserva realizada.
- Validar la edición o eliminación de reservas (si está disponible).

**API:**

- Validar la información de las reservas mediante `GET /api/booking`.
- Validar la información mostrada en el calendario mediante el endpoint correspondiente de Calendar View.

**End-to-End**
Ejecutar un flujo completo desde la creación de una reserva en la página pública hasta su verificación en el backend y su visualización en el panel administrativo.

### Dependencias

- SMB-3 — Booking Management, ya que deben existir reservas creadas previamente.
- SMB-4 — Admin Authentication, ya que el acceso al panel administrativo requiere una sesión iniciada.

### Riesgos / Supuestos
Las reservas visibles en el panel administrativo son temporales y pueden desaparecer automáticamente después de aproximadamente 8–9 minutos. Las pruebas deben validar la reserva poco después de su creación para evitar falsos fallos provocados por la limpieza automática del entorno.

### Bugs relacionados
Ninguno reportado hasta la fecha. Pendiente completar testing del endpoint de Calendar View.

### Definition of Done

- Las reservas creadas por los huéspedes aparecen correctamente en el panel de administración.
- La información mostrada coincide con los datos almacenados en el backend.
- El calendario muestra correctamente las reservas registradas.
- La edición y eliminación de reservas funcionan correctamente (si la funcionalidad está disponible).
- El flujo completo Página pública → Backend → Panel de administración queda validado.
- Suite automatizada ejecutándose correctamente en el pipeline.

---

## SMB-7 — Branding Configuration

**Prioridad:** Medium
**Etiquetas:** `SMB-Admin` `SMB-Configuration` `SMB-Branding` `SMB-Regression`
**Componente:** Admin - Branding

### Descripción
Cubre la configuración de la información pública del hotel desde el panel de administración, incluyendo el nombre, descripción, logo, dirección, información de contacto, ubicación y demás datos que se muestran en la homepage.

### Objetivo
Garantizar que los administradores puedan actualizar correctamente la información pública del hotel y que los cambios se reflejen tanto en la API como en la página principal.

### Valor de Negocio
Permite mantener actualizada la identidad del hotel y asegurar que los visitantes visualicen información correcta y consistente.

### Alcance
**Incluye:** 

- Modificación del nombre del hotel.
- Modificación del logo.
- Modificación de la descripción.
- Modificación de las instrucciones (Directions).
- Modificación de la información de contacto (nombre, teléfono y correo).
- Modificación de la dirección (Line 1, Line 2, Post Town y County).
- Modificación de la ubicación del mapa (Latitude y Longitude).
- Actualización de la configuración mediante `PUT /api/branding`.
- Validación de la información mediante `GET /api/branding`.
- Verificación de que los cambios se reflejan correctamente en la homepage.

**Fuera de alcance:** 

- Soporte para múltiples idiomas.
- Gestión de múltiples hoteles.
- Sistema avanzado de carga y almacenamiento de imágenes.

### Estrategia de Pruebas
**UI E2E:** 

- Modificar cada uno de los campos disponibles desde el panel administrativo.
- Guardar los cambios.
- Confirmar que la homepage muestra la nueva información correctamente.

**API:** 

- Verificar que la actualización realizada mediante `PUT /api/branding` finaliza correctamente.
- Validar mediante `GET /api/branding` que toda la información modificada fue almacenada correctamente.

**Regresión cruzada UI/API:** 
- Comparar la información mostrada en la homepage con la respuesta obtenida desde `GET /api/branding` para asegurar la consistencia entre frontend y backend.


### Dependencias

Depende de:

- **SMB-4 — Admin Authentication**, ya que requiere autenticación como administrador.

Puede afectar a:

- **SMB-1 — Public Experience / Homepage**, porque modifica toda la información visible para los visitantes.


### Riesgos / Supuestos

- El entorno es compartido y otros usuarios pueden modificar la configuración del branding mientras se ejecutan las pruebas.
- Las validaciones deben realizarse utilizando los valores configurados durante la ejecución de la prueba y no valores fijos.
- Los cambios realizados mediante `PUT /api/branding` son temporales y permanecen disponibles aproximadamente durante **15 minutos o menos**, tras lo cual el entorno vuelve automáticamente a su configuración original. Las validaciones deben realizarse inmediatamente después de guardar los cambios.

### Bugs relacionados
Ninguno reportado hasta la fecha.

### Definition of Done

- Todos los campos del Branding pueden modificarse correctamente.
- La actualización mediante `PUT /api/branding` finaliza exitosamente.
- La información obtenida mediante `GET /api/branding` coincide con los cambios realizados.
- La homepage refleja correctamente toda la información actualizada.
- La automatización se ejecuta correctamente en el pipeline.

---

## SMB-8 — Reports and Occupation

**Prioridad:** Low
**Etiquetas:** `SMB-Admin` `SMB-Reports` `SMB-Calendar` `SMB-Regression`
**Componente:** Admin - Reports & Occupation

### Descripción
Cubre la visualización de la ocupación del hotel mediante el calendario disponible en el panel administrativo, permitiendo consultar las reservas existentes y verificar que la información mostrada coincide con los datos almacenados en el sistema.

### Objetivo
Garantizar que los administradores puedan consultar correctamente la ocupación de las habitaciones y visualizar las reservas registradas.

### Valor de Negocio
Permite conocer la ocupación del hotel, facilitar la planificación operativa y verificar la disponibilidad de habitaciones.

### Alcance
**Incluye:** 

- Visualización del calendario de ocupación.
- Navegación entre meses.
- Visualización de reservas existentes.
- Correspondencia entre huésped, habitación y fechas.
- Validación de la información mostrada utilizando el endpoint del calendario (cuando se documente).
- Correlación entre las reservas creadas en **SMB-3 — Booking Management** y su visualización en el calendario administrativo.


**Fuera de alcance:** 

- Reportes financieros.
- Estadísticas de ingresos.
- Exportación de reportes.
- Reportes históricos o analíticos.

### Estrategia de Pruebas
**UI E2E:**

- Verificar que el calendario carga correctamente.
- Navegar entre meses.
- Confirmar que una reserva conocida aparece en el período correspondiente.
- Validar que el huésped, habitación y fechas coinciden con la reserva creada.

**API:**

- Validar la información utilizando el endpoint del calendario una vez documentado.
- Comparar la información del calendario con los datos obtenidos desde `GET /api/booking`.


**Validación cruzada UI/API**

- Crear una reserva mediante la UI pública (SMB-3).
- Confirmar la reserva mediante `GET /api/booking`.
- Verificar que la misma reserva aparece correctamente en el calendario administrativo.

### Dependencias
- **SMB-3 — Booking Management**, ya que deben existir reservas.
- **SMB-4 — Admin Authentication**, porque requiere acceso al panel administrativo.

### Riesgos / Supuestos
- El entorno es compartido y el calendario puede mostrar reservas creadas por otros usuarios.
- Las validaciones deben identificar únicamente la reserva creada durante la prueba utilizando nombre del huésped, habitación y fechas, sin asumir una cantidad fija de reservas.
- Las reservas creadas en este entorno son temporales y permanecen disponibles aproximadamente entre **8 y 9 minutos**, tras lo cual desaparecen automáticamente. Las validaciones deben realizarse inmediatamente después de crear la reserva.

### Bugs relacionados
Ninguno reportado hasta la fecha.

### Definition of Done
- El calendario carga correctamente.
- Es posible navegar entre meses.
- Las reservas se muestran con la información correcta.
- La información coincide con la obtenida desde la API correspondiente.
- La automatización se ejecuta correctamente en el pipeline.

---

## SMB-9 — QA Automation Framework (Mobile) — BORRADOR

**Prioridad:** High
**Etiquetas propuestas:** `SMB-Automation` `SMB-Mobile` `SMB-Maestro` *(las etiquetas originales del epic — SMB-Analytics/Occupancy/Reports — pertenecen a SMB-8, revisar en Jira si fue un error de copiado)*
**Componente:** Automation Framework

### Descripción
Agrupa los desarrollos de automatización de pruebas mediante Maestro Studio: estructura de flows, variables, datos de prueba, ejecución local y futura integración CI/CD.

### Objetivo
Disponer de una suite automatizada mantenible, reutilizable y escalable.

### Valor de Negocio
Reduce tiempo de ejecución de pruebas, aumenta cobertura y disminuye errores manuales.

### Alcance
**Pendiente de definir** — necesito saber qué aplicación mobile se prueba con Maestro (¿una app nativa distinta al sitio web, o la versión responsive de `automationintesting.online`?) para poder escribir el alcance real en vez de inventarlo.

### Definition of Done
- Flows creados
- Suite Smoke disponible
- Suite Regression disponible
- Evidencias generadas
- Ejecución estable