# Medio de pago alternativo

## Fuentes y alcance aprobado

- Figma: https://www.figma.com/design/3iU60ByWEkvtF8qQGl54ac/HISP---Challenge-UX-tech-3?node-id=40000024-824
- Card superior: nodo `40000024:925`. Details: `40000024:903`.
- Selección: `40000024:1151`. Gestión y confirmación: `40000024:1430`, `40000024:1560`.
- Consigna: `references/original-meli/challenge.pdf`, apartado B.
- Voz: casos en español `references/meli-cases/tiendas-express.pdf` y `fotos-ia.pdf`.
- Aprobado en conversación: comenzar en Details, principal vigente, sin alternativo,
  voseo argentino, card superior visible y navegación amarilla de Mercado Libre.

Esta especificación corresponde al flujo de pagos. Los documentos anteriores
sobre B1/B2 y la landing no se reemplazan ni se aplican a este flujo.

## Rutas y ejecución

- `/`: landing con los mismos componentes compartidos que Details; conserva su contenido.
- `/details`: detalle de suscripción y medios de pago.
- `/details/payment-methods`: selección de un medio guardado.
- `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`
- `npm run build` y `npm test` (tests nativos de Node, requiere Node 22.18+).

Prototipo exclusivamente local. El estado vive en memoria y se reinicia al
recargar. No hay backend, almacenamiento de tarjetas, cobros ni integraciones
reales. El saldo, identificadores y fechas son datos de demostración.

## Cambios respecto de Figma, por prioridad

1. Agregar un alternativo nunca cambia el principal. Visa permanece principal;
   se puede asociar Mastercard o dinero en cuenta como respaldo.
2. Conservar la card superior como invitación, sin la amenaza del vencimiento.
   Su cierre no oculta el acceso persistente de la sección Medios de pago.
3. Explicar el uso del alternativo antes de elegir, sin depender del tooltip.
4. Seleccionar con radios y confirmar con una acción explícita. No utilizar
   “Entendido” como confirmación de una modificación.
5. Volver a Details, mostrar el rol Alternativo y feedback persistente descartable.
6. Gestión secundaria: cambiar y eliminar únicamente el alternativo. Eliminarlo
   lo desvincula de Meli+, pero no lo borra de los medios guardados en la cuenta.
7. Header amarillo sticky en landing, Details y selección, sin la barra ficticia
   Android. Violeta Meli+ en la suscripción; CTA negro en la invitación y azul
   en las acciones de guardado. Reutilizar fuentes, tarjeta y assets originales.

Para representar el escenario vigente, la fecha ficticia de Visa cambia de
10/24 a 10/28. El vencimiento queda como variante futura, no como motivo del
caso principal. No se presenta la ausencia de respaldo como perfil incompleto.

## Textos principales

- Invitación: “Agregá un medio de pago alternativo”.
- Explicación: “Lo usaremos si no podemos cobrar tu suscripción con el medio principal.”
- Selección: “Elegí un medio de pago alternativo”.
- Aclaración: “Tu medio principal no cambia.”
- Guardado: “Agregar como alternativo” / “Guardar alternativo”.
- Feedback: “Agregaste un medio de pago alternativo.”
- Edición: “Cambiaste el medio de pago alternativo.”
- Eliminación: “Eliminaste el medio de pago alternativo de esta suscripción.”

## Interacción y accesibilidad

- Ingreso desde la card superior o desde Medios de pago.
- No se preselecciona un nuevo medio. En edición se muestra el alternativo actual.
- Principal visible pero no elegible como alternativo.
- Enviar sin selección muestra un error y enfoca la primera opción.
- Volver sin guardar conserva el estado anterior.
- Radio group nativo con etiquetas; navegación de vistas con título y foco.
- Confirmación de eliminación con `dialog.showModal()`, fondo inerte, foco inicial
  en Cancelar, ciclo de Tab y cierre con Escape. Cancelar devuelve foco a Modificar;
  eliminar enfoca Medios de pago, ya que el disparador desaparece.
- Feedback en región viva estable, sin desaparición automática.
- Toast con entrada de 180 ms (fade + subida de 8 px) y salida de 120 ms
  (fade + bajada de 4 px), ambas ease-out. Con movimiento reducido, solo fade.
  CSS nativo con `@starting-style` y transición discreta de `display` conserva
  el contenido durante la salida. Sin soporte, el cambio de display es inmediato.
  Sin autocierre ni librerías; el control saliente deja de recibir foco y el
  cierre manual devuelve el foco a Medios de pago sin desplazar la página.
- Las demás acciones de pagos no tienen animaciones ni desplazamientos suaves.
- La tarjeta Total incorpora el carrusel de servicios del nodo `40000024:263`:
  Disney+, Deezer, Max y Paramount+, en ese orden. Desplazamiento horizontal
  nativo en touch/trackpad, arrastre con mouse y control de avance con teclado.
- El control de dots ocupa 44 × 44 px: clic, Enter o Espacio avanzan; las
  flechas recorren las imágenes y Home/End van a los extremos. Los cuatro dots
  son indicadores dentro de ese control, no cuatro blancos táctiles diminutos.
- El gap visual del carrusel de servicios es 4 px; el del carrusel de planes
  sigue en 8 px. Mover contenido dentro de Total no cambia el plan.
- Una demostración breve revela parte de la próxima imagen y vuelve al inicio,
  sin cambiar la selección. Se ejecuta una sola vez por carga del documento,
  cuando el carrusel activo entra en pantalla. Se cancela ante interacción,
  salida del viewport o cambio de preferencia de movimiento.
- Con `prefers-reduced-motion: reduce` no se ejecuta la demostración y los
  cambios manuales se posicionan instantáneamente. No hay autoplay continuo.

## Componentes y tokens

- `src/components/Header.tsx`: navegación web compartida.
- `src/components/PlanCard.tsx`: tarjeta y lista de beneficios, variantes de
  contratación y suscripción activa sin duplicar estructura.
- `src/components/ServiceCarousel.tsx`, `useSnapCarousel.ts` y `useSwipeHint.ts`:
  contenido multimedia, observación compartida y demostración cancelable.
- `Button.tsx`, `Icon.tsx` y `ServiceLogo.tsx`: controles y assets reutilizables.
- `src/data/plans.tsx`: datos y copy originales de la landing.
- `src/tokens.css`: colores semánticos, espaciado, radios, tamaños y capas.
- Logos del nodo `40000024:946`: caja de 32 × 32 px, radio de 4 px y ajuste de
  imagen por marca. Los archivos originales se guardan en `public/assets/services/`.
- No se incorporan dependencias nuevas.

Branches locales renombradas a `feature/landing` y `feature/payment-change`.
Los cambios compartidos se trabajan en payment-change (incluida su ruta `/`);
feature/landing conserva su commit anterior hasta aprobar el traslado.
`main` no se modifica.

## Objetivo del board original

`references/original-meli/original-board.pdf` fija el KPI de esta sección:
**mejorar el ratio de cancelaciones involuntarias por overdue (error/falta de
cobro)**, con el objetivo de experiencia de que las personas suscriptas carguen
un medio de pago alternativo.

La primera versión de este flujo neutralizó el riesgo en tres capas a la vez:
movió el vencimiento de la Visa a 10/28, sacó la consecuencia del copy y omitió
el contexto de cobro. Contra un KPI que trata justamente del riesgo, eso dejaba
el flujo sin motivo visible. Los tres se repusieron, calibrados: se nombra la
consecuencia una vez, sin alarmismo, y no se presenta la ausencia de respaldo
como un perfil incompleto.

## Estado de cobro fallido

`/details?cobro=fallido` renderiza la variante a la que llega alguien desde el
aviso de cobro rechazado. Diferencias con el estado normal:

- La invitación se reemplaza por el aviso de falla, **que no se puede descartar**:
  un cobro rechazado es un hecho de la cuenta, no una sugerencia.
- El renglón de cobro pasa de `Próximo cobro` a `Reintentamos el cobro el ...`.
- El query se conserva al entrar y volver de la pantalla de selección.

## Comunicaciones

No se construyen: no hay backend y el entregable formal es Figma. El copy queda
acá para armarlas ahí. Son la palanca principal del KPI, porque la persona en
riesgo no está en la app cuando el cobro falla.

Preventiva:

- Asunto: “Agregá un medio de pago alternativo a Meli+”.
- Preheader: “Si falla un cobro, lo intentamos con el alternativo y no perdés los beneficios.”
- Push: “Agregá un medio de pago alternativo a Meli+ y no te quedes sin beneficios si falla un cobro.”

Post-falla:

- Asunto: “No pudimos cobrar tu suscripción a Meli+”.
- Cuerpo: “Intentamos cobrar $17,90 con tu Visa terminada en 8743 y no pudimos.
  Vamos a reintentar el 18 de septiembre. Agregá un medio de pago alternativo
  para que lo intentemos ahí si vuelve a fallar.”
- CTA: “Agregar un medio de pago alternativo”.

## Fuera de alcance

- Envío real de correo y notificaciones; el copy queda especificado arriba.
- Carga de una tarjeta nueva; el botón de Figma se conserva deshabilitado.
- Cambio o eliminación del principal.
- Soporte, cancelación, términos y ayuda de código de servicio:
  se preserva su representación, sin crear destinos.
- Las imágenes del carrusel no navegan a plataformas externas.
- Atrás desde Details no tiene destino definido y permanece deshabilitado.

## Verificación

- Build de producción y doce tests pasan: seis de pagos y seis de navegación,
  límites de arrastre y recorrido de la demostración.
- Prueba de navegador: ingreso desde ambos accesos, validación sin selección,
  alta con teclado, cambio de Mastercard a dinero en cuenta, eliminación y Escape.
- Revisión visual y de desbordamiento a 360, 390 y 412 px.
- Verificación del CTA negro, logos uniformes, gaps de 4/8 px, header sticky,
  avance de las cuatro imágenes, Home/End y arrastre anidado sin cambio de plan.
- Demostración observada en navegador: termina con scroll horizontal 0 y
  Disney+ activo. La preferencia de movimiento se contempla en código; no se
  cambió la configuración de accesibilidad del sistema del usuario.
- No se probaron lector de pantalla real ni dispositivo táctil físico.
