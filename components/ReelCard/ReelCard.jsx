"use client";

import { useRef } from "react";
import Image from "next/image";
import { Maximize, Play, Volume2 } from "lucide-react";
import styles from "./ReelCard.module.css";

// Barra de player decorativa (play, progresso, tempo, volume, tela cheia)
function PlayerControls() {
  return (
    <span className={styles.cardControls} aria-hidden="true">
      <Play size={16} fill="currentColor" strokeWidth={0} className={styles.cardIcon} />
      <span className={styles.cardProgress} />
      <span className={styles.cardTime}>0:00</span>
      <Volume2 size={16} strokeWidth={2} className={styles.cardIcon} />
      <Maximize size={16} strokeWidth={2} className={styles.cardIcon} />
    </span>
  );
}

// Card 9:16 do coverflow; o botão é o próprio card
// Ativo (central): o clique abre o player e onOpen recebe a posição da mídia (início da transição)
// Lateral: o clique só traz o card para o centro (onSelect)
export default function ReelCard({ index, client, category, poster, active, onOpen, onSelect }) {
  const mediaRef = useRef(null);

  return (
    <article className={styles.card} data-active={active || undefined}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={() => (active ? onOpen(mediaRef.current?.getBoundingClientRect()) : onSelect())}
        aria-current={active || undefined} // também acende a luz da borda no CSS
        aria-haspopup={active ? "dialog" : undefined}
        aria-label={active ? `Assistir reel ${client}` : `Mostrar reel ${client}`}
        tabIndex={active ? 0 : -1}
      >
        <span ref={mediaRef} className={styles.cardMedia}>
          {poster && (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 340px, 60vw"
              className={styles.cardPoster}
            />
          )}
          <span className={styles.cardIndex} aria-hidden="true">
            {String(index).padStart(2, "0")}
          </span>
          <PlayerControls />
        </span>
      </button>

      {/* Legenda visível só no card ativo; as outras continuam no HTML (SEO) */}
      <div className={styles.cardCaption}>
        <h3 className={styles.cardClient}>{client}</h3>
        <p className={styles.cardCategory}>{category}</p>
      </div>
    </article>
  );
}
