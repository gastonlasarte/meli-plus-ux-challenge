import type { ComponentProps } from "react";

export function Button({ variant = "primary", className = "", type = "button", ...props }:
  ComponentProps<"button"> & { variant?: "primary" | "dark" | "text" | "danger" }) {
  return <button type={type} className={`button button--${variant} ${className}`} {...props} />;
}
