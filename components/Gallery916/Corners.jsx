import styles from "./Gallery916.module.css";

// 4 marcas de registro "+" nos cantos de uma moldura .blueprint
export default function Corners() {
  return (
    <>
      <i className={`${styles.corner} ${styles.tl}`} />
      <i className={`${styles.corner} ${styles.tr}`} />
      <i className={`${styles.corner} ${styles.bl}`} />
      <i className={`${styles.corner} ${styles.br}`} />
    </>
  );
}
