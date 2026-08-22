# SMB-13 — Información y catálogo de habitaciones

## User Story

**Como usuario**, quiero consultar la información de las habitaciones mostradas en la homepage para comparar las opciones y decidir cuál reservar.

---

## Criterios de aceptación

### AC-1 — Visualización del catálogo de habitaciones

**Given** el usuario accede a la homepage
**When** la información de las habitaciones termina de cargar
**Then** debe visualizar el listado de habitaciones disponibles en la homepage.

---

### AC-2 — Información de cada habitación

**Given** el usuario visualiza el listado de habitaciones
**When** una habitación se encuentra disponible en la homepage
**Then** debe visualizar la información correspondiente a la habitación.

**And** debe mostrar como mínimo:

* Número/nombre de la habitación.
* Tipo de habitación.
* Precio.
* Descripción.
* Imagen.
* Características disponibles.

---

### AC-3 — Consistencia de la información

**Given** la información de las habitaciones está disponible mediante `GET /api/room`
**When** el usuario consulta el catálogo de habitaciones
**Then** la información mostrada en la homepage debe corresponder con la información proporcionada por la API.

---

### AC-4 — Representación de las características

**Given** una habitación dispone de determinadas características
**When** el usuario visualiza dicha habitación
**Then** deben mostrarse las características asociadas a esa habitación.

**And** no deben mostrarse características pertenecientes a otra habitación.

---

### AC-5 — Información visual de la habitación

**Given** una habitación dispone de una imagen
**When** el usuario visualiza la habitación
**Then** debe mostrarse la imagen correspondiente a dicha habitación.

---

### AC-6 — Acceso al proceso de reserva

**Given** el usuario está consultando una habitación
**When** selecciona la opción disponible para reservarla
**Then** debe poder continuar hacia el flujo correspondiente de reserva.

---

# Trazabilidad

| Test ID     | Test Case                                                                                                | AC relacionado         | Componente                | Tipo de prueba      | Resultado | Bug relacionado |
| ----------- | -------------------------------------------------------------------------------------------------------- | ---------------------- | ------------------------- | ------------------- | --------- | --------------- |
| **SMB-126** | **TC47** — Verificar visualización del catálogo de habitaciones en la homepage                           | AC-1                   | `Rooms`, `Homepage`       | `Positive-tests`    | ✅ Passed  | —               |
| **SMB-127** | **TC48** — Verificar correspondencia entre la información de las habitaciones en la UI y `GET /api/room` | AC-2, AC-3, AC-4, AC-5 | `Rooms`                   | `Integration-Tests` | ✅ Passed  | —               |
| **SMB-131** | **TC49** — Verificar comportamiento cuando el catálogo de habitaciones está vacío                        | AC-1                   | `Rooms`, `Homepage`       | `Negative-Tests`    | ❌ Failed  | **SMB-134**     |
| **SMB-132** | **TC50** — Verificar comportamiento ante información incompleta de una habitación                        | AC-2, AC-4, AC-5       | `Rooms`                   | `Edge-Cases`        | ✅ Passed  | —               |
| **SMB-133** | **TC51** — Verificar acceso al flujo de reserva desde una habitación                                     | AC-6                   | `Public-Booking`, `Rooms` | `Happy-path`        | ✅ Passed  | —               |

---

# Test Cases

## SMB-126 — TC47 — Verificar visualización del catálogo de habitaciones en la homepage

| Campo              | Valor                                                                           |
| ------------------ | ------------------------------------------------------------------------------- |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Rooms`, `SMB-Homepage`, `SMB-Smoke` |
| **Componentes**    | `Rooms`, `Homepage`                                                             |
| **Tipo de prueba** | `Positive-tests`                                                                |
| **Resultado**      | ✅ **Passed**                                                                    |

### Descripción

Verificar que la homepage carga correctamente el catálogo de habitaciones y que las habitaciones disponibles se muestran correctamente al usuario.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* La sección de habitaciones está disponible.
* El endpoint `GET /api/room` es accesible.

---

### Pasos

1. Acceder a la homepage.
2. Desplazarse hasta la sección de habitaciones.
3. Identificar las habitaciones mostradas en el catálogo.
4. Consultar el endpoint `GET /api/room`.
5. Identificar las habitaciones devueltas por el endpoint.
6. Comparar las habitaciones mostradas en la UI con las habitaciones devueltas por `GET /api/room`.

---

### Resultado esperado

* Debe mostrarse el catálogo de habitaciones disponible en la homepage.
* Cada habitación debe mostrarse de forma individual en el catálogo.
* Las habitaciones mostradas en la UI deben corresponder a las habitaciones devueltas por `GET /api/room`.
* No deben mostrarse habitaciones duplicadas.
* Todas las habitaciones que correspondan al catálogo deben representarse correctamente.

---

### Resultado

✅ **Passed**

---

## SMB-127 — TC48 — Verificar correspondencia entre la información de las habitaciones en la UI y `GET /api/room`

| Campo              | Valor                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Rooms`, `SMB-Homepage`, `SMB-Integration`, `SMB-Validation` |
| **Componentes**    | `Rooms`                                                                                                 |
| **Tipo de prueba** | `Integration-Tests`                                                                                     |
| **Resultado**      | ✅ **Passed**                                                                                            |

### Descripción

Verificar que la información de las habitaciones mostrada en la homepage coincide con los datos proporcionados en tiempo de ejecución por el endpoint `GET /api/room`.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* La sección de habitaciones está disponible.
* El endpoint `GET /api/room` es accesible.

---

### Datos de prueba

Los datos de prueba se obtienen dinámicamente de la respuesta del endpoint:

```http
GET /api/room
```

No se establecen habitaciones, precios o características concretas como datos fijos, ya que el contenido de la aplicación puede ser modificado antes de la ejecución de la prueba.

---

### Pasos

1. Realizar una petición `GET /api/room`.
2. Obtener las habitaciones devueltas por el endpoint.
3. Identificar para cada habitación los valores de `roomid`, `roomName`, `type`, `roomPrice`, `description`, `features` e `image`.
4. Acceder a la homepage.
5. Desplazarse hasta la sección de habitaciones.
6. Localizar las habitaciones mostradas en la UI.
7. Identificar el nombre, tipo, precio, descripción, características e imagen mostrados para cada habitación.
8. Comparar los datos mostrados en la UI con los obtenidos mediante `GET /api/room`.
9. Repetir la comparación para todas las habitaciones devueltas por el endpoint.

---

### Resultado esperado

* `GET /api/room` debe devolver correctamente la información disponible de las habitaciones.
* La información mostrada en la UI debe coincidir con la información obtenida mediante `GET /api/room`.
* El **número de habitación** mostrado en la UI debe corresponder al valor de `roomName`.
* El **tipo de habitación** mostrado debe corresponder al valor de `type`.
* El **precio** mostrado debe corresponder al valor de `roomPrice`.
* La **descripción** mostrada debe corresponder al valor de `description`.
* Las **características** mostradas deben corresponder a los valores de `features`.
* La **imagen** mostrada debe corresponder al valor de `image`.
* Los datos de cada habitación deben mostrarse asociados a la habitación correspondiente.
* Todas las habitaciones devueltas por `GET /api/room` deben representarse correctamente en la UI.

---

### Resultado

✅ **Passed**

---

## SMB-131 — TC49 — Verificar comportamiento cuando el catálogo de habitaciones está vacío

| Campo              | Valor                                                                                |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Rooms`, `SMB-Homepage`, `SMB-Validation` |
| **Componentes**    | `Rooms`, `Homepage`                                                                  |
| **Tipo de prueba** | `Negative-Tests`                                                                     |
| **Resultado**      | ❌ **Failed**                                                                         |

### Descripción

Verificar que la aplicación gestiona correctamente la ausencia de habitaciones disponibles en el catálogo y proporciona al usuario información adecuada cuando no existen habitaciones para mostrar.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El endpoint `GET /api/room` es accesible.
* Existe al menos una habitación disponible para eliminar.
* El usuario puede gestionar las habitaciones desde el panel administrativo o dispone de un token válido para realizar peticiones autenticadas mediante API.

---

### Preparación del escenario

Las habitaciones pueden eliminarse temporalmente mediante cualquiera de las siguientes opciones:

#### Opción 1 — Panel administrativo

Acceder a:

```text
/admin/rooms
```

En el panel se muestran las habitaciones disponibles. Para eliminar una habitación, seleccionar el botón **X** correspondiente a la habitación.

Repetir el proceso con todas las habitaciones disponibles hasta dejar el catálogo vacío.

#### Opción 2 — Vía API/Postman

##### 1. Obtener un token válido

Realizar:

```http
POST {{Url}}/api/auth/login
```

En **Body → raw → JSON**, utilizar las **credenciales proporcionadas por el equipo para las pruebas**.

La respuesta del login proporciona el token necesario para realizar las operaciones autenticadas.

Para evitar introducir manualmente el token cada vez que caduque, se puede guardar como una **variable de entorno de Postman**. De esta forma, cuando el token cambie, únicamente es necesario volver a ejecutar la petición de login para actualizar su valor.

##### 2. Eliminar las habitaciones

Realizar:

```http
DELETE {{Url}}/api/room/{roomid}
```

Donde `{roomid}` corresponde al identificador de la habitación que se desea eliminar.

Repetir el proceso con las habitaciones restantes hasta que `GET /api/room` devuelva:

```json
{
  "rooms": []
}
```

La eliminación de las habitaciones es **temporal**, ya que la aplicación las restablece automáticamente después de un determinado periodo de tiempo.

---

### Pasos

1. Eliminar todas las habitaciones disponibles mediante el panel administrativo o mediante la petición `DELETE /api/room/{roomid}`.
2. Acceder a la homepage.
3. Consultar la respuesta de `GET /api/room`.
4. Comprobar que el catálogo de habitaciones se encuentra vacío.
5. Desplazarse hasta la sección de habitaciones.
6. Observar el estado de la sección cuando no existen habitaciones disponibles.

---

### Resultado esperado

* `GET /api/room` debe devolver correctamente un catálogo vacío:

```json
{
  "rooms": []
}
```

* La sección de habitaciones debe gestionarse correctamente cuando no existen habitaciones disponibles.
* No deben mostrarse tarjetas correspondientes a habitaciones inexistentes.
* Debe mostrarse un **mensaje informativo indicando que no existen habitaciones disponibles**.
* La ausencia de habitaciones no debe provocar errores de ejecución.
* El resto de la homepage debe continuar funcionando correctamente.

---

### Resultado actual

`GET /api/room` devuelve correctamente:

```json
{
  "rooms": []
}
```

* En la homepage **no se muestran tarjetas de habitaciones**, comportamiento esperado al no existir habitaciones disponibles.
* Sin embargo, **no se muestra ningún mensaje informativo que indique al usuario que actualmente no existen habitaciones disponibles**.
* La sección permanece sin contenido, sin proporcionar información sobre el motivo por el que no se muestran habitaciones.
* El resto de la homepage continúa funcionando correctamente.

---

### Bug relacionado

* **SMB-134 — No se muestra mensaje informativo cuando el catálogo de habitaciones está vacío**
* Documentación: `docs/bugs/SMB-1/SMB-134-empty-room-state.md`

---

## SMB-132 — TC50 — Verificar comportamiento ante información incompleta de una habitación

| Campo              | Valor                                                                                |
| ------------------ | ------------------------------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Rooms`, `SMB-Homepage`, `SMB-Validation` |
| **Componentes**    | `Rooms`                                                                              |
| **Tipo de prueba** | `Edge-Cases`                                                                         |
| **Resultado**      | ✅ **Passed**                                                                         |

### Descripción

Verificar que la aplicación gestiona correctamente una habitación con información incompleta y que la UI continúa mostrando la habitación sin generar errores cuando los campos **Description**, **Features** e **Image** no contienen información.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El endpoint `GET /api/room` es accesible.
* Existe al menos una habitación disponible.
* Se dispone de credenciales de acceso proporcionadas por el equipo para realizar las modificaciones mediante API, en caso de utilizar Postman.

---

### Datos de prueba

Una habitación existente con los siguientes campos vacíos:

* `description`
* `features`
* `image`

El resto de información de la habitación debe mantenerse válida.

El identificador `{roomid}` debe corresponder a una habitación existente obtenida mediante `GET /api/room`.

---

### Preparación del escenario

La información de la habitación puede modificarse de dos formas:

#### Opción 1 — Panel administrativo

1. Acceder a `/admin/rooms`.
2. Seleccionar una habitación disponible.
3. Editar los campos **Description**, **Features** e **Image**.
4. Dejar los tres campos vacíos.
5. Actualizar los cambios.

#### Opción 2 — Mediante Postman

##### 1. Obtener un token válido

Realizar:

```http
POST {{Url}}/api/auth/login
```

En **Body → raw → JSON**, utilizar las **credenciales proporcionadas por el equipo para las pruebas**.

La respuesta del login proporciona el token necesario para las operaciones autenticadas.

* Para evitar introducir manualmente el token cada vez que caduque, se puede guardar la respuesta como una variable de entorno de Postman.
* De esta forma, cuando el token cambie, únicamente es necesario volver a ejecutar la petición de login para actualizar su valor.

##### 2. Modificar la habitación

Realizar una petición:

```http
PUT {{Url}}/api/room/{roomid}
```

Donde `{roomid}` representa el identificador de una habitación existente obtenida mediante `GET /api/room`.

En **Headers**:

```text
Cookie: token={{token}}
```

En **Body → raw → JSON**:

```json
{
  "accessible": true,
  "description": "",
  "features": [],
  "image": "",
  "roomName": "101",
  "roomPrice": 100,
  "roomid": 1,
  "type": "Single"
}
```

> Los valores `roomName`, `roomPrice`, `type`, `accessible` y `roomid` del ejemplo deben sustituirse por los datos actuales de la habitación que se esté utilizando. Lo que debe mantenerse para este caso de prueba es que `description`, `features` e `image` estén vacíos.

---

### Pasos

1. Preparar una habitación dejando vacíos los campos **Description**, **Features** e **Image** mediante el panel administrativo o mediante la petición `PUT` descrita anteriormente.
2. Acceder a la homepage.
3. Consultar la petición `GET /api/room`.
4. Identificar la habitación modificada en la respuesta.
5. Comprobar que los campos `description`, `features` e `image` se encuentran vacíos.
6. Desplazarse hasta la sección de habitaciones.
7. Localizar la habitación correspondiente.
8. Comparar la información mostrada en la UI con la información proporcionada por `GET /api/room`.
9. Comprobar cómo se representan en la UI los campos que no contienen información.

---

### Resultado esperado

* `GET /api/room` debe reflejar correctamente los cambios realizados en la habitación.
* El campo `description` debe aparecer vacío.
* El campo `features` debe devolver un array vacío (`[]`).
* El campo `image` debe aparecer vacío.
* La habitación debe continuar mostrándose correctamente en la homepage.
* La ausencia de estos datos no debe provocar errores de ejecución.
* No deben mostrarse datos pertenecientes a otra habitación.
* El resto de información disponible de la habitación debe continuar mostrándose correctamente.
* La UI debe gestionar correctamente la ausencia de descripción, características e imagen.

---

### Resultado

✅ **Passed**

---

## SMB-133 — TC51 — Verificar acceso al flujo de reserva desde una habitación

| Campo              | Valor                                                                             |
| ------------------ | --------------------------------------------------------------------------------- |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Rooms`, `SMB-Booking`, `SMB-E2E`, `SMB-Homepage` |
| **Componentes**    | `Public-Booking`, `Rooms`                                                         |
| **Tipo de prueba** | `Happy-path`                                                                      |
| **Resultado**      | ✅ **Passed**                                                                      |

### Descripción

Verificar que el usuario puede acceder correctamente al flujo de reserva desde una habitación disponible en la homepage y que la información de la habitación seleccionada se mantiene durante la navegación.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* Existe al menos una habitación disponible.
* La sección de habitaciones se encuentra disponible.
* La habitación seleccionada dispone de una opción para iniciar el proceso de reserva.

---

### Datos de prueba

* Una habitación disponible en la homepage.
* Fechas de **Check-in** y **Check-out** válidas.
* Las fechas utilizadas pueden ser las establecidas por defecto por la aplicación o modificarse durante la prueba.

---

### Pasos

1. Acceder a la homepage.
2. Comprobar las fechas establecidas en **Check-in** y **Check-out**.
3. Desplazarse hasta la sección **Rooms**.
4. Localizar una habitación disponible.
5. Pulsar **Book Now**.
6. Comprobar que la aplicación dirige a la página de reserva.
7. Comprobar que la URL contiene el identificador correspondiente a la habitación seleccionada.
8. Comprobar que la URL mantiene las fechas de **Check-in** y **Check-out** seleccionadas.
9. Comprobar que la página de reserva carga correctamente.
10. Repetir los pasos del 4 al 9 para cada habitación disponible.

---

### Resultado esperado

* Cada habitación disponible debe mostrar un botón **Book Now**.
* Al seleccionar **Book Now**, el usuario debe ser dirigido a la página de reserva correspondiente.
* El identificador de la habitación en la URL debe corresponder a la habitación seleccionada.
* Las fechas de **Check-in** y **Check-out** deben mantenerse correctamente en la URL.
* La página de reserva debe cargar correctamente para cada habitación.
* El comportamiento debe ser consistente para todas las habitaciones disponibles.

---

### Resultado

✅ **Passed**
