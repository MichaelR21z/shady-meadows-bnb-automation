# SMB-119 — El enlace `Amenities` del header no dirige a una sección existente de la homepage

## Descripción

El enlace **Amenities** del header apunta a `/#amenities`, pero la homepage no contiene ningún elemento con `id="amenities"`.

Como resultado, el enlace no lleva al usuario a una sección correspondiente a **Amenities**.

---

## Trazabilidad

| Elemento                | Referencia                                                            |
| ----------------------- | --------------------------------------------------------------------- |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                              |
| **User Story**          | SMB-11 — Navegación entre las secciones públicas                      |
| **Test Case**           | SMB-111 / TC42 — Verificar navegación mediante los enlaces del header |
| **Acceptance Criteria** | AC-1 — Navegación mediante el menú principal                          |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El header está visible.

---

## Pasos para reproducir

1. Acceder a la homepage.
2. Localizar el header.
3. Seleccionar el enlace **Amenities**.
4. Observar el destino de la navegación.
5. Revisar el DOM de la homepage y buscar un elemento con `id="amenities"`.

---

## Resultado actual

El enlace **Amenities** utiliza:

```html
<a class="nav-link" href="/#amenities">Amenities</a>
```

El destino configurado es:

```text
/#amenities
```

Sin embargo, no existe actualmente ningún elemento en el DOM con:

```text
id="amenities"
```

Por lo tanto, el usuario no es dirigido a una sección específica relacionada con **Amenities**.

---

## Resultado esperado

El enlace **Amenities** debe dirigir al usuario a una sección de la homepage que contenga la información correspondiente a los servicios o amenities del establecimiento.

---

## Observaciones

* El resto de enlaces del header funcionan correctamente.
* El problema parece estar relacionado con la correspondencia entre el destino definido en el enlace y la estructura actual del DOM.
* No se ha determinado si la solución correcta consiste en crear la sección **Amenities** o modificar el destino del enlace.

---

## Recomendación

Revisar con el equipo cuál debe ser el comportamiento esperado para **Amenities**.

Si existe una sección de Amenities prevista en el diseño, se recomienda crearla y asociarla al enlace mediante:

```html
id="amenities"
```

Si la sección no forma parte de la homepage, se recomienda modificar o eliminar el enlace para evitar ofrecer una opción de navegación que no tiene un destino válido.

---

## Evidencias

| #     | Tipo    | Evidencia                                                                                           | Referencia                                                                                                      |
| ----- | ------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **1** | Vídeo   | Interacción con los enlaces del header, mostrando que `Amenities` no dirige a una sección existente | [Ver vídeo en Google Drive](https://drive.google.com/file/d/1r_Pvn8DIKOB_gZ4VU_Dno_-VExrpjov4/view?usp=sharing) |
| **2** | Captura | DOM del enlace `Amenities` mostrando `href="/#amenities"`                                           | `[docs/evidence/SMB-1/SMB-11/SMB-119/amenities-link-dom.png]`                                                                                            |

---

## Environment

| Campo                 | Valor                                 |
| --------------------- | ------------------------------------- |
| **Dispositivo**       | Mac                                   |
| **Sistema operativo** | Tahoe 26.5.2                          |
| **Browser**           | Safari 26.5.2                         |
| **URL**               | `https://automationintesting.online/` |
| **Fecha**             | 17 / agosto / 2026                    |
| **Severidad**         | Medium                                |
| **Prioridad**         | Medium                                |
