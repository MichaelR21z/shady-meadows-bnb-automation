# SMB-10 — Información pública del hotel

## User Story

**Como usuario**, quiero consultar la información del hotel en la homepage para evaluar el B&B y decidir si reservar.

---

## Acceptance Criteria

### AC-1 — Visualización de la información del hotel

**Given** el usuario accede a la página principal de Shady Meadows
**When** la homepage termina de cargar
**Then** debe visualizar el nombre del hotel y su información descriptiva.

---

### AC-2 — Visualización de los datos de contacto

**Given** el usuario se encuentra en la homepage
**When** la información del hotel está cargada
**Then** debe visualizar los datos de contacto disponibles del hotel
**And** la información mostrada debe corresponder con los datos configurados para el hotel.

---

### AC-3 — Visualización de la identidad del hotel

**Given** el usuario se encuentra en la homepage
**When** la página termina de cargar
**Then** debe visualizar correctamente los elementos de identidad del hotel disponibles, como el nombre y las imágenes asociadas al contenido del hotel.

---

### AC-4 — Consistencia entre API y UI

**Given** la información pública del hotel está disponible mediante `GET /api/branding`
**When** el usuario accede a la homepage
**Then** la información mostrada en la interfaz debe coincidir con los datos proporcionados por la API.

---

### AC-5 — Acceso público

**Given** el usuario no dispone de una sesión autenticada
**When** accede a la homepage
**Then** debe poder visualizar la información pública del hotel sin necesidad de autenticarse.

---

## Trazabilidad

| Test ID     | Test Case                                                                                             | Cobertura                                        | Tipo                  | Resultado | Bug relacionado |
| ----------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------- | --------- | --------------- |
| **SMB-102** | **TC37** — Validar visualización de la información del hotel en la homepage                           | AC-1, AC-2, AC-3                                 | UI / Funcional        | ✅ Ok      | —               |
| **SMB-103** | **TC38** — Validar correspondencia entre `GET /api/branding` y la información mostrada en la homepage | AC-4                                             | API / Cross-check UI  | ✅ Ok      | —               |
| **SMB-104** | **TC39** — Validar acceso a la información de branding sin autenticación                              | AC-5                                             | API                   | ✅ Ok      | —               |
| **SMB-105** | **TC40** — Validar estructura y campos obligatorios de `GET /api/branding`                            | Soporte a AC-1, AC-2, AC-3 y AC-4                | API / Contract        | ✅ Ok      | —               |
| **SMB-106** | **TC41** — Validar comportamiento de la homepage cuando falta un objeto de `/api/branding`            | Robustez relacionada con AC-1, AC-2, AC-3 y AC-4 | Negative / Robustness | ❌ Fail    | **SMB-110**     |

---

# Test Cases

## SMB-102 — TC37 — Validar visualización de la información del hotel en la homepage

| Campo              | Valor                                                   |
| ------------------ | ------------------------------------------------------- |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Homepage`, `SMB-Smoke` |
| **Componente**     | `Homepage`                                              |
| **Tipo de prueba** | `Positive-tests`                                        |

### Objetivo

Verificar que la homepage muestra correctamente la información pública del hotel necesaria para que el usuario pueda conocer y evaluar el B&B.

### Precondiciones

* La aplicación se encuentra disponible.
* El usuario puede acceder a la homepage.
* No es necesario iniciar sesión.

### Pasos

1. Acceder a la homepage de Shady Meadows.
2. Esperar a que la página termine de cargar.
3. Visualizar la información mostrada.

### Resultado esperado

* La homepage se carga correctamente.
* Se muestra el nombre del hotel.
* Se muestra correctamente la imagen principal de la homepage.
* Se muestra la descripción del hotel.
* Se muestran los datos de contacto disponibles.
* Se muestra la dirección del hotel.
* Se muestra correctamente la información de ubicación o mapa cuando esté disponible.
* La información es legible y no presenta errores visibles.

### Resultado

**Ok**

### Nota

La correspondencia entre la información mostrada y los datos proporcionados por el backend se validará específicamente en **TC38**.

---

## SMB-103 — TC38 — Validar correspondencia entre `GET /api/branding` y la información mostrada en la homepage

| Campo              | Valor                                                                    |
| ------------------ | ------------------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Integration`, `SMB-Homepage` |
| **Componente**     | `API-Branding`                                                           |
| **Tipo de prueba** | `Integration-Tests`                                                      |

### Descripción

Este caso valida la **consistencia entre backend y frontend**, verificando que la información del hotel mostrada en la homepage coincide con los datos proporcionados por el endpoint público `GET /api/branding`.

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage es accesible.
* El endpoint `GET /api/branding` está disponible.

### Pasos

1. Acceder a la homepage de Shady Meadows.
2. Obtener la información del hotel mediante `GET /api/branding`.
3. Consultar la información del hotel mostrada en la homepage.
4. Comparar los datos obtenidos de la API con los mostrados en la interfaz.

### Resultado esperado

* `GET /api/branding` responde correctamente.
* La información del hotel obtenida del endpoint se refleja correctamente en la homepage.
* El nombre del hotel mostrado en la homepage coincide con el valor recibido en `name`.
* La imagen principal de la homepage corresponde a la ruta indicada en `logoUrl`.
* La descripción mostrada coincide con el valor recibido en `description`.
* Los datos de contacto mostrados coinciden con los valores recibidos en `contact`.
* La dirección mostrada coincide con los valores recibidos en `address`.
* La ubicación del mapa mostrado coincide con los valores recibidos en `map`.

### Resultado

**Ok**

---

## SMB-104 — TC39 — Validar acceso a la información de branding sin autenticación

| Campo              | Valor                                                            |
| ------------------ | ---------------------------------------------------------------- |
| **Etiquetas**      | `SMB-Automation`, `SMB-API`, `SMB-Authentication`, `SMB-Backend` |
| **Componente**     | `API-Branding`                                                   |
| **Tipo de prueba** | `Positive-tests`                                                 |

### Descripción

Verificar que la información pública del hotel puede consultarse mediante `GET /api/branding` sin necesidad de disponer de una sesión autenticada.

### Precondiciones

* La aplicación se encuentra disponible.
* No existe una sesión autenticada.
* No se dispone de un token válido de autenticación.

### Pasos

1. Acceder al endpoint `GET /api/branding`.
2. Realizar la petición sin incluir una cookie ni token de autenticación.
3. Revisar la respuesta recibida.

### Resultado esperado

* El endpoint permite realizar la consulta sin autenticación.
* La respuesta devuelve **HTTP 200 OK**.
* La respuesta contiene la información pública del hotel.
* La aplicación no solicita autenticación para acceder a estos datos.
* La respuesta mantiene una estructura válida.

### Resultado actual

**Ok**

---

## SMB-105 — TC40 — Validar estructura y campos obligatorios de `GET /api/branding`

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-API`, `SMB-Backend`, `SMB-Validation` |
| **Componente**     | `API-Branding`                                               |
| **Tipo de prueba** | `Functional`                                                 |

### Descripción

Verificar que `GET /api/branding` devuelve correctamente la estructura de datos necesaria para mostrar la información pública del hotel.

### Pasos

1. Realizar una petición `GET` al endpoint `/api/branding`.
2. Obtener la respuesta del servicio.
3. Revisar la estructura de la respuesta.
4. Revisar los datos incluidos en cada sección.

### Resultado esperado

* El endpoint responde con **HTTP 200 OK**.
* La respuesta tiene un formato JSON válido.
* Se encuentra la información principal del hotel.
* El objeto `address` contiene la información de dirección disponible.
* El objeto `contact` contiene los datos de contacto disponibles.
* El campo `description` contiene la descripción del hotel.
* El campo `directions` contiene información sobre cómo llegar al hotel.
* El campo `logoUrl` contiene la ruta del recurso utilizado como imagen principal.
* El objeto `map` contiene la información de ubicación cuando esté disponible.
* El campo `name` contiene el nombre del hotel.
* Los campos esperados presentan un tipo de dato válido.
* La respuesta no contiene errores ni una estructura incompleta que impida utilizar la información en la homepage.

### Resultado

**Ok**

---

## SMB-106 — TC41 — Validar comportamiento de la homepage cuando falta un objeto de `/api/branding`

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-API`, `SMB-Integration`, `SMB-Validation`, `SMB-Homepage` |
| **Componente**     | `API-Branding`                                               |
| **Tipo de prueba** | `Negative-Tests`                                                 |

### Descripción

Verificar que la homepage gestiona correctamente la ausencia de un objeto principal de información proporcionado por `GET /api/branding`, evitando errores de ejecución que impidan la carga de la página.

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage es accesible.
* La homepage realiza una petición `GET /api/branding` durante su carga.
* Se dispone de una respuesta válida de `GET /api/branding`.
* Cypress permite interceptar y modificar la respuesta del endpoint.

### Datos de prueba

Respuesta válida de `GET /api/branding`.

Se utilizarán tres variantes de la respuesta:

| Variante | Modificación                 |
| -------- | ---------------------------- |
| **1**    | Eliminar el objeto `address` |
| **2**    | Eliminar el objeto `contact` |
| **3**    | Eliminar el objeto `map`     |

### Pasos

1. Configurar una interceptación para la petición `GET /api/branding`.
2. Modificar la respuesta eliminando uno de los objetos definidos en los datos de prueba.
3. Acceder a la homepage.
4. Esperar a que la aplicación realice la petición `GET /api/branding`.
5. Observar el comportamiento de la homepage.
6. Repetir la prueba utilizando las demás variantes.

### Resultado esperado

* La homepage debe gestionar correctamente la ausencia del objeto.
* La ausencia del objeto no debe provocar un error de ejecución.
* La homepage debe continuar cargándose correctamente.
* La información disponible debe continuar mostrándose.
* La aplicación debe gestionar de forma controlada la información que no esté disponible.

### Resultado actual

Cuando se elimina completamente cualquiera de los siguientes objetos:

* `address`
* `contact`
* `map`

la aplicación genera un error de ejecución y la homepage deja de cargarse correctamente.

Se observa el error:

```text id="7d9a0s"
TypeError: Cannot read properties of undefined
```

y la interfaz muestra:

> **This page couldn’t load**

### Comportamiento adicional observado

Cuando el objeto se mantiene pero se eliminan todos o algunos de sus campos, la homepage continúa funcionando.

Por ejemplo:

```json id="31v2po"
{
  "map": {}
}
```

La página continúa cargándose.

Por tanto, el fallo se produce específicamente cuando **el objeto completo no está presente en la respuesta**.

### Bug relacionado

- **SMB-110 — La homepage falla cuando falta un objeto principal de `/api/branding`**
- Detectado durante la ejecución de **SMB-106 / TC41**.
- Documentación completa: `docs/bugs/SMB-1/SMB-110-missing-branding-object.md`