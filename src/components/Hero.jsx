import { site } from '../data/site'
import { TalvezLink } from './Basicos'

export default function Hero() {
  const [primeiro, ...resto] = site.nome.split(' ')

  return (
    <header className="flex flex-col gap-8 lg:gap-16">
      {/* Navegação */}
      <nav className="flex items-center justify-between text-texto">
        <TalvezLink link={site.assinaturaLink} as="span" className="text-[12px] lg:text-[14px]">
          {site.assinatura}
        </TalvezLink>
        <ul className="flex gap-[18px] text-[11px] lg:gap-8 lg:text-[13px]">
          {site.navegacao.map((item) => (
            <li key={item.rotulo}>
              <TalvezLink link={item.link} as="span">
                {item.rotulo}
              </TalvezLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Nome: duas linhas no celular/tablet, uma linha no computador */}
      <h1 className="font-display font-normal uppercase text-texto leading-[0.9] text-[clamp(64px,26.6vw,104px)] md:text-[150px] lg:leading-[0.95] lg:text-[clamp(110px,9.65vw,139px)]">
        <span className="block lg:inline">{primeiro}</span>{' '}
        <span className="block lg:inline">{resto.join(' ')}</span>
      </h1>

      {/* Especialidade (celular/tablet) */}
      <p className="text-[13px] leading-[1.5] md:text-[16px] lg:hidden">{site.especialidade}</p>

      {/* Apresentação cinematográfica */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:gap-[72px]">
        <div className="hidden w-[280px] shrink-0 flex-col gap-7 pb-2 lg:flex">
          <p className="text-[16px] leading-[1.6]">{site.especialidade}</p>
          <p className="text-[12px] uppercase text-suave">{site.chamadaPortfolio}</p>
        </div>

        <picture className="block h-[300px] w-full overflow-hidden md:h-[440px] lg:h-[clamp(320px,30.5vw,440px)] lg:flex-1">
          <source media="(max-width: 767px)" srcSet={site.hero.imagemMobile} />
          <img
            src={site.hero.imagem}
            alt={site.hero.alt}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </picture>
      </div>
    </header>
  )
}
