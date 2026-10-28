"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import Corners from "./Corners";
import { SPRING } from "./motion-config";
import styles from "./Gallery916.module.css";

// Moldura 9:16 da Galeria Fotos com o player do site por dentro (volume em 50%, barra de volume)
// Fecha com X, Esc ou clique no fundo; clique no vídeo não fecha
export default function GalleryModal({ item, index, onClose, reduceMotion }) {
  const closeRef = useRef(null);
  const number = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    // Esc dentro da barra de volume para nela (stopPropagation) e não chega aqui
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      aria-label={`Vídeo: ${item.title}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className={`${styles.frame} ${styles.blueprint}`}
        initial={{ scale: reduceMotion ? 1 : 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: reduceMotion ? 1 : 0.94, opacity: 0 }}
        transition={reduceMotion ? { duration: 0.15 } : SPRING}
        onClick={(e) => e.stopPropagation()}
      >
        <Corners />
        <div className={styles.frameHeader}>
          <div>
            <span className={styles.frameKicker}>
              {number} · {item.kicker}
            </span>
            <span className={styles.frameTitle}>{item.title}</span>
          </div>
          <button
            ref={closeRef}
            type="button"
            className={`${styles.btnIcon} ${styles.btnOnDark}`}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className={styles.framePlayer}>
          <VideoPlayer src={item.video} poster={item.image} title={item.title} autoPlay />
        </div>
      </motion.div>
    </motion.div>
  );
}
