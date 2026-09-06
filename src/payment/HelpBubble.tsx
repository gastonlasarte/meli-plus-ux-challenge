import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Icon } from "../components/Icon";
import type { IconName } from "../components/Icon";

const GAP = 8;

export function HelpBubble({ id, label, triggerClass, icon, iconSize, children }: {
  id: string;
  label: string;
  triggerClass: string;
  icon: IconName;
  iconSize?: 16 | 20 | 24;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [above, setAbove] = useState(true);
  const [caret, setCaret] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const bubble = useRef<HTMLDivElement>(null);

  function dismiss() {
    setOpen(false);
    trigger.current?.focus();
  }

  useLayoutEffect(() => {
    const button = trigger.current;
    const panel = bubble.current;
    if (!open || !button || !panel) return;
    const anchor = button.getBoundingClientRect();
    setCaret(anchor.left + anchor.width / 2 - panel.getBoundingClientRect().left);
    // La barra superior tapa el globo si se abre debajo de ella; cuando está oculta, no ocupa nada.
    const ceiling = document.querySelector(".top-bar")?.getBoundingClientRect().bottom ?? 0;
    setAbove(anchor.top - Math.max(ceiling, 0) >= panel.offsetHeight + GAP * 2);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!bubble.current?.contains(target) && !trigger.current?.contains(target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      dismiss();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return <>
    <button
      ref={trigger}
      className={triggerClass}
      type="button"
      aria-label={label}
      aria-expanded={open}
      aria-controls={id}
      onClick={() => setOpen(!open)}
    >
      <Icon name={icon} size={iconSize} />
    </button>
    {open && (
      <div
        className={`help-bubble help-bubble--${above ? "above" : "below"}`}
        id={id}
        ref={bubble}
        style={{ "--caret": `${caret}px` } as CSSProperties}
      >
        <p>{children}</p>
        <button type="button" onClick={dismiss}>Entendido</button>
      </div>
    )}
  </>;
}
