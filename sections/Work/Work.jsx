import Gallery916 from "@/components/Gallery916/Gallery916";
import Panel from "@/components/Panel/Panel";
import { work } from "@/content/site";
import styles from "./Work.module.css";

// Sem o deslize de entrada do Panel: a galeria tem a própria (queda + leque)
export default function Work() {
  return (
    <Panel id="trabalhos" aria-labelledby="work-title" variant="glass" className={styles.work}>
      <Gallery916 items={work.items} kicker={work.kicker} title={work.title} lead={work.lead} titleId="work-title" />
    </Panel>
  );
}
