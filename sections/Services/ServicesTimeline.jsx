"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal/Reveal";
import { useTimelineReveal } from "@/hooks/useTimelineReveal";
import { useTimelineLine } from "@/hooks/useTimelineLine";
import styles from "./Services.module.css";

// Cabeçalho entra primeiro (Reveal); depois os passos da linha do tempo
// Mobile/tablet: a linha desce com o scroll e cada card entra quando o ponto dele cruza 80% da tela
// Desktop (CSS): quando a fileira cruza a linha de leitura, a linha corre da esquerda e cada
// ponto + card entra quando ela chega (--i × --tl-step, 350ms)
export default function ServicesTimeline({ heading, items }) {
  const reduceMotion = useReducedMotion();
  const [headingDone, setHeadingDone] = useState(false);
  const onHeadingReveal = useCallback(() => setHeadingDone(true), []);
  const { dots, setDot, shown } = useTimelineReveal(items.length, { ready: headingDone, skip: reduceMotion });
  const trackRef = useRef(null);
  const scaleY = useTimelineLine(trackRef, dots, shown);

  return (
    <>
      <Reveal onReveal={onHeadingReveal}>{heading}</Reveal>

      <div className={styles.servicesTimeline} data-active={shown > 0}>
        <motion.span
          ref={trackRef}
          className={styles.servicesTrack}
          style={{ scaleY: reduceMotion ? 1 : scaleY }}
          aria-hidden="true"
        />
        <ol className={styles.servicesSteps}>
          {items.map((item, i) => (
            <li key={item.n} className={styles.servicesStep} data-shown={i < shown} style={{ "--i": i }}>
              <span className={styles.servicesMarker} data-timeline-marker aria-hidden="true">
                <span ref={setDot(i)} className={styles.servicesDot} />
              </span>
              <article className={styles.servicesCard}>
                <div className={styles.servicesHead}>
                  <span className={styles.servicesNumber}>{item.n}</span>
                  <h3 className={styles.servicesTitle}>{item.title}</h3>
                </div>
                <dl className={styles.servicesList}>
                  <div className={styles.servicesItem}>
                    <dt className={styles.servicesLabel}>Pra quem</dt>
                    <dd className={styles.servicesText}>{item.who}</dd>
                  </div>
                  <div className={styles.servicesItem}>
                    <dt className={styles.servicesLabel}>O que resolve</dt>
                    <dd className={styles.servicesText}>{item.what}</dd>
                  </div>
                </dl>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
