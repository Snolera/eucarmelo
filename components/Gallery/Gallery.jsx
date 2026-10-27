"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ReelCard from "@/components/ReelCard/ReelCard";
import VideoModal from "@/components/VideoModal/VideoModal";
import { useCoverflow } from "@/hooks/useCoverflow";
import { VISIBLE_SIDE, getCardPose, spring } from "@/lib/coverflow";
import styles from "./Gallery.module.css";

// Galeria em coverflow: abre no card do meio e troca por arrasto, clique ou setas do teclado
// Clicar no card central abre o player (transição de 240ms); num lateral, traz ele para o centro
export default function Gallery({ items }) {
  const [active, setActive] = useState(null); // { item, originRect }
  const { index, trackRef, select, panHandlers, onKeyDown } = useCoverflow({ total: items.length });
  // Quem prefere menos movimento vê a troca sem animação
  const transition = useReducedMotion() ? { duration: 0 } : spring;

  return (
    <div className={styles.gallery} aria-roledescription="carrossel" onKeyDown={onKeyDown}>
      <motion.div className={styles.galleryStage} {...panHandlers}>
        <ul ref={trackRef} className={styles.galleryTrack}>
          {items.map((item, i) => {
            const offset = i - index;
            return (
              <motion.li
                key={item.id}
                className={styles.galleryCard}
                style={{ zIndex: items.length - Math.abs(offset) }} // o central fica na frente
                initial={false}
                animate={getCardPose(offset)}
                transition={transition}
                aria-hidden={Math.abs(offset) > VISIBLE_SIDE || undefined}
              >
                <ReelCard
                  index={i + 1}
                  client={item.client}
                  category={item.category}
                  poster={item.poster}
                  active={offset === 0}
                  onSelect={() => select(i)}
                  onOpen={(originRect) => setActive({ item, originRect })}
                />
              </motion.li>
            );
          })}
        </ul>
      </motion.div>

      <VideoModal
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.item.client}
        src={active?.item.src}
        poster={active?.item.poster}
        originRect={active?.originRect}
      />
    </div>
  );
}
