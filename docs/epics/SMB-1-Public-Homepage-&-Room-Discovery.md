# SMB-1 — Public Homepage & Room Discovery

> **Epic:** Funcionalidades públicas de la homepage, información del hotel, catálogo de habitaciones, recursos visuales, navegación y acceso al inicio del flujo de reserva.

Cubre las principales funcionalidades públicas disponibles para los visitantes, incluyendo la información del hotel, el catálogo de habitaciones, la navegación, los recursos visuales y los puntos de entrada hacia el proceso de reserva.

---

## Objetivo

Garantizar que los usuarios puedan acceder a la homepage, consultar correctamente la información pública del alojamiento y sus habitaciones, navegar por las distintas secciones y acceder al inicio del flujo de reserva.

---

## Valor de negocio

La homepage es el principal punto de entrada para clientes potenciales.

Su correcto funcionamiento influye directamente en la confianza del usuario, la experiencia de navegación y la decisión de continuar hacia una reserva.

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

Incluye:

* carga y funcionamiento general de la homepage;
* información pública del hotel;
* catálogo e información de habitaciones;
* consistencia entre UI y `GET /api/branding`;
* consistencia entre UI y `GET /api/room`;
* navegación mediante header, footer y anchors;
* acceso al inicio del flujo de reserva;
* validación de imágenes y enlaces públicos;
* comportamiento responsive en diferentes tamaños de pantalla;
* comportamiento ante datos o recursos no disponibles.

Fuera de alcance:

* creación completa de reservas — **SMB-3**;
* validaciones propias del proceso de reserva — **SMB-3**;
* formulario de contacto y envío de mensajes — **SMB-2**;
* gestión administrativa de habitaciones;
* funcionalidades del panel de administración.

---

## Estrategia de pruebas

La cobertura combina pruebas funcionales, de integración UI/API, negativas, de robustez y responsive.

Se valida principalmente:

* carga y navegación de la homepage;
* información del hotel y habitaciones;
* correspondencia entre los datos mostrados en UI y las APIs;
* comportamiento ante catálogos vacíos o datos incompletos;
* enlaces, anchors y rutas públicas;
* carga y comportamiento de imágenes;
* navegación en móvil, tablet y desktop.

---

## Trazabilidad

| User Story | Cobertura                              | Documentación                                       |
| ---------- | -------------------------------------- | --------------------------------------------------- |
| **SMB-10** | Información pública del hotel          | `docs/test-cases/SMB-1/SMB-10-hotel-information.md` |
| **SMB-11** | Navegación pública                     | `docs/test-cases/SMB-1/SMB-11-public-navigation.md` |
| **SMB-13** | Información y catálogo de habitaciones | `docs/test-cases/SMB-1/SMB-13-room-information.md`  |
| **SMB-35** | Imágenes públicas                      | `docs/test-cases/SMB-1/SMB-35-broken-images.md`     |
| **SMB-36** | Enlaces y destinos públicos            | `docs/test-cases/SMB-1/SMB-36-broken-links.md`      |

---

## Automatización asociada

| User Story                                 | Test Cases                   | Automatización                             |
| ------------------------------------------ | ---------------------------- | ------------------------------------------ |
| **SMB-10 — Información pública del hotel** | TC37, TC38, TC41             | **Cypress** → `branding.cy.js`             |
|                                            | TC39, TC40                   | **Postman / Newman**                       |
| **SMB-11 — Navegación pública**            | TC42, TC43, TC44, TC46       | **Cypress** → `navigation.cy.js`           |
|                                            | TC45                         | **Maestro** → `navigation-responsive.yaml` |
| **SMB-13 — Información de habitaciones**   | TC47, TC48, TC49, TC50, TC51 | **Cypress** → `rooms.cy.js`                |
| **SMB-35 — Imágenes rotas**                | TC52, TC53, TC54             | **Cypress** → `images.cy.js`               |
|                                            | TC55                         | **Maestro** → validación responsive        |
| **SMB-36 — Enlaces rotos**                 | TC56, TC57                   | **Cypress** → `links.cy.js`                |

Estructura principal:

```text
cypress/e2e/public/homepage/
├── branding.cy.js
├── navigation.cy.js
├── rooms.cy.js
├── images.cy.js
└── links.cy.js
```

```text
maestro/flows/
└── navigation-responsive.yaml
```

---

## Bugs encontrados

| ID          | Descripción                                                                             |
| ----------- | --------------------------------------------------------------------------------------- |
| **SMB-39**  | Los iconos de redes sociales del footer no redirigen a sus respectivas plataformas      |
| **SMB-110** | La homepage falla cuando falta un objeto principal de `/api/branding`                   |
| **SMB-119** | El enlace `Amenities` del header no dirige a una sección existente                      |
| **SMB-120** | La sección Booking queda parcialmente oculta al navegar                                 |
| **SMB-121** | La página 404 no proporciona una navegación adecuada para regresar al sitio             |
| **SMB-122** | El menú hamburguesa permanece abierto y oculta el contenido                             |
| **SMB-123** | El mapa de la sección Location no se visualiza completamente en dispositivos responsive |
| **SMB-125** | Los Quick Links del footer no redirigen a sus destinos correspondientes                 |
| **SMB-134** | No se muestra un mensaje informativo cuando el catálogo de habitaciones está vacío      |

> Los bugs individuales se encuentran documentados en `docs/bugs/SMB-1/`.
