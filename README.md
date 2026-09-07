# Meli+ — Prototipo del UX Challenge

Prototipo mobile-first de dos flujos de Meli+, el programa de suscripción de
Mercado Libre y Mercado Pago:

- **Landing de suscripción**, para que se entiendan los dos planes y se pueda
  elegir entre ellos.
- **Medio de pago alternativo**, para que un cobro rechazado no termine en una
  cancelación involuntaria.

No hay backend. El estado vive en memoria y se reinicia al recargar: no hay
cobros, ni almacenamiento de tarjetas, ni integraciones. Montos, códigos y
fechas son datos de demostración.

## Cómo correrlo

```bash
git clone https://github.com/gastonlasarte/meli-plus-ux-challenge.git
cd meli-plus-ux-challenge
npm install
npm run dev
```

| Ruta | Pantalla |
| --- | --- |
| `/` | Landing con los dos planes |
| `/details` | Detalle de la suscripción y medios de pago |
| `/details?cobro=fallido` | El mismo detalle, tras un cobro rechazado |
| `/details/payment-methods` | Elección del medio alternativo |

No hay link entre la landing y el detalle: son dos flujos distintos del mismo
ejercicio. Se navega cambiando la URL.

```bash
npm test          # modelo de pagos y del carrusel
npm run build     # build de producción
```

## Documentación

- [`docs/figma-implementation.md`](docs/figma-implementation.md) — qué sigue al
  frame original, en qué se desvía y por qué, incluido el racional de contraste.
- [`docs/payment-flow.md`](docs/payment-flow.md) — el flujo de pagos, con la
  priorización de las iteraciones y el copy completo.

## Sobre los assets

Las marcas, tipografías e imágenes de `public/assets` son de sus respectivos
titulares —Mercado Libre, Mercado Pago, Disney+, Deezer, Max, Paramount+, Visa,
Mastercard— y están acá solo para reproducir el ejercicio. No se redistribuyen
para ningún otro uso. El material de referencia del challenge no se versiona.
