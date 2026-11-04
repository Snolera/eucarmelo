"use client";

import { useEffect, useRef, useState } from "react";
import VideoModal from "@/components/VideoModal/VideoModal";
import styles from "./Hero.module.css";

// Autoplay do showreel de fundo (sem som, em loop). false = o card mostra o 1º quadro/poster
export const SHOWREEL_AUTOPLAY = true;

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// Card do hero clicável por inteiro: qualquer clique abre o player do showreel
// O mesmo vídeo toca sem som no fundo do card; no player, recomeça do início e com som
export default function HeroCard({ className, video, children }) {
  const [originRect, setOriginRect] = useState(null); // null = fechado
  const [onScreen, setOnScreen] = useState(true);
  const cardRef = useRef(null);
  const backgroundRef = useRef(null);
  const open = Boolean(originRect);

  // Fora da tela o vídeo pausa: decodificar vídeo pesa na GPU do celular e trava as animações abaixo
  useEffect(() => {
    if (!cardRef.current || !("IntersectionObserver" in window)) return;
    const observer = new window.IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay pelo JS (não pelo atributo): fica parado com "reduzir movimento",
  // fora da tela e enquanto o player com som está aberto
  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;
    if (!SHOWREEL_AUTOPLAY || open || !onScreen || prefersReducedMotion()) background.pause();
    // Navegador bloqueou: fica no 1º quadro (play() sem Promise em navegadores antigos/jsdom)
    else background.play()?.catch(() => {});
  }, [open, onScreen]);

  const handleClick = (e) => {
    // Links (CTA do Instagram) seguem seu destino normal
    if (e.target.closest("a")) return;
    // Não abre se a pessoa só estava selecionando texto
    if (window.getSelection?.().toString()) return;
    // Posição do card: ponto de partida da transição do player
    setOriginRect(e.currentTarget.getBoundingClientRect());
  };

  return (
    <>
      <div ref={cardRef} className={className} onClick={handleClick}>
        {video.src ? (
          <video
            ref={backgroundRef}
            className={styles.heroMedia}
            src={video.src}
            poster={video.poster ?? undefined}
            muted
            loop
            playsInline
            preload="metadata" // sem autoplay no atributo, quem vê parado baixa só o começo
            aria-hidden="true"
          />
        ) : (
          <div className={`${styles.heroMedia} ${styles["heroMedia--placeholder"]}`} aria-hidden="true" />
        )}
        {children}
      </div>
      {/* Fora do card: cliques no modal não sobem até o onClick acima */}
      <VideoModal
        open={open}
        onClose={() => setOriginRect(null)}
        title={video.title}
        src={video.src}
        poster={video.poster}
        originRect={originRect}
      />
    </>
  );
}
