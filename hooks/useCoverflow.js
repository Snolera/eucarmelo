"use client";

import { useRef, useState } from "react";
import { clamp, getMiddleIndex, getSwipeSteps } from "@/lib/coverflow";

const KEY_ACTIONS = {
  ArrowLeft: (index) => index - 1,
  ArrowRight: (index) => index + 1,
  Home: () => 0,
  End: (_, last) => last,
};

// Controla o coverflow: card ativo (começa no do meio), arrasto (swipe), teclado e clique
export function useCoverflow({ total }) {
  const [index, setIndex] = useState(() => getMiddleIndex(total));
  const trackRef = useRef(null); // mede a largura do card e acha o botão do card ativo
  const wasDragged = useRef(false);
  const last = total - 1;

  const goTo = (value) => {
    const next = clamp(value, 0, last);
    setIndex(next);
    return next;
  };

  const panHandlers = {
    onPanStart: () => {
      wasDragged.current = true;
    },
    onPanEnd: (_, { offset, velocity }) => {
      const cardWidth = trackRef.current?.offsetWidth ?? 300;
      goTo(index + getSwipeSteps(offset.x, velocity.x, cardWidth));
    },
    // O clique que vem logo depois de um arrasto não seleciona nem abre o player
    onClickCapture: (e) => {
      if (!wasDragged.current) return;
      wasDragged.current = false;
      e.stopPropagation();
      e.preventDefault();
    },
    onPointerDown: () => {
      wasDragged.current = false;
    },
  };

  // Setas/Home/End trocam o card; o foco acompanha o novo card ativo (roving tabindex)
  const onKeyDown = (e) => {
    const action = KEY_ACTIONS[e.key];
    if (!action) return;
    e.preventDefault();
    const next = goTo(action(index, last));
    trackRef.current?.children[next]?.querySelector("button")?.focus({ preventScroll: true });
  };

  return { index, trackRef, select: goTo, panHandlers, onKeyDown };
}
