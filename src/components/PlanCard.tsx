import { useId } from "react";
import type { Plan } from "../data/plans";
import { Button } from "./Button";
import { ServiceLogo } from "./ServiceLogo";
import { ServiceCarousel } from "./ServiceCarousel";

export function BenefitsList({ benefits }: { benefits: Plan["benefits"] }) {
  return <ul className="plan-card__benefits">
    {benefits.map((benefit, index) => <li key={index}>
      {benefit.title
        ? <ServiceLogo service={benefit.image.replace(".png", "")} />
        : <img src={`/assets/figma/${benefit.image}`} alt="" width="16" height="16" draggable="false" />}
      <div>{benefit.title && <h4>{benefit.title}</h4>}<p>{benefit.text}</p></div>
    </li>)}
  </ul>;
}

export function PlanCard({ plan, subscribed = false, active = true }: {
  plan: Plan; subscribed?: boolean; active?: boolean;
}) {
  const titleId = useId();
  return <article className={`plan-card plan-card--${plan.id}${subscribed ? " plan-card--subscribed" : ""}`} aria-labelledby={titleId}>
    {plan.id === "total" ? <ServiceCarousel enabled={active} /> : <div className="plan-card__cover">
      <img src={`/assets/figma/${plan.cover}`} alt="" width="320" height="236" draggable="false" />
    </div>}
    <div className="plan-card__header">
      <div className="subscription-title"><h3 id={titleId}>{plan.name}</h3>{subscribed && <span className="subscription-badge">Activa</span>}</div>
      <p>{plan.description}</p>
    </div>
    <BenefitsList benefits={plan.benefits} />
    <footer className="plan-card__footer">
      <p className="price"><strong>{plan.price}</strong><span>Por mes</span></p>
      {subscribed
        ? <Button variant="text" className="subscription-cancel" disabled>Cancelar suscripción</Button>
        : <Button className="choose-plan" disabled>Elegir plan</Button>}
    </footer>
  </article>;
}
