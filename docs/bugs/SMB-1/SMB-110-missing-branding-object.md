# SMB-110 — La homepage falla cuando falta un objeto principal de `/api/branding`

## Descripción

La homepage genera un error de ejecución cuando la respuesta de `GET /api/branding` no contiene alguno de los objetos principales `address`, `contact` o `map`, impidiendo que la página se cargue correctamente.

---

## Relación

| Elemento       | Referencia                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------ |
| **Epic**       | SMB-1 — Public Homepage & Room Discovery                                                         |
| **User Story** | SMB-10 — Información pública del hotel                                                           |
| **Test Case**  | SMB-106 / TC41 — Validar comportamiento de la homepage cuando falta un objeto de `/api/branding` |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage es accesible.
* La homepage realiza una petición `GET /api/branding` durante su carga.
* Se dispone de una respuesta válida de `GET /api/branding`.
* Cypress permite interceptar y modificar la respuesta del endpoint.

---

## Datos de prueba

Respuesta válida de `GET /api/branding`.

Se utilizarán tres variantes de la respuesta:

| Variante | Modificación                 |
| -------- | ---------------------------- |
| **1**    | Eliminar el objeto `address` |
| **2**    | Eliminar el objeto `contact` |
| **3**    | Eliminar el objeto `map`     |

---

## Pasos para reproducir

1. Configurar una interceptación para la petición `GET /api/branding`.
2. Modificar la respuesta eliminando uno de los objetos definidos en los datos de prueba.
3. Acceder a la homepage.
4. Esperar a que la aplicación realice la petición `GET /api/branding`.
5. Observar el comportamiento de la homepage.
6. Repetir la prueba utilizando las demás variantes.

---

## Resultado actual

Cuando se elimina completamente cualquiera de los siguientes objetos:

* `address`
* `contact`
* `map`

la aplicación genera un error de ejecución y la homepage deja de cargarse correctamente.

Se observa el error:

```text
TypeError: Cannot read properties of undefined
```

y la interfaz muestra:

> **This page couldn’t load**

---

## Comportamiento adicional observado

Cuando el objeto se mantiene pero se eliminan todos o algunos de sus campos, la homepage continúa funcionando.

Por ejemplo:

```json
{
  "map": {}
}
```

La página continúa cargándose.

Por tanto, el fallo se produce específicamente cuando **el objeto completo no está presente en la respuesta**.

---

## Resultado esperado

* La homepage debe gestionar correctamente la ausencia del objeto.
* La ausencia del objeto no debe provocar un error de ejecución.
* La homepage debe continuar cargándose correctamente.
* La información disponible debe continuar mostrándose.
* La aplicación debe gestionar de forma controlada la información que no esté disponible.

---

## Observaciones

* El comportamiento se reproduce eliminando individualmente `address`, `contact` o `map`.
* El resto de la respuesta de `/api/branding` permanece sin modificaciones.
* Cuando el objeto existe pero sus campos están vacíos o ausentes, la homepage continúa funcionando.
* El fallo está relacionado específicamente con la ausencia completa del objeto.

---

## Recomendación

Se recomienda que el frontend valide la existencia de los objetos antes de acceder a sus propiedades.

La ausencia de un objeto no debería provocar una excepción de JavaScript que bloquee toda la homepage.

La aplicación debería gestionar el escenario de forma controlada, por ejemplo:

* Mostrar únicamente la información disponible.
* Omitir el componente asociado al objeto ausente.
* Mostrar un estado alternativo cuando corresponda.
* Evitar que el fallo de un bloque de información impida cargar el resto de la homepage.

También se recomienda definir con el equipo si `address`, `contact` y `map` son campos **obligatorios u opcionales** dentro del contrato de `GET /api/branding`.

---

## Evidencias

Las evidencias siguientes corresponden al defecto **SMB-110 — La homepage falla cuando falta un objeto principal de `/api/branding`**, detectado durante la ejecución de **SMB-106 / TC41**.

| #     | Tipo    | Evidencia                                                                                                                                                                                                | Referencia                                                                                                         |
| ----- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **1** | Vídeo   | Ejecución del test en Cypress eliminando completamente el objeto `map` de la respuesta de `GET /api/branding`. La modificación provoca un error de ejecución y la homepage muestra la pantalla de error. | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1iM10e4F4l-iWh69_0VtU9zc1I5kaW0mV/view)                |
| **2** | Vídeo   | Ejecución utilizando `"map": {}`. La homepage continúa funcionando cuando el objeto existe pero está vacío, demostrando que el defecto ocurre cuando el objeto completo está ausente.                    | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1zm3CSD1a-AnOroQ5H4M0MW7tUGOyDans/view?usp=share_link) |
| **3** | Captura | Error registrado en la consola: `TypeError: Cannot read properties of undefined`.                                                                                                                        | `[docs/evidence/SMB-1/console-error.png]`                                                                                             |
| **4** | Captura | Estado de la UI después del fallo, mostrando la pantalla **“This page couldn’t load”**.                                                                                                                  | `[docs/evidence/SMB-1/ui-error.png]`                                                                                             |
| **5** | Captura | Petición `GET /api/branding` respondiendo con **HTTP 200 OK** a pesar de que la respuesta modificada provoca el fallo de la aplicación.                                                                  | `[docs/evidence/SMB-1/branding-response-200.png]`                                                                                             |

### Evidencia 1 — Objeto `map` ausente

Durante la ejecución automatizada se intercepta la petición:

```http
GET /api/branding
```

y se elimina completamente el objeto `map` de la respuesta.

El flujo observado es:

```text
Homepage
   ↓
GET /api/branding
   ↓
Respuesta modificada sin el objeto map
   ↓
Error de ejecución
   ↓
This page couldn’t load
```

🎥 [Ver ejecución en Google Drive](https://drive.google.com/file/d/1iM10e4F4l-iWh69_0VtU9zc1I5kaW0mV/view)

---

### Evidencia 2 — Objeto `map` vacío

Se realiza una segunda ejecución manteniendo el objeto `map`, pero sin propiedades:

```json
{
  "map": {}
}
```

En este escenario la homepage continúa funcionando.

Esto permite comprobar que el defecto no se produce simplemente por la ausencia de datos dentro de `map`, sino específicamente cuando **el objeto completo no existe en la respuesta**.

🎥 [Ver ejecución en Google Drive](https://drive.google.com/file/d/1zm3CSD1a-AnOroQ5H4M0MW7tUGOyDans/view?usp=share_link)

---

### Evidencia 3 — Console

La consola registra el error:

```text
TypeError: Cannot read properties of undefined
```

📷 `[docs/evidence/SMB-1/console-error.png]`

---

### Evidencia 4 — UI

Después del error de ejecución, la homepage deja de cargarse correctamente y muestra:

> **This page couldn’t load**

📷 `[docs/evidence/SMB-1/ui-error.png]`

---

### Evidencia 5 — Network

La petición:

```http
GET /api/branding
```

responde con:

```text
HTTP 200 OK
```

aunque la respuesta modificada sin el objeto principal provoca posteriormente el error en el frontend.

📷 `[docs/evidence/SMB-1/branding-response-200.png]`


## Environment

| Campo           | Valor                                |
| --------------- | ------------------------------------ |
| **Dispositivo** | Mac                                  |
| **Browser**     | Electron                             |
| **URL**         | `https://automationintesting.online` |
| **Fecha**       | 16 / agosto / 2026                   |
| **Severidad**   | Crítica                              |
| **Prioridad**   | Alta                                 |
