"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useAnimationControls, useInView } from "motion/react";
import { FULL_VIEW, MIN_VIEW, STACK_HOLD_MS } from "@/components/Gallery916/motion-config";

// Fração do palco exigida no viewport. Se o palco for mais alto que a tela,
// exigir 100% nunca dispararia: usa a fração que de fato cabe.
function getRequiredAmount(stage) {
  const ratio = window.innerHeight / stage.offsetHeight;
  return ratio >= 1 ? FULL_VIEW : Math.max(MIN_VIEW, ratio * FULL_VIEW);
}

// Suporte a IntersectionObserver não muda durante a sessão: nada a assinar (igual ao useReveal)
const noopSubscribe = () => () => {};
const getSupport = () => "IntersectionObserver" in window;
const getServerSupport = () => true;

// Distância (px) de cada card até o centro visível do palco.
function measureStackOffsets(stage, cards) {
  const s = stage.getBoundingClientRect();
  const center = s.left + s.width / 2;
  return cards.map((card) => {
    const r = card.getBoundingClientRect();
    return center - (r.left + r.width / 2);
  });
}

// Entrada da galeria em duas fases: os cards caem empilhados no centro, pausam e abrem em leque
// Só começa com o palco inteiro na tela; com "reduzir movimento" (ou navegador sem
// IntersectionObserver) vai direto para o leque
// `beforeMeasure`: deixa o palco na posição final (ex.: scroll do mobile) antes de medir
export function useGalleryIntro(stageRef, cardRefs, reduceMotion, beforeMeasure) {
  const introControls = useAnimationControls();
  const [amount, setAmount] = useState(FULL_VIEW);
  const [stackOffsets, setStackOffsets] = useState(null);
  const [sequenceDone, setSequenceDone] = useState(false);
  const supportsObserver = useSyncExternalStore(noopSubscribe, getSupport, getServerSupport);
  // Sem suporte, observa um ref vazio: o useInView do Motion não cria o observer
  const emptyRef = useRef(null);
  const inView = useInView(supportsObserver ? stageRef : emptyRef, { once: true, amount });
  const introDone = reduceMotion || sequenceDone || !supportsObserver;

  // Mede depois do 1º quadro e a cada resize (callbacks, não o corpo do efeito)
  useEffect(() => {
    const update = () => stageRef.current && setAmount(getRequiredAmount(stageRef.current));
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [stageRef]);

  // Gatilho: mede as posições (após o layout/scroll inicial) e arma a sequência.
  useEffect(() => {
    if (!inView || reduceMotion || stackOffsets) return;
    const frame = requestAnimationFrame(() => {
      beforeMeasure?.();
      setStackOffsets(measureStackOffsets(stageRef.current, cardRefs.current));
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, reduceMotion, stackOffsets, stageRef, cardRefs, beforeMeasure]);

  // Sequência: hidden → stacked → pausa → fanned.
  useEffect(() => {
    if (!stackOffsets || introDone) return;
    let cancelled = false;
    let holdTimer;
    const hold = () => new Promise((resolve) => (holdTimer = setTimeout(resolve, STACK_HOLD_MS)));

    (async () => {
      introControls.set("hidden");
      await introControls.start("stacked");
      if (cancelled) return;
      await hold();
      if (cancelled) return;
      await introControls.start("fanned");
      if (!cancelled) setSequenceDone(true);
    })();

    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      introControls.stop();
    };
  }, [stackOffsets, introDone, introControls]);

  return { introControls, introDone, stackOffsets };
}
