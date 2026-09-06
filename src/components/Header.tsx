import type { Ref } from "react";
import { Icon } from "./Icon";
import { useHideOnScroll } from "./useHideOnScroll";

export function Header({ title, onBack, headingRef, hideOnScroll = false }: {
  title?: string;
  onBack?: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
  hideOnScroll?: boolean;
}) {
  const { hidden, reveal } = useHideOnScroll(hideOnScroll);

  return <header className={`top-bar${hidden ? " top-bar--hidden" : ""}`} onFocusCapture={reveal}>
    <div className="top-bar__navigation">
      <button className="back-button" type="button" disabled={!onBack} onClick={onBack} aria-label="Volver">
        <Icon name="back" />
      </button>
      {title && <h1 className="top-bar__title" tabIndex={-1} ref={headingRef}>{title}</h1>}
    </div>
  </header>;
}
