import type { Ref } from "react";
import { Icon } from "./Icon";

export function Header({ title, onBack, headingRef }: {
  title?: string;
  onBack?: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  return <header className="top-bar">
    <div className="top-bar__navigation">
      <button className="back-button" type="button" disabled={!onBack} onClick={onBack} aria-label="Volver">
        <Icon name="back" />
      </button>
      {title && <h1 className="top-bar__title" tabIndex={-1} ref={headingRef}>{title}</h1>}
    </div>
  </header>;
}
