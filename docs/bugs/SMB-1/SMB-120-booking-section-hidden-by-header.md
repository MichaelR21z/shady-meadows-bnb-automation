# SMB-120 — La sección Booking queda parcialmente oculta por el header al navegar mediante el enlace del header

## Descripción

Al acceder a la sección **Booking** mediante el enlace correspondiente del header, la navegación se realiza correctamente, pero el posicionamiento final de la sección hace que el header se superponga sobre su contenido, ocultando los campos **Check In** y **Check Out**.

---

## Trazabilidad

| Elemento                | Referencia                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                                                   |
| **User Story**          | SMB-11 — Navegación entre las secciones públicas                                           |
| **Test Case**           | SMB-112 / TC43 — Verificar visibilidad de las secciones al navegar desde el header         |
| **Acceptance Criteria** | AC-1 — Navegación mediante el menú principal / AC-2 — Navegación mediante enlaces internos |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El header está visible.

---

## Datos de prueba

Enlaces del header que dirigen a secciones de la homepage:

* **Rooms**
* **Booking**
* **Amenities**
* **Location**
* **Contact**

> El enlace **Admin** queda fuera de esta prueba porque dirige a una página independiente.

---

## Pasos para reproducir

1. Acceder a la homepage.
2. Seleccionar una sección disponible mediante su enlace en el header.
3. Esperar a que la navegación hacia la sección termine.
4. Observar la posición final de la sección.
5. Comprobar que el contenido principal de la sección es visible y accesible.
6. Regresar a la homepage.
7. Repetir los pasos anteriores con las demás secciones disponibles.

---

## Resultado actual

Las secciones quedan correctamente posicionadas para estar accesibles, pero se observa que **Booking no queda completamente visible al llegar a su destino**.

El header se superpone sobre parte de la sección y oculta los campos:

* **Check In**
* **Check Out**

mientras que el botón **Check Availability** permanece visible.

---

## Resultado esperado

* Cada sección debe quedar correctamente posicionada después de la navegación.
* El contenido principal de la sección debe ser completamente visible.
* El header no debe ocultar información relevante de la sección.
* Los elementos interactivos de la sección deben permanecer accesibles.
* El usuario debe poder visualizar e interactuar con el contenido sin realizar desplazamientos adicionales para descubrir elementos que deberían estar visibles al llegar al destino.

---

## Observaciones

* El problema observado no corresponde a un fallo del enlace **Booking**, ya que la navegación hacia `#booking` se realiza correctamente.
* El problema está relacionado con la **posición de la sección después de la navegación mediante un anchor**.
* El header ocupa parte del área visible de la sección al finalizar la navegación.

---

## Recomendación

Se recomienda revisar el posicionamiento de las secciones utilizadas como destinos de los anchors del header, teniendo en cuenta la altura del header al realizar el desplazamiento.

Como posible solución, el equipo puede ajustar el desplazamiento de las secciones para que el contenido relevante quede por debajo del header al navegar mediante anchors, por ejemplo mediante una configuración equivalente a:

```css
scroll-margin-top
```

o mediante el mecanismo de navegación utilizado actualmente.

La solución concreta debería adaptarse al diseño y estructura actual de la aplicación, pero el objetivo debe ser que la sección **Booking** llegue a una posición en la que **Check In**, **Check Out** y **Check Availability** sean completamente visibles y utilizables.

---

## Evidencias

| #     | Tipo    | Evidencia                                                                                                | Referencia                                                                                                      |
| ----- | ------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **1** | Vídeo   | Navegación hacia la sección Booking mostrando que el header oculta parcialmente los campos de la sección | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1TOW99D8MiHwhapSuIAson-GK0s2YuhoB/view?usp=sharing) |
| **2** | Captura | Posición final de la sección Booking con el header superpuesto sobre `Check In` y `Check Out`            | `[docs/evidence/SMB-1/SMB-11/SMB-120/booking-section-header-overlap.png]`                                                                                        |

---

## Environment

| Campo                 | Valor                                 |
| --------------------- | ------------------------------------- |
| **Dispositivo**       | Mac                                   |
| **Sistema operativo** | Tahoe 26.5.2                          |
| **Browser**           | Safari 26.5.2                         |
| **URL**               | `https://automationintesting.online/` |
| **Fecha**             | 17 / agosto / 2026                    |
| **Severidad**         | Low                                   |
| **Prioridad**         | Medium                                |