"use client";

import { useRef, useState } from "react";
import { usePreviewLoop } from "@/hooks/usePreviewLoop";
import styles from "./Gallery916.module.css";

// Prévia do card em destaque: por cima da capa, aparece (fade) só quando o 1º quadro toca
// Montada só no card ativo: ao sair, desmonta (volta à capa) e ao voltar recomeça do início
export default function CardPreview({ src, playing }) {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  usePreviewLoop(ref, playing);

  return (
    <video
      ref={ref}
      className={styles.cardVideo}
      data-started={started}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onPlaying={() => setStarted(true)}
    />
  );
}
