# Portafolio QA — Shady Meadows B&B Testing

> Suite de pruebas end-to-end, API y mobile construida sobre [automationintesting.online](https://automationintesting.online), usada como entorno público de práctica para simular un proceso de QA completo.

![Cypress](https://img.shields.io/badge/Cypress-E2E-17202C?logo=cypress)
![Postman](https://img.shields.io/badge/Postman-API-FF6C37?logo=postman)
![Maestro](https://img.shields.io/badge/Maestro-Mobile-000000)
![Pipeline](https://img.shields.io/badge/pipeline-passing-brightgreen)

## Sobre este proyecto

Este repositorio documenta un proceso de QA completo sobre una aplicación real de reservas de hotel: análisis de requisitos, diseño de casos de prueba (happy path, negativos y edge cases), automatización en tres capas (UI, API, mobile), reporte de bugs, e investigación de causa raíz.

No es una colección de scripts aislados — sigue el mismo flujo de trabajo que tendría un QA dentro de un equipo real: **Jira → Diseño de Casos de Prueba → Automatización → Reporte de Bugs → CI/CD**.

## Stack

| Área | Herramienta |
|---|---|
| E2E Web | Cypress |
| API | Postman / Newman |
| E2E Mobile | Maestro |
| Gestión de pruebas y bugs | Jira |
| CI/CD | GitLab CI |
| Control de versiones | GitHub |

## Estructura del repositorio

```
├── cypress/
│   ├── e2e/
│   │   ├── authentication.cy.js
│   │   ├── contact.cy.js
│   │   └── reservation.cy.js
│   ├── fixtures/
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
├── cypress.env.json               # credenciales, ignorado por git — nunca se commitea
├── package.json
├── docs/
│   ├── epics.md                  # Alcance de alto nivel por epic
│   ├── test-cases/               # Casos de prueba detallados (precondiciones, pasos, resultado esperado)
│   ├── bug-reports/              # Espejo en markdown de los bugs de Jira (Jira es privado)
│   ├── case-studies/             # Investigaciones de causa raíz
│   └── traceability-matrix.md    # User Story → Test Case → ¿Automatizado? → Bug
├── evidence/                     # Capturas referenciadas en los reportes de bugs (los videos se enlazan, no se commitean)
├── api-tests/
│   └── postman/
├── mobile-e2e/
│   └── flows/
└── .gitlab-ci.yml
```

## Convenciones de documentación

- **Jira es privado**, así que cada bug y cada caso de prueba detallado se refleja aquí en Markdown, dentro de `docs/`. Los IDs de Jira (ej. `SMB-72`) se mantienen como nombre de archivo y encabezado, para poder cruzar referencias.
- Las **capturas de pantalla** se commitean directamente en `evidence/`. **Los videos no se commitean** — se graban con Loom (o se suben a YouTube como no listado) y se enlazan desde el reporte de bug correspondiente, para mantener el repositorio liviano.
- `docs/epics.md` es la fuente única de verdad del alcance, reemplazando lo que en un proyecto de equipo normalmente viviría en Confluence.

## Cómo correr los tests localmente

```bash
# E2E Web (desde la raíz del repo)
npm install
npx cypress open   # modo interactivo
npx cypress run    # modo headless, el mismo que corre en CI

# API
cd api-tests
newman run postman/automationintesting.postman_collection.json

# Mobile
cd mobile-e2e
maestro test flows/
```

## CI/CD

Cada push a `main` ejecuta:
1. Suite smoke (chequeos rápidos, en cada push)
2. Suite de regresión completa (nocturna — incluye tests más lentos como la expiración de sesión)
3. Colección de API (Newman)
4. Reporte HTML publicado → [ver último reporte](#)

## Bugs encontrados

| ID | Título | Severidad | Prioridad | Detectado vía |
|---|---|---|---|---|
| [SMB-38](docs/bug-reports/SMB-38-pantalla-negra-fechas-invalidas.md) | Pantalla negra al reservar con un rango de fechas inválido | Critical | Highest | Manual |
| SMB-XX *(confirmar ID)* | Precio/noches negativas con fechas invertidas | Critical | Highest | Manual |
| SMB-XX *(confirmar ID)* | Mensajes de validación técnicos y poco claros | Media | Alta | Manual |
| [SMB-46](docs/bug-reports/SMB-46-datos-invalidos-aceptados.md) | La reserva se crea a pesar de datos de invitado inválidos | Alta | Alta | Manual + regresión automatizada |
| SMB-48 | Los campos obligatorios no están marcados visualmente | Baja (UX) | Media | Manual |
| [SMB-72](docs/bug-reports/SMB-72-inconsistencia-disponibilidad.md) | Check Availability lista habitaciones con reservas solapadas | Alta | Highest | Automatizado, causa raíz confirmada |
| [SMB-73](docs/bug-reports/SMB-73-crash-conflicto.md) | La app crashea ante cualquier respuesta no-201 del endpoint de reserva | Critical | Highest | Automatizado, 100% reproducible |

*Los valores de severidad/prioridad reflejan la evaluación de trabajo de esta investigación — confírmalos contra Jira antes de darlos por definitivos.*

## Casos de estudio

**[Investigación de disponibilidad y manejo de errores en reservas](docs/case-studies/investigacion-conflicto-reservas.md)** — análisis de causa raíz que conecta un HTTP 409 Conflict intermitente con un hueco específico en el filtro de disponibilidad (SMB-72), y un crash relacionado pero distinto en cómo el frontend maneja esa respuesta (SMB-73). Incluye un test de regresión determinista en Cypress para cada uno, reproduciendo el comportamiento real del backend en vez de esperar a que ocurra por casualidad.

**[Investigación de sesión de administrador](docs/case-studies/investigacion-sesion-logout.md)** — metodología para aislar si un problema de autenticación era un defecto real del producto o una diferencia en el setup de pruebas, comparando atributos de cookies, headers de respuesta, y el flujo de login manual vs. automatizado paso a paso.

## Métricas

- **X** casos de prueba diseñados · **Y** automatizados (**Z%**)
- **N** bugs encontrados — ver desglose arriba
- Cobertura: Reservas (UI + API), Autenticación de administrador, Mensajería

## Contacto

[LinkedIn](#) · [Correo](#)