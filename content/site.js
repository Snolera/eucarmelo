// Copy, links e mídia do site (fonte: export/Welinton Carmelo v2)
// Títulos de seção: *palavra* vira destaque (Space Grotesk 700, sem itálico) e \n quebra a linha
import photo01 from "./media/photos/01.jpg";
import photo02 from "./media/photos/02.jpg";
import photo03 from "./media/photos/03.jpg";
import photo04 from "./media/photos/04.jpg";
import photo05 from "./media/photos/05.jpg";
import photo06 from "./media/photos/06.jpg";
import photo07 from "./media/photos/07.jpg";
import photo08 from "./media/photos/08.jpg";
import photo09 from "./media/photos/09.jpg";
import logoCupularia from "./media/partners/cupularia.png";
import logoFestaDaCindy from "./media/partners/festadacindy.png";
import logoOcupacionalSS from "./media/partners/ocupacionalss.png";
import logoZig from "./media/partners/zig.png";
import logoQuality from "./media/partners/quality.png";
import logoTura from "./media/partners/turaconstrutora.png";
// Capas do Portfólio: 1º quadro de cada vídeo (720×1280), nome = id do card
import cover01 from "./media/work/01.jpg";
import cover02 from "./media/work/02.jpg";
import cover03 from "./media/work/03.jpg";
import cover04 from "./media/work/04.jpg";
import cover05 from "./media/work/05.jpg";

export const instagram = {
  handle: "@eucarmelo",
  dmUrl: "https://ig.me/m/eucarmelo",
  profileUrl: "https://instagram.com/eucarmelo",
};

// Linha de funções: no hero (abaixo do título) e no rodapé
export const roles = "audiovisual, estratégia & arte.";

// Redes do rodapé, nesta ordem: href null = ainda sem endereço (ícone aparece sem link)
export const social = [
  { id: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@eucarmelo" }, 
  { id: "instagram", label: "Instagram", href: "https://instagram.com/eucarmelo" },
  { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/5511981685510" }, 
  { id: "email", label: "E-mail", href: "mailto:wcarmelo@outlook.com" }, 
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
  title: "NÃO BASTA OLHAR.",
  titleEm: "É PRECISO SENTIR.",
  cta: "Fale Comigo",
  // Showreel no Vercel Blob: toca sem som no fundo do card e, ao clicar, do início e com som no player
  // poster null: o card mostra o 1º quadro do vídeo
  showreel: {
    title: "Showreel 2026",
    src: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Boma%20-%20S%C3%A3o%20Paulo.mp4",
    poster: null,
  },
};

// Faixa de marcas parceiras: PNG 1080×660, logo branco em fundo transparente, centralizado e com a mesma área visual
// Logo novo precisa do mesmo tratamento (branco, transparente, mesma área)
// Trocar logo = substituir o arquivo em media/partners/ com o mesmo nome
export const partners = [
  { name: "Zig", logo: logoZig },
  { name: "Quality Eventos", logo: logoQuality },
  { name: "Ocupacional SS", logo: logoOcupacionalSS },
  { name: "A Festa da Cindy", logo: logoFestaDaCindy },
  { name: "Cupularia Gláucia Moreno", logo: logoCupularia },
  { name: "Tura Construtora", logo: logoTura },
];

// Portfólio: um bloco por card, na ordem da galeria (o 3º começa no centro)
// video: URL do Vercel Blob (como o showreel); trocar o SAMPLE_VIDEO de cada card pela URL real
// duration: "m:ss" (ex.: "0:45"); image: capa local em media/work (1º quadro do vídeo; picsum é placeholder); alt: descreve a capa
// Quando todos os vídeos forem trocados, apagar o SAMPLE_VIDEO (o lint avisa que ficou sem uso)
const SAMPLE_VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

export const work = {
  kicker: "Portfólio",
  title: "Congelo o *Tempo* em *Movimento*",
  items: [
    {
      id: 1,
      title: "Cine Vista",
      tag: "Vlog",
      duration: "0:49",
      year: "2026",
      desc: "Visita ao Cine Vista, um dos cinemas mais modernos de São Paulo.",
      video: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Cine%20Vista%20-%20SP.mp4",
      image: cover01,
      alt: "vlog do cine vista",
    },
    {
      id: 2,
      title: "Floating Bar",
      tag: "Work",
      duration: "0:26",
      year: "2026",
      desc: "Trabalho feito para a Heineken Floating Bar, um evento de barco na cidade de São Paulo.",
      video: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Heineken%20Floating%20Bar%20-%20SP.mp4",
      image: cover02,
      alt: "Capturação de video do evento",
    },
    {
      id: 3,
      title: "Rodoviária",
      tag: "Vlog",
      duration: "0:41",
      year: "2025",
      desc: "Uma viagem para o Rio de Janeiro.",
      video: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Rodoviaria%20Rio%20de%20Janeiro.mp4",
      image: cover03,
      alt: "Viagem para o Rio de Janeiro",
    },
    {
      id: 4,
      title: "Jaguariana Rodeo Festival",
      tag: "Work",
      duration: "0:56",
      year: "2026",
      desc: "Trabalho feito para a Quality Eventos, em um dos eventos mais importantes do Circuito Sertanejo.",
      video: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Jaguari%C3%BAna%20Rodeo%20Festival%202025Este%20%C3%A9%20um%20dos%20eventos%20mais%20importantes%20do%20Circuito%20Sertanejo.mp4",
      image: cover04,
      alt: "Capturação de video do evento",
    },
    {
      id: 5,
      title: "Eat",
      tag: "Vlog",
      duration: "0:34",
      year: "2026",
      desc: "Vlog do Eat, um restaurante de comida japonesa em São Paulo.",
      video: "https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/Eat.mp4",
      image: cover05,
      alt: "vlog do eat",
    },
    {
      id: 6,
      title: "Cliente",
      tag: "Depoimento",
      duration: "1:05",
      year: "2026",
      desc: "Quem contratou conta como foi — direto, sem roteiro engessado.",
      video: SAMPLE_VIDEO,
      image: "https://picsum.photos/seed/obra-06/540/960",
      alt: "Depoimento do cliente",
    },
  ],
};

export const services = {
  kicker: "Serviços",
  title: "A forma *importa.*\n A intenção *Transforma.*",
  lead: "Cada projeto começa com uma intenção clara. Conecto narrativa, posicionamento e execução para transformar ideias em experiências que fortalecem marcas e geram resultado.",
  items: [
    { title: "Produção Audiovisual", text: "Transformo momentos, ideias e experiências em narrativas visuais com agilidade, mobilidade e direção criativa. Produzo conteúdos que aproximam marcas de pessoas e amplificam mensagens." },
    { title: "Edição e Pós-Produção", text: "Cada imagem tem uma intenção. Por meio do ritmo, da narrativa e da linguagem visual, construo histórias que despertam sensações, comunicam mensagens e valorizam a identidade de cada projeto."  },
    { title: "Estratégia de Marca Digital", text: "Conecto identidade, comunicação e objetivos de negócio para construir uma presença digital relevante. Desenvolvo estratégias que fortalecem o posicionamento das marcas, criam conexões com o público e geram resultados." },
  ],
};

export const about = {
  kicker: "Sobre",
  title: "Entre o *olhar* e a *intenção.*",
  paragraphs: [
    "Ao longo de mais de quinze anos, conectei arte, comunicação e marketing. Essa vivência me ensinou que toda boa execução nasce de uma visão clara e organizada. Hoje uno sensibilidade artística e estratégia para transformar ideias em experiências."
  ],
  // Foto ainda não enviada: null mostra o placeholder
  portrait: { src: null, alt: "Retrato de Welinton Carmelo" },
};

// Galeria de Fotos: imports locais (content/media/photos), o Next lê dimensões e gera o blur no build
// Trocar foto = substituir o arquivo com o mesmo nome; alt provisório, revisar com o Welinton
export const photos = {
  kicker: "Fotografia",
  title: "Entre linhas, luzes e *Silêncios.*",
  lead: "O cotidiano não é comum quando você observa.",

  items: [
    { id: 1, image: photo01, alt: "Ciclista" },
    { id: 2, image: photo02, alt: "Sombras" },
    { id: 3, image: photo03, alt: "Moldura" },
    { id: 4, image: photo04, alt: "Palhaços" },
    { id: 5, image: photo05, alt: "Lua" },
    { id: 6, image: photo06, alt: "Presente" },
    { id: 7, image: photo07, alt: "Quero-quero" },
    { id: 8, image: photo08, alt: "Folhas" },
    { id: 9, image: photo09, alt: "Trabalhadores" },
  ],
};
