"use client";

import { useState } from "react";
import Image from "next/image";
import PhotoLightbox from "@/components/PhotoLightbox/PhotoLightbox";
import styles from "./PhotoGrid.module.css";

// Grid de miniaturas: 2 colunas no mobile (a 1ª foto larga, 4:3) e 3 a partir de 768px (todas 4:5)
// Clicar numa miniatura abre a foto ampliada
export default function PhotoGrid({ items = [] }) {
  const [openId, setOpenId] = useState(null);
  const openPhoto = items.find((p) => p.id === openId) ?? null;

  return (
    <>
      <ul className={styles.grid}>
        {items.map((photo, i) => (
          <li key={photo.id} className={styles.gridItem}>
            <button
              type="button"
              className={styles.gridButton}
              aria-label={`Ampliar: ${photo.alt}`}
              aria-haspopup="dialog"
              onClick={() => setOpenId(photo.id)}
            >
              <Image
                src={photo.image}
                alt={photo.alt}
                fill
                placeholder="blur"
                sizes={i === 0 ? "(min-width: 768px) 33vw, 100vw" : "(min-width: 768px) 33vw, 50vw"}
                className={styles.gridImage}
              />
            </button>
          </li>
        ))}
      </ul>
      <PhotoLightbox photo={openPhoto} onClose={() => setOpenId(null)} />
    </>
  );
}
