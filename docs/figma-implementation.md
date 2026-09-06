# Implementación del frame de Figma

Branch: `figma/implementation`

Fuente: https://www.figma.com/design/3iU60ByWEkvtF8qQGl54ac/HISP---Challenge-UX-tech-3?node-id=40000024-493

Frame: Plan Selection, 360 × 1975. El frame abre en Esencial; la landing abre
en Total, por decisión de producto: es el plan hacia el que se empuja.

Esta branch sigue el frame provisto —copy, precios, assets, orden de planes y
carrusel—. Los requisitos y el copy anteriores de B1/B2 se conservan en la
documentación y en la branch `prototype/b1-b2`; no se incorporan a esta
implementación visual.

## Comportamiento implementado

- Desplazamiento horizontal nativo con scroll snapping de CSS.
- Los planes se eligen con un control segmentado que lleva sus nombres, y
  responde a puntero, teclado, flechas, Home y End.
- Un `IntersectionObserver` mantiene el control en sincronía con la card visible.
- Con movimiento reducido, el posicionamiento es instantáneo y se quitan las
  transiciones de opacidad.
- Las imágenes y los SVG decorativos originales viven en `public/assets/figma`.
  Los glifos de UI del frame están inline en `src/components/Icon.tsx`.
- Las fuentes Proxima Nova se guardan localmente desde el CDN público de
  Mercado Libre.

## Información pendiente de la fuente

- El frame trae las preguntas del FAQ colapsadas y sin respuestas. El acordeón
  está implementado; las respuestas se escribieron para el prototipo y están
  aprobadas, como datos de demostración.
- El botón Atrás no tiene página anterior definida y permanece deshabilitado.
- “Elegir plan” no tiene destino en el frame y el checkout está fuera de
  alcance. En vez de quedar deshabilitado y parecer roto, avisa que no forma
  parte de este prototipo.

No se fabrica comportamiento de suscripción ni de pago.

## Verificación

- Build de producción y los doce tests pasan.
- Sin desbordamiento horizontal a 320 y 375 px, ni errores de consola.
- Contrastes medidos sobre el par realmente renderizado, con el alfa compuesto
  sobre su fondo real. El detalle está en “Contraste”.
- Geometría verificada por DOM: bordes de alineación, gaps, áreas táctiles y
  posición de las secciones.

Lo que no se verificó, y conviene mirar antes de mostrarlo: que tocar una
pestaña cambie efectivamente de plan, el desplazamiento suave, Escape en el
diálogo, `prefers-reduced-motion` real, Firefox —donde recién se nota el arreglo
de `line-height`, porque no soporta `text-box`— y un lector de pantalla. Las
animaciones y el `IntersectionObserver` necesitan que la página pinte, y el
panel de vista previa usado durante el desarrollo no pinta.

## Desvíos posteriores a la auditoría de interfaz

Todo lo de esta sección está aprobado (2026-09-05).

La landing ya no reproduce el copy del frame palabra por palabra. Toda la interfaz
habla una sola voz —voseo argentino, el registro que ya fijaban `content.md` y
`payment-flow.md`— porque el producto cambiaba de dialecto al pasar de la landing
a Details. Cambios de copy respecto del frame:

- `Consigue` → `Conseguí`, `Elige un plan` → `Elegí un plan`, `Disfruta` → `Disfrutá`,
  `Ahorra` / `haz` → `Ahorrá` / `hacé`, `Consulta` → `Consultá`.
- Un solo término por concepto: `cash back` / `Cash-back` → `cashback`;
  `cryptomonedas` → `criptomonedas`; `30% Off.` → `30% de descuento.`
- Sentence case en toda la interfaz: `Elegir Plan` → `Elegir plan`,
  `Preguntas Frecuentes` → `Preguntas frecuentes`, `3 Cuotas` → `3 cuotas`.
- Formato numérico es-AR, coherente con el `$13.000` que ya usaba el flujo de
  pagos: `$17.90` → `$17,90`, `$9.90` → `$9,90`, `$29.00` → `$29,00`.
- Etiqueta verbo-primero: `Nuevo medio de pago` → `Agregar un nuevo medio de pago`.

Copy nuevo, que el frame no traía:

- Las cuatro respuestas del FAQ (`src/data/faq.tsx`). El frame trae las preguntas
  colapsadas y sin respuestas; se escribieron para el prototipo y son datos de
  demostración, no condiciones contractuales.
- “Elegir un plan no forma parte de este prototipo.”, el aviso del CTA de la landing.

También se desvían del frame, por accesibilidad:

- `--action` y `--success` se oscurecen hasta pasar 4.5:1 en todos sus roles.
  El detalle está en “Contraste” más abajo.
- Los controles sin destino se pintan como deshabilitados en lugar de a opacidad 1.
  La excepción es `Elegir plan`: queda habilitado y explica el alcance en un toast,
  porque es la acción principal de la landing.
- Los tamaños de texto siguen la escala por rol de `tokens.css`; el piso es 12px.
- Los dos puntos indicadores pasan a un control segmentado con los nombres de
  los planes, arriba del riel: `acceptance.md` pide que Esencial y Total sean
  explícitos antes de interactuar, y dos puntos anónimos no lo son.
- En Details, la card de suscripción arranca colapsada y lleva el cobro en su
  pie: una sola card que dice qué plan, que está activo, cuánto cuesta y cuándo
  se cobra. El contenido del plan queda detrás de `Ver más`.

### Contraste

Dos colores del frame no llegan al mínimo de 4.5:1 que WCAG pide para texto de
menos de 24px. No es un detalle de implementación: son el color con el que se
pintan todas las acciones del producto y el que confirma que la suscripción está
activa.

| Par | Frame | Ahora |
| --- | --- | --- |
| `--action` como texto sobre `--surface` | **3.34:1** | 5.39:1 |
| Texto claro sobre `--action` | **3.61:1** | 5.82:1 |
| `--action` como texto sobre blanco | **3.64:1** | 5.87:1 |
| Badge “Activa” sobre `--success` | **3.17:1** | 5.90:1 |
| Texto del toast sobre `--success` | **3.20:1** | 5.95:1 |

`--action` pasa de `#3483fa` a `#1560cc` y `--success` de `#00a650` a `#00742a`.
Los dos conservan tono y croma: solo baja la luminosidad, que es la palanca que
no altera la identidad del color.

Lo que ya cumplía se dejó intacto: `--text-secondary` sobre blanco (4.76:1), el
chip “Habilitada” (4.84:1) y el rojo de error (6.03:1 como texto, 6.52:1 con
texto claro encima, que además pasa a ser el rol destructivo del diálogo de
eliminación).

El anillo de foco se unificó con `--action`, que sobre el amarillo del header da
4.63:1 contra un mínimo de 3:1 para indicadores. Sobre las superficies violeta y
oscuras se hereda un anillo claro, porque ahí el azul no llegaría.

Es la desviación del frame que más se defiende sola: detectar que el color de
acción de la marca no cumple y proponer un valor que sí, con la medición al
lado, es parte de lo que el ejercicio pide mirar. Todas las mediciones son sobre
el par realmente renderizado, con el alfa compuesto sobre su fondo real.

### Iconos

Los iconos de UI son los glifos del propio frame (Material Symbols exportados
desde Figma), pero servidos inline en `src/components/Icon.tsx` en lugar de como
`<img>`. El problema nunca fue el dibujo: como archivos traían el color horneado
—`add.svg` e `info.svg` habían quedado con un azul viejo— y no seguían a los
tokens. Inline y con `currentColor`, cada icono toma el color de su superficie.
Eso además elimina el `filter: invert(1)` del toast y los dos archivos que
representaban el estado de un mismo punto indicador, ahora CSS.

Se probó reemplazarlos por Iconoir y se revirtió: la consigna marca la
consistencia con el sistema de Meli como prioridad, y el cambio de familia no
era necesario para resolver el acoplamiento de color.

Las marcas (Visa, Mastercard, Mercado Pago y los logos de los servicios) siguen
siendo `<img>`: son multicolor y una máscara o un `fill` único las rompería.
