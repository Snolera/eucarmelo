"use client";

import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 40; // px mínimos para contar como arrasto

// Carrossel de trilho: índice do primeiro card visível + arrasto por ponteiro
// step = quantos cards cada seta/arrasto avança (padrão: 1)
export function useCarousel({ total, visible, step = 1 }) {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, total - visible);
  const startX = useRef(null);
  const swiped = useRef(false);

  const goTo = (i) => setIndex(Math.min(Math.max(i, 0), maxIndex));
  const prev = () => goTo(index - step);
  const next = () => goTo(index + step);

  // Foco pelo teclado em card escondido: vai para a "página" que contém o card
  const reveal = (i) => {
    if (i < index || i > index + visible - 1) goTo(Math.floor(i / step) * step);
  };

  const swipeHandlers = {
    onPointerDown: (e) => {
      startX.current = e.clientX;
      swiped.current = false;
    },
    onPointerUp: (e) => {
      if (startX.current === null) return;
      const dx = e.clientX - startX.current;
      startX.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD) return;
      swiped.current = true;
      if (dx < 0) next();
      else prev();
    },
    onPointerCancel: () => {
      startX.current = null;
    },
    // Evita abrir o player quando o gesto foi um arrasto
    onClickCapture: (e) => {
      if (!swiped.current) return;
      swiped.current = false;
      e.stopPropagation();
      e.preventDefault();
    },
  };

  return {
    index,
    canPrev: index > 0,
    canNext: index < maxIndex,
    prev,
    next,
    reveal,
    swipeHandlers,
  };
}
