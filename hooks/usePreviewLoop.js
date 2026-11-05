"use client";

import { useEffect, useState } from "react";

export const PREVIEW_SECONDS = 10; // trecho em loop da prévia do card

// Prévia sem som de um <video>: toca só os primeiros PREVIEW_SECONDS em loop,
// pausa fora da tela ou quando `playing` é false (ex.: player aberto)
export function usePreviewLoop(videoRef, playing) {
  const [onScreen, setOnScreen] = useState(true);

  // Fora da tela pausa: decodificar vídeo pesa na GPU do celular (mesmo motivo do Hero)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const observer = new window.IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(video);
    return () => observer.disconnect();
  }, [videoRef]);

  // muted pela propriedade: o atributo do React nem sempre chega ao elemento e o autoplay seria bloqueado
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (playing && onScreen) video.play()?.catch(() => {}); // bloqueado: fica na capa
    else video.pause();
  }, [videoRef, playing, onScreen]);

  // timeupdate dispara ~4x/s: volta ao início ao passar do trecho (vídeos mais curtos usam o `loop`)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => video.currentTime >= PREVIEW_SECONDS && (video.currentTime = 0);
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [videoRef]);
}
