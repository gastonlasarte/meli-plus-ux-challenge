import type { ReactNode } from "react";

export type FaqEntry = { id: string; question: ReactNode; answer: ReactNode };

// Las preguntas vienen del frame de Figma (nodo 40000024:493), que las trae
// colapsadas y sin respuestas. Las respuestas de abajo son CONTENIDO DUMMY para
// poder mostrar el acordeón: no son política de producto ni condiciones reales
// de Meli+, y hay que reemplazarlas por texto aprobado antes de publicar.

export const faq: FaqEntry[] = [
  {
    id: "cambiar-plan",
    question: <>Si me suscribo a uno de los planes de <strong>Meli+</strong>, ¿puedo cambiarlo luego?</>,
    answer: "Sí. Podés cambiar de plan cuando quieras desde el detalle de tu suscripción. El cambio se aplica en el siguiente período.",
  },
  {
    id: "servicios-incluidos",
    question: <>Si me suscribo a <strong>Meli+</strong>, ¿tendré acceso a <strong>Disney+</strong> y <strong>Deezer Premium</strong> sin cargo extra?</>,
    answer: "Sí, los dos vienen incluidos en Meli+ Total sin costo adicional. Activás cada servicio desde el detalle de tu suscripción con el código que te damos.",
  },
  {
    id: "cambiar-disney",
    question: <>¿Puedo cambiar el plan de <strong>Disney+</strong> que está incluido con <strong>Meli+ Total</strong>?</>,
    answer: "Sí. Podés pasar a un plan superior de Disney+ pagando la diferencia en Disney+. La parte que cubre Meli+ Total no cambia.",
  },
  {
    id: "disney-otro-proveedor",
    question: <>¿Qué sucede si ya contraté <strong>Disney+</strong> con otro proveedor?</>,
    answer: "Podés vincular la cuenta que ya tenés al activar el beneficio. Si preferís no hacerlo, seguí con tu suscripción actual y activalo cuando quieras.",
  },
];
