"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import styles from "./PhotoLightbox.module.css";

// Foto ampliada num <dialog> nativo: foco preso, Esc fecha e o fundo fica inerte
// Fecha pelo X, Esc ou clique no fundo; clique na foto não fecha
export default function PhotoLightbox({ photo, onClose }) {
  const dialogRef = useRef(null);

  // Layout effect: abre antes do navegador pintar (sem "piscar")
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (photo && dialog && !dialog.open) dialog.showModal();
  }, [photo]);

  if (!photo) return null;

  // Todo fechamento passa pelo close() nativo, que devolve o foco à miniatura
  const close = () => dialogRef.current?.close();

  return (
    <dialog
      ref={dialogRef}
      className={styles.lightbox}
      aria-label="Foto ampliada"
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && close()}
    >
      <button type="button" className={styles.lightboxClose} onClick={close} aria-label="Fechar foto">
        <X size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
      <Image
        src={photo.full}
        alt={photo.alt}
        width={1200}
        height={1500}
        sizes="(min-width: 768px) 720px, 100vw"
        className={styles.lightboxImage}
      />
    </dialog>
  );
}
