# SMB-121 — La página 404 muestra una pantalla técnica sin opciones de navegación

## Descripción

Al acceder a una ruta inexistente, la aplicación muestra una pantalla 404 básica con el mensaje técnico **“404 | This page could not be found.”**, sin opciones para continuar navegando dentro del sitio.

---

## Trazabilidad

| Elemento                | Referencia                                                                  |
| ----------------------- | --------------------------------------------------------------------------- |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                                    |
| **User Story**          | SMB-11 — Navegación entre las secciones públicas                            |
| **Test Case**           | SMB-113 / TC44 — Verificar comportamiento al acceder a una ruta inexistente |
| **Acceptance Criteria** | AC-5 — Rutas inexistentes                                                   |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage es accesible.

---

## Datos de prueba

Ruta inexistente:

```text
/non-existent-route
```

---

## Pasos para reproducir

1. Acceder a la homepage.
2. Introducir una URL correspondiente a una ruta inexistente.
3. Acceder a la URL.
4. Esperar a que finalice la carga.
5. Verificar que se muestra la página de error 404.
6. Verificar las opciones de navegación disponibles en la página 404.
7. Intentar regresar a la homepage utilizando las opciones disponibles.

---

## Resultado esperado

* La aplicación debe gestionar la ruta inexistente de forma controlada.
* Debe mostrarse una página o mensaje indicando que el recurso solicitado no existe.
* La aplicación no debe mostrar errores de ejecución que bloqueen la interfaz.
* El usuario debe poder regresar a una sección válida del sitio.
* La navegación de la aplicación debe continuar funcionando después de acceder a la ruta inexistente.

---

## Resultado actual

Al acceder a una ruta inexistente, la aplicación muestra:

> **404 | This page could not be found.**

La página aparece completamente en negro y no proporciona ninguna opción de navegación para volver a la homepage.

Para regresar al sitio, el usuario debe utilizar el botón **Atrás** del navegador.

Además, en la consola se registra:

```text
Failed to load resource: the server responded with a status of 404 ()
```

---

## Observaciones

El código de respuesta HTTP `404` es correcto para una ruta inexistente.

El problema identificado corresponde a la experiencia de usuario de la página 404, que no proporciona opciones de navegación internas para continuar utilizando la aplicación.

---

## Recomendación

Diseñar una página 404 más atractiva y orientada al usuario, evitando mostrar mensajes excesivamente técnicos.

Se recomienda incluir un mensaje claro explicando que la página no existe y proporcionar opciones de navegación, por ejemplo:

* Volver a la página principal.
* Volver atrás.
* Opcionalmente, enlaces a las principales secciones del sitio.

Esto permitiría recuperar la navegación sin depender exclusivamente del botón **Atrás** del navegador y mejoraría la experiencia del usuario.

---

## Evidencias

| #     | Tipo      | Descripción                                                                                                     | Referencia                                                                                                          |
| ----- | --------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **1** | Captura   | Pantalla 404 mostrando únicamente el mensaje `404 \| This page could not be found.` sin opciones de navegación. | [Ver captura](../../evidence/SMB-1/SMB-11/SMB-121/404-page-without-navigation.png)                                  |
| **2** | Grabación | Reproducción del bug accediendo a una ruta inexistente.                                                         | [Ver grabación en Google Drive](https://drive.google.com/file/d/1zPL-tWFWmm4QT2m-XtpjIN4on6DBPfE6/view?usp=sharing) |

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
