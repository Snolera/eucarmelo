"use client";

import { useEffect, useRef } from "react";
import { animate, useAnimationFrame, useMotionValue, useReducedMotion } from "motion/react";

const SNAP = { type: "spring", stiffness: 120, damping: 20 };

// Foco vindo do teclado (Tab), e não de clique, arrasto ou do player devolvendo o foco
export const isKeyboardFocus = (el) => {
  try {
    return el.matches(":focus-visible");
  } catch {
    return true; // navegador sem :focus-visible: trata como teclado
  }
};

// Controla a rotação do anel 3D: autoplay contínuo, arrasto (swipe) e foco pelo teclado
// paused: pausa externa (ex.: player aberto)
export function useRingRotation({ total, speed = 8, dragFactor = 0.3, paused = false }) {
  const rotation = useMotionValue(0);
  // Quem prefere menos movimento vê o anel parado (o arrasto continua funcionando)
  const reduceMotion = useReducedMotion();
  const isDragging = useRef(false);
  const isFocused = useRef(false);
  const wasDragged = useRef(false);
  const step = 360 / total;

  // Ao fechar o player, o foco volta ao card que o abriu: isso não deve deixar o anel parado
  useEffect(() => {
    if (!paused) isFocused.current = false;
  }, [paused]);

  // Autoplay: `speed` em graus por segundo, independente do FPS; o hover não pausa
  useAnimationFrame((_, delta) => {
    if (reduceMotion || paused || isDragging.current || isFocused.current) return;
    rotation.set(rotation.get() - (speed * delta) / 1000);
  });

  // Encaixa no card mais próximo do ângulo informado
  const snapTo = (angle) => {
    const target = Math.round(angle / step) * step;
    if (reduceMotion) rotation.set(target);
    else animate(rotation, target, SNAP);
  };

  // Traz o card `index` para a frente pelo caminho mais curto (ex.: foco pelo teclado)
  const focusIndex = (index) => {
    const base = -index * step;
    snapTo(base + 360 * Math.round((rotation.get() - base) / 360));
  };

  const panHandlers = {
    onPanStart: () => {
      isDragging.current = true;
      wasDragged.current = true;
      rotation.stop();
    },
    onPan: (_, info) => rotation.set(rotation.get() + info.delta.x * dragFactor),
    onPanEnd: (_, info) => {
      isDragging.current = false;
      // Soma um pouco da velocidade do gesto para dar sensação de inércia
      snapTo(rotation.get() + info.velocity.x * dragFactor * 0.2);
    },
    // O clique que vem logo depois de um arrasto não abre o player
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

  // Com foco de teclado dentro do anel, a rotação automática espera
  const focusHandlers = {
    onFocus: (e) => (isFocused.current = isKeyboardFocus(e.target)),
    onBlur: () => (isFocused.current = false),
  };

  return { rotation, focusIndex, panHandlers, focusHandlers };
}
