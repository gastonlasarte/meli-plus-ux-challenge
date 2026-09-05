export function Icon({ name, size = 24 }: { name: string; size?: 16 | 20 | 24 }) {
  return <img className={`icon icon--${size}`} src={`/assets/payment/${name}`} alt="" width={size} height={size} />;
}
