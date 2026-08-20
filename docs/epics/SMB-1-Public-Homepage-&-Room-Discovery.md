# SMB-1 — Public Homepage & Room Discovery

> **Epic:** Funcionalidades públicas de la homepage, información del hotel, catálogo de habitaciones, recursos visuales, navegación y acceso al inicio del flujo de reserva.

Cubre las funcionalidades públicas disponibles para los visitantes en la homepage, incluyendo la información general del hotel, el catálogo de habitaciones, los recursos visuales, la navegación pública y los puntos de entrada hacia el proceso de búsqueda y reserva.

---

## Objetivo

Garantizar que los usuarios puedan acceder a la homepage, consultar correctamente la información pública del alojamiento y de sus habitaciones, navegar por las diferentes secciones y acceder al inicio del proceso de reserva.

---

## Valor de negocio

La homepage representa el principal punto de entrada para clientes potenciales. Su correcto funcionamiento influye directamente en la confianza del usuario, la experiencia de navegación y la decisión de continuar hacia una reserva.

---

## User Stories incluidas

| ID         | User Story                                      |
| ---------- | ----------------------------------------------- |
| **SMB-10** | Información pública del hotel                   |
| **SMB-11** | Navegación entre las secciones públicas         |
| **SMB-13** | Información y catálogo de habitaciones          |
| **SMB-35** | Detección de imágenes rotas en páginas públicas |
| **SMB-36** | Detección de enlaces rotos o destinos inválidos |

---

## Alcance

### Incluye

#### Homepage

* Carga y funcionamiento general de la homepage.
* Comportamiento responsive de la homepage.

#### Información pública del hotel

* nombre;
* descripción;
* dirección;
* teléfono;
* email;
* ubicación y mapa.

#### Catálogo de habitaciones

* Catálogo inicial de habitaciones.
* Información mostrada para cada habitación:

  * número o nombre;
  * tipo;
  * precio;
  * descripción;
  * características;
  * imagen.

#### Consistencia UI / API

| Interfaz                               | API                 |
| -------------------------------------- | ------------------- |
| Información pública del hotel          | `GET /api/branding` |
| Catálogo e información de habitaciones | `GET /api/room`     |

#### Recursos visuales

* Integridad y carga de imágenes públicas.
* Comportamiento ante imágenes no disponibles.

#### Navegación pública

* header;
* footer;
* enlaces internos;
* anchors.
* Detección de enlaces sin destino funcional.
* Detección de anchors que apuntan a secciones inexistentes.
* Comportamiento de rutas públicas inexistentes.
* Acceso desde una habitación al punto de entrada del flujo de reserva.

---

### Fuera de alcance

| Funcionalidad                              | Epic / Área    |
| ------------------------------------------ | -------------- |
| Creación completa de reservas              | **SMB-3**      |
| Validación del formulario de reserva       | **SMB-3**      |
| Formulario de contacto y envío de mensajes | **SMB-2**      |
| Gestión administrativa de habitaciones     | Fuera de SMB-1 |
| Panel de administración                    | Fuera de SMB-1 |

---

## Estrategia de pruebas

### UI / E2E

* Validar la carga de la homepage.
* Validar los elementos principales de la interfaz pública.
* Validar la navegación entre las diferentes secciones.
* Validar la representación del catálogo de habitaciones.
* Validar el acceso al inicio del flujo de reserva.
* Validar comportamiento responsive en móvil, tablet y desktop.

### API / Cross-check UI

* Validar que `GET /api/branding` devuelve la información pública utilizada por la homepage.
* Comparar los datos de branding de la API con los mostrados en la UI.
* Validar que `GET /api/room` devuelve el catálogo de habitaciones.
* Comparar la información de las habitaciones de la API con la representada en la homepage.
* Obtener los datos dinámicamente durante la ejecución para evitar dependencias de valores hardcodeados.

### Negative / Robustness

* Catálogo de habitaciones vacío.
* Información incompleta de una habitación.
* Objetos principales ausentes en `/api/branding`.
* Recursos de imagen no disponibles.
* Enlaces sin destino funcional.
* Anchors cuyo destino no existe.
* Acceso a rutas públicas inexistentes.

### Responsive / Compatibilidad

* Validar la homepage en diferentes tamaños de pantalla.
* Comprobar navegación, imágenes, mapa y distribución de contenido.
* Ejecutar las pruebas relevantes en Chrome y Safari.

---

## Dependencias

| Dependencia         | Uso                                    |
| ------------------- | -------------------------------------- |
| `GET /api/branding` | Información pública del hotel          |
| `GET /api/room`     | Catálogo e información de habitaciones |
| **SMB-3**           | Flujo de disponibilidad y reserva      |

SMB-1 proporciona a **SMB-3** la interfaz pública y los puntos de entrada necesarios para iniciar el flujo de disponibilidad y reserva.

---

## Riesgos / Supuestos

* La información del hotel y de las habitaciones puede cambiar entre ejecuciones.
* Las pruebas deben obtener los datos actuales desde la API siempre que sea posible.
* Los casos no deben depender de habitaciones, precios, imágenes o características concretas salvo que el escenario lo requiera.
* El entorno es compartido y determinados datos pueden ser modificados por otros usuarios.
* Las modificaciones realizadas desde el panel administrativo o mediante API pueden ser restauradas automáticamente por la aplicación.
* El comportamiento visual puede variar según el viewport, dispositivo o navegador utilizado.

---

## Trazabilidad

### User Stories y documentación

| User Story | Cobertura                              | Documentación                                       |
| ---------- | -------------------------------------- | --------------------------------------------------- |
| **SMB-10** | Información pública del hotel          | `docs/test-cases/SMB-1/SMB-10-hotel-information.md` |
| **SMB-11** | Navegación pública                     | `docs/test-cases/SMB-1/SMB-11-public-navigation.md` |
| **SMB-13** | Información y catálogo de habitaciones | `docs/test-cases/SMB-1/SMB-13-room-information.md`  |
| **SMB-35** | Imágenes rotas                         | `docs/test-cases/SMB-1/SMB-35-broken-images.md`     |
| **SMB-36** | Enlaces rotos o destinos inválidos     | `docs/test-cases/SMB-1/SMB-36-broken-links.md`      |

### Automatización asociada

```text
cypress/e2e/public/homepage/
├── branding.cy.js
├── navigation.cy.js
├── rooms.cy.js
├── images.cy.js
└── links.cy.js
```

### Documentación del epic

```text
docs/
├── epics/
│   └── SMB-1-public-homepage-room-discovery.md
│
├── test-cases/
│   └── SMB-1/
│
├── bugs/
│   └── SMB-1/
│
└── evidence/
    └── SMB-1/
```

---

## Bugs relacionados

Durante la ejecución se han identificado:

| ID          | Descripción                                                                             |
| ----------- | --------------------------------------------------------------------------------------- |
| **SMB-39**  | Los iconos de redes sociales del footer no redirigen a sus respectivas plataformas      |
| **SMB-119** | El enlace `Amenities` del header no dirige a una sección existente                      |
| **SMB-120** | La sección Booking queda parcialmente oculta al navegar                                 |
| **SMB-121** | La página 404 no proporciona una navegación adecuada para regresar al sitio             |
| **SMB-122** | El menú hamburguesa permanece abierto y oculta el contenido                             |
| **SMB-123** | El mapa de la sección Location no se visualiza completamente en dispositivos responsive |
| **SMB-125** | Los enlaces de **Quick Links** del footer no redirigen a sus destinos correspondientes  |
| **SMB-134** | No se muestra mensaje informativo cuando el catálogo de habitaciones está vacío         |
| **SMB-110** | La homepage falla cuando falta un objeto principal de `/api/branding`                   |

> Los bugs individuales se encuentran documentados en `docs/bugs/SMB-1/`.