"use client";

import { motion } from "motion/react";
import Image from "next/image";
import {
  SPRING,
  DROP_SPRING,
  FAN_SPRING,
  DROP_DISTANCE,
  DROP_STAGGER,
  FAN_STAGGER,
  SHADOW_SM,
  SHADOW_MD,
  SHADOW_LG,
} from "./motion-config";
import styles from "./Gallery916.module.css";

const INACTIVE_LOOK = {
  boxShadow: SHADOW_SM,
  filter: "brightness(0.7)",
};

// Estado final (leque). x: 0 = posição do CSS; z-index troca sem interpolação.
function getFannedState({ isActive, hover, isMobile, reduceMotion, zIndex }) {
  const base = { x: 0, opacity: 1, zIndex };
  if (!isActive) return { ...base, scale: 1, y: 0, ...INACTIVE_LOOK };

  const lifted = hover && !isMobile && !reduceMotion;
  // Card horizontal é largo: escala menor que a do 9:16 para caber na coluna de 1240px
  let scale = lifted ? 1.1 : 1.07;
  if (isMobile) scale = 1.03;
  if (reduceMotion) scale = isMobile ? 1.02 : 1.05;
  return {
    ...base,
    scale,
    y: isMobile || reduceMotion ? 0 : lifted ? -18 : -10,
    boxShadow: lifted ? SHADOW_LG : SHADOW_MD,
    filter: "brightness(1)",
  };
}

// Variants da entrada; `custom` = props do card + stackX (deslocamento até o centro, em px).
const introVariants = {
  hidden: (c) => ({
    x: c.stackX,
    y: -DROP_DISTANCE,
    scale: 1,
    opacity: 0,
    zIndex: c.stackZ,
    ...INACTIVE_LOOK,
  }),
  stacked: (c) => ({
    x: c.stackX,
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
    ...getFannedState(c),
    transition: {
      ...FAN_SPRING,
      delay: c.fanOrder * FAN_STAGGER,
      zIndex: { duration: 0 },
    },
  }),
};

// Card horizontal (formato da print): imagem 16:9 no topo, título e o kicker como descrição
// 1º clique destaca; clique no ativo abre o player
export default function GalleryCard({
  ref,
  item,
  index,
  offset,
  zIndex,
  isActive,
  hover,
  isMobile,
  reduceMotion,
  introControls,
  introDone,
  stackX = 0,
  onSelect,
  onHoverChange,
}) {
  const cardState = { index, isActive, hover, isMobile, reduceMotion, zIndex };
  const custom = {
    ...cardState,
    stackX,
    stackZ: 20 - index,
    fanOrder: Math.abs(offset) - 0.5,
  };
  const transition = {
    ...(reduceMotion ? { duration: 0.15 } : SPRING),
    zIndex: { duration: 0 },
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className={styles.card}
      style={{ "--d": offset }}
      custom={custom}
      variants={introVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={introDone ? getFannedState(cardState) : introControls}
      transition={transition}
      onHoverStart={() => isActive && onHoverChange(true)}
      onHoverEnd={() => onHoverChange(false)}
      onClick={() => onSelect(index)}
      aria-pressed={isActive}
      aria-haspopup={isActive ? "dialog" : undefined}
      aria-label={isActive ? `Assistir: ${item.title}` : `Destacar: ${item.title}`}
    >
      <span className={styles.media}>
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 78vw, 340px"
          loading="eager"
          className={styles.image}
        />
      </span>
      <span className={styles.meta}>
        <span className={styles.cardTitle}>{item.title}</span>
        <span className={styles.cardDesc}>{item.kicker}</span>
      </span>
    </motion.button>
  );
}
