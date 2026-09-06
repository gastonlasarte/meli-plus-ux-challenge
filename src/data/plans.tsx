import type { ReactNode } from "react";

export type Plan = {
  id: string;
  name: string;
  short: string;
  price: string;
  cover: string;
  description: ReactNode;
  benefits: { service?: string; title?: string; text: ReactNode }[];
};

// Copy and order come from Figma node 40000024:493, not the earlier B1/B2 draft.
export const plans: Plan[] = [
  {
    id: "total",
    name: "Meli+ Total",
    short: "Total",
    price: "$17,90",
    cover: "total-cover.png",
    description: <>Disfrutá de las mejores películas, series y música además de todos los beneficios de <strong>Meli+ Esencial.</strong></>,
    benefits: [
      { service: "disney", title: "Disney+ Estándar", text: "Películas, series y el deporte de ESPN." },
      { service: "deezer", title: "Deezer Premium", text: "Música sin anuncios por 12 meses." },
      { service: "max", title: "Max", text: "30% de descuento." },
      { service: "paramount", title: "Paramount+", text: "30% de descuento." },
    ],
  },
  {
    id: "esencial",
    name: "Meli+ Esencial",
    short: "Esencial",
    price: "$9,90",
    cover: "esencial-cover.png",
    description: "Ahorrá en tus compras, pagos y hacé crecer tu dinero.",
    benefits: [
      { text: "Envíos gratis desde $29,00" },
      { text: "3 cuotas extra sin intereses." },
      { text: "Cashback en criptomonedas." },
      { text: <>Tu dinero rinde más en <strong>Mercado Pago.</strong></> },
    ],
  },
];
