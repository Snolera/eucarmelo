"use client";

import { useState } from "react";
import { motion } from "motion/react";
import ReelCard from "@/components/ReelCard/ReelCard";
import VideoModal from "@/components/VideoModal/VideoModal";
import { isKeyboardFocus, useRingRotation } from "@/hooks/useRingRotation";
import styles from "./Gallery.module.css";

// Galeria em anel 3D: cada card é girado em Y e empurrado para fora em Z
// Gira sozinha e com o arrasto; clicar num card abre o player (transição de 240ms, sem giro)
export default function Gallery({ items }) {
  const [active, setActive] = useState(null); // { item, originRect }
  const { rotation, focusIndex, panHandlers, focusHandlers } = useRingRotation({
    total: items.length,
    paused: Boolean(active),
  });
  const step = 360 / items.length;

  return (
    <div className={styles.gallery}>
      <motion.div className={styles.galleryStage} {...panHandlers} {...focusHandlers}>
        <div className={styles.galleryDepth}>
          <motion.ul className={styles.galleryRing} style={{ rotateX: -6, rotateY: rotation }}>
            {items.map((item, index) => (
              <li
                key={item.id}
                className={styles.galleryCard}
                style={{ "--angle": `${index * step}deg` }}
                onFocus={(e) => isKeyboardFocus(e.target) && focusIndex(index)}
              >
                <ReelCard
                  index={index + 1}
                  client={item.client}
                  category={item.category}
                  poster={item.poster}
                  onOpen={(originRect) => setActive({ item, originRect })}
                />
              </li>
            ))}
          </motion.ul>
        </div>
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
