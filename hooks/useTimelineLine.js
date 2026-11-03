"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, useMotionValueEvent, useScroll, useSpring } from "motion/react";

// Mola curta: a linha acompanha o scroll quase colada e suaviza os saltos (cascata, âncora)
const LINE_SPRING = { stiffness: 320, damping: 40, restDelta: 0.001 };

// Fração da linha (0–1) até o centro do próximo ponto ainda apagado; com todos acesos, 1
export function capFraction(track, dots, shown) {
  const next = dots[shown];
  if (!track || !next) return 1;
  const t = track.getBoundingClientRect();
  if (!t.height) return 1;
  const d = next.getBoundingClientRect();
  return Math.min(1, Math.max(0, (d.top + d.height / 2 - t.top) / t.height));
}

// scaleY da linha: a ponta segue a linha de leitura (80% da tela), só cresce
// e nunca passa de um ponto que ainda não acendeu
export function useTimelineLine(trackRef, dots, shown) {
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 80%", "end 80%"] });
  const target = useMotionValue(0);
  const scrollMax = useRef(0);
  const cap = useRef(0);
  const scaleY = useSpring(target, LINE_SPRING);

  const apply = useCallback(() => {
    const next = Math.min(scrollMax.current, cap.current);
    if (next > target.get()) target.set(next);
  }, [target]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollMax.current = Math.max(scrollMax.current, v);
    apply();
  });

  // Limite recalculado quando um ponto acende e quando a tela muda de tamanho
  useEffect(() => {
    const measure = () => {
      cap.current = capFraction(trackRef.current, dots.current, shown);
      scrollMax.current = Math.max(scrollMax.current, scrollYProgress.get());
      apply();
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [trackRef, dots, shown, scrollYProgress, apply]);

  return scaleY;
}
