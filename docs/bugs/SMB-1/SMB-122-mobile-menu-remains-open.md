# SMB-122 — El menú hamburguesa permanece abierto y oculta el contenido de las secciones en dispositivos móviles y tablet

## Descripción

En dispositivos móviles y tablet, al seleccionar una opción del menú hamburguesa, la aplicación navega correctamente hacia la sección seleccionada, pero el menú permanece abierto y se superpone sobre el contenido, dificultando la visualización de las secciones.

---

## Trazabilidad

| Elemento                | Referencia                                                               |
| ----------------------- | ------------------------------------------------------------------------ |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                                 |
| **User Story**          | SMB-11 — Navegación entre las secciones públicas                         |
| **Test Case**           | TC45 — Verificar navegación responsive en diferentes tamaños de pantalla |
| **Acceptance Criteria** | AC-7 — Navegación en diferentes tamaños de pantalla                      |

---

## Pasos para reproducir

1. Acceder a la homepage desde un dispositivo móvil o tablet.
2. Abrir el menú hamburguesa.
3. Seleccionar una de las opciones de navegación.
4. Esperar a que la aplicación navegue hasta la sección correspondiente.
5. Observar el estado del menú y el contenido de la sección.
6. Intentar cerrar el menú utilizando el icono correspondiente.

---

## Resultado actual

La aplicación navega correctamente hacia la sección seleccionada, pero:

* El menú hamburguesa permanece abierto.
* El menú se superpone sobre el contenido de la sección.
* Parte del contenido queda oculto mientras el menú permanece abierto.
* El usuario puede necesitar realizar acciones adicionales para visualizar correctamente el contenido de la sección.

---

## Resultado esperado

* El usuario debe ser dirigido a la sección seleccionada.
* El menú hamburguesa debe cerrarse automáticamente después de seleccionar una opción.
* La sección de destino debe quedar completamente visible.
* El menú no debe cubrir contenido de la página.
* El usuario debe poder visualizar e interactuar con todos los elementos de la sección.

---

## Observaciones

* El problema no afecta a la navegación hacia el destino: la sección se alcanza correctamente.
* El defecto se encuentra en el comportamiento posterior del menú hamburguesa.
* El menú debería formar parte del flujo de navegación y desaparecer una vez que el usuario ha seleccionado su destino.
* El problema se reproduce tanto en **iPhone 17** como en **iPad Pro 11-inch (M5)** con iOS 26.5.
* El comportamiento puede afectar a cualquier sección accesible desde el menú responsive, por lo que no se considera un problema exclusivo de una sección concreta.

---

## Recomendación

Modificar el comportamiento del menú hamburguesa para que se cierre automáticamente después de seleccionar una opción de navegación.

Además, debería revisarse el posicionamiento del menú y de las secciones de destino para garantizar que, después de navegar, ningún elemento del menú cubra información relevante.

La solución debería validarse en diferentes tamaños de pantalla para garantizar que el comportamiento sea consistente en móvil y tablet.

---

## Evidencias

## Evidencias

| # | Tipo | Descripción | Referencia |
| --- | --- | --- | --- |
| **1** | Maestro CLI | Ejecución automatizada de TC45 en iPad Pro 11-inch (M5). La prueba reproduce SMB-122 al detectar que el menú hamburguesa permanece visible después de navegar a la sección `Rooms`. | [Ver grabación en Google Drive](https://drive.google.com/file/d/19vowishx5VYqwRLQOC_J__n0bWaJPiOO/view?usp=sharing) |
| **2** | Maestro CLI | Ejecución automatizada de TC45 en iPhone 17. La prueba reproduce SMB-122 al detectar que el menú hamburguesa permanece visible después de navegar a la sección `Rooms`. | [Ver grabación en Google Drive](https://drive.google.com/file/d/1-AVQ-666yLWhtRwUzYMAbnFWJvD2K4m8/view?usp=sharing) |
| **3** | Maestro Studio | Ejecución visual de TC45 en iPhone 17 mediante Maestro Studio, mostrando el flujo automatizado y el comportamiento asociado a SMB-122 durante la navegación responsive. | [Ver grabación en Google Drive](https://drive.google.com/file/d/1w02qgaVIVqS3IM7BrzrzTd_hYgzWUSuD/view?usp=sharing) |
| **4** | Grabación de dispositivo | Grabación directa del iPhone 17 que muestra visualmente cómo el menú hamburguesa permanece abierto y se superpone al contenido después de navegar a la sección `Rooms`. | [Ver grabación en Google Drive](https://drive.google.com/file/d/1cFCeNpPMQnueEiT9zvP9ZromG6Rekpjo/view?usp=sharing) |

---

## Environment

| Campo | Valor |
| --- | --- |
| **Dispositivo** | iPhone 17 / iPad Pro 11-inch (M5) |
| **Sistema operativo** | iOS 26.5 |
| **Browser** | Safari 26.5 |
| **Framework** | Maestro 0.9.3 |
| **URL** | `https://automationintesting.online/` |
| **Fecha** | 17 / agosto / 2026 |
| **Severidad** | Medium |
| **Prioridad** | Medium |