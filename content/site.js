// Copy, links e mídia do site (fonte: export/Welinton Carmelo v2)
// Títulos de seção: *palavra* vira destaque em Playfair itálico e \n quebra a linha
export const instagram = {
  handle: "@eucarmelo",
  dmUrl: "https://ig.me/m/eucarmelo",
  profileUrl: "https://instagram.com/eucarmelo",
};

// Linha de funções: no hero (abaixo do título) e no rodapé
export const roles = "Direção / Roteiro / Montagem / Produção / Criação";

// Redes do rodapé, nesta ordem: href null = ainda sem endereço (ícone aparece sem link)
export const social = [
  { id: "facebook", label: "Facebook", href: null }, // PREENCHER: ex. "https://facebook.com/usuario"
  { id: "instagram", label: "Instagram", href: "https://instagram.com/eucarmelo" },
  { id: "x", label: "X", href: null }, // PREENCHER: ex. "https://x.com/usuario"
  { id: "email", label: "E-mail", href: null }, // PREENCHER: ex. "mailto:contato@dominio.com"
];

export const footer = {
  copyright: "Copyright © 2026 Welinton Carmelo",
};

export const nav = [
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  title: "Filmes curtos para marcas que vivem",
  titleEm: "no feed.",
  cta: "Fale Comigo",
  // Showreel no Vercel Blob: toca sem som no fundo do card e, ao clicar, do início e com som no player
  // poster null: o card mostra o 1º quadro do vídeo
  showreel: {
    title: "Showreel 2026",
    src: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Boma%20-%20S%C3%A3o%20Paulo.mp4",
    poster: null,
  },
};

// Placeholder: no futuro vira a vitrine de marcas atendidas
export const stats = [
  { value: "30M", label: "visualizações geradas" },
  { value: "250+", label: "reels entregues" },
  { value: "60", label: "marcas atendidas" },
];

// Portfólio: textos, imagens (picsum) e vídeo (MDN) são placeholders
// Trocar pelo conteúdo real (capas mín. 540×800; vídeos no Vercel Blob)
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const work = {
  kicker: "Portfólio",
  title: "Por trás de *cada*\n*projeto*",
  items: [
    { id: 1, title: "Montagem", tag: "Bastidores", duration: "0:45", year: "2026", desc: "Do primeiro dia de obra à estrutura de pé, em ritmo de reel.", image: "https://picsum.photos/seed/obra-01/540/960", alt: "Montagem da estrutura no canteiro de obras", video: SAMPLE_VIDEO },
    { id: 2, title: "Estrutura", tag: "Processo", duration: "0:38", year: "2026", desc: "Cada etapa do projeto mostrada de perto, sem perder o fio.", image: "https://picsum.photos/seed/obra-02/540/960", alt: "Etapa estrutural do projeto", video: SAMPLE_VIDEO },
    { id: 3, title: "Acabamento", tag: "Detalhe", duration: "0:30", year: "2026", desc: "Texturas, materiais e o cuidado que faz a diferença no final.", image: "https://picsum.photos/seed/obra-03/540/960", alt: "Detalhes de acabamento", video: SAMPLE_VIDEO },
    { id: 4, title: "Na obra", tag: "Equipe", duration: "0:52", year: "2026", desc: "As pessoas por trás do projeto, à vontade diante da câmera.", image: "https://picsum.photos/seed/obra-04/540/960", alt: "Equipe trabalhando na obra", video: SAMPLE_VIDEO },
    { id: 5, title: "Resultado", tag: "Entrega", duration: "0:41", year: "2026", desc: "O espaço pronto, apresentado para prender os primeiros segundos.", image: "https://picsum.photos/seed/obra-05/540/960", alt: "Resultado final entregue", video: SAMPLE_VIDEO },
    { id: 6, title: "Cliente", tag: "Depoimento", duration: "1:05", year: "2026", desc: "Quem contratou conta como foi — direto, sem roteiro engessado.", image: "https://picsum.photos/seed/obra-06/540/960", alt: "Depoimento do cliente", video: SAMPLE_VIDEO },
  ],
};

export const services = {
  kicker: "Serviços",
  title: "O que eu *resolvo*\ne pra *quem*",
  lead: "Vídeo curto bem feito não é sorte. É roteiro pensado para o feed, gravação ágil e edição no ritmo certo — para que a sua marca seja vista, lembrada e procurada.",
  items: [
    { n: "01", title: "Reels para marcas", who: "Pra marcas e negócios locais que precisam aparecer no feed com frequência, mas não têm tempo nem equipe para produzir.", what: "Roteiro, gravação e edição de vídeos curtos que prendem nos primeiros segundos e fazem o perfil crescer com consistência." },
    { n: "02", title: "Registro de obras e projetos", who: "Pra construtoras, arquitetos e escritórios que querem mostrar o processo — não só o resultado.", what: "Bastidores, etapas e entrega transformados em conteúdo que gera confiança e vende o próximo projeto." },
    { n: "03", title: "Eventos e lançamentos", who: "Pra marcas que vão abrir, lançar ou celebrar algo e querem que isso dure além do dia.", what: "Cobertura com celular, ágil e discreta, com reels entregues rápido para aproveitar o momento enquanto ele acontece." },
  ],
};

export const about = {
  kicker: "Sobre",
  title: "Um celular, um olhar e o ritmo certo para prender os primeiros segundos.",
  paragraphs: [
    "Sou Welinton Carmelo, videomaker focado em conteúdo para Instagram. Gravo tudo com o celular: equipamento leve, que entra em qualquer espaço e deixa as pessoas à vontade diante da câmera.",
    "Trabalho com marcas que querem estar presentes no feed com consistência — do roteiro à edição, entregando vídeos prontos para postar e pensados para reter a atenção.",
  ],
  // Foto ainda não enviada: null mostra o placeholder
  portrait: { src: null, alt: "Retrato de Welinton Carmelo" },
};

// Galeria de Fotos: placeholders do picsum (miniatura 4:5 e versão ampliada)
// Trocar por fotos reais no Vercel Blob e alt descritivo de cada uma
export const photos = {
  kicker: "Fotografia",
  title: "Galeria de *Fotos*",
  items: Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    alt: `Foto ${i + 1}`,
    thumb: `https://picsum.photos/seed/foto-0${i + 1}/800/1000`,
    full: `https://picsum.photos/seed/foto-0${i + 1}/1200/1500`,
  })),
};
