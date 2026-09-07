# SMB-155 — El formulario de contacto no muestra ningún mensaje cuando el servicio de envío devuelve un error

## Descripción

Cuando `POST /api/message` devuelve un error durante el envío del formulario de contacto, la aplicación evita completar el envío y la homepage continúa funcionando correctamente. Sin embargo, no muestra ningún mensaje al usuario indicando que la operación ha fallado.

Esto puede generar incertidumbre, ya que el usuario no sabe si el mensaje fue enviado, si debe volver a intentarlo o si existe un problema temporal con el servicio.

---

## Relación

| Elemento | Referencia |
|---|---|
| **Epic** | SMB-2 — Public Contact Form |
| **User Story** | SMB-14 — Envío de mensajes mediante el formulario de contacto |
| **Test Case** | SMB-154 / TC60 — Verificar comportamiento del formulario cuando el servicio de mensajes devuelve un error |

---

## Precondiciones

- La aplicación se encuentra disponible.
- La homepage y la sección **Contact** cargan correctamente.
- El formulario puede completarse utilizando datos válidos.
- Cypress permite interceptar la petición `POST /api/message`.
- El formulario funciona correctamente cuando el servicio responde de forma satisfactoria.

---

## Datos de prueba

Utilizar datos válidos en todos los campos del formulario.

Durante la ejecución se simula una respuesta de error del servicio:

```text
POST /api/message
→ HTTP 500 Internal Server Error
```

El objetivo es reproducir de forma controlada un fallo del backend durante el envío del formulario.

---

## Pasos para reproducir

1. Configurar una interceptación para la petición `POST /api/message`.
2. Configurar la respuesta simulada con `HTTP 500 Internal Server Error`.
3. Acceder a la homepage.
4. Desplazarse hasta la sección **Contact**.
5. Completar todos los campos del formulario utilizando datos válidos.
6. Enviar el formulario.
7. Esperar a que la aplicación procese la respuesta simulada.
8. Observar el comportamiento mostrado al usuario.
9. Continuar interactuando con la homepage después del fallo.

---

## Resultado actual

La aplicación gestiona correctamente el fallo desde el punto de vista de estabilidad:

- El formulario no se procesa como enviado.
- No se muestra ningún mensaje de confirmación de éxito.
- La homepage continúa funcionando correctamente.
- No se produce ningún error de ejecución que bloquee la interfaz.

Sin embargo, **no se muestra ningún mensaje de error, aviso o información al usuario indicando que el envío no pudo completarse**.

---

## Resultado esperado

- La petición de envío debe recibir correctamente la respuesta de error configurada.
- La aplicación no debe mostrar una confirmación indicando que el mensaje fue enviado.
- El formulario no debe comportarse como si la operación hubiera finalizado correctamente.
- El usuario debe recibir una indicación clara de que el mensaje no pudo enviarse.
- La interfaz debe continuar funcionando correctamente después del fallo.
- El error del servicio no debe provocar un crash ni bloquear la homepage.

---

## Observaciones

- La aplicación mantiene correctamente la estabilidad después del fallo del servicio.
- No se produce un crash ni se bloquea la navegación.
- No se muestra una confirmación falsa de envío.
- El defecto está específicamente relacionado con la **ausencia de feedback al usuario**.
- El comportamiento se reproduce de forma controlada simulando un `HTTP 500 Internal Server Error` en `POST /api/message`.
- El problema es diferente de **SMB-43 — Mensajes de error técnicos y poco amigables en los formularios**. En SMB-155 no existe ningún mensaje; en SMB-43 el problema está relacionado con la claridad de los mensajes que sí se muestran.

---

## Recomendación

Se recomienda mostrar un mensaje de error claro y orientado al usuario cuando el servicio no pueda completar el envío.

Por ejemplo:

> **No hemos podido enviar tu mensaje. Inténtalo de nuevo más tarde.**

El mensaje debería:

- indicar claramente que el envío no se completó;
- evitar mostrar información técnica del backend;
- permitir al usuario comprender que puede volver a intentarlo;
- mantener, cuando sea posible, los datos introducidos para evitar que el usuario tenga que completar nuevamente todo el formulario;
- diferenciar claramente un fallo de envío de una confirmación exitosa.

---

## Evidencias

Las evidencias siguientes corresponden al defecto **SMB-155 — El formulario de contacto no muestra ningún mensaje cuando el servicio de envío devuelve un error**, detectado durante la ejecución de **SMB-154 / TC60**.

| # | Tipo | Evidencia | Referencia |
|---|---|---|---|
| **1** | Vídeo | Ejecución del Test Case en Cypress UI. Se observa el formulario completado con datos válidos, el intento de envío, la ausencia de mensaje de éxito o error y que la homepage continúa funcionando correctamente después del fallo. | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1f1ifXHyn1ulbXXnDPhCBMK-ob46bnAub/view?usp=sharing) |
| **2** | Captura | Network/console durante la ejecución mostrando la petición `POST /api/message` con respuesta **HTTP 500 Internal Server Error**, confirmando que el escenario de fallo fue reproducido correctamente. | `docs/evidence/SMB-2/SMB-155/post-message-500-network.png` |

---

## Environment

| Campo | Valor |
| --- | --- |
| **Dispositivo** | Mac |
| **Sistema operativo** | Tahoe 26.5.2 |
| **Browser** | Chrome 151 |
| **Framework** | Cypress 15.21.1 |
| **Aplicación** | Restful-booker-platform demo / Shady Meadows B&B |
| **URL** | `https://automationintesting.online/` |
| **Fecha** | 27 / agosto / 2026 |
| **Severidad** | Medium |
| **Prioridad** | Medium |