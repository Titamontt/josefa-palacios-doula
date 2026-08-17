# Doula de la muerte y el duelo

Landing page de una sola página. HTML, CSS y JavaScript planos — sin build ni
dependencias. Se abre haciendo doble clic en `index.html`.

## Estructura

```
index.html
assets/
  css/style.css    variables de color y tipografía al inicio del archivo
  js/main.js       menú, scroll, FAQ y formulario
  img/             aquí van las fotos
  fonts/           Season Mix Light y PP Neue Montreal Book
```

## Qué falta reemplazar

Los marcadores están escritos entre corchetes para poder buscarlos. Búscalos con
`grep -rn "\[" index.html assets/js/main.js`:

| Marcador | Dónde | Qué es |
|---|---|---|
| `[FAMILIAR / EXPERIENCIA PERSONAL]` | sobre mí | la historia de origen |
| `[INSTITUCIÓN DE FORMACIÓN]` | sobre mí | dónde se formó |
| `[CIUDAD / REGIÓN]`, `[CIUDAD, PAÍS]` | sobre mí, footer | ubicación |
| `[EMAIL]` | footer y `main.js` | correo de contacto |
| `[INSTAGRAM]` | footer | usuario sin `@` |

## Fotos

Están puestas y viven en `assets/img/`:

- `hero-flores.jpg` — campo de flores blancas, mitad derecha del hero
- `josefa-retrato.jpg` — retrato de la sección Sobre mí

Se conectan con dos variables en `:root`, arriba de `assets/css/style.css`:

```css
--hero-img: url("../img/hero-flores.jpg");
--retrato-img: url("../img/josefa-retrato.jpg");
```

Para cambiarlas, deja el archivo nuevo en `assets/img/` y actualiza la ruta.
El encuadre se ajusta con `background-position` en `.hero__media`
(hoy `center 62%`) y en `.about__media` (hoy `center 25%`): el segundo valor
es qué parte de la foto queda a la vista, 0% arriba y 100% abajo.

Las originales venían en PNG de 2,4 MB; las convertí a JPEG (421 KB y 185 KB).
Si reemplazas alguna, conviene hacer lo mismo.

## Formulario

No hay servidor detrás. Al enviar, `main.js` arma un correo con los datos y lo
abre en el cliente de mail de quien escribe. Es lo que funciona en un sitio
estático sin backend, pero depende de que la persona tenga mail configurado.

Si prefieres recibir los mensajes de forma más fiable, la vía más simple es
Formspree: crear un formulario en su sitio y cambiar en `index.html`

```html
<form class="form" id="form" action="https://formspree.io/f/TU_ID" method="POST">
```

y borrar el bloque del formulario en `main.js`.

## Paleta

Definida como variables CSS en `:root`:

crema `#F4EDE1` · hueso `#FFFDF8` · ocre `#C08A4A` · salvia `#8D9C84` ·
café `#4A3728` · café hondo `#2E2118`

## Tipografías

Van cargadas desde `assets/fonts/`, sin depender de internet:

- **Season Mix Light** — titulares, cita destacada, logotipo del hero y frase
  de cierre
- **PP Neue Montreal Book** — cuerpo, menú, botones y formulario

Season Mix viene en un solo estilo, sin itálica: los tres lugares que antes
iban en itálica ahora van en redonda. Si más adelante consigues otros pesos o
la itálica, se agregan como `@font-face` nuevos al inicio de `style.css`.

> **Ojo con la licencia.** El archivo es `SeasonMix-Light-TRIAL.ttf` — una
> versión de prueba. Las licencias trial casi siempre prohíben publicar el
> sitio; hay que comprar la licencia web antes de subirlo.

Los `.ttf` y `.otf` funcionan en todos los navegadores actuales. Convertirlos a
`.woff2` los deja cerca de la mitad de peso, si en algún momento importa.
