# SMB-125 — Los enlaces de Quick Links del footer no redirigen a sus destinos correspondientes

## Descripción

Los enlaces de navegación disponibles en la sección **Quick Links** del footer no dirigen correctamente al usuario a las páginas o secciones correspondientes de la aplicación.

Los enlaces **Home**, **Rooms**, **Booking** y **Contact** utilizan actualmente `href="#"`, provocando que todos dirijan al inicio de la homepage.

---

## Trazabilidad

| Elemento                | Referencia                                                                        |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                                          |
| **User Story**          | SMB-11 — Navegación entre las secciones públicas                                  |
| **Test Case**           | SMB-124 / TC46 — Verificar navegación mediante los enlaces del footer             |
| **Acceptance Criteria** | AC-2 — Navegación mediante enlaces internos / AC-3 — Navegación hacia la homepage |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* El footer es visible al desplazarse hasta la parte inferior de la homepage.

---

## Datos de prueba

Enlaces disponibles en **Quick Links**:

* **Home**
* **Rooms**
* **Booking**
* **Contact**

---

## Pasos para reproducir

1. Acceder a la homepage.
2. Desplazarse hasta el footer.
3. Localizar la sección **Quick Links**.
4. Seleccionar el enlace **Home**.
5. Comprobar el destino de la navegación.
6. Repetir el procedimiento con **Rooms**.
7. Repetir el procedimiento con **Booking**.
8. Repetir el procedimiento con **Contact**.

---

## Resultado actual

Los cuatro enlaces de **Quick Links** utilizan actualmente:

```html
<a href="#" class="text-white text-decoration-none">Home</a>
<a href="#" class="text-white text-decoration-none">Rooms</a>
<a href="#" class="text-white text-decoration-none">Booking</a>
<a href="#" class="text-white text-decoration-none">Contact</a>
```

* El enlace **Home** presenta el comportamiento esperado, ya que al seleccionarlo dirige al inicio de la homepage. Sin embargo, su implementación utiliza `href="#"`.
* Los enlaces **Rooms**, **Booking** y **Contact** presentan un comportamiento incorrecto, ya que también dirigen al inicio de la homepage en lugar de dirigir a sus respectivas secciones.

---

## Resultado esperado

* **Home** debe dirigir al inicio de la homepage.
* **Rooms** debe dirigir a la sección Rooms.
* **Booking** debe dirigir a la sección Booking.
* **Contact** debe dirigir a la sección Contact.
* Cada enlace debe ejecutar una navegación funcional hacia su destino correspondiente.

---

## Observaciones

* El enlace **Home** presenta el comportamiento correcto, pero el atributo `href` utilizado no corresponde con el destino esperado.
* **Rooms**, **Booking** y **Contact** presentan un destino incorrecto.
* Existe una inconsistencia entre el footer y el header: el header dispone de enlaces funcionales hacia las diferentes secciones, mientras que los enlaces equivalentes del footer utilizan `href="#"`.
* El problema es independiente de la navegación del header, validada en **TC42**.

---

## Recomendación

Configurar cada enlace con sus respectivos destinos, reemplazando el `href="#"` actual.

```html
<a href="/home">Home</a>
<a href="/#rooms">Rooms</a>
<a href="/#booking">Booking</a>
<a href="/#contact">Contact</a>
```

De esta forma, **Home** mantendrá su comportamiento actual utilizando el destino correcto, mientras que **Rooms**, **Booking** y **Contact** dirigirán al usuario a sus respectivas secciones.

---

## Evidencias

| #     | Tipo      | Descripción                                                                            | Referencia                                                                                                          |
| ----- | --------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **1** | Grabación | Reproducción del bug seleccionando cada uno de los enlaces disponibles en Quick Links. | [Ver grabación en Google Drive](https://drive.google.com/file/d/1-l01YKSpubMjqfMEghwrVA1A5kI8uilI/view?usp=sharing) |
| **2** | Captura   | Inspección del DOM donde se observa que el enlace Rooms utiliza `href="#"`.            | [Ver captura](../../evidence/SMB-1/SMB-11/SMB-125/footer-quick-links-dom.png)                                       |

---

## Environment

| Campo                 | Valor                                 |
| --------------------- | ------------------------------------- |
| **Dispositivo**       | Mac                                   |
| **Sistema operativo** | Tahoe 26.5.2                          |
| **Browser**           | Safari 26.5.2                         |
| **URL**               | `https://automationintesting.online/` |
| **Fecha**             | 20 / agosto / 2026                    |
| **Severidad**         | Low                                   |
| **Prioridad**         | Medium                                |
