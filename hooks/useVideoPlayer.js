"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Estado do <video> controlado por eventos nativos (fonte da verdade é o elemento)
// initialVolume: volume ao abrir (0 a 1); no iPhone o volume é sempre o do aparelho
export function useVideoPlayer({ initialVolume = 0.5 } = {}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);
  // false até confirmar que o navegador aceita mudar o volume (no iPhone não aceita)
  const [canSetVolume, setCanSetVolume] = useState(false);

  // Aplica antes do vídeo carregar o suficiente para o autoplay começar
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = initialVolume;
  }, [initialVolume]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setIsPlaying(false));
    else video.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  // Volume de 0 a 1: em 0 fica no mudo; subir o volume tira do mudo
  const setVolume = useCallback((value) => {
    const video = videoRef.current;
    if (!video) return;
    if (value > 0) video.volume = value;
    video.muted = value === 0;
    setVolumeState(video.volume);
    setIsMuted(video.muted);
  }, []);

  const seek = useCallback((time) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  }, []);

  // Handlers para espalhar no <video>
  const videoProps = {
    ref: videoRef,
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onEnded: () => setIsPlaying(false),
    onTimeUpdate: (e) => setCurrentTime(e.currentTarget.currentTime),
    onLoadedMetadata: (e) => {
      setDuration(e.currentTarget.duration || 0);
      // O efeito já aplicou initialVolume: se não "pegou", o volume é do aparelho
      setCanSetVolume(e.currentTarget.volume === initialVolume);
    },
    onVolumeChange: (e) => {
      setIsMuted(e.currentTarget.muted);
      setVolumeState(e.currentTarget.volume);
    },
  };

  return {
    videoProps,
    isPlaying,
    isMuted,
    volume,
    canSetVolume,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    setVolume,
    seek,
  };
}

// 75 -> "1:15"
export function formatTime(seconds) {
  const total = Math.floor(seconds || 0);
  const min = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
