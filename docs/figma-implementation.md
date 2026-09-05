# Figma implementation

Branch: `figma/implementation`

Source: https://www.figma.com/design/3iU60ByWEkvtF8qQGl54ac/HISP---Challenge-UX-tech-3?node-id=40000024-493

Frame: Plan Selection, 360 × 1975. Esencial is selected initially.

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

También se desvían del frame, por accesibilidad:

- `--action` y `--success` se oscurecen hasta pasar 4.5:1 en todos sus roles.
- Los controles sin destino se pintan como deshabilitados en lugar de a opacidad 1.
- Los tamaños de texto siguen la escala por rol de `tokens.css`; el piso es 12px.

### Iconos

Los iconos de UI del frame (Material Symbols relleno) se reemplazan por Iconoir
(trazo 1.5 sobre grilla de 24). Se copian los paths en `src/components/Icon.tsx`
en lugar de instalar `iconoir-react`, así el prototipo sigue sin dependencias
nuevas; la licencia MIT y la atribución están en `NOTICE.md`.

El motivo no es estético: como `<img>`, cada icono traía el color horneado en el
archivo y no seguía a los tokens — `add.svg` e `info.svg` habían quedado con el
azul anterior. Inline y con `currentColor`, el icono toma el color de su
superficie. Eso además elimina el `filter: invert(1)` del toast y los dos
archivos que representaban el estado de un mismo punto indicador, ahora CSS.

El trazo es 1.5, y 2 cuando el icono acompaña texto en peso 600.

Las marcas (Visa, Mastercard, Mercado Pago y los logos de los servicios) y los
assets decorativos siguen siendo los originales del frame: Iconoir no tiene
logotipos de marca.
