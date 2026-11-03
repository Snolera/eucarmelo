import Reveal from "@/components/Reveal/Reveal";
import styles from "./Panel.module.css";

// Caixa escura arredondada de todas as seções, na coluna central
// as: tag externa ("section" por padrão; "footer" no rodapé)
// reveal: entra da esquerda no scroll (60% visível)
export default function Panel({ as: Tag = "section", reveal = false, className = "", children, ...rest }) {
  const Box = reveal ? Reveal : "div";
  return (
    <Tag className={`container ${styles.panel}`} {...rest}>
      <Box className={`${styles.panelBox} ${className}`}>{children}</Box>
    </Tag>
  );
}
