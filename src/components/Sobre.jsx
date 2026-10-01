import { site } from '../data/site'
import { TituloSecao } from './Basicos'

export default function Sobre() {
  const { nome, texto, retrato, alt } = site.sobre

  return (
    <section id="sobre" className="flex flex-col gap-7 lg:gap-10">
      <TituloSecao>Sobre</TituloSecao>

      <div className="flex flex-col gap-7 md:flex-row md:items-center md:gap-12 lg:gap-20">
        <img
          src={retrato}
          alt={alt}
          loading="lazy"
          className="aspect-[342/340] w-full object-cover md:aspect-[420/360] md:w-[46%] md:max-w-[420px] md:shrink-0"
        />
        <div className="flex flex-col gap-5">
          <p className="text-[18px]">{nome}</p>
          <p className="text-[15px] leading-[1.65] lg:text-[19px]">{texto}</p>
        </div>
      </div>
    </section>
  )
}
