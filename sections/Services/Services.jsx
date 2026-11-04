import Panel from "@/components/Panel/Panel";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import { services } from "@/content/site";
import ServicesTimeline from "./ServicesTimeline";
import styles from "./Services.module.css";

// Server Component: a caixa fica parada; cabeçalho e linha do tempo animam no ServicesTimeline (cliente)
export default function Services() {
  return (
    <Panel id="servicos" aria-labelledby="services-title" className={styles.services}>
      <ServicesTimeline
        heading={
          <SectionHeading
            className={styles.servicesHeading}
            kicker={services.kicker}
            title={services.title}
            titleId="services-title"
            lead={services.lead}
          />
        }
        items={services.items}
      />
    </Panel>
  );
}
