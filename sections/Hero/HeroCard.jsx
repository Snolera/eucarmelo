"use client";

import { useState } from "react";
import VideoModal from "@/components/VideoModal/VideoModal";

// Card do hero clicável por inteiro: qualquer clique abre o player do showreel
export default function HeroCard({ className, video, children }) {
  const [originRect, setOriginRect] = useState(null); // null = fechado

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
      <div className={className} onClick={handleClick}>
        {children}
      </div>
      {/* Fora do card: cliques no modal não sobem até o onClick acima */}
      <VideoModal
        open={Boolean(originRect)}
        onClose={() => setOriginRect(null)}
        title={video.title}
        src={video.src}
        poster={video.poster}
        originRect={originRect}
      />
    </>
  );
}
