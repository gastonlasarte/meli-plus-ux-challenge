import type { methods } from "./model";

export function MethodIcon({ method }: { method: typeof methods[number] }) {
  return (
    <span className={`method-icon${method.id === "balance" ? " method-icon--balance" : ""}`}>
      <img src={`/assets/payment/${method.icon}`} alt="" width="40" height="32" />
    </span>
  );
}
