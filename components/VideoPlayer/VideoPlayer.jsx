"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { formatTime, useVideoPlayer } from "@/hooks/useVideoPlayer";
import styles from "./VideoPlayer.module.css";

// Ícone de som que abre uma barra vertical de volume acima dele
// Fecha com novo clique no ícone, Esc (sem fechar o player) ou clique fora
function VolumeControl({ volume, isMuted, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const sliderRef = useRef(null);
  const sliderId = useId();
  const shownVolume = isMuted ? 0 : volume; // no mudo, a barra mostra 0

  // Aberta: foco na barra (setas já mudam o volume) e clique fora fecha
  useEffect(() => {
    if (!open) return;
    sliderRef.current?.focus();
    const closeOnOutside = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  const handleKeyDown = (e) => {
    if (e.key !== "Escape" || !open) return;
    e.preventDefault(); // não deixa o <dialog> do player fechar junto
    e.stopPropagation();
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={styles.playerVolume} onKeyDown={handleKeyDown}>
      {open && (
        <div className={styles.playerVolumePopover}>
          <input
            ref={sliderRef}
            id={sliderId}
            type="range"
            className={styles.playerVolumeSlider}
            min={0}
            max={1}
            step={0.05}
            value={shownVolume}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Volume"
            aria-orientation="vertical"
            aria-valuetext={`${Math.round(shownVolume * 100)}%`}
            style={{ "--progress": `${shownVolume * 100}%` }}
          />
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        className={styles.playerButton}
        onClick={() => setOpen((value) => !value)}
        disabled={disabled}
        aria-label="Ajustar volume"
        aria-expanded={open}
        aria-controls={open ? sliderId : undefined}
        data-muted={shownVolume === 0}
      >
        {shownVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
}

// Player vertical (9:16) com controles próprios; sem src mostra estado vazio
export default function VideoPlayer({ src, poster, title, autoPlay = false }) {
  const {
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
  } = useVideoPlayer();
  const hasVideo = Boolean(src);

  return (
    <div className={styles.player} data-video-player>
      {hasVideo ? (
        <video
          {...videoProps}
          className={styles.playerVideo}
          src={src}
          poster={poster ?? undefined}
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
          onClick={togglePlay}
          aria-label={title}
        />
      ) : (
        <div className={styles.playerEmpty}>
          <span className={styles.playerEmptyIcon} aria-hidden="true">
            <Play size={22} strokeWidth={1.6} />
          </span>
          <p>Vídeo em breve</p>
        </div>
      )}

      <div className={styles.playerControls}>
        <button
          type="button"
          className={styles.playerButton}
          onClick={togglePlay}
          disabled={!hasVideo}
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <input
          type="range"
          className={styles.playerProgress}
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => seek(Number(e.target.value))}
          disabled={!hasVideo}
          aria-label="Progresso do vídeo"
          aria-valuetext={formatTime(currentTime)}
          style={{ "--progress": `${duration ? (currentTime / duration) * 100 : 0}%` }}
        />

        <span className={styles.playerTime}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Onde o site muda o volume, o ícone abre a barra; no iPhone (volume do aparelho) só liga/desliga o som */}
        {canSetVolume ? (
          <VolumeControl volume={volume} isMuted={isMuted} disabled={!hasVideo} onChange={setVolume} />
        ) : (
          <button
            type="button"
            className={styles.playerButton}
            onClick={toggleMute}
            disabled={!hasVideo}
            aria-label={isMuted ? "Ativar som" : "Desativar som"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
