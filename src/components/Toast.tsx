import { useState } from "react";
import { Icon } from "./Icon";
import "./toast.css";

export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  // Keep the last text painted while CSS completes the discrete display transition.
  const [lastMessage, setLastMessage] = useState(message);
  if (message && message !== lastMessage) setLastMessage(message);

  return <>
    <p className="sr-only" role="status" aria-atomic="true">{message}</p>
    <div className="toast" data-open={Boolean(message)} inert={!message} aria-hidden={!message}>
      <p>{message || lastMessage}</p>
      <button type="button" aria-label="Cerrar mensaje" onClick={onDismiss}>
        <Icon name="close.svg" size={20} />
      </button>
    </div>
  </>;
}
