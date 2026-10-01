// Peças pequenas reaproveitadas pelas seções.

// Renderiza um <a> quando existe link; caso contrário, um elemento sem clique.
// Assim os botões já ficam prontos: basta preencher o link nos dados.
export function TalvezLink({ link, as: Tag = 'div', className = '', children, ...rest }) {
  if (link) {
    const externo = /^https?:/.test(link)
    return (
      <a
        href={link}
        className={className}
        {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  )
}

// Título de seção em Bebas Neue (48px no celular, 80px no computador).
export function TituloSecao({ children, className = '' }) {
  return (
    <h2
      className={`font-display font-normal uppercase leading-[1.05] text-[48px] md:text-[64px] lg:text-[80px] ${className}`}
    >
      {children}
    </h2>
  )
}

// Ícone do Instagram (mesmo desenho do Lucide usado no Figma).
export function IconeInstagram({ size = 18, strokeWidth = 2, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
