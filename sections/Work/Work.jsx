import Gallery916 from "@/components/Gallery916/Gallery916";
import Panel from "@/components/Panel/Panel";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import { work } from "@/content/site";
import styles from "./Work.module.css";

// Portfólio. Sem o deslize de entrada do Panel: a galeria tem a própria (queda + leque)
export default function Work() {
  return (
    <Panel id="trabalhos" aria-labelledby="work-title" className={styles.work}>
      <SectionHeading kicker={work.kicker} title={work.title} titleId="work-title" className={styles.workHeading} />
      <Gallery916 items={work.items} />
    </Panel>
  );
}
