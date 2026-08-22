# SMB-134 — No se muestra mensaje informativo cuando el catálogo de habitaciones está vacío

## Descripción

Cuando no existen habitaciones disponibles y `GET /api/room` devuelve `rooms: []`, la sección de habitaciones de la homepage permanece vacía sin mostrar ningún mensaje al usuario indicando que no hay habitaciones disponibles.

---

## Trazabilidad

| Elemento                | Referencia                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------- |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                                                |
| **User Story**          | SMB-13 — Información y catálogo de habitaciones                                         |
| **Test Case**           | SMB-131 / TC49 — Verificar comportamiento cuando el catálogo de habitaciones está vacío |
| **Acceptance Criteria** | AC-1 — Visualización del catálogo de habitaciones                                       |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El endpoint `GET /api/room` es accesible.
* Existe al menos una habitación disponible para eliminar.
* El usuario puede gestionar las habitaciones desde el panel administrativo o dispone de un token válido para realizar peticiones autenticadas mediante API.

---

## Preparación del escenario

Las habitaciones pueden eliminarse temporalmente mediante cualquiera de las siguientes opciones:

### Opción 1 — Panel administrativo

Acceder a:

```text
/admin/rooms
```

En el panel se muestran las habitaciones disponibles. Para eliminar una habitación, seleccionar el botón **X** correspondiente a la habitación.

Repetir el proceso con todas las habitaciones disponibles hasta dejar el catálogo vacío.

### Opción 2 — Vía API/Postman

#### 1. Obtener un token válido

Realizar:

```http
POST {{Url}}/api/auth/login
```

En **Body → raw → JSON**, utilizar las credenciales proporcionadas por el equipo para las pruebas.

La respuesta del login proporciona el token necesario para realizar las operaciones autenticadas.

Para evitar introducir manualmente el token cada vez que caduque, se puede guardar como una variable de entorno de Postman. De esta forma, cuando el token cambie, únicamente es necesario volver a ejecutar la petición de login para actualizar su valor.

#### 2. Eliminar las habitaciones

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

La eliminación de las habitaciones es temporal, ya que la aplicación las restablece automáticamente después de un determinado periodo de tiempo.

---

## Pasos para reproducir

1. Eliminar todas las habitaciones disponibles mediante el panel administrativo o mediante la petición `DELETE /api/room/{roomid}`.
2. Acceder a la homepage.
3. Consultar la respuesta de `GET /api/room`.
4. Comprobar que el catálogo de habitaciones se encuentra vacío.
5. Desplazarse hasta la sección de habitaciones.
6. Observar el estado de la sección cuando no existen habitaciones disponibles.

---

## Resultado actual

`GET /api/room` devuelve correctamente:

```json
{
  "rooms": []
}
```

* En la homepage no se muestran tarjetas de habitaciones, comportamiento esperado al no existir habitaciones disponibles.
* Sin embargo, no se muestra ningún mensaje informativo que indique al usuario que actualmente no existen habitaciones disponibles.
* La sección permanece sin contenido, sin proporcionar información sobre el motivo por el que no se muestran habitaciones.
* El resto de la homepage continúa funcionando correctamente.

---

## Resultado esperado

* `GET /api/room` debe devolver correctamente un catálogo vacío:

```json
{
  "rooms": []
}
```

* La sección de habitaciones debe gestionarse correctamente cuando no existen habitaciones disponibles.
* No deben mostrarse tarjetas correspondientes a habitaciones inexistentes.
* Debe mostrarse un mensaje informativo indicando que no existen habitaciones disponibles.
* La ausencia de habitaciones no debe provocar errores de ejecución.
* El resto de la homepage debe continuar funcionando correctamente.

---

## Observaciones

El endpoint gestiona correctamente el escenario de catálogo vacío devolviendo un array `rooms` sin elementos.

El defecto se encuentra en la gestión del estado vacío en la UI, ya que la aplicación no proporciona ningún feedback al usuario cuando no existen habitaciones disponibles.

La eliminación utilizada para preparar este escenario es temporal, por lo que las habitaciones pueden volver a aparecer automáticamente después de un determinado periodo de tiempo.

---

## Recomendación

Implementar un estado vacío para la sección de habitaciones cuando `GET /api/room` devuelva `rooms: []`, mostrando un mensaje claro al usuario, por ejemplo:

> **No hay habitaciones disponibles en este momento.**

---

## Evidencias

| #     | Tipo    | Descripción                                                                                                                                                                                           | Referencia                                                                                  |
| ----- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **1** | Captura | Validación en Postman de `GET /api/room` con **HTTP 200 OK** y respuesta `{"rooms":[]}`. En la sección **Tests/Scripts** se valida que la propiedad `rooms` existe, es un array y se encuentra vacío. | [Ver captura](../../evidence/SMB-1/SMB-13/SMB-134/rooms-empty-postman-validation.png)       |
| **2** | Captura | Panel administrativo `/admin/rooms` después de eliminar las habitaciones disponibles, mostrando que el catálogo administrativo se encuentra vacío.                                                    | [Ver captura](../../evidence/SMB-1/SMB-13/SMB-134/admin-rooms-empty-state.png)              |
| **3** | Captura | Sección Rooms de la homepage sin tarjetas de habitaciones y sin ningún mensaje informativo que explique al usuario que el catálogo está vacío.                                                        | [Ver captura](../../evidence/SMB-1/SMB-13/SMB-134/homepage-rooms-empty-without-message.png) |

---

## Environment

| Campo                 | Valor                                 |
| --------------------- | ------------------------------------- |
| **Dispositivo**       | Mac                                   |
| **Sistema operativo** | Tahoe 26.5.2                          |
| **Browser**           | Safari 26.5.2                         |
| **URL**               | `https://automationintesting.online/` |
| **Fecha**             | 19 / agosto / 2026                    |
| **Severidad**         | Low                                   |
| **Prioridad**         | Medium                                |