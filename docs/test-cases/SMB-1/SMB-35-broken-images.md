# SMB-35 — Detección de imágenes rotas en páginas públicas

## User Story

**Como Ingeniero de QA**, quiero detectar imágenes rotas en las páginas públicas para garantizar una experiencia visual correcta y profesional del sitio.

---

## Criterios de aceptación

### AC-1 — Carga correcta de imágenes públicas

**Given** el usuario accede a una página pública
**When** la página termina de cargar
**Then** las imágenes utilizadas en la interfaz deben cargarse correctamente.

**And** no deben mostrarse imágenes rotas, placeholders del navegador ni recursos inexistentes.

---

### AC-2 — Respuesta válida de los recursos de imagen

**Given** una imagen pública está referenciada por la aplicación
**When** el navegador solicita el recurso correspondiente
**Then** la petición de la imagen debe completarse correctamente.

**And** no debe devolver errores HTTP asociados a recursos inexistentes o no disponibles.

---

### AC-3 — Correspondencia entre imagen y contenido

**Given** una imagen está asociada a un elemento concreto de la aplicación
**When** el usuario visualiza dicho elemento
**Then** la imagen mostrada debe corresponder al recurso configurado para ese contenido.

Ejemplos:

* Imagen principal del hotel.
* Imágenes de habitaciones.
* Otras imágenes visibles en páginas públicas.

---

### AC-4 — Gestión de una imagen no disponible

**Given** una imagen pública no puede cargarse correctamente
**When** la aplicación intenta mostrar dicho recurso
**Then** el fallo de la imagen no debe provocar un error de ejecución ni bloquear el resto de la página.

**And** el resto del contenido debe continuar siendo accesible.

> No se exige una imagen fallback concreta al no existir actualmente ese requisito. Se valida la robustez de la aplicación ante el fallo del recurso.

---

### AC-5 — Integridad de imágenes en diferentes tamaños de pantalla

**Given** el usuario accede a las páginas públicas desde distintos tamaños de pantalla
**When** las imágenes son renderizadas
**Then** deben continuar siendo visibles y no aparecer rotas por el comportamiento responsive.

---

# Trazabilidad

| Test ID     | Test Case                                                                                | AC relacionado | Componente | Tipo de prueba      | Resultado | Bug relacionado |
| ----------- | ---------------------------------------------------------------------------------------- | -------------- | ---------- | ------------------- | --------- | --------------- |
| **SMB-135** | **TC52** — Verificar que las imágenes de las páginas públicas cargan correctamente       | AC-1, AC-3     | `Homepage` | `Functional`        | ✅ Passed  | —               |
| **SMB-136** | **TC53** — Verificar las respuestas HTTP de los recursos de imagen públicos              | AC-2           | `Homepage` | `Integration-Tests` | ✅ Passed  | —               |
| **SMB-137** | **TC54** — Verificar comportamiento de la aplicación cuando una imagen no puede cargarse | AC-4           | `Homepage` | `Negative-Tests`    | ✅ Passed  | —               |
| **SMB-138** | **TC55** — Verificar visualización de imágenes en diferentes tamaños de pantalla         | AC-5           | `Homepage` | `Functional`        | ✅ Passed  | —               |

---

# Test Cases

## SMB-135 — TC52 — Verificar que las imágenes de las páginas públicas cargan correctamente

| Campo              | Valor                                                   |
| ------------------ | ------------------------------------------------------- |
| **Etiquetas**      | `SMB-UI`, `SMB-Image`, `SMB-Homepage`, `SMB-Validation` |
| **Componentes**    | `Homepage`                                              |
| **Tipo de prueba** | `Functional`                                            |
| **Resultado**      | ✅ **Passed**                                            |

### Descripción

Verificar que las imágenes utilizadas en las páginas públicas de la aplicación cargan correctamente y se muestran al usuario sin recursos visuales rotos o ausentes.

---

### Precondiciones

* La aplicación se encuentra disponible.
* Existe contenido con imágenes disponible en la aplicación.
* La conexión con los recursos utilizados por la aplicación se encuentra disponible.

---

### Datos de prueba

Las imágenes utilizadas como datos de prueba se obtienen dinámicamente de las páginas públicas durante la ejecución.

Se deben considerar tanto:

* Imágenes renderizadas mediante elementos `<img>`.
* Imágenes utilizadas mediante propiedades como `background-image`.

---

### Pasos

1. Acceder a la homepage.
2. Recorrer las diferentes secciones públicas de la página.
3. Identificar las imágenes utilizadas en cada sección.
4. Identificar las imágenes renderizadas mediante elementos `<img>`.
5. Identificar las imágenes utilizadas como fondos u otros recursos visuales.
6. Observar la carga de cada una de las imágenes identificadas.
7. Repetir la comprobación para el resto del contenido público disponible.

---

### Resultado esperado

* Todas las imágenes utilizadas en las páginas públicas deben cargar correctamente.
* Las imágenes deben ser visibles para el usuario cuando corresponda.
* No deben mostrarse iconos o indicadores de imagen rota.
* No deben existir espacios provocados por imágenes que no hayan podido cargarse cuando estas formen parte del contenido esperado.
* Las imágenes utilizadas mediante `<img>` deben disponer de un recurso válido y cargado.
* Las imágenes utilizadas mediante `background-image` deben cargar correctamente.
* El fallo de carga de una imagen no debe pasar desapercibido durante la ejecución del caso.
* El resto del contenido de la página debe mantenerse correctamente renderizado.

---

### Resultado

✅ **Passed**

---

## SMB-136 — TC53 — Verificar las respuestas HTTP de los recursos de imagen públicos

| Campo              | Valor                                                    |
| ------------------ | -------------------------------------------------------- |
| **Etiquetas**      | `SMB-API`, `SMB-Image`, `SMB-Homepage`, `SMB-Validation` |
| **Componentes**    | `Homepage`                                               |
| **Tipo de prueba** | `Integration-Tests`                                      |
| **Resultado**      | ✅ **Passed**                                             |

### Descripción

Verificar que los recursos de imagen utilizados en las páginas públicas de la aplicación son accesibles y responden correctamente, evitando referencias a imágenes inexistentes o recursos que devuelvan errores HTTP.

---

### Precondiciones

* La aplicación se encuentra disponible.
* Existen imágenes referenciadas por la aplicación.
* Los recursos de imagen pueden consultarse mediante sus correspondientes URLs.

---

### Datos de prueba

Las rutas de las imágenes deben obtenerse dinámicamente durante la ejecución a partir de los recursos utilizados por las páginas públicas.

Se deben incluir, cuando corresponda:

* Valores `src` de elementos `<img>`.
* Recursos configurados mediante `background-image`.
* Rutas de imágenes proporcionadas por endpoints públicos como `GET /api/room` o `GET /api/branding` cuando sean utilizadas por la UI.

---

### Pasos

1. Acceder a una página pública de la aplicación.
2. Identificar los recursos de imagen utilizados por la página.
3. Obtener las URLs o rutas correspondientes a dichos recursos.
4. Realizar una petición HTTP a cada recurso identificado.
5. Registrar el código de respuesta obtenido para cada imagen.
6. Repetir la comprobación para todos los recursos de imagen identificados en las páginas públicas.

---

### Resultado esperado

* Los recursos de imagen referenciados por las páginas públicas deben encontrarse disponibles.
* Cada recurso de imagen público utilizado por la aplicación debe responder con un estado HTTP satisfactorio, preferiblemente `200 OK`, y no debe devolver errores `4xx` o `5xx`.
* Las rutas utilizadas por la aplicación no deben apuntar a recursos inexistentes.
* La respuesta obtenida debe corresponder a un recurso de imagen válido.
* No deben existir referencias rotas entre la aplicación y los recursos visuales utilizados.

---

### Resultado

✅ **Passed**

---

## SMB-137 — TC54 — Verificar comportamiento de la aplicación cuando una imagen no puede cargarse

| Campo              | Valor                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| **Etiquetas**      | `SMB-Automation`, `SMB-UI`, `SMB-Image`, `SMB-Homepage`, `SMB-Validation` |
| **Componentes**    | `Homepage`                                                                |
| **Tipo de prueba** | `Negative-Tests`                                                          |
| **Resultado**      | ✅ **Passed**                                                              |

### Descripción

Verificar que la aplicación gestiona correctamente el fallo de carga de una imagen pública sin provocar errores de ejecución ni bloquear el resto del contenido de la página.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage es accesible.
* Existe al menos una imagen pública utilizada por la aplicación.
* Cypress permite interceptar la petición del recurso de imagen.

---

### Datos de prueba

Se utilizará una imagen pública utilizada actualmente por la aplicación.

Ejemplo:

```text
/images/rbp-logo.jp
```

Se simulará que el recurso no está disponible mediante una respuesta:

```text
HTTP 404 Not Found
```

---

### Pasos

1. Configurar una interceptación para una imagen utilizada en la homepage.
2. Configurar la interceptación para devolver `HTTP 404 Not Found`.
3. Acceder a la homepage.
4. Desplazarse hasta la sección donde se utiliza la imagen afectada.
5. Observar el comportamiento del elemento asociado a la imagen.
6. Continuar navegando por el resto de la homepage.

---

### Resultado esperado

* El fallo de carga de una imagen no debe provocar un error de ejecución.
* La homepage debe continuar funcionando.
* El resto del contenido debe mantenerse visible y accesible.
* El fallo debe quedar limitado al recurso de imagen afectado.
* No debe mostrarse contenido perteneciente a otra imagen como sustitución incorrecta.
* El usuario debe poder continuar navegando por la página sin ningún tipo de problema.

---

### Resultado

✅ **Passed**

---

## SMB-138 — TC55 — Verificar visualización de imágenes en diferentes tamaños de pantalla

| Campo              | Valor                                                                     |
| ------------------ | ------------------------------------------------------------------------- |
| **Etiquetas**      | `SMB-UI`, `SMB-Image`, `SMB-Responsive`, `SMB-Homepage`, `SMB-Validation` |
| **Componentes**    | `Homepage`                                                                |
| **Tipo de prueba** | `Functional`                                                              |
| **Resultado**      | ✅ **Passed**                                                              |

### Descripción

Verificar que las imágenes utilizadas en las páginas públicas se mantienen visibles y correctamente adaptadas en diferentes tamaños de pantalla.

---

### Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* Existen imágenes públicas visibles en la aplicación.
* Los recursos de imagen cargan correctamente.

---

### Datos de prueba

Dispositivos utilizados para la validación responsive:

| Dispositivo               | Sistema operativo |
| ------------------------- | ----------------- |
| **iPhone 17**             | iOS 26.5          |
| **iPad Pro 11-inch (M5)** | iOS 26.5          |

---

### Pasos

1. Acceder a la homepage desde el dispositivo móvil.
2. Recorrer las diferentes secciones públicas que contienen imágenes.
3. Observar la visualización de las imágenes.
4. Acceder a la homepage desde el dispositivo tablet.
5. Recorrer nuevamente las secciones que contienen imágenes.
6. Observar la adaptación de las imágenes al nuevo tamaño de pantalla.
7. Comparar el comportamiento visual entre los dispositivos utilizados.

---

### Resultado esperado

* Las imágenes deben cargar correctamente en los diferentes tamaños de pantalla.
* Las imágenes deben mantenerse dentro de sus contenedores correspondientes.
* No deben aparecer imágenes rotas como consecuencia del comportamiento responsive.
* Las imágenes no deben deformarse de forma que afecte significativamente a su visualización.
* El contenido principal de una imagen no debe quedar recortado de forma que deje de ser comprensible o usable.
* Las imágenes no deben superponerse sobre otros elementos de la interfaz.
* La visualización debe mantenerse usable tanto en móvil como en tablet.

---

### Resultado

✅ **Passed**
