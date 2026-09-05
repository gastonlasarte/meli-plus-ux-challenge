import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./tokens.css";
import "./styles.css";
import "./components/shared.css";
import { PaymentFlow } from "./payment/PaymentFlow";
import "./payment/payment.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.location.pathname.startsWith("/details") ? <PaymentFlow /> : <App />}
  </StrictMode>,
);
