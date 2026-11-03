import styles from "./Kicker.module.css";

// Pílula em caixa alta acima dos títulos das seções ("PORTFÓLIO", "SERVIÇOS"...)
export default function Kicker({ children, className = "" }) {
  return <p className={`${styles.kicker} ${className}`}>{children}</p>;
}
