import { ArrowUpRight } from 'lucide-react'
import { IconeInstagram, TalvezLink } from './Basicos'

// Card de um trabalho do portfólio.
// - Se "video" estiver preenchido, toca o trecho em loop (sem som) usando a imagem como capa.
// - Se "link" estiver preenchido, o card inteiro vira link para o post no Instagram.
// - No computador todos os cards têm 416x540 (Figma).
export default function CardTrabalho({ trabalho }) {
  const { titulo, categoria, duracao, imagem, imagemMobile, video, link } = trabalho

  return (
    <TalvezLink link={link} as="article" className="flex flex-col gap-3">
      <div className="relative aspect-[163/218] w-full overflow-hidden bg-linha/40 lg:aspect-[416/540]">
        {video ? (
          <video
            src={video}
            poster={imagem}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <picture>
            {imagemMobile && <source media="(max-width: 767px)" srcSet={imagemMobile} />}
            <img
              src={imagem}
              alt={titulo}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
        )}

        {/* Selo "Reel" */}
        <span className="absolute left-2.5 top-2.5 flex items-center gap-[5px] bg-black/60 px-2 py-1.5 text-[10px]">
          <IconeInstagram size={13} />
          Reel
        </span>

        {/* Duração */}
        <span className="absolute bottom-2.5 right-2.5 bg-black/60 px-1.5 py-1 text-[10px]">
          {duracao}
        </span>
      </div>

      {/* Legenda */}
      <div className="flex flex-col gap-[5px]">
        <div className="flex items-center gap-2">
          <h3 className="flex-1 text-[13px] font-normal leading-[1.2] md:text-[15px] lg:text-[17px]">
            {titulo}
          </h3>
          <ArrowUpRight size={16} strokeWidth={2} className="hidden shrink-0 lg:block" aria-hidden="true" />
        </div>
        <p className="text-[10px] text-suave lg:text-[11px]">{categoria} · Instagram</p>
      </div>
    </TalvezLink>
  )
}
