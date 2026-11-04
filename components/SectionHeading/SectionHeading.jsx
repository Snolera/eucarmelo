import { Fragment } from "react";
import Kicker from "@/components/Kicker/Kicker";
import styles from "./SectionHeading.module.css";

// "Por trás de *cada*\n*projeto*" → trechos de texto, destaque (em) e quebra de linha (br)
export function parseEmphasis(source) {
  const parts = [];
  source.split("\n").forEach((line, i) => {
    if (i > 0) parts.push({ type: "br" });
    // Índices ímpares do split são o que estava entre asteriscos
    line.split("*").forEach((value, j) => {
      if (value) parts.push({ type: j % 2 ? "em" : "text", value });
    });
  });
  return parts;
}

// Cabeçalho centralizado das seções: pílula, H2 (Space Grotesk light + destaques em Playfair) e lead opcional
export default function SectionHeading({ kicker, title, titleId, lead, className = "" }) {
  return (
    <div className={`${styles.heading} ${className}`}>
      <Kicker>{kicker}</Kicker>
      <h2 id={titleId} className={styles.headingTitle}>
        {parseEmphasis(title).map((part, i) => (
          <Fragment key={i}>
            {part.type === "text" && part.value}
            {part.type === "em" && <em className={styles.headingEm}>{part.value}</em>}
            {/* O espaço antes do <br> mantém o nome do título legível ("cada projeto") */}
            {part.type === "br" && (
              <>
                {" "}
                <br />
              </>
            )}
          </Fragment>
        ))}
      </h2>
      {lead && <p className={styles.headingLead}>{lead}</p>}
    </div>
  );
}
