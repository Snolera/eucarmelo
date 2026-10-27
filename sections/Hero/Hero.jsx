import { Play } from "lucide-react";
import Button from "@/components/Button/Button";
import Reveal from "@/components/Reveal/Reveal";
import { hero, instagram } from "@/content/site";
import HeroCard from "./HeroCard";
import styles from "./Hero.module.css";

// Server Component: o conteúdo vem pronto no HTML; só o HeroCard e o Reveal rodam no cliente
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      {/* Entra da esquerda ao carregar: por CSS, sem esperar o JS (o H1 é o LCP) */}
      <Reveal immediate>
        {/* O HeroCard também desenha o showreel de fundo (sem som) */}
        <HeroCard className={styles.heroCard} video={hero.showreel}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <p className={styles.heroKicker}>{hero.kicker}</p>
              <h1 id="hero-title" className={styles.heroTitle}>
                {hero.title} <em>{hero.titleEm}</em>
              </h1>
            </div>

            <div className={styles.heroActions}>
              {/* Acesso por teclado/leitor de tela; o clique sobe até o HeroCard */}
              <Button variant="light" aria-haspopup="dialog">
                <Play size={16} strokeWidth={1.6} aria-hidden="true" />
                {hero.watch}
              </Button>
              <Button href={instagram.dmUrl} variant="accent">
                {hero.cta} · {instagram.handle}
              </Button>
            </div>
          </div>
        </HeroCard>
      </Reveal>
    </section>
  );
}
