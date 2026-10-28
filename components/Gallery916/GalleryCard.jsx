"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Play } from "lucide-react";
import Corners from "./Corners";
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
  BORDER_ACCENT,
  BORDER_DIVIDER,
} from "./motion-config";
import styles from "./Gallery916.module.css";

const INACTIVE_LOOK = {
  boxShadow: SHADOW_SM,
  borderColor: BORDER_DIVIDER,
  filter: "saturate(0.6) brightness(0.97)",
};

// Estado final (leque). x: 0 = posição do CSS; z-index troca sem interpolação.
function getFannedState({ isActive, hover, isMobile, reduceMotion, zIndex }) {
  const base = { x: 0, opacity: 1, zIndex };
  if (!isActive) return { ...base, scale: 1, y: 0, ...INACTIVE_LOOK };

  const lifted = hover && !isMobile && !reduceMotion;
  let scale = lifted ? 1.2 : 1.16;
  if (isMobile) scale = 1.06;
  if (reduceMotion) scale = isMobile ? 1.04 : 1.08;
  return {
    ...base,
    scale,
    y: isMobile || reduceMotion ? 0 : lifted ? -26 : -14,
    boxShadow: lifted ? SHADOW_LG : SHADOW_MD,
    borderColor: BORDER_ACCENT,
    filter: "saturate(1) brightness(1)",
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

// Card 9:16 em "desenho técnico": duotone azul-aço (inativo) ou laranja claro (ativo)
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
  const tintTransition = { duration: reduceMotion ? 0.15 : 0.4 };
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.button
      ref={ref}
      type="button"
      className={`${styles.card} ${styles.blueprint} ${isActive ? styles.cardActive : ""}`}
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
      <Corners />
      <span className={styles.inner}>
        <span className={styles.media}>
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 62vw, 260px"
            loading="eager"
            className={styles.image}
          />
          <motion.span
            className={styles.tintCool}
            initial={false}
            animate={{ opacity: isActive ? 0 : 1 }}
            transition={tintTransition}
          />
          <motion.span
            className={styles.tintWarm}
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={tintTransition}
          />
          <span className={`${styles.tag} ${styles.tagNum}`}>{number}</span>
          <span className={`${styles.tag} ${styles.tagDur}`}>{item.duration}</span>
        </span>
        <span className={styles.footer}>
          <span className={styles.meta}>
            <span className={styles.kickerSm}>{item.kicker}</span>
            <span className={styles.cardTitle}>{item.title}</span>
          </span>
          <span className={`${styles.play} ${styles.blueprint}`} aria-hidden="true">
            <Corners />
            <Play size={16} strokeWidth={1.5} />
          </span>
        </span>
      </span>
    </motion.button>
  );
}
