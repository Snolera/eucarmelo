"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { formatTime, useVideoPlayer } from "@/hooks/useVideoPlayer";
import styles from "./VideoPlayer.module.css";

// Player vertical (9:16) com controles próprios; sem src mostra estado vazio
export default function VideoPlayer({ src, poster, title, autoPlay = false }) {
  const { videoProps, isPlaying, isMuted, currentTime, duration, togglePlay, toggleMute, seek } =
    useVideoPlayer();
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

        <button
          type="button"
          className={styles.playerButton}
          onClick={toggleMute}
          disabled={!hasVideo}
          aria-label={isMuted ? "Ativar som" : "Desativar som"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </div>
  );
}
