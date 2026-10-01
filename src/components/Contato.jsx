import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import { site } from '../data/site'
import { IconeInstagram, TalvezLink, TituloSecao } from './Basicos'

const icones = {
  instagram: (p) => <IconeInstagram {...p} />,
  whatsapp: (p) => <MessageCircle {...p} aria-hidden="true" />,
  email: (p) => <Mail {...p} aria-hidden="true" />,
}

export default function Contato() {
  return (
    <section id="contato" className="flex flex-col gap-7 lg:gap-10">
      <hr className="h-px border-0 bg-linha" />
      <TituloSecao>Contato</TituloSecao>

      <div className="flex flex-col gap-3 md:flex-row">
        {site.contatos.map(({ tipo, rotulo, link }) => {
          const Icone = icones[tipo]
          return (
            <TalvezLink
              key={tipo}
              link={link}
              className="flex h-14 w-full items-center justify-between border border-linha px-5 md:w-auto md:flex-1 md:max-w-[260px]"
            >
              <span className="flex items-center gap-3 text-[14px]">
                <Icone size={18} strokeWidth={2} />
                {rotulo}
              </span>
              <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
            </TalvezLink>
          )
        })}
      </div>

      <p className="text-[10px] text-suave">{site.nota}</p>
    </section>
  )
}
