"use client";

import { useId } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { DROP_DISTANCE, DROP_SPRING, DROP_STAGGER, FAN_SPRING, FAN_STAGGER, SPRING } from "./motion-config";
import styles from "./Gallery916.module.css";

// Variants da entrada; `custom` = { index, fanned (posição final), stackZ }
// Todos os cards nascem no centro do palco: a pilha é só x = 0, sem medir nada
const introVariants = {
  hidden: (c) => ({ x: 0, y: -DROP_DISTANCE, scale: 1, opacity: 0, zIndex: c.stackZ }),
  stacked: (c) => ({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    zIndex: c.stackZ,
    transition: {
      ...DROP_SPRING,
      delay: c.index * DROP_STAGGER,
      opacity: { duration: 0.3, delay: c.index * DROP_STAGGER },
    },
  }),
  fanned: (c) => ({
    ...c.fanned,
    transition: { ...FAN_SPRING, delay: c.ring * FAN_STAGGER, zIndex: { duration: 0 } },
  }),
};

// Card do leque: capa, título + ano, descrição, tag + duração e botão Assistir
// Clique em qualquer parte de um card inativo o traz para o centro; Assistir no ativo abre o player
export default function GalleryCard({ item, index, distance, fanned, isActive, introControls, introDone, reduceMotion, onSelect, onWatch }) {
  const titleId = useId();
  const hidden = fanned.opacity === 0;
  const custom = { index, fanned, stackZ: fanned.zIndex, ring: Math.abs(distance) };
  const transition = { ...(reduceMotion ? { duration: 0.15 } : SPRING), zIndex: { duration: 0 } };

  const handleWatch = (e) => {
    if (!isActive) return; // inativo: o clique sobe até o card e só o destaca
    e.stopPropagation();
    onWatch(e.currentTarget.closest("article").getBoundingClientRect());
  };

  return (
    <motion.article
      className={styles.card}
      aria-labelledby={titleId}
      aria-current={isActive ? "true" : undefined}
      inert={hidden} // fora do leque: sem foco, sem clique e fora da árvore de acessibilidade
      custom={custom}
      variants={introVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={introDone ? fanned : introControls}
      transition={transition}
      onClick={() => !isActive && onSelect(index)}
    >
      <Image src={item.image} alt={item.alt} fill sizes="(min-width: 768px) 270px, 236px" className={styles.cardImage} />

      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <h3 id={titleId} className={styles.cardTitle}>
            {item.title}
          </h3>
          <span className={styles.cardYear}>{item.year}</span>
        </div>
        <p className={styles.cardDesc}>{item.desc}</p>
        <div className={styles.cardTags}>
          <span className={styles.cardTag}>{item.tag}</span>
          <span className={`${styles.cardTag} ${styles.cardTagTime}`}>{item.duration}</span>
        </div>
        <button
          type="button"
          className={styles.cardWatch}
          tabIndex={isActive ? undefined : -1} // teclado: setas trocam o card, Tab chega só no ativo
          aria-label={`Assistir: ${item.title}`}
          aria-haspopup="dialog"
          onClick={handleWatch}
        >
          Assistir
        </button>
      </div>
    </motion.article>
  );
}
