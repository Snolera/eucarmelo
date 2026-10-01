import projetos from '../data/projetos.json'
import { site } from '../data/site'
import CardTrabalho from './CardTrabalho'
import { TituloSecao } from './Basicos'

export default function Portfolio() {
  return (
    <section id="portfolio" className="flex flex-col gap-7 lg:gap-10">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between">
        <TituloSecao>Portfólio</TituloSecao>
        <p className="text-[11px] text-suave">{site.portfolio.legenda}</p>
      </div>

      {/* Celular/tablet: 2 colunas iguais.
          Computador: 3 colunas de 416px com 24px de espaço (3×416 + 2×24 = 1296). */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-12">
        {projetos.map((trabalho) => (
          <CardTrabalho key={trabalho.titulo} trabalho={trabalho} />
        ))}
      </div>
    </section>
  )
}
