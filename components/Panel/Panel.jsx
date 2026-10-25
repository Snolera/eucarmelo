import styles from "./Panel.module.css";

// Caixa arredondada das seções; variant: "solid" (cinza do design) ou "glass" (vidro/lente)
// as: tag externa ("section" por padrão; "footer" no rodapé)
export default function Panel({ as: Tag = "section", variant = "solid", className = "", children, ...rest }) {
  return (
    <Tag className={styles.panel} {...rest}>
      <div className={`${styles.panelBox} ${styles[`panelBox--${variant}`]} ${className}`}>{children}</div>
    </Tag>
  );
}
