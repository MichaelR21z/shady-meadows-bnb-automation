# SMB-15 — Validaciones del formulario de contacto

## User Story

**Como usuario**, quiero recibir validaciones claras cuando relleno el formulario de contacto para evitar errores y enviar la información correctamente.

---

## Acceptance Criteria

### AC-1 — Campos obligatorios

**Given** el usuario intenta enviar el formulario sin completar uno o más campos obligatorios  
**When** pulsa el botón de envío  
**Then** el sistema debe impedir el envío.

**And** debe indicar qué información obligatoria falta.

---

### AC-2 — Formato de email

**Given** el usuario introduce un email con formato inválido  
**When** intenta enviar el formulario  
**Then** el sistema debe impedir el envío.

**And** debe indicar que el email introducido no tiene un formato válido.

---

### AC-3 — Validación del teléfono

**Given** el usuario introduce un teléfono con un formato inválido o fuera de los límites permitidos  
**When** intenta enviar el formulario  
**Then** el sistema debe impedir el envío.

**And** el valor debe cumplir las restricciones de formato y longitud definidas para el campo.

Rango actualmente identificado:

`11–21 caracteres`

---

### AC-4 — Validación del asunto

**Given** el usuario introduce un asunto fuera de los límites permitidos  
**When** intenta enviar el formulario  
**Then** el sistema debe impedir el envío.

Rango actualmente identificado:

`5–100 caracteres`

---

### AC-5 — Validación del mensaje

**Given** el usuario introduce un mensaje fuera de los límites permitidos  
**When** intenta enviar el formulario  
**Then** el sistema debe impedir el envío.

Rango actualmente identificado:

`20–2000 caracteres`

---

### AC-6 — Feedback de validación

**Given** el formulario contiene información inválida  
**When** el sistema rechaza el envío  
**Then** debe proporcionar feedback que permita al usuario identificar qué información debe corregir.

**And** los mensajes no deberían exponer detalles técnicos internos de la aplicación.

---

# Trazabilidad

| Test ID | Test Case | AC relacionado | Componente | Tipo de prueba | Resultado | Bug relacionado |
| --- | --- | --- | --- | --- | --- | --- |
| **SMB-156** | **TC61** — Verificar validación de campos obligatorios del formulario de contacto | AC-1 | `Contact` | `Negative-Tests` | ✅ Passed | — |
| **SMB-157** | **TC62** — Verificar validación de formato inválido en los campos del formulario de contacto | AC-2, AC-3 | `Contact` | `Negative-Tests` | ❌ Failed | **SMB-42** |
| **SMB-158** | **TC63** — Verificar límites de longitud de los campos del formulario de contacto | AC-3, AC-4, AC-5 | `Contact` | `Edge-Cases` | ✅ Passed | — |
| **SMB-159** | **TC64** — Verificar claridad de los mensajes de validación mostrados al usuario | AC-6 | `Contact` | `Functional` | ❌ Failed | **SMB-43** |

---

# Test Cases

## SMB-156 — TC61 — Verificar validación de campos obligatorios del formulario de contacto

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-Validation`, `SMB-Homepage` |
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Negative-Tests` |
| **Resultado** | ✅ **Passed** |

### Descripción

Verificar que el formulario de contacto impide el envío cuando uno o más campos obligatorios se encuentran vacíos y que la aplicación informa al usuario qué información debe completar antes de continuar.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** es accesible.
- El formulario de contacto se encuentra operativo.
- El botón **Submit** se encuentra disponible.

---

### Datos de prueba

Mantener vacíos los campos obligatorios del formulario:

| Campo | Valor |
| --- | --- |
| **Name** | Vacío |
| **Email** | Vacío |
| **Phone** | Vacío |
| **Subject** | Vacío |
| **Message** | Vacío |

---

### Pasos

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. No introducir información en ninguno de los campos del formulario.
4. Hacer clic en **Submit**.
5. Observar las validaciones mostradas por el formulario.
6. Verificar que no se muestra una confirmación de envío exitoso.
7. Comprobar que el formulario no se procesa como un mensaje válido.
8. Verificar que la homepage continúa funcionando correctamente.

---

### Resultado esperado

- El formulario debe impedir el envío mientras existan campos obligatorios sin completar.
- Debe indicarse qué campos requieren información.
- No debe mostrarse una confirmación de envío exitoso.
- El formulario no debe procesarse como un mensaje válido.
- La homepage debe continuar funcionando correctamente.

---

### Resultado actual

Al intentar enviar el formulario con todos los campos vacíos, el sistema impide el envío y no muestra ninguna confirmación de éxito.

Se muestran los siguientes mensajes de validación:

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

Los mensajes `may not be blank` permiten identificar los campos obligatorios que no han sido completados.

La homepage continúa funcionando correctamente y el formulario no se procesa como un mensaje válido.

---

### Observaciones

- El sistema impide correctamente el envío con los campos obligatorios vacíos.
- Los mensajes permiten identificar los campos que requieren información.
- Algunos campos vacíos muestran más de un mensaje de validación al mismo tiempo: además de indicar que son obligatorios, también se muestra una validación relacionada con su longitud.
- La claridad y presentación de estos mensajes se evalúan específicamente en **SMB-159 / TC64**.

---

## SMB-157 — TC62 — Verificar validación de formato inválido en los campos del formulario de contacto

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Validation`, `SMB-Backend`, `SMB-Integration` |
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Negative-Tests` |
| **Resultado** | ❌ **Failed** |

### Descripción

Verificar que el formulario de contacto rechaza valores con un formato claramente inválido en los campos que requieren una estructura específica y evita procesar el mensaje como válido cuando la información introducida no cumple con el formato esperado.

---

### Técnica de diseño

**Partición de equivalencia**

Se definen clases de equivalencia válidas e inválidas para los campos cuyo formato puede evaluarse claramente desde la interfaz.

Para esta prueba se seleccionan valores representativos de las particiones inválidas de:

- **Email**
- **Phone**

El resto de los campos se completan con datos válidos y dinámicos para aislar únicamente el campo bajo prueba.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** es accesible.
- El formulario de contacto se encuentra operativo.
- El endpoint `POST /api/message` se encuentra disponible.

---

### Datos de prueba

| Campo | Tipo HTML | Partición inválida | Valor |
| --- | --- | --- | --- |
| **Email** | `type="email"` | Formato de email inválido | `jh@h` |
| **Phone** | `type="tel"` | Caracteres alfabéticos en un campo telefónico | `asdfghjklñzxcvbnm` |

Para cada ejecución, el resto de los campos debe contener datos válidos y únicos.

Ejemplo:

```text
Name: Michael QA {timestamp}
Subject: Invalid format test {timestamp}
Message: Invalid format test validation message {timestamp}
```

---

### Pasos

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. Generar datos válidos y únicos para el formulario.
4. Sustituir únicamente el campo evaluado por el valor inválido correspondiente.
5. Completar el formulario.
6. Hacer clic en **Submit**.
7. Observar las validaciones mostradas por la aplicación.
8. Verificar si se genera la petición `POST /api/message`.
9. Comprobar que no se muestra una confirmación de envío exitoso.
10. Repetir la prueba para cada partición inválida definida.
11. Verificar que la homepage continúa funcionando correctamente.

---

### Resultado esperado

- El formulario debe detectar el formato inválido del campo evaluado.
- El formulario no debe procesarse como un mensaje válido.
- No debe mostrarse una confirmación de envío exitoso.
- El sistema debe indicar al usuario que el dato introducido requiere corrección.
- No debe generarse una creación válida mediante `POST /api/message`.
- El resto de los campos válidos no debe afectar a la validación del campo bajo prueba.
- La homepage debe continuar funcionando correctamente.

---

### Resultado actual

La aplicación no valida correctamente los formatos evaluados.

#### Email

El formulario acepta:

```text
jh@h
```

y permite continuar con el envío.

#### Phone

El formulario acepta:

```text
asdfghjklñzxcvbnm
```

a pesar de contener caracteres alfabéticos.

En ambos escenarios:

- se ejecuta `POST /api/message`;
- el servicio responde `HTTP 200 OK`;
- la respuesta contiene `success: true`;
- la aplicación muestra una confirmación de envío exitoso;
- el mensaje queda almacenado en el backend.

Por tanto, el comportamiento actual no cumple con el resultado esperado.

---

### Observaciones

- El campo **Email** utiliza `type="email"`, pero la aplicación acepta el valor `jh@h`.
- El campo **Phone** utiliza `type="tel"`, pero permite caracteres alfabéticos sin mostrar validación.
- `Name`, `Subject` y `Message` no forman parte de esta prueba de formato porque sus controles manejan contenido textual y no existe una regla conocida que prohíba valores numéricos por sí solos.
- Las restricciones de longitud mínima y máxima se validan en **SMB-158 / TC63**.
- Los escenarios de Email y Phone se ejecutan de forma independiente para aislar el campo bajo prueba.
- La automatización utiliza datos válidos y dinámicos para el resto del formulario.

---

### Bug relacionado

- **SMB-42 — El formulario de contacto acepta y almacena datos con formato inválido**
- Documentación: `docs/bugs/SMB-2/SMB-42-contact-form-accepts-invalid-data.md`

---

## SMB-158 — TC63 — Verificar límites de longitud de los campos del formulario de contacto

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-Validation`, `SMB-Homepage` |
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Edge-Cases` |
| **Resultado** | ✅ **Passed** |

### Descripción

Verificar que el formulario de contacto aplica correctamente los límites mínimos y máximos de longitud definidos para los campos **Phone**, **Subject** y **Message**, aceptando los valores dentro del rango permitido y rechazando aquellos que se encuentran fuera de los límites establecidos.

---

### Técnica de diseño

**Análisis de valores límite**

Se prueban valores inmediatamente inferiores, iguales e inmediatamente superiores a los límites mínimo y máximo definidos para cada campo.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** es accesible.
- El formulario de contacto se encuentra operativo.
- El resto de los campos se completan con datos válidos durante cada escenario.
- Los valores utilizados en el campo bajo prueba cumplen las demás restricciones conocidas.

---

### Límites conocidos

| Campo | Mínimo | Máximo |
| --- | ---: | ---: |
| **Phone** | 11 caracteres | 21 caracteres |
| **Subject** | 5 caracteres | 100 caracteres |
| **Message** | 20 caracteres | 2000 caracteres |

No se han identificado restricciones explícitas de longitud para **Name** y **Email**, por lo que no forman parte de este Test Case.

---

### Datos de prueba

#### Escenario A — Phone

| Longitud | Resultado esperado |
| ---: | --- |
| **10** | Rechazado |
| **11** | Aceptado |
| **21** | Aceptado |
| **22** | Rechazado |

#### Escenario B — Subject

| Longitud | Resultado esperado |
| ---: | --- |
| **4** | Rechazado |
| **5** | Aceptado |
| **100** | Aceptado |
| **101** | Rechazado |

#### Escenario C — Message

| Longitud | Resultado esperado |
| ---: | --- |
| **19** | Rechazado |
| **20** | Aceptado |
| **2000** | Aceptado |
| **2001** | Rechazado |

---

### Pasos

Ejecutar los siguientes pasos para cada valor definido en los escenarios anteriores:

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. Completar todos los campos con datos válidos.
4. Sustituir únicamente el campo bajo prueba por un valor con la longitud correspondiente al escenario.
5. Hacer clic en **Submit**.
6. Observar si el formulario acepta o rechaza el valor.
7. Verificar si se muestra una validación asociada al campo.
8. Comprobar si el formulario se procesa como enviado.
9. Repetir el flujo con el siguiente valor límite.

---

### Resultado esperado

Para valores inferiores al mínimo o superiores al máximo:

- el sistema debe impedir el envío;
- debe mostrarse una validación asociada al campo;
- no debe mostrarse una confirmación de éxito;
- el formulario no debe procesarse como un mensaje válido.

Para valores iguales al mínimo o máximo permitido:

- el campo debe considerarse válido;
- no debe mostrarse un error relacionado con su longitud;
- el formulario debe poder procesarse correctamente siempre que el resto de los datos sean válidos.

---

### Resultado actual

Los límites identificados para **Phone**, **Subject** y **Message** se aplican correctamente.

Los valores inmediatamente inferiores o superiores a los rangos permitidos son rechazados, mientras que los valores iguales a los límites mínimo y máximo son aceptados.

El comportamiento observado coincide con los rangos definidos para los tres campos.

---

### Observaciones

- Este Test Case valida únicamente restricciones de longitud.
- `Name` y `Email` no se incluyen porque no se han identificado límites explícitos de longitud para esos campos.
- La validación de formato se cubre en **SMB-157 / TC62**.
- Cada campo se ejecuta como un escenario independiente dentro del mismo Test Case para evitar duplicar casos con el mismo objetivo y técnica de diseño.

---

## SMB-159 — TC64 — Verificar claridad de los mensajes de validación mostrados al usuario

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-UI`, `SMB-Validation`, `SMB-Homepage` |
| **Componentes** | `Contact` |
| **Tipo de prueba** | `Functional` |
| **Resultado** | ❌ **Failed** |

### Descripción

Verificar que los mensajes de validación mostrados por el formulario de contacto sean claros, comprensibles y permitan al usuario identificar qué información debe corregir antes de realizar el envío.

También se valida que el feedback se presente de forma coherente y no muestre información innecesaria o poco orientada al usuario.

---

### Precondiciones

- La aplicación se encuentra disponible.
- La homepage carga correctamente.
- La sección **Send Us a Message** es accesible.
- El formulario de contacto se encuentra operativo.

---

### Datos de prueba

Dejar vacíos los campos del formulario para provocar las validaciones asociadas a obligatoriedad y longitud:

| Campo | Valor |
| --- | --- |
| **Name** | Vacío |
| **Email** | Vacío |
| **Phone** | Vacío |
| **Subject** | Vacío |
| **Message** | Vacío |

---

### Pasos

1. Acceder a la homepage.
2. Desplazarse hasta la sección **Send Us a Message**.
3. Dejar todos los campos del formulario vacíos.
4. Hacer clic en **Submit**.
5. Observar los mensajes mostrados al usuario.
6. Verificar si los mensajes permiten identificar el campo afectado.
7. Comprobar si aparecen varios mensajes para un mismo campo.
8. Verificar si los mensajes siguen un orden comprensible respecto a los campos del formulario.
9. Comprobar que la homepage continúa funcionando correctamente.

---

### Resultado esperado

- Los mensajes deben permitir identificar claramente el campo que contiene el problema.
- El usuario debe poder entender qué información debe corregir.
- El feedback debería seguir un orden coherente con los campos del formulario.
- Cuando un campo está vacío, debería mostrarse la validación correspondiente a obligatoriedad antes de evaluar otras restricciones.
- No deberían mostrarse varios mensajes innecesarios para comunicar el mismo problema.
- Los mensajes deben utilizar un lenguaje comprensible y orientado al usuario.
- La aplicación debe continuar funcionando correctamente mientras muestra las validaciones.

---

### Resultado actual

Al intentar enviar el formulario con todos los campos vacíos, el sistema impide correctamente el envío y no muestra ninguna confirmación de éxito.

Se muestran simultáneamente los siguientes mensajes:

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

El feedback presenta varios problemas de claridad:

- los mensajes no siguen el mismo orden que los campos del formulario;
- `Phone`, `Subject` y `Message` muestran simultáneamente una validación de campo obligatorio y otra relacionada con la longitud;
- se muestran varios mensajes para un mismo campo aunque una única indicación sería suficiente para comunicar el problema principal;
- expresiones como `may not be blank` resultan poco naturales y poco orientadas al usuario;
- la cantidad y disposición de los mensajes dificulta identificar rápidamente qué información debe corregirse.

La homepage continúa funcionando correctamente y no se procesa ningún mensaje.

---

### Observaciones

- El formulario bloquea correctamente el envío.
- No se muestra ninguna confirmación de éxito.
- El defecto se encuentra específicamente en la presentación y claridad del feedback.
- Las reglas funcionales de obligatoriedad se validan independientemente en **SMB-156 / TC61**.

---

### Bug relacionado

- **SMB-43 — Los mensajes de validación del formulario son poco claros, desordenados y repetitivos**
- Documentación: `docs/bugs/SMB-2/SMB-43-validation-messages-unclear-and-repetitive.md`