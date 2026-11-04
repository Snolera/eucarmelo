import Image from "next/image";
import Kicker from "@/components/Kicker/Kicker";
import Panel from "@/components/Panel/Panel";
import { parseEmphasis } from "@/components/SectionHeading/SectionHeading";
import { about } from "@/content/site";
import styles from "./About.module.css";

// Ordem do HTML = ordem do mobile (título, retrato, texto); no desktop o grid põe o retrato à esquerda
export default function About() {
  return (
    <Panel id="sobre" aria-labelledby="about-title" reveal className={styles.about}>
      <Kicker className={styles.aboutKicker}>{about.kicker}</Kicker>

      <div className={styles.aboutGrid}>
        <h2 id="about-title" className={styles.aboutTitle}>
          {parseEmphasis(about.title).map((part, i) =>
            part.type === "em" ? (
              <em key={i} className={styles.aboutEm}>{part.value}</em>
            ) : part.type === "br" ? (
              <br key={i} />
            ) : (
              part.value
            )
          )}
        </h2>

        <figure className={styles.aboutPortrait}>
          {about.portrait.src && (
            <Image
              src={about.portrait.src}
              alt={about.portrait.alt}
              fill
              sizes="(min-width: 1024px) 300px, (min-width: 768px) 240px, 100vw"
              className={styles.aboutPortraitImage}
            />
          )}
        </figure>

        <div className={styles.aboutText}>
          {about.paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
        </div>
      </div>
    </Panel>
  );
}
