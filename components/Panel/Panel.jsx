import Reveal from "@/components/Reveal/Reveal";
import styles from "./Panel.module.css";

// Caixa arredondada das seções; variant: "solid" (cinza do design) ou "glass" (vidro/lente)
// as: tag externa ("section" por padrão; "footer" no rodapé)
// reveal: entra da esquerda no scroll (60% visível)
export default function Panel({ as: Tag = "section", variant = "solid", reveal = false, className = "", children, ...rest }) {
  const Box = reveal ? Reveal : "div";
  return (
    <Tag className={styles.panel} {...rest}>
      <Box className={`${styles.panelBox} ${styles[`panelBox--${variant}`]} ${className}`}>{children}</Box>
    </Tag>
  );
}
