"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import styles from "./VideoModal.module.css";

// <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte sem JS extra
export default function VideoModal({ open, onClose, title, src, poster }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

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
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.modalContent}>
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
