import Logo from "@/components/Logo/Logo";
import Panel from "@/components/Panel/Panel";
import SocialIcon from "@/components/SocialIcon/SocialIcon";
import { footer, roles, social } from "@/content/site";
import styles from "./Footer.module.css";

// Rodapé = seção Contato (#contato): logo, funções, redes e copyright, centralizados
export default function Footer() {
  return (
    <Panel as="footer" id="contato" className={styles.footer}>
      <Logo className={styles.footerLogo} />
      <p className={styles.footerRoles}>{roles}</p>

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

      <p className={styles.footerCopy}>{footer.copyright}</p>
    </Panel>
  );
}
