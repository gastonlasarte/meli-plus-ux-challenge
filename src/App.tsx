import { useRef } from "react";
import type { KeyboardEvent } from "react";
import { Header } from "./components/Header";
import { PlanCard } from "./components/PlanCard";
import { plans } from "./data/plans";
import { useSnapCarousel } from "./components/useSnapCarousel";
import { carouselKeyIndex } from "./components/carouselModel";

const asset = (name: string) => `/assets/figma/${name}`;

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <img className="meli-logo" src={asset("meli-logo.svg")} alt="Meli+" width="60" height="24" />
      <h1 id="hero-title">Consigue <strong>envíos gratis, cuotas extra sin intereses, cash back</strong> y beneficios en entretenimiento.</h1>
    </section>
  );
}

function PlanCarousel() {
  const { active, rail, slides, select } = useSnapCarousel(plans.length, 1);
  const indicators = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent, index: number) => {
    const next = carouselKeyIndex(event.key, index, plans.length);
    if (next === null) return;
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
            <PlanCard plan={plan} active={active === index} />
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
