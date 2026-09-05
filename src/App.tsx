import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

const asset = (name: string) => `/assets/figma/${name}`;

type Plan = {
  id: string;
  name: string;
  price: string;
  cover: string;
  description: ReactNode;
  benefits: { image: string; title?: string; text: ReactNode }[];
};

// Copy and order come from Figma node 40000024:493, not the earlier B1/B2 draft.
const plans: Plan[] = [
  {
    id: "total",
    name: "Meli+ Total",
    price: "$17.90",
    cover: "total-cover.png",
    description: <>Disfruta de las mejores películas, series y música además de todos los beneficios de <strong>Meli+ Esencial.</strong></>,
    benefits: [
      { image: "disney.png", title: "Disney+ Estándar", text: "Películas, series y el deporte de ESPN." },
      { image: "deezer.png", title: "Deezer Premium", text: "Música sin anuncios por 12 meses." },
      { image: "max.png", title: "Max", text: "30% Off." },
      { image: "paramount.png", title: "Paramount+", text: "30% Off." },
    ],
  },
  {
    id: "esencial",
    name: "Meli+ Esencial",
    price: "$9.90",
    cover: "esencial-cover.png",
    description: "Ahorra en tus compras, pagos y haz crecer tu dinero.",
    benefits: [
      { image: "check.svg", text: "Envíos gratis desde $29.00" },
      { image: "check.svg", text: "3 Cuotas extra sin intereses." },
      { image: "check.svg", text: "Cash-back en cryptomonedas." },
      { image: "check.svg", text: <>Tu dinero rinde más en <strong>Mercado Pago.</strong></> },
    ],
  },
];

function Header() {
  return (
    <header className="top-bar">
      <div className="status-bar" aria-hidden="true">
        <img src={asset("wifi.svg")} alt="" width="18" height="14" />
        <img src={asset("cellular.svg")} alt="" width="14" height="14" />
        <img src={asset("battery.svg")} alt="" width="9" height="14" />
        <span>12:30</span>
      </div>
      <div className="top-bar__navigation">
        <button className="back-button" type="button" disabled aria-label="Volver">
          <img src={asset("arrow-left.svg")} alt="" width="24" height="24" />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="meli-logo" src={asset("meli-logo.svg")} alt="Meli+" width="60" height="24" />
      <h1 id="hero-title">Consigue <strong>envíos gratis, cuotas extra sin intereses, cash back</strong> y beneficios en entretenimiento.</h1>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article className={`plan-card plan-card--${plan.id}`} aria-labelledby={`${plan.id}-title`}>
      <div className="plan-card__cover">
        <img src={asset(plan.cover)} alt="" width="320" height={plan.id === "total" ? 176 : 236} draggable="false" />
        {plan.id === "total" && <img className="plan-card__promoted" src={asset("disney.png")} width="32" height="32" alt="" />}
      </div>
      <div className="plan-card__header">
        <h3 id={`${plan.id}-title`}>{plan.name}</h3>
        <p>{plan.description}</p>
      </div>
      <ul className="plan-card__benefits">
        {plan.benefits.map((benefit, index) => (
          <li key={index}>
            <img src={asset(benefit.image)} alt="" width={benefit.title ? 32 : 16} height={benefit.title ? 32 : 16} draggable="false" />
            <div>{benefit.title && <h4>{benefit.title}</h4>}<p>{benefit.text}</p></div>
          </li>
        ))}
      </ul>
      <footer className="plan-card__footer">
        <p className="price"><strong>{plan.price}</strong><span>Por mes</span></p>
        <button className="choose-plan" type="button" disabled>Elegir Plan</button>
      </footer>
    </article>
  );
}

function PlanCarousel() {
  const [active, setActive] = useState(1);
  const rail = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);
  const indicators = useRef<(HTMLButtonElement | null)[]>([]);

  // Start at Esencial before paint, matching the selected state of the frame.
  useLayoutEffect(() => {
    const container = rail.current;
    const initial = slides.current[1];
    if (container && initial) container.scrollLeft = initial.offsetLeft - 24;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.65);
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.index));
    }, { root: rail.current, threshold: 0.65 });
    slides.current.forEach((slide) => { if (slide) observer.observe(slide); });
    return () => observer.disconnect();
  }, []);

  const select = (index: number) => {
    const container = rail.current;
    const slide = slides.current[index];
    if (!container || !slide) return;
    container.scrollTo({
      left: slide.offsetLeft - 24,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    let next: number;
    if (event.key === "ArrowLeft" || event.key === "Home") next = 0;
    else if (event.key === "ArrowRight" || event.key === "End") next = 1;
    else return;
    event.preventDefault();
    if (next !== index) select(next);
    indicators.current[next]?.focus({ preventScroll: true });
  };

  return (
    <div className="carousel" role="region" aria-roledescription="carrusel" aria-label="Planes Meli+">
      <div className="carousel__rail" ref={rail}>
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            id={`slide-${plan.id}`}
            data-index={index}
            className={`carousel__slide${index === active ? " is-active" : ""}`}
            ref={(element) => { slides.current[index] = element; }}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de 2: ${plan.name}`}
            inert={active !== index}
          >
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>
      <div className="carousel__indicators" aria-label="Seleccionar plan">
        {plans.map((plan, index) => (
          <button
            key={plan.id}
            type="button"
            ref={(element) => { indicators.current[index] = element; }}
            aria-label={`Ver ${plan.name}`}
            aria-controls={`slide-${plan.id}`}
            aria-pressed={active === index}
            onClick={() => select(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <img src={asset(active === index ? "dot-active.svg" : "dot-inactive.svg")} alt="" width="8" height="8" />
          </button>
        ))}
      </div>
      <p className="sr-only" role="status" aria-live="polite">{plans[active].name}</p>
    </div>
  );
}

function MarketingZone() {
  return (
    <section className="marketing" aria-labelledby="plans-title">
      <div className="marketing__background" aria-hidden="true">
        <img className="marketing__top-wave" src={asset("wave-top.svg")} alt="" width="752" height="84" />
        <div className="marketing__gradient" />
        <img className="marketing__bottom-layers" src={asset("wave-layers.svg")} alt="" width="752" height="43" />
        <img className="marketing__bottom-wave" src={asset("wave-bottom.svg")} alt="" width="752" height="37" />
      </div>
      <img className="hero-art" src={asset("hero.png")} alt="" width="360" height="303" fetchPriority="high" />
      <h2 id="plans-title" tabIndex={-1}>Elige un plan</h2>
      <PlanCarousel />
    </section>
  );
}

const questions = [
  <>Si me suscribo a uno de los planes de <strong>Meli+</strong>, ¿puedo cambiarlo luego?</>,
  <>Si me suscribo a <strong>Meli+</strong>, ¿tendré acceso a <strong>Disney+</strong> y <strong>Deezer Premium</strong> sin cargo extra?</>,
  <>¿Puedo cambiar el plan de <strong>Disney+</strong> que está incluido con <strong>Meli+ Total</strong>?</>,
  <>¿Qué sucede si ya contraté <strong>Disney+</strong> con otro proveedor?</>,
];

function FrequentlyAskedQuestions() {
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Preguntas Frecuentes</h2>
      {questions.map((question, index) => (
        // Only collapsed questions are supplied by the frame. No fabricated answers.
        <button className="faq__question" type="button" key={index} disabled>
          <span>{question}</span>
          <img src={asset("chevron.svg")} alt="" width="24" height="24" />
        </button>
      ))}
    </section>
  );
}

function Legal() {
  return (
    <footer className="legal">
      <p>Los beneficios de Meli son válidos para usuarios mayores de edad.</p>
      <p>(1) Envíos gratis para productos seleccionados con la etiqueta Meli+ en la modalidad de entrega "Tu Día de Entregas" y sujeto a condiciones. Consulta los Términos y condiciones.</p>
      <p>(2) Cashback en Meli Dólares en tu cuenta de Mercado Pago. Tope de hasta 5% por compras realizadas en Mercado Libre y 0,6% por pago con tarjeta de crédito de Mercado Pago. Sujeto a Términos y condiciones.</p>
    </footer>
  );
}

export function App() {
  return (
    <div className="page">
      <a className="skip-link" href="#plans-title">Ir a los planes</a>
      <Header />
      <main><Hero /><MarketingZone /><FrequentlyAskedQuestions /></main>
      <Legal />
    </div>
  );
}
