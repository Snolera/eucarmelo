"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReelCard from "@/components/ReelCard/ReelCard";
import VideoModal from "@/components/VideoModal/VideoModal";
import { useCarousel } from "@/hooks/useCarousel";
import styles from "./Work.module.css";

const VISIBLE_MOBILE = 2; // cards visíveis no carrossel mobile

// Mobile: carrossel de trilho com setas; tablet/desktop: grade (via CSS)
export default function WorkGrid({ items }) {
  const [active, setActive] = useState(null);
  const { index, canPrev, canNext, prev, next, reveal, swipeHandlers } = useCarousel({
    total: items.length,
    visible: VISIBLE_MOBILE,
    step: VISIBLE_MOBILE, // cada passada revela 2 cards novos
  });

  return (
    <>
      <div className={styles.workCarousel} role="group" aria-roledescription="carrossel" aria-label="Reels">
        <div className={styles.workViewport} {...swipeHandlers}>
          <ul className={styles.workGrid} style={{ "--index": index }}>
            {items.map((item, i) => (
              <li key={item.id} className={styles.workItem} onFocus={() => reveal(i)}>
                <ReelCard
                  index={i + 1}
                  client={item.client}
                  category={item.category}
                  poster={item.poster}
                  onOpen={() => setActive(item)}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Setas abaixo das legendas (só no mobile) */}
        <div className={styles.workControls}>
          <button
            type="button"
            className={styles.workArrow}
            onClick={prev}
            disabled={!canPrev}
            aria-label="Reel anterior"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className={styles.workArrow}
            onClick={next}
            disabled={!canNext}
            aria-label="Próximo reel"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>

        <p className={styles.workStatus} aria-live="polite">
          Reels {index + 1} e {index + VISIBLE_MOBILE} de {items.length}
        </p>
      </div>

      <VideoModal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.client}
        src={active?.src}
        poster={active?.poster}
      />
    </>
  );
}
