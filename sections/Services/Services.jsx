import Panel from "@/components/Panel/Panel";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import { services } from "@/content/site";
import styles from "./Services.module.css";

// 3 serviços: número, título e os pares "Pra quem" / "O que resolve"
export default function Services() {
  return (
    <Panel id="servicos" aria-labelledby="services-title" reveal className={styles.services}>
      <SectionHeading kicker={services.kicker} title={services.title} titleId="services-title" lead={services.lead} />

      <div className={styles.servicesGrid}>
        {services.items.map((item) => (
          <article key={item.n} className={styles.servicesCard}>
            <span className={styles.servicesNumber}>{item.n}</span>
            <h3 className={styles.servicesTitle}>{item.title}</h3>
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
        ))}
      </div>
    </Panel>
  );
}
