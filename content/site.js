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
  kicker: "Videomaker · Conteúdo para Instagram",
  title: "Filmes curtos para marcas que vivem",
  titleEm: "no feed.",
  watch: "Assistir showreel",
  cta: "Mandar direct",
  // Vídeos ainda não hospedados: null mostra o placeholder
  backgroundSrc: null,
  showreel: { title: "Showreel 2026", src: null, poster: null },
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

// Reels do anel 3D (6 cards, 9:16): src/poster null até os vídeos serem hospedados
export const work = {
  kicker: "Reels para marcas",
  title: "Trabalhos selecionados",
  items: [
    { id: "cafe-bruma", client: "Café Bruma", category: "Gastronomia", src: null, poster: null },
    { id: "atelier-no", client: "Atelier Nó", category: "Moda", src: null, poster: null },
    { id: "studio-vila", client: "Studio Vila", category: "Bem-estar", src: null, poster: null },
    { id: "festival-aurora", client: "Festival Aurora", category: "Eventos", src: null, poster: null },
    { id: "loja-verso", client: "Loja Verso", category: "Varejo", src: null, poster: null },
    { id: "lume-beauty", client: "Lume Beauty", category: "Beleza", src: null, poster: null },
  ],
};
