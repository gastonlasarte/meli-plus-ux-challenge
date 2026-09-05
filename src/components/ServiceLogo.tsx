export function ServiceLogo({ service }: { service: string }) {
  return <img className={`service-logo service-logo--${service}`} src={`/assets/services/${service}.png`} alt="" width="32" height="32" draggable="false" />;
}
