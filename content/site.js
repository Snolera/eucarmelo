// Copy e links do site (fonte: objeto T.pt do protótipo)
export const instagram = {
  handle: "@eucarmelo",
  dmUrl: "https://ig.me/m/eucarmelo",
  profileUrl: "https://instagram.com/eucarmelo",
};

// Redes do rodapé: href null = ainda sem endereço (ícone aparece sem link)
export const social = [
  { id: "x", label: "X", href: null }, // PREENCHER: ex. "https://x.com/usuario"
  { id: "instagram", label: "Instagram", href: "https://instagram.com/eucarmelo" },
  { id: "email", label: "E-mail", href: null }, // PREENCHER: ex. "mailto:contato@dominio.com"
];

export const footer = {
  copyright: "© 2026 Welinton Carmelo",
};

export const nav = [
  { label: "Trabalhos", href: "#trabalhos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  cardName: "welinton.carmelo", // topo do card no mobile, ao lado do @ do Instagram
  kicker: "Direção / Roteiro / Montagem / Produção / Criação", // linha de funções abaixo do título
  title: "Filmes curtos para marcas que vivem",
  titleEm: "no feed.",
  watch: "Assistir showreel",
  cta: "Mandar direct",
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

// Galeria 9:16 (Trabalhos): textos, imagens e vídeos são placeholders da Galeria Fotos
// Trocar pelo conteúdo real (banners 9:16, mín. 540×960; vídeos no Vercel Blob)
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const work = {
  kicker: "Galeria", // vira "Galeria · 06 vídeos"
  title: "Por trás de cada projeto",
  lead: "",
  items: [
    { id: 1, kicker: "Bastidores", title: "Montagem", duration: "0:42", image: "https://picsum.photos/seed/obra-01/540/960", alt: "Montagem da estrutura no canteiro de obras", video: SAMPLE_VIDEO },
    { id: 2, kicker: "Processo", title: "Estrutura", duration: "1:05", image: "https://picsum.photos/seed/obra-02/540/960", alt: "Etapa estrutural do projeto", video: SAMPLE_VIDEO },
    { id: 3, kicker: "Detalhe", title: "Acabamento", duration: "0:38", image: "https://picsum.photos/seed/obra-03/540/960", alt: "Detalhes de acabamento", video: SAMPLE_VIDEO },
    { id: 4, kicker: "Equipe", title: "Na obra", duration: "1:12", image: "https://picsum.photos/seed/obra-04/540/960", alt: "Equipe trabalhando na obra", video: SAMPLE_VIDEO },
    { id: 5, kicker: "Entrega", title: "Resultado", duration: "0:55", image: "https://picsum.photos/seed/obra-05/540/960", alt: "Resultado final entregue", video: SAMPLE_VIDEO },
    { id: 6, kicker: "Depoimento", title: "Cliente", duration: "1:30", image: "https://picsum.photos/seed/obra-06/540/960", alt: "Depoimento do cliente", video: SAMPLE_VIDEO },
  ],
};
