# Medio de pago alternativo

## Fuentes y alcance aprobado

- Consigna: `references/original-meli/challenge.pdf`, apartado B.
- Voz: casos en español `references/meli-cases/tiendas-express.pdf` y `fotos-ia.pdf`.
- Aprobado en conversación: comenzar en Details, principal vigente, sin alternativo,
  voseo argentino, card superior visible y navegación amarilla de Mercado Libre.

## Rutas y ejecución

- `/`: landing con los mismos componentes compartidos que Details; conserva su contenido.
- `/details`: detalle de suscripción y medios de pago.
- `/details/payment-methods`: selección de un medio guardado.
- `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`
- `npm run build` y `npm test` (tests nativos de Node, requiere Node 22.18+).

Prototipo exclusivamente local. El estado vive en memoria y se reinicia al
recargar. No hay backend, almacenamiento de tarjetas, cobros ni integraciones
reales. El saldo, identificadores y fechas son datos de demostración.

## Priorización de las iteraciones

Ordenadas por impacto sobre el objetivo del board —bajar las cancelaciones
involuntarias por overdue— y no por esfuerzo.

**1. El principal nunca queda en riesgo.** La exploración original resuelve
"agregar un alternativo" y "cambiar el principal" en la misma pantalla: se
titula "Seleccionar medio de pago", encabeza "Medio de Pago" y en ningún lugar
dice "alternativo". Acá la pantalla se llama "Medio de pago alternativo", el
encabezado lo repite y se aclara que el principal no cambia; el principal
aparece en la lista, marcado y no elegible. Va primero porque un error acá le
cambia a la persona con qué se le cobra.

**2. Nombrar lo que está en juego.** El copy explicaba el mecanismo —"lo
usaremos si no podemos cobrar"— y nunca la consecuencia. Contra un KPI que
trata de cancelaciones, la invitación ahora dice que si falla el cobro y no hay
alternativo la suscripción se cancela y se pierden los beneficios. Una vez, sin
alarmismo, y sin presentar la ausencia de respaldo como un perfil incompleto.

**3. Contexto de cobro.** Monto y fecha del próximo cobro en la card de
suscripción. Sin ellos, "agregá un respaldo" es una afirmación sin evidencia:
con ellos, el riesgo tiene precio y calendario.

**4. Estado de protección.** Medios de pago abre contestando si la suscripción
tiene respaldo o no, que es la pregunta que la sección existe para responder.
Reemplaza a una explicación que decía lo mismo más abajo.

**5. Estado de cobro fallido.** `/details?cobro=fallido` es la pantalla a la que
llega alguien desde el aviso de cobro rechazado. El prototipo asumía que todo
estaba bien; el objetivo trata de cuando no lo está.

**6. Confirmar en vez de aplicar al toque.** La original aplica el alternativo
al tocar una fila y vuelve, sin confirmación ni feedback. Acá se elige con
radios y se confirma con una acción explícita, y el resultado se anuncia en un
toast persistente y descartable. Enviar sin selección enfoca la primera opción.

**7. Explicar antes de elegir, no detrás de un tooltip.** En touch un tooltip no
se alcanza, y esa frase es lo que vuelve comprensible la feature. Vive en texto
permanente en la invitación y otra vez en la pantalla de selección.

**8. La invitación se puede cerrar sin perder el acceso.** Cerrarla no esconde
la entrada persistente de Medios de pago. El aviso de cobro fallido también se
cierra, porque el dato del reintento queda en la card.

**9. Gestión acotada.** Cambiar y eliminar solo el alternativo. El diálogo de
eliminación dice qué pasa —deja de usarse como respaldo, sigue guardado en la
cuenta, el principal no cambia— y el botón nombra la acción en vez de contestar
"sí". Cambiar o eliminar el principal queda fuera de alcance.

**10. Jerarquía de la pantalla.** Es configuración, no venta: la card de
suscripción arranca colapsada con lo esencial —qué plan, que está activo, cuánto
y cuándo se cobra— y el contenido queda detrás de "Ver qué incluye". Eso subió
Medios de pago de 1261 a 771 px en 375×812, arriba del fold.

**11. Identidad.** Header sticky sin la barra ficticia Android: amarillo en la
landing, violeta en Details y selección, para que encabece el bloque al que
pertenece. Violeta Meli+ en la suscripción, CTA negro en la invitación y azul en
las acciones de guardado. Fuentes, tarjeta, glifos y assets son los originales.

Para representar el escenario vigente, la fecha ficticia de Visa cambia de
10/24 a 10/28. El vencimiento queda como variante futura, no como motivo del
caso principal.

## Textos principales

- Invitación: “Agregá un medio de pago alternativo”.
- Lo que está en juego: “Si falla el cobro con tu medio principal y no tenés un
  alternativo, tu suscripción se cancela y perdés los beneficios.”
- Explicación: “Lo usaremos solo si no podemos cobrar tu suscripción con el
  medio principal.”
- Estado de protección: “Tu suscripción no tiene respaldo. Si falla el cobro, se
  cancela.” / “Tu suscripción tiene respaldo. Si falla el cobro con el
  principal, lo intentamos con el alternativo.”
- Cobro fallido: “No pudimos cobrar tu suscripción” + “Intentamos cobrar $17,90
  con tu Visa terminada en 8743 el 15 de septiembre. Reintentamos el 18 de
  septiembre. Agregá un medio de pago alternativo para que lo intentemos ahí.”
- Cobro: “Suscripción mensual” · “Próximo cobro: 15 de septiembre” /
  “Reintentamos el cobro el 18 de septiembre”.
- Selección: “Elegí un medio de pago alternativo”.
- Aclaración: “Tu medio principal no cambia.”
- Guardado: “Agregar como alternativo” / “Guardar alternativo”.
- Feedback: “Agregaste un medio de pago alternativo.”
- Edición: “Cambiaste el medio de pago alternativo.”
- Eliminación: “Eliminaste el medio de pago alternativo de esta suscripción.”
- Código de servicio: “Es el código que te piden Disney+ y Star+ para activar tu
  beneficio. Lo usás una sola vez, al crear tu cuenta o al vincular una que ya
  tengas.”
- Fuera de alcance, por acción: “<Acción> no forma parte de este prototipo.”

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
- Volver a Medios de pago después de guardar o eliminar se desplaza suave;
  con movimiento reducido, instantáneo. El resto de las acciones no anima.
- La tarjeta Total incorpora el carrusel de servicios:
  Disney+, Deezer, Max y Paramount+, en ese orden. Desplazamiento horizontal
  nativo en touch/trackpad, arrastre con mouse y control de avance con teclado.
- El control de dots del carrusel de servicios ocupa 44 × 44 px: clic, Enter o
  Espacio avanzan; las flechas recorren las imágenes y Home/End van a los
  extremos. Los cuatro dots son indicadores dentro de ese control, no cuatro
  blancos táctiles diminutos. Mover contenido dentro de Total no cambia el plan.
- En la landing, los planes se eligen con un control segmentado que lleva sus
  nombres, no con puntos anónimos.
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
- Logos de servicio: caja de 32 × 32 px, radio de 4 px y ajuste de
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

- Build de producción y dieciséis tests pasan: seis de pagos, seis de navegación
  y cuatro de la barra superior, más límites de arrastre y recorrido de la demostración.
- Prueba de navegador: ingreso desde ambos accesos, validación sin selección,
  alta con teclado, cambio de Mastercard a dinero en cuenta, eliminación y Escape.
- Revisión visual y de desbordamiento a 360, 390 y 412 px.
- Verificación del CTA negro, logos uniformes, gaps de 4/8 px, header sticky,
  avance de las cuatro imágenes, Home/End y arrastre anidado sin cambio de plan.
- Demostración observada en navegador: termina con scroll horizontal 0 y
  Disney+ activo. La preferencia de movimiento se contempla en código; no se
  cambió la configuración de accesibilidad del sistema del usuario.
- No se probaron lector de pantalla real ni dispositivo táctil físico.
