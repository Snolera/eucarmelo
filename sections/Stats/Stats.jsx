import Panel from "@/components/Panel/Panel";
import { stats } from "@/content/site";
import styles from "./Stats.module.css";

// Faixa só com CSS: entra pela direita, sai pela esquerda, sem repetir valores
// Futuro: vitrine de marcas atendidas
export default function Stats() {
  return (
    <Panel aria-label="Números" className={styles.stats}>
      <div className={styles.statsViewport}>
        <ul className={styles.statsList}>
          {stats.map((item) => (
            <li key={item.label} className={styles.statsItem}>
              <span className={styles.statsValue}>{item.value}</span>
              <span className={styles.statsLabel}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
