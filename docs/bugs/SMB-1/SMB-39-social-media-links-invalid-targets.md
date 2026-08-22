# SMB-39 — Los iconos de redes sociales del footer no redirigen a sus respectivas plataformas

## Descripción

Los iconos de **Facebook, Instagram y Twitter** disponibles en el footer utilizan `href="#"`, por lo que no dirigen al usuario a las correspondientes redes sociales y no cumplen su función de navegación externa.

---

## Trazabilidad

| Elemento                | Referencia                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epic**                | SMB-1 — Public Homepage & Room Discovery                                                                                                    |
| **User Story**          | SMB-36 — Detección de enlaces rotos o destinos inválidos                                                                                    |
| **Test Case**           | SMB-139 / TC56 — Verificar que los enlaces de las páginas públicas disponen de un destino válido                                            |
| **Acceptance Criteria** | AC-1 — Los enlaces públicos deben disponer de un destino funcional / AC-3 — No deben existir elementos de navegación con destinos inválidos |

---

## Precondiciones

* La aplicación se encuentra disponible.
* La homepage carga correctamente.
* Los elementos de navegación públicos son visibles.
* El DOM puede inspeccionarse.

---

## Pasos para reproducir

1. Acceder a la homepage.
2. Desplazarse hasta el footer.
3. Localizar los iconos de **Facebook, Instagram y Twitter**.
4. Seleccionar el icono de **Facebook**.
5. Observar el destino de navegación.
6. Volver al footer.
7. Repetir la acción con **Instagram**.
8. Repetir la acción con **Twitter**.

---

## Resultado actual

Los iconos de **Facebook, Instagram y Twitter** se muestran correctamente en el footer y son interactivos.

Sin embargo, todos utilizan:

```html
href="#"
```

Por este motivo, al seleccionarlos no se abre ni se alcanza la red social correspondiente.

La navegación permanece dentro de la homepage en lugar de dirigir al usuario a un destino externo válido.

---

## Resultado esperado

* Todos los elementos destinados a realizar navegación deben tener un destino funcional.
* Cada icono debe dirigir al usuario a la plataforma correspondiente mediante una URL válida.
* No deben utilizarse valores como `href="#"` cuando el elemento pretende dirigir al usuario a la red social correspondiente.
* Ningún enlace debe aparentar ser funcional si no tiene un destino real asociado.

---

## Recomendación

Configurar cada icono con la URL correspondiente a la red social que representa.

Si alguna red social no está disponible o no forma parte del alcance del sitio, se recomienda eliminar o deshabilitar el icono hasta disponer de un destino válido.

---

## Evidencias

| #     | Tipo      | Descripción                                                                                                                                                             | Referencia                                                                                                          |
| ----- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **1** | Grabación | Ejecución del comportamiento del bug mostrando la interacción con los iconos de Facebook, Instagram y Twitter y la inspección del elemento donde se observa `href="#"`. | [Ver grabación en Google Drive](https://drive.google.com/file/d/1qUxfE099lpUnhCh3GQhtJkI-qdLjnmUZ/view?usp=sharing) |

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
| **Prioridad**         | Low                                   |
