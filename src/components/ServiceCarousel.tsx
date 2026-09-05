import { useId, useRef } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { ServiceLogo } from "./ServiceLogo";
import { useSnapCarousel } from "./useSnapCarousel";
import { useSwipeHint } from "./useSwipeHint";
import { carouselKeyIndex, nearestSlide } from "./carouselModel";

const services = [
  { id: "disney", name: "Disney+", description: "Thor: El mundo oscuro" },
  { id: "deezer", name: "Deezer", description: "The Weeknd" },
  { id: "max", name: "Max", description: "Ciudad de Dios" },
  { id: "paramount", name: "Paramount+", description: "Star Trek: Picard" },
] as const;

export function ServiceCarousel({ enabled = true }: { enabled?: boolean }) {
  const id = useId();
  const { active, rail, slides, select } = useSnapCarousel(services.length);
  const cancelHint = useSwipeHint(rail, enabled);
  const drag = useRef<{ x: number; y: number; left: number; horizontal: boolean } | null>(null);

  function onKeyDown(event: KeyboardEvent) {
    const next = carouselKeyIndex(event.key, active, services.length);
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    cancelHint();
    select(next);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    cancelHint();
    // Touch/trackpad use the browser's native scrolling and axis arbitration.
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, horizontal: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal) {
      if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) { drag.current = null; return; }
      if (Math.abs(dx) < 8 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
      gesture.horizontal = true;
      event.currentTarget.setAttribute("data-dragging", "");
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = gesture.left - dx;
  }
  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    drag.current = null;
    event.currentTarget.removeAttribute("data-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (gesture?.horizontal) select(nearestSlide(event.currentTarget.scrollLeft, event.currentTarget.clientWidth, services.length));
  }

  return <div className="service-carousel" role="region" aria-roledescription="carrusel" aria-label="Entretenimiento incluido"
    onKeyDown={onKeyDown} onFocusCapture={cancelHint}>
    <div className="service-carousel__rail" id={id} ref={rail} onPointerDown={startDrag} onPointerMove={moveDrag}
      onPointerUp={endDrag} onPointerCancel={endDrag} onWheel={cancelHint}>
      {services.map((service, index) => <div className="service-carousel__slide" key={service.id} data-index={index}
        ref={element => { slides.current[index] = element; }} role="group" aria-roledescription="diapositiva"
        aria-label={`${index + 1} de ${services.length}: ${service.name}`} aria-hidden={index !== active}>
        <img className="service-carousel__image" src={`/assets/services/${service.id}-cover.png`}
          alt={service.description} width="320" height="176" draggable="false" loading={index < 2 ? "eager" : "lazy"} />
        <div className="service-carousel__brand"><ServiceLogo service={service.id} /></div>
      </div>)}
    </div>
    {/* Compact dots are indicators inside one generous control, not four tiny hit areas. */}
    <button className="service-carousel__next" type="button" aria-label="Ver siguiente contenido"
      aria-controls={id} onClick={() => { cancelHint(); select((active + 1) % services.length); }}>
      <span className="service-indicators" aria-hidden="true">{services.map((service, index) =>
        <img key={service.id} src={`/assets/figma/dot-${active === index ? "active" : "inactive"}.svg`} alt="" width="6" height="6" />)}
      </span>
    </button>
    <p className="sr-only" role="status">{services[active].name}, {active + 1} de {services.length}</p>
  </div>;
}
