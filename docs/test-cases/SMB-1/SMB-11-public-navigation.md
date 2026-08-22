# SMB-11 — Navegación entre las secciones públicas

## User Story

**Como usuario**, quiero navegar fácilmente entre las secciones del sitio para moverme por el sitio de forma intuitiva.

---

## Acceptance Criteria

### AC-1 — Navegación mediante el menú principal

**Given** el usuario se encuentra en la homepage
**When** selecciona una opción disponible del menú de navegación
**Then** debe ser dirigido a la sección correspondiente.

---

### AC-2 — Navegación mediante enlaces internos

**Given** el usuario se encuentra en una sección pública del sitio
**When** selecciona un enlace que dirige a otra sección pública
**Then** debe acceder correctamente a la sección correspondiente.

---

### AC-3 — Navegación hacia la homepage

**Given** el usuario se encuentra en una sección diferente de la homepage
**When** selecciona el enlace o elemento que permite volver al inicio
**Then** debe regresar correctamente a la homepage.

---

### AC-4 — Mantener la navegación dentro del ámbito público

**Given** el usuario no tiene una sesión autenticada
**When** navega entre las diferentes secciones públicas
**Then** debe poder acceder a ellas sin necesidad de autenticarse.

---

### AC-5 — Rutas inexistentes

**Given** el usuario introduce una URL que no corresponde a una sección existente
**When** intenta acceder a dicha URL
**Then** la aplicación debe mostrar una respuesta controlada para una ruta inexistente
**And** no debe producir errores de ejecución que bloqueen la aplicación.

---

### AC-6 — Navegación en diferentes tamaños de pantalla

**Given** el usuario accede al sitio desde un dispositivo con un tamaño de pantalla diferente
**When** utiliza los controles de navegación disponibles
**Then** debe poder acceder a las secciones públicas sin que los elementos de navegación queden inaccesibles o inutilizables.

---

# Trazabilidad

| Test ID     | Test Case                                                                    | AC relacionado   | Componente           | Tipo de prueba   | Resultado | Bug relacionado          |
| ----------- | ---------------------------------------------------------------------------- | ---------------- | -------------------- | ---------------- | --------- | ------------------------ |
| **SMB-111** | **TC42** — Verificar navegación mediante los enlaces del header              | AC-1, AC-4       | `Header`             | `Functional`     | ❌ Failed  | **SMB-119**              |
| **SMB-112** | **TC43** — Verificar visibilidad de las secciones al navegar desde el header | AC-1, AC-2       | `Header`             | `Functional`     | ❌ Failed  | **SMB-120**              |
| **SMB-113** | **TC44** — Verificar comportamiento al acceder a una ruta inexistente        | AC-5             | `Routing`            | `Negative-Tests` | ❌ Failed  | **SMB-121**              |
| —           | **TC45** — Verificar navegación responsive en diferentes tamaños de pantalla | AC-6             | `Header`, `Homepage` | `Functional`     | ❌ Failed  | **SMB-122**, **SMB-123** |
| **SMB-124** | **TC46** — Verificar navegación mediante los enlaces del footer              | AC-2, AC-3, AC-4 | `Footer`             | `Functional`     | ❌ Failed  | **SMB-125**              |

> **Nota:** TC45 se mantiene sin identificador SMB porque no se ha proporcionado uno.

---

# Test Cases

## SMB-111 — TC42 — Verificar navegación mediante los enlaces del header

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Navegation`, `SMB-Homepage` |
| **Componentes**    | `Header`                                                     |
| **Tipo de prueba** | `Functional`                                                 |
| **Resultado**      | ❌ **Failed**                                                 |

### Descripción

Verificar que los enlaces disponibles en el header dirigen al usuario a la sección o página correspondiente dentro de la aplicación.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El header está visible.

---

### Datos de prueba

| Enlace        | Destino esperado |
| ------------- | ---------------- |
| **Rooms**     | `/#rooms`        |
| **Booking**   | `/#booking`      |
| **Amenities** | `/#amenities`    |
| **Location**  | `/#location`     |
| **Contact**   | `/#contact`      |
| **Admin**     | `/admin`         |

> Los destinos se validan según los enlaces actualmente presentes en el header.

---

### Pasos

1. Acceder a la homepage.
2. Seleccionar **Rooms** desde el header.
3. Volver a la homepage.
4. Seleccionar **Booking** desde el header.
5. Volver a la homepage.
6. Seleccionar **Amenities** desde el header.
7. Volver a la homepage.
8. Seleccionar **Location** desde el header.
9. Volver a la homepage.
10. Seleccionar **Contact** desde el header.
11. Volver a la homepage.
12. Seleccionar **Admin** desde el header.

---

### Resultado esperado

* **Rooms** debe dirigir a la sección de habitaciones de la homepage.
* **Booking** debe dirigir a la sección de reservas de la homepage.
* **Amenities** debe dirigir a la sección de servicios correspondiente.
* **Location** debe dirigir a la sección de ubicación de la homepage.
* **Contact** debe dirigir a la sección de contacto de la homepage.
* **Admin** debe dirigir correctamente a la página de inicio de sesión del panel administrativo.
* Cada enlace debe responder a la acción del usuario sin producir errores de navegación.

---

### Resultado actual

Los enlaces **Rooms, Booking, Location, Contact y Admin** funcionan correctamente y dirigen al destino correspondiente.

El enlace **Amenities** no dirige a ninguna sección específica de la homepage.

El enlace utiliza:

```html
<a class="nav-link" href="/#amenities">Amenities</a>
```

pero no existe actualmente ningún elemento en el DOM con:

```text
id="amenities"
```

Como consecuencia, al seleccionar **Amenities**, la navegación no posiciona al usuario en una sección específica relacionada con el enlace.

---

### Bug relacionado

* **SMB-119 — El enlace "Amenities" del header no dirige a una sección existente de la homepage**
* Documentación: `docs/bugs/SMB-1/SMB-119-amenities-link-invalid-target.md`

---

## SMB-112 — TC43 — Verificar visibilidad de las secciones al navegar desde el header

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Navegation`, `SMB-Homepage` |
| **Componentes**    | `Header`, `Homepage`                                         |
| **Tipo de prueba** | `Functional`                                                 |
| **Resultado**      | ❌ **Failed**                                                 |

### Descripción

Verificar que las secciones de la homepage quedan correctamente posicionadas y completamente visibles cuando el usuario accede a ellas mediante los enlaces del header.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El header está visible.

---

### Datos de prueba

Enlaces del header que dirigen a secciones de la homepage:

* **Rooms**
* **Booking**
* **Amenities**
* **Location**
* **Contact**

> El enlace **Admin** queda fuera de esta prueba porque dirige a una página independiente.

---

### Pasos

1. Acceder a la homepage.
2. Seleccionar una sección disponible mediante su enlace en el header.
3. Esperar a que la navegación hacia la sección termine.
4. Observar la posición final de la sección.
5. Comprobar que el contenido principal de la sección es visible y accesible.
6. Regresar a la homepage.
7. Repetir los pasos anteriores con las demás secciones disponibles.

---

### Resultado esperado

* Cada sección debe quedar correctamente posicionada después de la navegación.
* El contenido principal de la sección debe ser completamente visible.
* El header no debe ocultar información relevante de la sección.
* Los elementos interactivos de la sección deben permanecer accesibles.
* El usuario debe poder visualizar e interactuar con el contenido sin realizar desplazamientos adicionales para descubrir elementos que deberían estar visibles al llegar al destino.

---

### Resultado actual

* Las secciones quedan correctamente posicionadas para estar accesibles, pero se observa que **Booking no queda completamente visible al llegar a su destino**.
* El header se superpone sobre parte de la sección y oculta los campos **Check In** y **Check Out**, mientras que el botón **Check Availability** permanece visible.

---

### Observaciones

* El problema observado no corresponde a un fallo del enlace `Booking`, ya que la navegación hacia `#booking` se realiza correctamente.
* El problema está relacionado con la **posición de la sección después de la navegación mediante un anchor**, debido a que el header ocupa parte del área visible.

---

### Bug relacionado

* **SMB-120 — La sección Booking queda parcialmente oculta por el header al navegar mediante el enlace de Booking**
* Documentación: `docs/bugs/SMB-1/SMB-120-booking-section-hidden-by-header.md`

---

## SMB-113 — TC44 — Verificar comportamiento al acceder a una ruta inexistente

| Campo              | Valor                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Navegation`, `SMB-Validation`, `SMB-Homepage` |
| **Componentes**    | `Routing`                                                                      |
| **Tipo de prueba** | `Negative-Tests`                                                               |
| **Resultado**      | ❌ **Failed**                                                                   |

### Descripción

Verificar que la aplicación gestiona correctamente el acceso a una URL que no corresponde a ninguna ruta disponible, sin provocar errores de ejecución ni dejar al usuario en un estado no controlado.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage es accesible.

---

### Datos de prueba

Ruta inexistente:

```text
/non-existent-route
```

---

### Pasos

1. Acceder a la homepage.
2. Introducir una URL correspondiente a una ruta inexistente.
3. Acceder a la URL.
4. Esperar a que finalice la carga.
5. Verificar que se muestra la página de error 404.
6. Verificar las opciones de navegación disponibles en la página 404.
7. Intentar regresar a la homepage utilizando las opciones disponibles.

---

### Resultado esperado

* La aplicación debe gestionar la ruta inexistente de forma controlada.
* Debe mostrarse una página o mensaje indicando que el recurso solicitado no existe.
* La aplicación no debe mostrar errores de ejecución que bloqueen la interfaz.
* El usuario debe poder regresar a una sección válida del sitio.
* La navegación de la aplicación debe continuar funcionando después de acceder a la ruta inexistente.

---

### Resultado actual

Al acceder a una ruta inexistente, la aplicación muestra:

> **404 | This page could not be found.**

La página aparece completamente en negro y **no proporciona ninguna opción de navegación para volver a la homepage**.

Para regresar al sitio, el usuario debe utilizar el botón **Atrás** del navegador.

Además, en la consola se registra:

```text
Failed to load resource: the server responded with a status of 404 ()
```

---

### Observación

El código de respuesta HTTP `404` es correcto para una ruta inexistente.

El problema identificado corresponde a la experiencia de usuario de la página 404, que no proporciona opciones de navegación internas para continuar utilizando la aplicación.

---

### Bug relacionado

* **SMB-121 — La página 404 muestra una pantalla técnica sin opciones de navegación**
* Documentación: `docs/bugs/SMB-1/SMB-121-404-page-without-navigation.md`

---

## TC45 — Verificar navegación responsive en diferentes tamaños de pantalla

| Campo | Valor |
| --- | --- |
| **Etiquetas** | `SMB-Automation`, `SMB-UI`, `SMB-Navegation`, `SMB-Responsive`, `SMB-Homepage` |
| **Componentes** | `Header`, `Homepage` |
| **Tipo de prueba** | `Functional` |
| **Automatización** | `Maestro` |
| **Flow** | `maestro/flows/navigation-responsive.yaml` |
| **Resultado** | ❌ **Failed** |

### Descripción

Verificar que la navegación de la homepage se mantiene funcional y usable en diferentes tamaños de pantalla, garantizando que los controles de navegación y las secciones sean accesibles en dispositivos móviles y tablet.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* Los controles de navegación responsive están disponibles.

---

### Datos de prueba

| Dispositivo               | Sistema operativo | Orientación |
| ------------------------- | ----------------- | ----------- |
| **iPhone 17**             | iOS 26.5          | Portrait    |
| **iPad Pro 11-inch (M5)** | iOS 26.5          | Portrait    |

---

### Pasos

1. Acceder a la homepage desde un dispositivo móvil.
2. Comprobar que el header responsive y el menú hamburguesa son visibles.
3. Abrir el menú hamburguesa.
4. Seleccionar una de las opciones de navegación disponibles.
5. Comprobar que la aplicación dirige a la sección correspondiente.
6. Verificar que el menú hamburguesa se cierra después de realizar la navegación.
7. Comprobar que el contenido de la sección de destino permanece visible y accesible.
8. Repetir el procedimiento en el resto de secciones disponibles.
9. Repetir las comprobaciones utilizando el iPad Pro 11-inch (M5).

---

### Resultado esperado

* El header debe adaptarse correctamente al tamaño de pantalla.
* El menú hamburguesa debe permitir acceder a las opciones de navegación disponibles.
* Al seleccionar una opción, el usuario debe ser dirigido correctamente a la sección correspondiente.
* El menú debe cerrarse después de seleccionar una opción de navegación.
* El menú no debe permanecer superpuesto sobre el contenido de la sección de destino.
* La sección seleccionada debe quedar correctamente posicionada y su contenido debe permanecer visible y accesible.
* Los elementos interactivos de las secciones deben poder utilizarse correctamente.
* El comportamiento debe mantenerse consistente entre móvil y tablet.

---

### Resultado actual

La navegación hacia las diferentes secciones funciona correctamente tanto en **iPhone 17** como en **iPad Pro 11-inch (M5)**.

Sin embargo, se observan los siguientes comportamientos:

* El menú hamburguesa permanece abierto después de seleccionar una opción de navegación.
* Al permanecer abierto, el menú se superpone sobre el contenido de la sección de destino.
* El menú puede ocultar parte del contenido de las diferentes secciones.
* El problema afecta a la correcta visualización y utilización del contenido de las secciones.

---

### Observaciones

* La navegación funcional de los enlaces no presenta problemas: las secciones se alcanzan correctamente.
* El problema está relacionado con el comportamiento del menú hamburguesa una vez realizada la navegación.
* El comportamiento se reproduce en **móvil y tablet**, por lo que no parece estar limitado a un único dispositivo.
* La superposición del menú impide que el usuario visualice completamente el contenido de la sección seleccionada.

---

### Bugs relacionados

| Bug         | Descripción                                                                                                   | Documentación                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **SMB-122** | El menú hamburguesa permanece abierto y oculta el contenido de las secciones en dispositivos móviles y tablet | `docs/bugs/SMB-1/SMB-122-mobile-menu-remains-open.md` |
| **SMB-123** | El mapa de la sección Location no se visualiza completamente en dispositivos responsive                       | `docs/bugs/SMB-1/SMB-123-responsive-location-map-cut-off.md` |

---

## SMB-124 — TC46 — Verificar navegación mediante los enlaces del footer

| Campo              | Valor                                                        |
| ------------------ | ------------------------------------------------------------ |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Navegation`, `SMB-Homepage` |
| **Componentes**    | `Footer`                                                     |
| **Tipo de prueba** | `Functional`                                                 |
| **Resultado**      | ❌ **Failed**                                                 |

### Descripción

Verificar que los enlaces de navegación disponibles en la sección **Quick Links** del footer dirigen correctamente al usuario a las páginas o secciones correspondientes de la aplicación.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El footer es visible al desplazarse hasta la parte inferior de la homepage.

---

### Datos de prueba

Enlaces disponibles en **Quick Links**:

| Enlace      | Destino esperado      |
| ----------- | --------------------- |
| **Home**    | Inicio de la homepage |
| **Rooms**   | Sección Rooms         |
| **Booking** | Sección Booking       |
| **Contact** | Sección Contact       |

---

### Pasos

1. Acceder a la homepage.
2. Desplazarse hasta el footer.
3. Localizar la sección **Quick Links**.
4. Seleccionar el enlace **Home**.
5. Comprobar el destino de la navegación.
6. Repetir el procedimiento con **Rooms**.
7. Repetir el procedimiento con **Booking**.
8. Repetir el procedimiento con **Contact**.

---

### Resultado esperado

* **Home** debe dirigir al inicio de la homepage.
* **Rooms** debe dirigir a la sección Rooms.
* **Booking** debe dirigir a la sección Booking.
* **Contact** debe dirigir a la sección Contact.
* Cada enlace debe ejecutar una navegación funcional hacia su destino correspondiente.

---

### Resultado actual

Los cuatro enlaces de **Quick Links** utilizan actualmente:

```html
href="#"
```

Implementación observada:

```html
<a href="#" class="text-white text-decoration-none">Home</a>
<a href="#" class="text-white text-decoration-none">Rooms</a>
<a href="#" class="text-white text-decoration-none">Booking</a>
<a href="#" class="text-white text-decoration-none">Contact</a>
```

* El enlace **Home** presenta el comportamiento esperado, ya que al seleccionarlo dirige al inicio de la homepage. Sin embargo, su implementación debería utilizar `href="/"` en lugar de `href="#"`.
* Los enlaces **Rooms, Booking y Contact** presentan un comportamiento incorrecto, ya que al seleccionarlos también dirigen al inicio de la homepage en lugar de dirigir a sus respectivas secciones.

---

### Observaciones

* El enlace **Home** presenta el comportamiento correcto, pero el atributo `href` utilizado no corresponde con el destino esperado.
* **Rooms, Booking y Contact** presentan un destino incorrecto.
* Existe una inconsistencia entre el footer y el header: el header dispone de enlaces funcionales hacia las diferentes secciones, mientras que los enlaces equivalentes del footer utilizan `href="#"`.
* El problema es independiente de la navegación del header, validada en **TC42**.

---

### Recomendación

Configurar cada enlace con sus respectivos destinos, reemplazando el `href="#"` actual.

```html
<a href="/home">Home</a>
<a href="/#rooms">Rooms</a>
<a href="/#booking">Booking</a>
<a href="/#contact">Contact</a>
```

De esta forma, **Home** mantendrá su comportamiento actual utilizando el destino correcto, mientras que **Rooms, Booking y Contact** dirigirán al usuario a sus respectivas secciones.

---

### Bug relacionado

* **SMB-125 — Los enlaces de Quick Links del footer no redirigen a sus destinos correspondientes**
* Documentación: `docs/bugs/SMB-1/SMB-125-[nombre-del-archivo].md`