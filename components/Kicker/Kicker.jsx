import styles from "./Kicker.module.css";

// Rótulo pequeno em caixa alta acima dos títulos das seções
// Texto: cada letra vira um span com índice (--i) e o total vai em --n; quando a seção é
// revelada no scroll (data-revealed do Panel/Reveal), uma onda laranja passa pelas letras
// e uma linha cresce embaixo até 40% da largura
export default function Kicker({ children, className = "" }) {
  if (typeof children !== "string") return <p className={`${styles.kicker} ${className}`}>{children}</p>;

  const letters = Array.from(children);
  return (
    <p className={`${styles.kicker} ${className}`} style={{ "--n": letters.length }}>
      {/* Leitor de tela lê o texto inteiro; as letras soltas ficam só para a animação */}
      <span className={styles.kickerText}>{children}</span>
      {letters.map((letter, i) => (
        <span key={i} className={styles.kickerLetter} style={{ "--i": i }} aria-hidden="true">
          {letter}
        </span>
      ))}
    </p>
  );
}
