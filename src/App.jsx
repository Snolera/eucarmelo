import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Sobre from './components/Sobre'
import Contato from './components/Contato'

// Espaçamentos do Figma:
// celular  → margens 24px, 72px entre seções
// computador (1440) → margens 72px, 112px entre seções, conteúdo de 1296px
export default function App() {
  return (
    <main className="mx-auto flex max-w-[1440px] flex-col gap-[72px] px-6 pt-7 pb-10 md:gap-24 md:px-12 md:pt-8 lg:gap-28 lg:px-[clamp(40px,5vw,72px)] lg:pt-9 lg:pb-16">
      <Hero />
      <Portfolio />
      <Sobre />
      <Contato />
    </main>
  )
}
