import Kicker from "@/components/Kicker/Kicker";
import Panel from "@/components/Panel/Panel";
import { work } from "@/content/site";
import WorkGrid from "./WorkGrid";
import styles from "./Work.module.css";

export default function Work() {
  return (
    <Panel id="trabalhos" aria-labelledby="work-title" variant="glass" className={styles.work}>
      <div className={styles.workHeader}>
        <Kicker>{work.kicker}</Kicker>
        <h2 id="work-title" className={styles.workTitle}>
          {work.title}
        </h2>
      </div>
      <WorkGrid items={work.items} />
    </Panel>
  );
}
