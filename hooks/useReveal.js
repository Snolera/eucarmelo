"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const VISIBLE_SHARE = 0.6; // 60%

// Limiares de 0 a 1 em passos de 5%: o callback roda conforme a seção entra na tela
const THRESHOLDS = Array.from({ length: 21 }, (_, i) => i / 20);

// Suporte a IntersectionObserver não muda durante a sessão: nada a assinar
const noopSubscribe = () => () => {};
const getSupport = () => "IntersectionObserver" in window;
const getServerSupport = () => true; // no servidor assume suporte (seção começa escondida)

// Revela uma vez quando 60% do elemento está visível,
// ou quando ele ocupa 60% da tela (seções mais altas que a tela, comuns no mobile)
// enabled=false: não observa e já devolve revelado
export function useReveal({ enabled = true } = {}) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const supportsObserver = useSyncExternalStore(noopSubscribe, getSupport, getServerSupport);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || seen || !el || !supportsObserver) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
        const coversViewport = entry.intersectionRect.height >= viewportHeight * VISIBLE_SHARE;
        if (entry.intersectionRatio >= VISIBLE_SHARE || coversViewport) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: THRESHOLDS }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, seen, supportsObserver]);

  // Navegador sem IntersectionObserver: mostra direto
  return [ref, !enabled || seen || !supportsObserver];
}
