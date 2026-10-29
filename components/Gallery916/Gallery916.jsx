"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GalleryCard from "./GalleryCard";
import GalleryModal from "./GalleryModal";
import { MOBILE_QUERY } from "./motion-config";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useGalleryIntro } from "@/hooks/useGalleryIntro";
import styles from "./Gallery916.module.css";

// Setas do teclado num campo (ex.: barras do player) são do campo, não da galeria
const isFormField = (el) => el?.closest?.("input, textarea, select, [contenteditable='true']");

// Galeria 9:16: 6 cards fixos em linha e sobrepostos; o ativo cresce no lugar
// Desktop: clique num inativo destaca; clique no ativo abre o player
// Mobile (< 768px): fileira com scroll e snap; o card centralizado é o ativo
export default function Gallery916({ items = [], kicker, title, lead, titleId, initialActive = 2, autoplay = false }) {
  const count = items.length;
  const [active, setActive] = useState(Math.min(initialActive, count - 1));
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const activeRef = useRef(active); // lido por callbacks que não devem mudar a cada troca

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduceMotion = useReducedMotion();
  // No mobile o card ativo é o que está centralizado: navegar = rolar até ele.
  const scrollToCard = useCallback(
    (i, behavior = "smooth") => {
      const stage = stageRef.current;
      const card = cardRefs.current[i];
      if (!stage || !card) return;
      const left = card.offsetLeft - (stage.clientWidth - card.offsetWidth) / 2;
      stage.scrollTo({ left, behavior: reduceMotion ? "auto" : behavior });
    },
    [reduceMotion]
  );

  // Garante o card ativo centralizado antes de medir a pilha, sem depender da ordem dos efeitos.
  const centerBeforeIntro = useCallback(() => {
    if (window.matchMedia?.(MOBILE_QUERY).matches) scrollToCard(activeRef.current, "auto");
  }, [scrollToCard]);

  const { introControls, introDone, stackOffsets } = useGalleryIntro(
    stageRef,
    cardRefs,
    reduceMotion,
    centerBeforeIntro
  );

  const goTo = useCallback(
    (i) => {
      if (!introDone) return;
      setHover(false);
      if (isMobile) scrollToCard(i);
      else setActive(i);
    },
    [introDone, isMobile, scrollToCard]
  );

  const step = useCallback((delta) => goTo((activeRef.current + delta + count) % count), [goTo, count]);

  const handleSelect = (i) => {
    if (!introDone) return;
    if (i === active) setOpen(true);
    else goTo(i);
  };

  const handleHoverChange = (value) => introDone && setHover(value);

  const closeModal = useCallback(() => {
    setOpen(false);
    cardRefs.current[activeRef.current]?.focus();
  }, []);

  // Ao entrar no layout mobile, centraliza o card ativo sem animação.
  useEffect(() => {
    if (isMobile) scrollToCard(activeRef.current, "auto");
  }, [isMobile, scrollToCard]);

  // Mobile: o card mais próximo do centro do palco vira o ativo.
  useEffect(() => {
    const stage = stageRef.current;
    if (!isMobile || !stage) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = stage.scrollLeft + stage.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        cardRefs.current.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
          if (dist < best) {
            best = dist;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    };
    stage.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("scroll", onScroll);
    };
  }, [isMobile]);

  // Setas ← → em qualquer lugar da página (menos em campos e com o player aberto)
  useEffect(() => {
    if (open) return;
    const onKey = (e) => {
      if (isFormField(e.target)) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  useEffect(() => {
    if (!autoplay || !introDone || hover || open) return;
    const id = setInterval(() => step(1), 4000);
    return () => clearInterval(id);
  }, [autoplay, introDone, hover, open, step]);

  if (!count) return null;
  const activeItem = items[active];

  return (
    <div className={styles.gallery}>
      {/* div (não <header>): o banner da página é só o header do site */}
      <div className={styles.header}>
        <span className={styles.kicker}>{kicker}</span>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>

      <div
        ref={stageRef}
        className={`${styles.stage} ${introDone ? "" : styles.stageLocked}`}
        aria-roledescription="carrossel"
      >
        {items.map((item, i) => (
          <GalleryCard
            key={item.id}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            item={item}
            index={i}
            offset={i - (count - 1) / 2}
            zIndex={i === active ? 20 : 10 - Math.abs(i - active)}
            isActive={i === active}
            hover={hover}
            isMobile={isMobile}
            reduceMotion={reduceMotion}
            introControls={introControls}
            introDone={introDone}
            stackX={stackOffsets?.[i]}
            onSelect={handleSelect}
            onHoverChange={handleHoverChange}
          />
        ))}
      </div>

      <nav className={styles.controls} aria-label="Navegação da galeria">
        <button type="button" className={`${styles.btnIcon} ${styles.btnArrow}`} onClick={() => step(-1)} aria-label="Anterior">
          <ChevronLeft size={14} strokeWidth={1.5} />
        </button>
        <button type="button" className={`${styles.btnIcon} ${styles.btnArrow}`} onClick={() => step(1)} aria-label="Próximo">
          <ChevronRight size={14} strokeWidth={1.5} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <GalleryModal
            key={activeItem.id}
            item={activeItem}
            index={active}
            onClose={closeModal}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
