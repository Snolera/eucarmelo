"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import styles from "./VideoModal.module.css";

export const OPEN_DURATION = 240; // ms do elemento clicado até o centro

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// FLIP: o player já abre no centro e uma animação de transform o faz "sair" do elemento clicado
function animateFromOrigin(content, originRect) {
  const player = content.querySelector("[data-video-player]") ?? content;
  const target = player.getBoundingClientRect();
  const box = content.getBoundingClientRect();

  // Escala uniforme (sem distorcer): o menor fator que cabe na origem
  const scale =
    target.width && target.height
      ? Math.min(originRect.width / target.width, originRect.height / target.height)
      : 1;
  const dx = originRect.left + originRect.width / 2 - (target.left + target.width / 2);
  const dy = originRect.top + originRect.height / 2 - (target.top + target.height / 2);

  // Escala a partir do centro do player (não do bloco título + player)
  content.style.transformOrigin = `${target.left - box.left + target.width / 2}px ${
    target.top - box.top + target.height / 2
  }px`;

  content.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.6 },
      { transform: "none", opacity: 1 },
    ],
    { duration: OPEN_DURATION, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
  );
}

// <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte sem JS extra
// originRect: posição do elemento clicado, ponto de partida da transição
export default function VideoModal({ open, onClose, title, src, poster, originRect }) {
  const dialogRef = useRef(null);
  const contentRef = useRef(null);
  const titleId = useId();

  // Layout effect: abre e posiciona a animação antes do navegador pintar (sem "piscar")
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    if (!dialog.open) dialog.showModal();

    const content = contentRef.current;
    if (!originRect || !content || typeof content.animate !== "function" || prefersReducedMotion()) return;
    animateFromOrigin(content, originRect);
  }, [open, originRect]);

  if (!open) return null;

  // Todo fechamento passa pelo close() nativo, que devolve o foco a quem abriu
  const close = () => dialogRef.current?.close();

  // Clique no fundo (fora do conteúdo) fecha o modal
  const handleClick = (e) => {
    if (e.target === dialogRef.current) close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.modal}
      aria-labelledby={titleId}
      // Fade do fundo com a mesma duração da transição do player
      style={{ "--modal-duration": `${OPEN_DURATION}ms` }}
      onClose={onClose}
      onClick={handleClick}
    >
      <div ref={contentRef} className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 id={titleId} className={styles.modalTitle}>
            {title}
          </h2>
          <button type="button" className={styles.modalClose} onClick={close} aria-label="Fechar vídeo">
            <X size={22} />
          </button>
        </div>
        <VideoPlayer src={src} poster={poster} title={title} autoPlay />
      </div>
    </dialog>
  );
}
