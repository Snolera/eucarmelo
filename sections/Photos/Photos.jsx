import Panel from "@/components/Panel/Panel";
import PhotoGrid from "@/components/PhotoGrid/PhotoGrid";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import { photos } from "@/content/site";
import styles from "./Photos.module.css";

// Server Component: só o grid (abre a foto ampliada) roda no cliente
export default function Photos() {
  return (
    <Panel id="galeria" aria-labelledby="photos-title" reveal className={styles.photos}>
      <SectionHeading kicker={photos.kicker} title={photos.title} titleId="photos-title" />
      <PhotoGrid items={photos.items} />
    </Panel>
  );
}
