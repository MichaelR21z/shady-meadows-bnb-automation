# SMB-42 — El formulario de contacto acepta y almacena datos con formato inválido

## Descripción

El formulario de contacto permite enviar valores con formato inválido en campos que requieren una estructura específica.

Actualmente:

- **Email** acepta un formato de correo inválido.
- **Phone** acepta caracteres alfabéticos que no corresponden con un formato telefónico esperado.

La aplicación no bloquea el envío ni informa al usuario de que existen valores que requieren corrección.

Cuando estos valores son aceptados, la petición `POST /api/message` se procesa correctamente, devuelve `HTTP 200 OK` con `success: true` y el mensaje queda almacenado en el backend.

El mensaje puede recuperarse posteriormente mediante los endpoints de mensajes y consultarse desde el panel administrativo.

---

## Trazabilidad

| Elemento | Referencia |
| --- | --- |
| **Epic** | SMB-2 — Contact Form Submission |
| **User Story** | SMB-15 — Validaciones del formulario de contacto |
| **Acceptance Criteria** | AC-2, AC-3 |
| **Test Case** | SMB-157 / TC62 — Verificar validación de formato inválido en los campos del formulario de contacto |
| **Resultado** | ❌ Failed |

---

## Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** es accesible.
- El formulario de contacto se encuentra operativo.
- `POST /api/message` se encuentra disponible.
- `GET /api/message` y `GET /api/message/{id}` permiten consultar los mensajes almacenados.
- El panel `/admin/message` se encuentra disponible.

---

## Datos de prueba

Cada formato inválido se evalúa de forma independiente.

El resto de los campos se completa con información válida y dinámica para aislar únicamente el campo bajo prueba.

| Campo evaluado | Tipo HTML | Valor inválido |
| --- | --- | --- |
| **Email** | `type="email"` | `jh@h` |
| **Phone** | `type="tel"` | `asdfghjklñzxcvbnm` |

Ejemplo de datos válidos utilizados para completar el resto del formulario:

```text
Name: Michael QA {timestamp}
Email: qa.contact+{timestamp}@example.com
Phone: 61234567890
Subject: Invalid format test {timestamp}
Message: Invalid format test validation message {timestamp}
```

Durante cada ejecución se sustituye únicamente el campo que se desea validar por su valor inválido.

---

## Pasos para reproducir

### Escenario 1 — Email con formato inválido

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. Completar todos los campos con datos válidos.
4. Introducir `jh@h` en **Email**.
5. Hacer clic en **Submit**.
6. Observar el comportamiento del formulario.
7. Revisar la petición `POST /api/message`.
8. Verificar el código y contenido de la respuesta.
9. Consultar `GET /api/message`.
10. Localizar el mensaje utilizando los datos únicos de la ejecución.
11. Obtener dinámicamente su `id`.
12. Consultar `GET /api/message/{id}`.
13. Comprobar los datos almacenados.

### Escenario 2 — Phone con formato inválido

1. Acceder nuevamente a la homepage.
2. Completar todos los campos con datos válidos.
3. Introducir `asdfghjklñzxcvbnm` en **Phone**.
4. Hacer clic en **Submit**.
5. Observar el comportamiento del formulario.
6. Revisar la petición `POST /api/message`.
7. Verificar el código y contenido de la respuesta.
8. Consultar `GET /api/message`.
9. Localizar el mensaje correspondiente a la ejecución.
10. Obtener dinámicamente su `id`.
11. Consultar `GET /api/message/{id}`.
12. Comprobar los datos almacenados.

Opcionalmente, el mensaje puede verificarse también desde `/admin/message`.

---

## Resultado actual

### Email

El formulario acepta:

```text
jh@h
```

sin mostrar una validación que impida el envío.

La aplicación procesa el formulario y muestra una confirmación de envío exitoso.

La petición:

```http
POST {{baseUrl}}/api/message
```

responde:

```text
HTTP 200 OK
```

con:

```json
{
  "success": true
}
```

El mensaje queda almacenado en el backend y puede recuperarse posteriormente mediante la API.

### Phone

El formulario acepta:

```text
asdfghjklñzxcvbnm
```

a pesar de contener caracteres alfabéticos.

La aplicación procesa nuevamente el formulario como válido y muestra una confirmación de envío exitoso.

La petición:

```http
POST {{baseUrl}}/api/message
```

responde:

```text
HTTP 200 OK
```

con:

```json
{
  "success": true
}
```

El valor inválido queda almacenado en el backend y puede recuperarse posteriormente mediante la API.

### Persistencia

Después de cada envío puede consultarse:

```http
GET {{baseUrl}}/api/message
```

para localizar el mensaje mediante datos únicos como `name` y `subject` y obtener el `id` asignado durante esa ejecución.

Posteriormente:

```http
GET {{baseUrl}}/api/message/{id}
```

devuelve el contenido completo del mensaje y confirma que el valor inválido introducido en **Email** o **Phone** quedó almacenado.

Los identificadores utilizados en las evidencias corresponden únicamente a esas ejecuciones concretas. La prueba no depende de IDs hardcodeados.

La homepage continúa funcionando correctamente después de los envíos.

---

## Resultado esperado

- El formulario debe detectar el formato inválido del campo evaluado.
- **Email** debe rechazar valores que no cumplan con el formato de correo esperado.
- **Phone** debe rechazar valores que no cumplan con el formato telefónico permitido.
- El formulario no debe procesarse como un mensaje válido cuando exista un error de formato.
- No debe mostrarse una confirmación de envío exitoso.
- El usuario debe recibir información que permita identificar el campo que requiere corrección.
- No debe generarse una creación válida mediante `POST /api/message`.
- El mensaje con formato inválido no debe quedar almacenado en el backend.
- El mensaje no debe aparecer en `GET /api/message`.
- El mensaje no debe poder recuperarse mediante `GET /api/message/{id}`.
- La homepage debe continuar funcionando correctamente.

---

## Evidencias

| # | Tipo | Escenario | Evidencia | Referencia |
| --- | --- | --- | --- | --- |
| **1** | Vídeo | Email inválido | Ejecución de TC62 con `jh@h`. Se observa que el formulario acepta el valor, procesa el envío y muestra confirmación de éxito. | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1o4J5-dg9Oy8NcrqdEOErfpZDdYfXYKHe/view?usp=sharing) |
| **2** | Captura | Email inválido | `GET /api/message` permite localizar el mensaje correspondiente a la ejecución y obtener dinámicamente su `id`. | `docs/evidence/SMB-2/SMB-42/email-invalid-message-list.png` |
| **3** | Captura | Email inválido | `GET /api/message/{id}` confirma que el Email con formato inválido quedó almacenado en el backend. | `docs/evidence/SMB-2/SMB-42/email-invalid-message-persisted.png` |
| **4** | Vídeo | Phone inválido | Ejecución de TC62 con caracteres alfabéticos en Phone. Se observa que el formulario procesa el envío y muestra confirmación de éxito. | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1SeB4meiPqDlq47yma8mK90t2Pf2gP6sf/view?usp=sharing) |
| **5** | Captura | Phone inválido | `GET /api/message` permite localizar el mensaje correspondiente a la ejecución y obtener dinámicamente su `id`. | `docs/evidence/SMB-2/SMB-42/phone-invalid-message-list.png` |
| **6** | Captura | Phone inválido | `GET /api/message/{id}` confirma que el valor alfabético introducido en Phone quedó almacenado en el backend. | `docs/evidence/SMB-2/SMB-42/phone-invalid-message-persisted.png` |

---

## Recomendación

Implementar validaciones de formato tanto en frontend como en backend.

Para **Email**:

- validar que el valor cumpla con el formato de correo definido;
- impedir el envío mientras el formato sea inválido;
- mostrar un mensaje de validación asociado al campo.

Para **Phone**:

- definir claramente los caracteres y formatos telefónicos permitidos;
- rechazar valores que no cumplan la regla definida;
- mostrar al usuario una indicación clara cuando el formato sea inválido.

Las mismas reglas deben aplicarse en backend para evitar almacenar información inválida mediante llamadas directas a la API o eludiendo las validaciones de la interfaz.

---

## Automatización

El defecto se encuentra cubierto por **SMB-157 / TC62** mediante Cypress.

Los escenarios de **Email** y **Phone** se ejecutan de forma independiente.

La automatización:

- genera datos válidos y únicos para el formulario;
- sustituye únicamente el campo bajo evaluación;
- evita depender de IDs fijos;
- permite reproducir el defecto mientras SMB-42 permanezca abierto.

---

## Environment

| Campo | Valor |
| --- | --- |
| **Dispositivo** | Mac |
| **Sistema operativo** | Tahoe 26.5.2 |
| **Browser** | Safari 26.5.2 |
| **Aplicación** | Restful-booker-platform demo / Shady Meadows B&B |
| **URL** | `https://automationintesting.online/` |
| **Fecha** | 2 / septiembre / 2026 |
| **Severidad** | Medium |
| **Prioridad** | Medium |