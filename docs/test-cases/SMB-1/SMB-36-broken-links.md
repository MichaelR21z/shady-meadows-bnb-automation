# SMB-36 — Detección de enlaces rotos o destinos inválidos

## User Story

**Como Ingeniero de QA**, quiero detectar enlaces rotos en las páginas públicas para garantizar que la navegación del sitio funcione correctamente y no existan enlaces muertos.

---

## Criterios de aceptación

### AC-1 — Los enlaces públicos deben disponer de un destino funcional

**Given** una página pública contiene elementos de navegación
**When** estos elementos se muestran al usuario
**Then** deben tener configurado un destino funcional.

**And** no deben utilizar valores como `href="#"` o un destino vacío cuando el elemento pretende dirigir a una página, sección o recurso concreto.

---

### AC-2 — Los enlaces internos deben apuntar a secciones existentes

**Given** un enlace interno utiliza un anchor para dirigir al usuario dentro de la página
**When** se selecciona dicho enlace
**Then** el identificador indicado en el anchor debe corresponder con una sección existente en el DOM.

**And** el usuario debe poder ser dirigido al contenido asociado a dicho enlace.

---

### AC-3 — No deben existir elementos de navegación con destinos inválidos

**Given** un elemento se presenta visualmente como enlace navegable
**When** su destino se evalúa
**Then** debe disponer de una referencia válida y alcanzable dentro del contexto de navegación previsto.

**And** no debe existir ningún enlace que aparente ser funcional pero no disponga de un destino real asociado.

---

# Trazabilidad

| Test ID     | Test Case                                                                                  | AC relacionado | Componentes                     | Tipo de prueba   | Resultado | Bugs relacionados       |
| ----------- | ------------------------------------------------------------------------------------------ | -------------- | ------------------------------- | ---------------- | --------- | ----------------------- |
| **SMB-139** | **TC56** — Verificar que los enlaces de las páginas públicas disponen de un destino válido | AC-1, AC-3     | `Footer`, `Homepage`, `Routing` | `Negative-Tests` | ❌ Failed  | **SMB-125**, **SMB-39** |
| **SMB-140** | **TC57** — Verificar que los enlaces internos y anchors apuntan a destinos existentes      | AC-2, AC-3     | `Header`, `Homepage`, `Routing` | `Negative-Tests` | ❌ Failed  | **SMB-119**             |

---

# Test Cases

## SMB-139 — TC56 — Verificar que los enlaces de las páginas públicas disponen de un destino válido

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-UI`, `SMB-Navegation`, `SMB-Validation`, `SMB-Homepage` |
| **Componentes**    | `Footer`, `Homepage`, `Routing`                              |
| **Tipo de prueba** | `Negative-Tests`                                             |
| **Resultado**      | ❌ **Failed**                                                 |

### Descripción

Verificar que los elementos de navegación disponibles en las páginas públicas tienen configurado un destino funcional y que no utilizan valores como `href="#"` cuando deberían dirigir al usuario a una sección, página o recurso externo.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* Los elementos de navegación públicos son visibles.
* El DOM puede inspeccionarse.

---

### Datos de prueba

Los enlaces se obtienen dinámicamente durante la ejecución.

Se deben incluir:

* Enlaces del header.
* Enlaces del footer.
* Enlaces internos de secciones.
* Otros elementos `<a>` disponibles en páginas públicas.

---

### Pasos

1. Acceder a la homepage.
2. Identificar los enlaces disponibles.
3. Obtener el atributo `href` de cada enlace.
4. Identificar los elementos que utilizan valores sin un destino funcional, como `href="#"` o un valor vacío.
5. Seleccionar los enlaces identificados.
6. Observar el comportamiento de navegación.
7. Repetir la comprobación para todos los elementos públicos disponibles.

---

### Resultado esperado

* Todos los elementos destinados a realizar navegación deben tener un destino funcional.
* No deben utilizarse valores como `href="#"` cuando el elemento pretende dirigir al usuario a otra sección, página o recurso.
* Los enlaces del footer deben llevar a las secciones correspondientes.
* Los iconos de redes sociales deben dirigir al destino configurado para la red social correspondiente.
* Ningún enlace debe aparentar ser funcional si no tiene un destino real asociado.

---

### Resultado actual

Durante la ejecución se identifican enlaces que utilizan:

```html
href="#"
```

Entre ellos:

* Los enlaces de **Quick Links** del footer.
* Los iconos de **Facebook, Instagram y Twitter**.

Como consecuencia, estos elementos no dirigen al usuario al destino que representan y generan un comportamiento equivalente a permanecer o desplazarse dentro de la homepage.

---

### Bugs relacionados

* **SMB-125 — Los enlaces de Quick Links del footer no redirigen a sus destinos correspondientes**

  * Documentación: `docs/bugs/SMB-1/SMB-125-footer-quick-links-invalid-targets.md`

* **SMB-39 — Los iconos de redes sociales del footer no redirigen a sus respectivas plataformas**

  * Documentación: `docs/bugs/SMB-1/SMB-39-social-media-links-invalid-targets.md`

---

## SMB-140 — TC57 — Verificar que los enlaces internos y anchors apuntan a destinos existentes

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-UI`, `SMB-Navegation`, `SMB-Validation`, `SMB-Homepage` |
| **Componentes**    | `Header`, `Homepage`, `Routing`                              |
| **Tipo de prueba** | `Negative-Tests`                                             |
| **Resultado**      | ❌ **Failed**                                                 |

### Descripción

Verificar que los enlaces internos que utilizan anchors apuntan a secciones realmente existentes dentro de la página y que el identificador indicado en el enlace corresponde con un elemento válido del DOM.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* Existen enlaces internos que utilizan anchors.
* Los elementos de destino pueden inspeccionarse en el DOM.

---

### Datos de prueba

Los anchors se obtienen dinámicamente de los enlaces internos.

Ejemplos:

```text
/#rooms
/#booking
/#location
/#contact
/#amenities
```

---

### Pasos

1. Acceder a la homepage.
2. Identificar los enlaces internos que utilizan anchors.
3. Obtener el identificador definido después de `#` en cada enlace.
4. Buscar en el DOM el elemento correspondiente a cada identificador.
5. Seleccionar el enlace.
6. Observar el comportamiento de navegación.
7. Repetir la comprobación para todos los anchors disponibles.

---

### Resultado esperado

* Cada anchor debe corresponder con un elemento existente en el DOM.
* El elemento de destino debe disponer del `id` indicado en el enlace.
* Al seleccionar el enlace, el usuario debe ser dirigido a la sección correspondiente.
* No deben existir anchors cuyo identificador no tenga un destino asociado.

---

### Resultado actual

Los enlaces internos **Rooms**, **Booking**, **Location** y **Contact** disponen de anchors válidos y dirigen correctamente a las secciones correspondientes de la homepage.

Sin embargo, el enlace **Amenities** apunta a:

```text
/#amenities
```

pero no existe ningún elemento en el DOM con:

```html
id="amenities"
```

Como consecuencia, **Amenities no dirige al usuario a una sección específica**, aunque el resto de los enlaces internos evaluados funciona correctamente.

El fallo se encuentra localizado en el enlace **Amenities** y no afecta al resto de los anchors evaluados.

---

### Bug relacionado

* **SMB-119 — El enlace "Amenities" del header no dirige a una sección existente de la homepage**
* Documentación: `docs/bugs/SMB-1/SMB-119-amenities-link-invalid-target.md`
