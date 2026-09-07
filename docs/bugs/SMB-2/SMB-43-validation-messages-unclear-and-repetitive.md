# SMB-43 — Los mensajes de validación del formulario son poco claros, desordenados y repetitivos

## Descripción

Al intentar enviar el formulario de contacto con los campos obligatorios vacíos, la aplicación bloquea correctamente el envío, pero presenta los mensajes de validación de forma poco clara para el usuario.

Los mensajes no siguen el mismo orden visual que los campos del formulario y algunos campos muestran simultáneamente más de una validación, aunque el problema principal sea que el campo se encuentra vacío.

Además, parte del feedback utiliza expresiones poco naturales y poco orientadas al usuario, lo que dificulta identificar rápidamente qué información debe corregirse.

---

## Trazabilidad

| Elemento | Referencia |
| --- | --- |
| **Epic** | SMB-2 — Contact Form Submission |
| **User Story** | SMB-15 — Validaciones del formulario de contacto |
| **Acceptance Criteria** | AC-6 — Feedback de validación |
| **Test Case** | SMB-159 / TC64 — Verificar claridad de los mensajes de validación mostrados al usuario |
| **Resultado** | ❌ Failed |

---

## Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** es accesible.
- El formulario de contacto se encuentra operativo.

---

## Pasos para reproducir

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. Dejar todos los campos del formulario vacíos.
4. Hacer clic en **Submit**.
5. Observar los mensajes de validación mostrados.

---

## Resultado actual

El sistema impide correctamente el envío y no muestra ninguna confirmación de éxito.

Sin embargo, se muestran simultáneamente los siguientes mensajes:

```text
Phone must be between 11 and 21 characters.
Email may not be blank
Subject must be between 5 and 100 characters.
Message must be between 20 and 2000 characters.
Phone may not be blank
Name may not be blank
Subject may not be blank
Message may not be blank
```

El feedback presenta los siguientes problemas:

- Los mensajes no siguen el mismo orden que los campos del formulario.
- `Phone`, `Subject` y `Message` muestran simultáneamente una validación de campo obligatorio y otra relacionada con la longitud.
- Se muestran varios mensajes para un mismo campo aunque una única validación sería suficiente para indicar el problema principal.
- Expresiones como `may not be blank` resultan poco naturales y poco orientadas al usuario.
- La cantidad y disposición de mensajes dificulta identificar rápidamente qué información debe corregirse.

La homepage continúa funcionando correctamente y no se procesa ningún mensaje.

---

## Resultado esperado

- Los mensajes de validación deben presentarse de forma clara y fácil de relacionar con cada campo.
- El orden del feedback debería seguir la estructura visual del formulario.
- Cuando un campo está vacío, debería mostrarse únicamente la validación correspondiente a obligatoriedad.
- Las validaciones de longitud deberían aplicarse cuando el usuario haya introducido un valor.
- Los mensajes deben utilizar un lenguaje comprensible y orientado al usuario.
- No deben mostrarse mensajes repetitivos o innecesarios.
- El formulario debe continuar bloqueando el envío mientras existan errores de validación.

---

## Evidencias

| # | Tipo | Evidencia | Referencia |
| --- | --- | --- | --- |
| **1** | Captura | Formulario de contacto vacío mostrando simultáneamente los mensajes de validación, permitiendo observar su orden, repetición y presentación. | `docs/evidence/SMB-2/SMB-43/contact-empty-form-validation-messages.png` |

---

## Recomendación

Mostrar las validaciones junto al campo correspondiente y priorizar el mensaje más relevante según el estado del campo.

Por ejemplo, si `Phone` está vacío, debería mostrarse primero una indicación como:

> **Phone is required.**

La validación de longitud debería aplicarse únicamente cuando el usuario haya introducido un valor.

También sería recomendable utilizar mensajes más naturales y consistentes para facilitar que el usuario identifique rápidamente qué debe corregir.

---

## Environment

| Campo | Valor |
| --- | --- |
| **Dispositivo** | Mac |
| **Sistema operativo** | Tahoe 26.5.2 |
| **Browser** | Safari 26.5.2 |
| **Aplicación** | Restful-booker-platform demo / Shady Meadows B&B |
| **URL** | `https://automationintesting.online/` |
| **Fecha** | 3 / septiembre / 2026 |
| **Severidad** | Low |
| **Prioridad** | Medium |