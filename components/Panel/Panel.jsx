import Reveal from "@/components/Reveal/Reveal";
import styles from "./Panel.module.css";

// Caixa escura arredondada de todas as seções, na coluna central
// as: tag externa ("section" por padrão; "footer" no rodapé)
// reveal: o conteúdo entra da esquerda no scroll (60% visível); a caixa (fundo) fica parada
// className: layout interno da seção (padding, flex) — vai em quem envolve o conteúdo
export default function Panel({ as: Tag = "section", reveal = false, className = "", children, ...rest }) {
  return (
    <Tag className={`container ${styles.panel}`} {...rest}>
      {reveal ? (
        <div className={styles.panelBox}>
          <Reveal className={className}>{children}</Reveal>
        </div>
      ) : (
        <div className={`${styles.panelBox} ${className}`}>{children}</div>
      )}
    </Tag>
  );
}
