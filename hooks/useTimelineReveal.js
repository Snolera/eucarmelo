"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export const READING_LINE = "0px 0px -20% 0px"; // linha de leitura a 80% da altura da tela
export const FIRST_DELAY = 300; // o 1º card entra logo depois do cabeçalho
export const STAGGER = 120; // intervalo mínimo entre um card e o próximo

// Suporte a IntersectionObserver não muda durante a sessão (igual ao useReveal)
const noopSubscribe = () => () => {};
const getSupport = () => "IntersectionObserver" in window;
const getServerSupport = () => true;

// Ponto cruzou a linha de leitura: está nela ou já passou para cima (inclusive fora da tela)
const crossed = (entry) =>
  entry.isIntersecting || entry.boundingClientRect.top < (entry.rootBounds?.bottom ?? window.innerHeight * 0.8);

// Revela os passos da linha do tempo, em ordem e uma vez só, quando o ponto de cada um cruza a linha de leitura
// ready: o cabeçalho já entrou · skip: mostra tudo (reduzir movimento)
// Devolve setDot(i) para o ref de cada ponto, a lista de pontos e quantos passos estão visíveis
export function useTimelineReveal(count, { ready, skip }) {
  const supportsObserver = useSyncExternalStore(noopSubscribe, getSupport, getServerSupport);
  const showAll = skip || !supportsObserver;
  const dots = useRef([]);
  const gate = useRef(0); // horário a partir do qual o próximo card pode entrar
  const [reached, setReached] = useState(0); // quantos pontos já cruzaram a linha
  const [shown, setShown] = useState(0);

  const setDot = useCallback((i) => (el) => void (dots.current[i] = el), []);

  // Pontos são ordenados de cima para baixo: se o ponto i cruzou, todos acima também
  const allReached = reached >= count;
  useEffect(() => {
    if (showAll || allReached) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        const last = entries.reduce((max, e) => (crossed(e) ? Math.max(max, dots.current.indexOf(e.target) + 1) : max), 0);
        setReached((r) => Math.max(r, last));
      },
      { rootMargin: READING_LINE }
    );
    dots.current.slice(0, count).forEach((dot) => dot && observer.observe(dot));
    return () => observer.disconnect();
  }, [showAll, allReached, count]);

  useEffect(() => {
    if (ready) gate.current = Date.now() + FIRST_DELAY;
  }, [ready]);

  // Um card por vez: o 1º espera o cabeçalho; os seguintes respeitam o STAGGER (cascata)
  useEffect(() => {
    if (showAll || !ready || shown >= reached) return;
    const timer = setTimeout(() => {
      gate.current = Date.now() + STAGGER;
      setShown((s) => s + 1);
    }, Math.max(0, gate.current - Date.now()));
    return () => clearTimeout(timer);
  }, [showAll, ready, shown, reached]);

  return { dots, setDot, shown: showAll ? count : shown };
}
