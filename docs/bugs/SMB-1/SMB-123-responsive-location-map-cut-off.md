# SMB-123 — El mapa de la sección Location no se visualiza completamente en dispositivos responsive

## Descripción

En dispositivos móviles y tablet, el mapa de la sección **Location** no dispone de suficiente espacio vertical para visualizarse correctamente, provocando que parte del mapa quede recortada o no sea completamente visible.

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
3. Acceder a la sección **Location**.
4. Observar el mapa mostrado en la sección.

---

## Resultado actual

El mapa de **Location** presenta una visualización vertical insuficiente en dispositivos responsive, provocando que no se muestre completamente.

Durante la investigación se observó que al aumentar el espacio inferior del elemento que contiene el mapa, una mayor parte del mapa pasa a ser visible.

---

## Resultado esperado

El mapa debe visualizarse completamente dentro de su contenedor, manteniendo unas dimensiones adecuadas para el dispositivo utilizado.

El contenido de la sección **Location** debe permanecer correctamente distribuido y no debe existir ningún recorte que dificulte la visualización o interacción con el mapa.

---

## Observaciones

* El problema se reproduce durante las pruebas responsive realizadas en **iPhone 17** y **iPad Pro 11-inch (M5)**.
* La incidencia afecta específicamente a la presentación del mapa dentro de la sección **Location**.
* El problema parece estar relacionado con las dimensiones y el espaciado del contenedor del mapa en el layout responsive.
* Durante la inspección se comprobó que modificar el `margin-bottom` del contenedor aumenta el área visible del mapa.
* El valor utilizado durante la investigación (`margin-bottom: 50%`) debe considerarse únicamente una prueba para identificar el origen del problema, no una solución definitiva.

---

## Recomendación

Revisar el diseño responsive de la sección **Location** y las dimensiones del contenedor que alberga el mapa para garantizar que disponga de una altura y espaciado adecuados en móvil y tablet.

---

## Evidencias

| # | Tipo | Descripción | Referencia |
| --- | --- | --- | --- |
| **1** | Grabación | Navegación responsive donde se aprecia que el mapa de la sección Location no se visualiza completamente. | [Ver grabación en Google Drive](https://drive.google.com/file/d/1VwjKwqdI1Ve_NgOQL83rUmYnrrSLlmTn/view?usp=sharing) |
| **2** | Captura | Inspección del DOM y dimensiones en iPhone, mostrando la prueba con `margin-bottom: 50%`. | [Ver captura](../../evidence/SMB-1/SMB-11/SMB-123/location-map-responsive-dom.png) |
| **3** | Captura | Visualización del mapa de la sección Location en iPhone, donde se observa el recorte del contenido. | [Ver captura](../../evidence/SMB-1/SMB-11/SMB-123/location-map-iphone.png) |
| **4** | Captura | Visualización del mapa de la sección Location en iPad, donde se observa el mismo comportamiento responsive. | [Ver captura](../../evidence/SMB-1/SMB-11/SMB-123/location-map-ipad.png) |

---

## Environment

| Campo                 | Valor                                 |
| --------------------- | ------------------------------------- |
| **Dispositivo**       | iPhone 17 / iPad Pro 11-inch (M5)     |
| **Sistema operativo** | iOS 26.5                              |
| **Browser**           | Safari 26.5                           |
| **URL**               | `https://automationintesting.online/` |
| **Fecha**             | 17 / agosto / 2026                    |
| **Severidad**         | Medium                                |
| **Prioridad**         | Medium                                |
