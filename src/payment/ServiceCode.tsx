import { useRef } from "react";
import { Icon } from "../components/Icon";
import { HelpBubble } from "./HelpBubble";

const code = "314159265358";

export function ServiceCode({ onNotice }: { onNotice: (message: string) => void }) {
  const value = useRef<HTMLElement>(null);

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
      <HelpBubble id="service-code-help" label="Qué es el código de servicio" triggerClass="service-help" icon="help">
        Es el código que te piden Disney+ y Star+ para activar tu beneficio. Lo usás una sola vez, al crear tu cuenta o al vincular una que ya tengas.
      </HelpBubble>
    </div>
  </>;
}
