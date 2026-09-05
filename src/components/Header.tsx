import type { Ref } from "react";

export function Header({ title, onBack, headingRef }: {
  title?: string;
  onBack?: () => void;
  headingRef?: Ref<HTMLHeadingElement>;
}) {
  return <header className="top-bar">
    <div className="top-bar__navigation">
      <button className="back-button" type="button" disabled={!onBack} onClick={onBack} aria-label="Volver">
        <img src="/assets/figma/arrow-left.svg" alt="" width="24" height="24" />
      </button>
      {title && <h1 className="top-bar__title" tabIndex={-1} ref={headingRef}>{title}</h1>}
    </div>
  </header>;
}
