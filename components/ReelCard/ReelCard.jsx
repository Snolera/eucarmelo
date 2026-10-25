import Image from "next/image";
import { Play } from "lucide-react";
import styles from "./ReelCard.module.css";

// Card 9:16; o botão cobre o card inteiro (stretched link) e abre o player
export default function ReelCard({ index, client, category, poster, onOpen }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardMedia}>
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1024px) 250px, 45vw"
            className={styles.cardPoster}
          />
        )}
        <span className={styles.cardIndex} aria-hidden="true">
          {String(index).padStart(2, "0")}
        </span>
        <span className={styles.cardPlay} aria-hidden="true">
          <Play size={18} strokeWidth={1.6} />
        </span>
      </div>

      <div className={styles.cardCaption}>
        <h3 className={styles.cardClient}>{client}</h3>
        <p className={styles.cardCategory}>{category}</p>
      </div>

      <button
        type="button"
        className={styles.cardButton}
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Assistir reel ${client}`}
      />
    </article>
  );
}
