import { useRef, useState } from "react";
import { Icon } from "../components/Icon";

const code = "314159265358";

export function ServiceCode({ onNotice }: { onNotice: (message: string) => void }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const value = useRef<HTMLElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      onNotice("Copiaste el código de servicio.");
    } catch {
      const range = document.createRange();
      if (value.current) range.selectNodeContents(value.current);
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      onNotice("No pudimos copiar el código. Te lo dejamos seleccionado para que lo copies.");
    }
  }

  return <>
    <div className="service-code">
      <div>
        <div className="service-code__value">
          <strong ref={value}>{code}</strong>
          <button type="button" aria-label="Copiar código de servicio" onClick={copy}>
            <Icon name="copy" size={20} />
          </button>
        </div>
        <p>Código de servicio Disney+ / Star+</p>
      </div>
      <button
        ref={helpButton}
        className="service-help"
        type="button"
        aria-label="Qué es el código de servicio"
        aria-expanded={helpOpen}
        aria-controls="service-code-help"
        onClick={() => setHelpOpen(!helpOpen)}
      >
        <Icon name="help" size={24} />
      </button>
    </div>
    {helpOpen && (
      <div className="alternate-help" id="service-code-help">
        <p>Es el código que te piden Disney+ y Star+ para activar tu beneficio. Lo usás una sola vez, al crear tu cuenta o al vincular una que ya tengas.</p>
        <button type="button" onClick={() => { setHelpOpen(false); helpButton.current?.focus(); }}>Entendido</button>
      </div>
    )}
  </>;
}
