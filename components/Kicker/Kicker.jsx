import styles from "./Kicker.module.css";

// Rótulo pequeno em caixa alta acima dos títulos das seções
export default function Kicker({ children, className = "" }) {
  return <p className={`${styles.kicker} ${className}`}>{children}</p>;
}
