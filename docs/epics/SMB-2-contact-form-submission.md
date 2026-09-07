# SMB-2 — Contact Form Submission

> **Epic:** Formulario público de contacto, envío de consultas, validación de datos y persistencia de mensajes.

Cubre el formulario de contacto utilizado por los visitantes para comunicarse con el hotel, incluyendo el envío de mensajes, las validaciones de los campos y la comprobación de que la información enviada queda registrada correctamente.

---

## Objetivo

Garantizar que los usuarios puedan enviar consultas mediante el formulario de contacto utilizando datos válidos, reciban feedback adecuado durante el proceso y que los mensajes enviados se registren correctamente en el sistema.

---

## Valor de negocio

El formulario de contacto constituye un canal directo de comunicación entre potenciales clientes y el hotel.

Su correcto funcionamiento permite recibir consultas de forma fiable, evitar la pérdida de oportunidades comerciales y proporcionar al usuario información clara cuando existen errores antes de realizar el envío.

---

## User Stories incluidas

| ID | User Story |
| --- | --- |
| **SMB-14** | Envío de mensajes mediante el formulario de contacto |
| **SMB-15** | Validaciones del formulario de contacto |

---

## Alcance

Incluye:

- envío del formulario con datos válidos;
- confirmación después de un envío exitoso;
- persistencia del mensaje en backend;
- correspondencia entre los datos enviados desde la UI y los almacenados;
- validación de campos obligatorios;
- validación de formato y tipo de datos;
- validación de límites de longitud;
- feedback mostrado ante errores de validación;
- comportamiento de la aplicación cuando el servicio de mensajes devuelve un error;
- comprobaciones mediante `POST /api/message`, `GET /api/message` y `GET /api/message/{id}` cuando el Test Case lo requiere.

Fuera de alcance:

- gestión administrativa de mensajes;
- respuesta del personal del hotel a las consultas;
- modificación o eliminación administrativa de mensajes;
- integración con servicios externos de correo electrónico o notificaciones.

---

## Estrategia de pruebas

La cobertura combina pruebas funcionales, negativas, de valores límite y de integración UI/API.

Se valida principalmente:

- envío correcto de mensajes;
- persistencia y correspondencia de datos entre UI y backend;
- campos obligatorios;
- formatos y tipos de datos inválidos;
- límites de `Phone`, `Subject` y `Message`;
- claridad de los mensajes de validación;
- comportamiento ante fallos del servicio de mensajes.

Los datos utilizados para comprobar persistencia se identifican dinámicamente para evitar depender de IDs fijos o de la posición de los mensajes dentro de las respuestas de la API.

---

## Trazabilidad

| User Story | Test Cases | Cobertura | Resultado |
| --- | --- | --- | --- |
| **SMB-14** | TC58, TC59, TC60 | Envío, confirmación, persistencia y error del servicio | 2 Passed / 1 Failed |
| **SMB-15** | TC61, TC62, TC63, TC64 | Obligatoriedad, formato, límites y feedback | 2 Passed / 2 Failed |

Documentación:

| User Story | Archivo |
| --- | --- |
| **SMB-14** | `docs/test-cases/SMB-2/SMB-14-contact-message-submission.md` |
| **SMB-15** | `docs/test-cases/SMB-2/SMB-15-contact-form-validation.md` |

---

## Automatización asociada

### Cypress

```text
cypress/e2e/public/homepage/
└── contact.cy.js
```

Actualmente se encuentra automatizado el escenario de gestión de errores del servicio:

| Test Case | Cobertura |
| --- | --- |
| **SMB-154 / TC60** | Simulación de `HTTP 500 Internal Server Error` sobre `POST /api/message` |

Los Test Cases restantes se incorporarán a la automatización conforme avance la cobertura de regresión del formulario.

---

## Bugs encontrados

| ID | Descripción | Test Case relacionado |
| --- | --- | --- |
| **SMB-155** | El formulario de contacto no muestra ningún mensaje cuando el servicio de envío devuelve un error | TC60 |
| **SMB-42** | El formulario de contacto acepta y almacena datos con formato inválido | TC62 |
| **SMB-43** | Los mensajes de validación del formulario son poco claros, desordenados y repetitivos | TC64 |

> Los bugs individuales se encuentran documentados en `docs/bugs/SMB-2/`.

Las evidencias asociadas se encuentran organizadas por identificador de bug en `docs/evidence/SMB-2/`.