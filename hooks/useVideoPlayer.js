"use client";

import { useCallback, useRef, useState } from "react";

// Estado do <video> controlado por eventos nativos (fonte da verdade é o elemento)
export function useVideoPlayer() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    onLoadedMetadata: (e) => setDuration(e.currentTarget.duration || 0),
    onVolumeChange: (e) => setIsMuted(e.currentTarget.muted),
  };

  return { videoProps, isPlaying, isMuted, currentTime, duration, togglePlay, toggleMute, seek };
}

// 75 -> "1:15"
export function formatTime(seconds) {
  const total = Math.floor(seconds || 0);
  const min = Math.floor(total / 60);
  const sec = String(total % 60).padStart(2, "0");
  return `${min}:${sec}`;
}
