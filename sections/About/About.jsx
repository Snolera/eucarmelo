import Image from "next/image";
import Kicker from "@/components/Kicker/Kicker";
import Panel from "@/components/Panel/Panel";
import { about } from "@/content/site";
import styles from "./About.module.css";

// Texto primeiro, retrato abaixo (em todas as telas)
export default function About() {
  return (
    <Panel id="sobre" aria-labelledby="about-title" variant="glass" className={styles.about}>
      <div className={styles.aboutContent}>
        <Kicker>{about.kicker}</Kicker>
        <h2 id="about-title" className={styles.aboutTitle}>
          {about.title}
        </h2>
        <div className={styles.aboutText}>
          {about.paragraphs.map((text) => (
            <p key={text.slice(0, 24)}>{text}</p>
          ))}
        </div>
      </div>

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
    </Panel>
  );
}
