import Link from "next/link";
import styles from "./Logo.module.css";

// "welinton" light + "carmelo" negrito, colados; o aria-label separa as palavras para o leitor de tela
// Tamanho e cor vêm do className de quem usa (header e rodapé)
export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={`${styles.logo} ${className}`} aria-label="Welinton Carmelo">
      welinton
      <span className={styles.logoBold} data-logo-bold>
        carmelo
      </span>
    </Link>
  );
}
