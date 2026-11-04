import Image from "next/image";
import Panel from "@/components/Panel/Panel";
import { partners } from "@/content/site";
import styles from "./Partners.module.css";

// Uma volta da faixa; a cópia (hidden) é só visual: alt vazio e aria-hidden
function LogoList({ hidden = false }) {
  return (
    <ul className={styles.partnersList} aria-hidden={hidden || undefined}>
      {partners.map((partner) => (
        <li key={partner.name} className={styles.partnersItem}>
          {/* sizes = largura máxima do logo (--partners-logo, 208px); lazy porque fica abaixo do Hero */}
          <Image src={partner.logo} alt={hidden ? "" : partner.name} sizes="208px" className={styles.partnersLogo} />
        </li>
      ))}
    </ul>
  );
}

// Faixa infinita só com CSS: lista + cópia lado a lado; anda uma lista inteira e recomeça sem emenda
export default function Partners() {
  return (
    <Panel aria-label="Marcas parceiras" reveal className={styles.partners}>
      <div className={styles.partnersViewport}>
        <div className={styles.partnersTrack}>
          <LogoList />
          <LogoList hidden />
        </div>
      </div>
    </Panel>
  );
}
