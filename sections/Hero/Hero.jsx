// import { Play } from "lucide-react"; // usado pelo botão "Assistir showreel" (comentado)
import Button from "@/components/Button/Button";
import Reveal from "@/components/Reveal/Reveal";
import { hero, instagram } from "@/content/site";
import HeroCard from "./HeroCard";
import styles from "./Hero.module.css";

// Server Component: o conteúdo vem pronto no HTML; só o HeroCard e o Reveal rodam no cliente
export default function Hero() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
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
              {/* Botão "Assistir showreel" comentado: some no mobile e no desktop.
                  Atenção: era o acesso por teclado/leitor de tela ao player (o clique no card continua)
                  Para reativar, descomente o bloco e o import do Play no topo do arquivo.
              <Button variant="light" className={styles.heroWatch} aria-haspopup="dialog">
                <Play size={16} strokeWidth={1.6} aria-hidden="true" />
                {hero.watch}
              </Button>
              */}
              <Button href={instagram.dmUrl} variant="accent" className={styles.heroDirect}>
                {hero.cta} · {instagram.handle}
              </Button>
            </div>
          </div>
        </HeroCard>
      </Reveal>
    </section>
  );
}
