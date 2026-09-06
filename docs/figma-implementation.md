# Figma implementation

Branch: `figma/implementation`

Source: https://www.figma.com/design/3iU60ByWEkvtF8qQGl54ac/HISP---Challenge-UX-tech-3?node-id=40000024-493

Frame: Plan Selection, 360 × 1975. El frame abre en Esencial; la landing abre
en Total, por decisión de producto: es el plan hacia el que se empuja.

This branch follows the supplied Figma frame, including its copy, prices, assets,
plan order and carousel. The earlier B1/B2 requirements and copy remain preserved
in the documentation and in branch `prototype/b1-b2`; they are not merged into
this new visual implementation.

## Implemented behavior

- Native horizontal scroll with CSS scroll snapping.
- Plan selectors support pointer, keyboard, arrow keys, Home and End.
- IntersectionObserver keeps the selectors in sync with the visible card.
- Reduced motion uses instant positioning and removes opacity transitions.
- Original images and SVG exports are stored in `public/assets/figma`.
- Proxima Nova fonts are stored locally from Mercado Libre's public webfont CDN.

## Pending source information

- The frame includes collapsed FAQ questions but no answers. Questions remain
  disabled until approved answers are supplied.
- The back button has no specified previous page and remains disabled.
- “Elegir Plan” has no destination in the supplied frame. It remains disabled;
  checkout is outside the current project scope.

No subscription, payment or FAQ-answer behavior is fabricated.

## Verification

- Production build passes (`npm run build`).
- Browser checked at 360, 390 and 412 CSS pixels; no document-level horizontal
  overflow. All local images load and no console warnings/errors were reported.
- Verified initial Esencial selection, pointer selection of Total, keyboard
  navigation, and native horizontal scrolling updating the active indicator.
- Vertical scrolling preserves the selected plan.
- Reduced-motion handling is implemented and code-reviewed; OS preference
  emulation and a physical touchscreen were not tested.
- The 8px dots have an 8px visual gap, matching Figma, within adjacent 44px
  selector targets that do not overlap.

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
