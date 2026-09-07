# SMB-14 — Envío de mensajes mediante el formulario de contacto

## User Story

**Como usuario**, quiero enviar un mensaje a través del formulario de contacto para consultar disponibilidad o resolver dudas.

---

## Acceptance Criteria

### AC-1 — Envío correcto del formulario

**Given** el usuario completa el formulario de contacto con datos válidos  
**When** envía el formulario  
**Then** el sistema debe aceptar la solicitud y procesar el mensaje correctamente.

---

### AC-2 — Confirmación del envío

**Given** el mensaje ha sido enviado correctamente  
**When** el sistema completa la operación  
**Then** debe mostrarse al usuario una confirmación indicando que el mensaje fue enviado correctamente.

**And** no debe mostrarse un estado de error.

---

### AC-3 — Persistencia del mensaje

**Given** el usuario ha enviado correctamente un mensaje  
**When** se consulta la información almacenada en el backend  
**Then** el mensaje debe encontrarse registrado en el sistema.

**And** los datos almacenados deben corresponder con los enviados desde el formulario.

---

### AC-4 — Gestión de errores durante el envío

**Given** el usuario completa el formulario con datos válidos  
**When** el servicio de mensajes no puede completar la operación  
**Then** la aplicación no debe informar al usuario de que el mensaje fue enviado correctamente.

**And** debe informar que la operación no pudo completarse.

**And** la página debe continuar funcionando sin producir un error de ejecución que bloquee la interfaz.

---

# Trazabilidad

| Test ID | Test Case | AC relacionado | Componente | Tipo de prueba | Resultado | Bug relacionado |
| --- | --- | --- | --- | --- | --- | --- |
| **SMB-151** | **TC58** — Verificar envío exitoso del formulario de contacto con datos válidos | AC-1, AC-2 | `Contact` | `Happy-path` | ✅ Passed | — |
| **SMB-152** | **TC59** — Verificar persistencia y correspondencia del mensaje enviado entre UI y backend | AC-3 | `Contact` | `Integration-Tests` | ✅ Passed | — |
| **SMB-154** | **TC60** — Verificar comportamiento del formulario cuando el servicio de mensajes devuelve un error | AC-4 | `Contact` | `Negative-Tests` | ❌ Failed | **SMB-155** |

---

# Test Cases

## SMB-151 — TC58 — Verificar envío exitoso del formulario de contacto con datos válidos

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Integration`|
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Happy-path` |
| **Resultado** | ✅ **Passed** |

### Descripción

Verificar que un usuario puede completar y enviar correctamente el formulario de contacto utilizando datos válidos y que la aplicación muestra una confirmación de envío exitoso.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** está disponible.
- El endpoint `POST /api/message` se encuentra disponible.

---

### Datos de prueba

Utilizar datos válidos y dinámicos para evitar reutilizar exactamente la misma información entre ejecuciones.

Ejemplo:

```text
Name: Michael QA
Email: qa.contact+{timestamp}@example.com
Phone: 61234567890
Subject: Contact test {timestamp}
Message: This is a valid contact message generated during the QA test execution.
```

El valor `{timestamp}` puede sustituirse por un identificador único generado durante la ejecución.

Los datos deben respetar las restricciones válidas conocidas del formulario.

---

### Pasos

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. Introducir un nombre válido.
4. Introducir un email válido.
5. Introducir un teléfono válido.
6. Introducir un asunto válido.
7. Introducir un mensaje válido.
8. Hacer clic en **Submit**.
9. Esperar a que la aplicación procese la solicitud.
10. Observar el estado mostrado después del envío.

---

### Resultado esperado

- El formulario debe aceptar los datos introducidos.
- Debe realizarse correctamente la solicitud de creación del mensaje.
- `POST /api/message` debe procesar el mensaje sin errores.
- No deben mostrarse errores de validación para los datos válidos.
- La aplicación debe mostrar una confirmación indicando que el mensaje se ha enviado correctamente.
- La homepage debe continuar funcionando correctamente después del envío.
- No debe producirse ningún error de ejecución que bloquee la interfaz.

---

### Resultado actual

El formulario acepta correctamente los datos válidos introducidos.

La petición `POST /api/message` se procesa sin errores y la aplicación muestra una confirmación indicando que el mensaje fue enviado correctamente.

No se muestran errores de validación y la homepage continúa funcionando normalmente después del envío.

---

## SMB-152 — TC59 — Verificar persistencia y correspondencia del mensaje enviado entre UI y backend

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Backend`, `SMB-Integration` |
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Integration-Tests` |
| **Resultado** | ✅ **Passed** |

### Descripción

Verificar que un mensaje enviado correctamente desde el formulario de contacto queda almacenado en el backend y que los datos recuperados corresponden con la información introducida por el usuario.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- El formulario de contacto está disponible.
- `POST /api/message` y `GET /api/message` se encuentran accesibles.
- El entorno permite consultar los mensajes almacenados.
- El mensaje utilizado para la prueba debe generarse con datos únicos.

---

### Datos de prueba

Generar datos únicos durante la ejecución.

Ejemplo:

```text
Name: Michael QA {timestamp}
Email: qa.contact+{timestamp}@example.com
Phone: 61234567890
Subject: Persistence test {timestamp}
Message: Contact persistence validation message {timestamp}
```

La identificación del mensaje debe realizarse utilizando varios campos del propio mensaje y no depender de:

- un `messageid` fijo;
- la posición del mensaje dentro de la respuesta;
- asumir que el último elemento del array corresponde a la prueba.

---

### Pasos

1. Generar datos únicos para el mensaje.
2. Acceder a la homepage.
3. Completar el formulario de contacto con los datos generados.
4. Enviar el formulario.
5. Esperar a que el envío finalice correctamente.
6. Realizar una petición `GET /api/message`.
7. Localizar en la respuesta el mensaje correspondiente a la ejecución utilizando datos disponibles como `name` y `subject`.
8. Obtener el `id` asignado al mensaje.
9. Realizar una petición `GET /api/message/{id}`.
10. Obtener el detalle completo del mensaje.
11. Comparar los datos recuperados con los introducidos originalmente en el formulario.

---

### Resultado esperado

- El mensaje enviado desde la UI debe aparecer en `GET /api/message`.
- El listado debe permitir identificar el mensaje y obtener su `id`.
- Al consultar `GET /api/message/{id}` deben recuperarse correctamente los detalles del mensaje.
- Los siguientes campos deben coincidir con los datos enviados:
  - `name`
  - `email`
  - `phone`
  - `subject`
  - `description`
- El mensaje recuperado debe corresponder con el `id` obtenido previamente.
- La validación no debe depender de un ID fijo ni de la posición del mensaje dentro del array.

---

### Resultado actual

El mensaje enviado desde la UI queda almacenado correctamente en el backend.

La consulta `GET /api/message` permite localizar el mensaje mediante los datos utilizados durante la ejecución y obtener el `id` asignado por el sistema.

Posteriormente, `GET /api/message/{id}` devuelve el detalle completo del mensaje.

Los valores recuperados para `name`, `email`, `phone`, `subject` y `description` corresponden con los datos introducidos originalmente en el formulario.

---

### Observaciones

- `GET /api/message` funciona como listado resumido de mensajes.
- `GET /api/message/{id}` devuelve el detalle completo del mensaje seleccionado.
- El `id` debe obtenerse dinámicamente durante la ejecución.
- No se deben utilizar IDs hardcodeados ni asumir que el último mensaje del array corresponde al Test Case.
- La combinación `name + subject` puede utilizarse para localizar el mensaje correspondiente a la ejecución.

---

## SMB-154 — TC60 — Verificar comportamiento del formulario cuando el servicio de mensajes devuelve un error

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Integration` |
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Negative-Tests` |
| **Resultado** | ❌ **Failed** |

### Descripción

Verificar que la aplicación gestiona correctamente un fallo del servicio de mensajes durante el envío del formulario, evitando mostrar una confirmación falsa y manteniendo la interfaz disponible para el usuario.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage y la sección **Send Us a Message** cargan correctamente.
- El formulario puede completarse con datos válidos.
- Cypress permite interceptar la petición `POST /api/message`.

---

### Datos de prueba

Utilizar datos válidos en todos los campos del formulario.

Durante la prueba se simula la siguiente respuesta:

```text
POST /api/message → HTTP 500 Internal Server Error
```

---

### Pasos

1. Configurar una interceptación sobre `POST /api/message`.
2. Configurar la respuesta simulada con `HTTP 500 Internal Server Error`.
3. Acceder a la homepage.
4. Desplazarse hasta la sección **Send Us a Message**.
5. Completar todos los campos con datos válidos.
6. Enviar el formulario.
7. Esperar a que la aplicación procese la respuesta simulada.
8. Observar el estado mostrado al usuario.
9. Continuar interactuando con la homepage después del fallo.

---

### Resultado esperado

- La petición de envío debe recibir la respuesta de error configurada.
- La aplicación no debe mostrar un mensaje indicando que el envío fue exitoso.
- El usuario debe recibir una indicación de que la operación no pudo completarse.
- La interfaz no debe bloquearse ni provocar un error de ejecución que inutilice la página.
- La homepage debe continuar accesible después del fallo.
- El formulario no debe comportarse como si el mensaje hubiese sido creado correctamente.

---

### Resultado actual

La aplicación gestiona correctamente el fallo del servicio en cuanto a estabilidad y procesamiento:

- el formulario no se procesa como enviado;
- no se muestra ningún mensaje de confirmación de éxito;
- la homepage continúa funcionando correctamente;
- no se produce ningún error de ejecución que bloquee la interfaz.

Sin embargo, **no se muestra ningún mensaje de error, aviso o información al usuario indicando que el envío no pudo completarse**.

---

### Observaciones

- La aplicación gestiona correctamente el fallo desde el punto de vista de estabilidad.
- No se produce un crash ni se bloquea la interfaz.
- No existe una confirmación falsa de envío.
- El defecto se encuentra específicamente en la ausencia de feedback al usuario.
- El comportamiento se reproduce al simular un error en `POST /api/message`.

---

### Bug relacionado

- **SMB-155 — El formulario de contacto no muestra ningún mensaje cuando el servicio de envío devuelve un error**
- Documentación: `docs/bugs/SMB-2/SMB-155-contact-form-no-error-feedback.md`