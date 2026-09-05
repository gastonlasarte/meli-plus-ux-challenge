// Iconos de Iconoir (https://iconoir.com) — MIT © 2021 Luca Burgio. Ver NOTICE.md.
// Se copian los paths en vez de instalar el paquete para no sumar dependencias.
// Van inline, no como <img>, para que hereden currentColor del contexto.
const paths = {
  add: ["M6 12H12M18 12H12M12 12V6M12 12V18"],
  back: ["M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5"],
  check: ["M5 13L9 17L19 7"],
  chevron: ["M6 9L12 15L18 9"],
  close: ["M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"],
  copy: [
    "M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z",
    "M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9",
  ],
  help: [
    "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
    "M9 9C9 5.49997 14.5 5.5 14.5 9C14.5 11.5 12 10.9999 12 13.9999",
    "M12 18.01L12.01 17.9989",
  ],
  info: [
    "M12 11.5V16.5",
    "M12 7.51L12.01 7.49889",
    "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
  ],
  lock: [
    "M16 12H17.4C17.7314 12 18 12.2686 18 12.6V19.4C18 19.7314 17.7314 20 17.4 20H6.6C6.26863 20 6 19.7314 6 19.4V12.6C6 12.2686 6.26863 12 6.6 12H8M16 12V8C16 6.66667 15.2 4 12 4C8.8 4 8 6.66667 8 8V12M16 12H8",
  ],
} as const;

export type IconName = keyof typeof paths;

// strokeWidth 1.5 acompaña texto en peso 400; 2 cuando el texto al lado es 600.
export function Icon({ name, size = 24, strokeWidth = 1.5 }: {
  name: IconName; size?: 16 | 20 | 24; strokeWidth?: number;
}) {
  return (
    <svg
      className={`icon icon--${size}`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name].map((d) => <path key={d} d={d} />)}
    </svg>
  );
}
