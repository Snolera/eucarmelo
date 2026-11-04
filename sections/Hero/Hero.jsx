import Button from "@/components/Button/Button";
import Reveal from "@/components/Reveal/Reveal";
import { hero, instagram, roles } from "@/content/site";
import HeroCard from "./HeroCard";
import styles from "./Hero.module.css";

// Server Component: o conteúdo vem pronto no HTML; só o HeroCard e o Reveal rodam no cliente
export default function Hero() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      {/* O HeroCard desenha o showreel de fundo (sem som) e fica parado; clicar no card abre o player */}
      <HeroCard className={styles.heroCard} video={hero.showreel}>
        {/* Só o texto e o botão entram da esquerda ao carregar: por CSS, sem esperar o JS (o H1 é o LCP) */}
        <Reveal immediate className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 id="hero-title" className={styles.heroTitle}>
              {hero.title} <em className={styles.heroTitleEm}>{hero.titleEm}</em>
            </h1>
            <p className={styles.heroRoles}>{roles}</p>
          </div>

          <Button href={instagram.dmUrl} variant="accent" className={styles.heroDirect}>
            {hero.cta}&nbsp;· {instagram.handle}
          </Button>
        </Reveal>
      </HeroCard>
    </section>
  );
}
