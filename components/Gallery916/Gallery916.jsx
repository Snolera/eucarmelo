"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import VideoModal from "@/components/VideoModal/VideoModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGalleryIntro } from "@/hooks/useGalleryIntro";
import GalleryCard from "./GalleryCard";
import { FAN, MOBILE_QUERY, SWIPE_MIN, circularDistance, getFanState } from "./motion-config";
import styles from "./Gallery916.module.css";

// Setas do teclado num campo (ex.: barras do player) são do campo, não da galeria
const isFormField = (el) => el?.closest?.("input, textarea, select, [contenteditable='true']");

// Portfólio em leque: o card ativo no centro, vizinhos menores dos dois lados
// Troca por clique num card, setas, ← → do teclado ou swipe; Assistir abre o player do showreel
export default function Gallery916({ items = [], initialActive = 2, label = "Projetos" }) {
  const count = items.length;
  const [active, setActive] = useState(Math.min(initialActive, count - 1));
  const [originRect, setOriginRect] = useState(null); // null = player fechado
  const stageRef = useRef(null);
  const touchX = useRef(0);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduceMotion = useReducedMotion();
  const { introControls, introDone } = useGalleryIntro(stageRef, reduceMotion);
  const fan = isMobile ? FAN.mobile : FAN.desktop;

  // Antes da entrada terminar, os cards não respondem (a animação não é interrompida)
  const step = useCallback(
    (delta) => introDone && setActive((a) => (a + delta + count) % count),
    [introDone, count]
  );
  const select = (i) => introDone && setActive(i);

  // Setas ← → em qualquer lugar da página (menos em campos e com o player aberto)
  const playerOpen = Boolean(originRect);
  useEffect(() => {
    if (playerOpen) return;
    const onKey = (e) => {
      if (isFormField(e.target)) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playerOpen, step]);

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) >= SWIPE_MIN) step(dx < 0 ? 1 : -1);
  };

  // Prévia em autoplay só no card ativo, depois da entrada (não disputa a GPU) e sem "reduzir movimento"
  const showPreview = introDone && !reduceMotion;

  if (!count) return null;
  const activeItem = items[active];

  return (
    <div className={styles.gallery}>
      <div
        ref={stageRef}
        className={styles.stage}
        aria-roledescription="carrossel"
        aria-label={label}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, i) => {
          const distance = circularDistance(i, active, count);
          return (
            <GalleryCard
              key={item.id}
              item={item}
              index={i}
              distance={distance}
              fanned={getFanState(distance, fan)}
              isActive={i === active}
              introControls={introControls}
              introDone={introDone}
              reduceMotion={reduceMotion}
              preview={showPreview && i === active}
              previewPlaying={!playerOpen}
              onSelect={select}
              onWatch={setOriginRect}
            />
          );
        })}
      </div>

      <nav className={styles.controls} aria-label="Navegação da galeria">
        <button type="button" className={`${styles.arrow} ${styles["arrow--prev"]}`} onClick={() => step(-1)} aria-label="Anterior">
          <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {/* Posição na fileira (só no mobile, pelo CSS); decorativa: as setas já dão o controle */}
        <div className={styles.dots} aria-hidden="true">
          {items.map((item, i) => (
            <span key={item.id} className={styles.dot} data-dot data-active={i === active} />
          ))}
        </div>
        <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Próximo">
          <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </nav>

      {/* Mesmo player do showreel: sai do card clicado até o centro (FLIP) */}
      <VideoModal
        open={playerOpen}
        onClose={() => setOriginRect(null)}
        title={activeItem.title}
        src={activeItem.video}
        poster={activeItem.image?.src ?? activeItem.image} // import local é objeto; o <video> quer a URL
        originRect={originRect}
      />
    </div>
  );
}
