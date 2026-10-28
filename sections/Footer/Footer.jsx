import SocialIcon from "@/components/SocialIcon/SocialIcon";
import { footer, social } from "@/content/site";
import styles from "./Footer.module.css";

// Rodapé na coluna central: copyright à esquerda, redes à direita
export default function Footer() {
  return (
    <footer className={`container ${styles.footer}`}>
      <p className={styles.footerCopy}>{footer.copyright}</p>

      <nav aria-label="Redes sociais">
        <ul className={styles.footerSocial}>
          {social.map((item) => {
            const isExternal = item.href?.startsWith("http");
            return (
              <li key={item.id}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={styles.footerLink}
                    aria-label={item.label}
                    {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    <SocialIcon name={item.id} />
                  </a>
                ) : (
                  // Sem endereço ainda: só o ícone, sem link quebrado
                  <span
                    className={`${styles.footerLink} ${styles["footerLink--pending"]}`}
                    role="img"
                    aria-label={`${item.label} (em breve)`}
                  >
                    <SocialIcon name={item.id} />
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
