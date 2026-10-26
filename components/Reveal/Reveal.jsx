"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./Reveal.module.css";

// Entra da esquerda para a direita quando a seção fica 60% visível
// immediate: para o que já está na tela ao abrir (Hero) — animação CSS no carregamento,
// sem esperar o JavaScript (não atrasa o LCP)
export default function Reveal({ immediate = false, className = "", children, ...rest }) {
  const [ref, revealed] = useReveal({ enabled: !immediate });
  const classes = [styles.reveal, immediate && styles["reveal--immediate"], className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes} data-revealed={revealed} {...rest}>
      {children}
    </div>
  );
}
