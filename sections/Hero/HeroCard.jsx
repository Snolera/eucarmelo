"use client";

import { useState } from "react";
import VideoModal from "@/components/VideoModal/VideoModal";

// Card do hero clicável por inteiro: qualquer clique abre o player do showreel
export default function HeroCard({ className, video, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e) => {
    // Links (CTA do Instagram) seguem seu destino normal
    if (e.target.closest("a")) return;
    // Não abre se a pessoa só estava selecionando texto
    if (window.getSelection?.().toString()) return;
    setIsOpen(true);
  };

  return (
    <>
      <div className={className} onClick={handleClick}>
        {children}
      </div>
      {/* Fora do card: cliques no modal não sobem até o onClick acima */}
      <VideoModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        title={video.title}
        src={video.src}
        poster={video.poster}
      />
    </>
  );
}
