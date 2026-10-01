// Textos e links gerais do site.
// Links vazios ('') deixam o elemento sem clique. Quando tiver o link, é só preencher.
export const site = {
  assinatura: '@eucarmelo',
  assinaturaLink: 'https://www.instagram.com/eucarmelo/',
  nome: 'Welinton Carmelo',
  especialidade: 'Videomaker · Conteúdo para Instagram',
  chamadaPortfolio: 'Trabalhos selecionados ↓',

  hero: {
    imagem: '/img/hero.webp',
    imagemMobile: '/img/hero-mobile.webp',
    alt: 'Pessoa caminhando sob um viaduto ao entardecer',
  },

  navegacao: [  // ex.: '#inicio'
    { rotulo: 'Portfólio', link: '#portfolio' }, // ex.: '#portfolio'
    { rotulo: 'Sobre', link: '#sobre' },     // ex.: '#sobre'
    { rotulo: 'Contato', link: '#contato' },   // ex.: '#contato'
  ],

  portfolio: {
    legenda: '06 filmes curtos / Instagram',
  },

  sobre: {
    nome: 'Welinton Carmelo',
    texto:
      'Sou Welinton. Crio vídeos para marcas e pessoas, da captação à edição, com olhar cinematográfico.',
    //retrato: '/img/retrato.webp',
    //alt: 'Retrato de Welinton Carmello segurando uma câmera',
  },

  contatos: [
    { tipo: 'instagram', rotulo: 'Instagram', link: '' }, // ex.: 'https://instagram.com/usuario'
    { tipo: 'whatsapp', rotulo: 'WhatsApp', link: '' },   // ex.: 'https://wa.me/5511999999999'
    { tipo: 'email', rotulo: 'E-mail', link: '' },        // ex.: 'mailto:contato@email.com'
  ],

  nota: 'Portfólio demonstrativo · Trabalhos e contatos ilustrativos',
}
