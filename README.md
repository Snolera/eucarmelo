# Welinton Carmelo — site (@eucarmelo)

Site one-page do **Welinton Carmelo**, videomaker de conteúdo para Instagram (gravação no celular). O público são marcas que querem contratar reels, e a ação principal é mandar um **direct no Instagram** (`ig.me/m/eucarmelo`).

- Idioma: somente português (`pt-BR`).
- Status: em construção. Header, Hero, Números, Trabalhos, Sobre e Rodapé prontos; **Contato** ainda não foi feito.
- Vídeos, retrato, números e nomes de clientes ainda são **placeholders**, aguardando o material real.

---

## Stack

| Uso | Ferramenta |
|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack, `cacheComponents`) |
| UI | **React 19**, **JavaScript** (sem TypeScript) |
| Estilos | **CSS Modules** + variáveis globais em `app/globals.css` |
| Fontes | `next/font/google`: **Space Grotesk** (títulos e texto do site), **Inter** (logo do header), **Barlow** e **Barlow Condensed** (galeria de Trabalhos) |
| Ícones | `lucide-react` (interface) + SVG próprio para as redes sociais |
| Animação | CSS puro (`transform`); a biblioteca `motion` está instalada, mas ainda não é usada |
| Testes | **Vitest** + **React Testing Library** + `jest-dom` (ambiente `jsdom`) |
| Lint | ESLint com `eslint-config-next` (core-web-vitals) |
| Deploy | Vercel (domínio definitivo a definir) |

## Como rodar

Requisitos: Node.js 20 ou mais recente (desenvolvido no Node 24).

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm test` | Roda os testes uma vez |
| `npm run test:watch` | Testes em modo watch |

### Variáveis de ambiente

| Variável | Obrigatória | Uso |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Não | URL pública usada no canonical, Open Graph, `sitemap.xml` e `robots.txt`. |

Sem ela, `lib/siteUrl.js` usa `VERCEL_PROJECT_PRODUCTION_URL`, preenchida automaticamente pela Vercel, e por último `http://localhost:3000`. Há um modelo em `.env.example`.

---

## Estrutura de pastas

```
app/            Rotas (App Router): layout, página, robots.js, sitemap.js, estilos globais
sections/       Blocos da página, na ordem em que aparecem (Header, Hero, Stats, Work, About, Footer)
components/     Peças reutilizáveis (Button, Panel, Kicker, Gallery916, Reveal, VideoPlayer, VideoModal, SocialIcon)
hooks/          Lógica reutilizável (useVideoPlayer, useGalleryIntro, useMediaQuery, useReveal)
content/        site.js: toda a copy, links e dados (vídeos, stats, reels, redes)
lib/            Utilitários (siteUrl.js)
__tests__/      Testes de cada seção e componente
```

Cada componente e cada seção tem um `Nome.jsx` e um `Nome.module.css` ao lado.

Não existe pasta `pages/`: ela ativaria o Pages Router. As seções ficam em `sections/`.

### Conteúdo

Todo texto, link e mídia fica em **`content/site.js`**. Para trocar uma copy, adicionar um reel ou ligar um vídeo, edite esse arquivo e não os componentes.

| Export | Conteúdo |
|---|---|
| `instagram` | handle, link do direct e do perfil |
| `nav` | links do menu (âncoras `#trabalhos`, `#sobre`, `#contato`) |
| `hero` | kicker, título, CTA, vídeo de fundo e showreel |
| `stats` | números da faixa (futuro: logos de marcas atendidas) |
| `work` | título da seção e os reels (`client`, `category`, `src`, `poster`) |
| `about` | título, parágrafos e retrato |
| `social` | redes do rodapé (X, Instagram, E-mail) |
| `footer` | copyright |

Mídia com `src: null` mostra um placeholder. É só preencher a URL quando o arquivo estiver hospedado.

---

## Arquitetura

### Server × Client Components

As seções são **Server Components** sempre que possível. O HTML chega pronto, o que é bom para SEO e para o tempo de carregamento, e o JavaScript só vai para o navegador onde há interação:

| Componente | Tipo | Por quê |
|---|---|---|
| `Hero`, `Stats`, `Work`, `About`, `Footer` | Server | Conteúdo estático |
| `Header` | Client | Abre e fecha o menu mobile |
| `HeroCard` | Client | Card do hero inteiro clicável, abre o showreel |
| `Gallery916` | Client | Galeria 9:16 (6 cards fixos e sobrepostos) + moldura do player com o card ativo |
| `VideoModal`, `VideoPlayer` | Client | `<dialog>` e controles do vídeo |

### Player de vídeo

- **`VideoPlayer`:** player próprio, sempre em **9:16** (o conteúdo é gravado no celular), com play/pause, barra de progresso, tempo e som. Sem `src`, mostra "Vídeo em breve" e desativa os controles.
- **`VideoModal`:** usa o `<dialog>` nativo com `showModal()`, que já traz foco preso, Esc para fechar e fundo inerte. Também fecha clicando fora. Todo fechamento passa pelo `dialog.close()`, que devolve o foco a quem abriu o modal.
- **Um único modal por seção:** o Hero e a `Gallery916` têm um modal cada um, alimentado com o vídeo ativo.
- **Hospedagem dos vídeos:** Vercel Blob (store público). O código só precisa da URL; ver "Vídeos e pôsteres (Vercel Blob)".

### Hooks

- **`useVideoPlayer`:** o estado do `<video>` vem dos eventos nativos (o elemento é a fonte da verdade) e expõe `togglePlay`, `toggleMute`, `setVolume` e `seek`. O som começa em 50% (`initialVolume`). No player, o ícone de som abre uma barra vertical de volume logo acima dele (mobile e desktop); ela fecha com novo clique no ícone, com Esc (sem fechar o player) ou clicando fora. Volume em 0 silencia, e subir o volume tira do mudo. Onde o navegador não deixa o site mudar o volume (`canSetVolume`; no iPhone vale o do aparelho), o ícone só liga e desliga o som. Também tem a função `formatTime` (`75` vira `"1:15"`).
- **`useGalleryIntro(stageRef, cardRefs, reduceMotion, beforeMeasure)`:** entrada da galeria em duas fases. Quando o palco fica inteiro na tela (`useInView` do motion), os cards caem empilhados no centro, pausam 500ms e abrem em leque. Com "reduzir movimento" ou sem IntersectionObserver, vai direto para o leque. Os tempos ficam em `components/Gallery916/motion-config.js`.
- **`useMediaQuery(query)`:** `true` enquanto a media query casa (`useSyncExternalStore`); a galeria usa para trocar o layout em 768px.

### Componentes compartilhados

- **`Panel`:** a caixa arredondada das seções. Props:
  - `variant`: `"solid"` (cinza do layout base) ou `"glass"` (vidro).
  - `as`: a tag externa (`section` por padrão, `footer` no rodapé).
- **`Button`:** botão outline. Vira `<a>` quando recebe `href`, e links externos ganham `target="_blank"` e `rel="noopener noreferrer"`. Variantes `light`, `accent` e `white`; tamanhos `md` e `lg`.
- **`Kicker`:** rótulo pequeno em caixa alta acima dos títulos. Cada letra vira um `<span>` com índice (`--i`) e `aria-hidden`, e o total de letras vai em `--n`; o texto inteiro fica num span visualmente escondido, para o leitor de tela não ler letra por letra.
- **`Gallery916`:** galeria da seção Trabalhos (modelo "Galeria Fotos", estilo desenho técnico: nada arredondado, marcas "+" nos cantos, fontes Barlow e Barlow Condensed). 6 cards 9:16 fixos, em linha e sobrepostos ~38%. O ativo cresce no lugar (1,16×, sobe 14px; no hover 1,2× e 26px) e fica com duotone laranja claro; os inativos ficam em duotone azul-aço. Clique num inativo destaca; clique no ativo abre a moldura do player, com o `VideoPlayer` do site por dentro (volume em 50%, barra de volume). Controles: setas, dots, contador e ← → do teclado (fora de campos). Fundo = `--color-page` do projeto. Mobile (< 768px): fileira com scroll e snap, e o card centralizado é o ativo. Textos, imagens (picsum) e vídeo (MDN) são placeholders em `work`, no `content/site.js`.
- **`SocialIcon`:** ícones de X, Instagram e E-mail só em contorno, que herdam a cor do texto.

---

## Design

O ponto de partida foi o **layout 2a** do protótipo de handoff (local, fora do git). Desde então o projeto mudou bastante, e **o que vale é o que está descrito aqui.**

### Tokens (`app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#000000` | Preto base (texto do link "Pular para o conteúdo") |
| `--color-surface-dark` | `#151717` | Cinza escuro do header, do card do hero e da faixa de números |
| `--color-page` | `#D9D4C3` | Fundo da página (bege) |
| `--color-ink` | `#000000` | Texto direto sobre o fundo da página |
| `--color-container` | `#666666` | Caixa `Panel` sólida |
| `--color-text` | `#ffffff` | Texto principal |
| `--color-text-footer` | `#b3b3b3` | Texto e ícones do rodapé |
| `--color-divider` | `#2a2a2a` | Linha do header |
| `--color-card-line` | `rgba(255,255,255,.35)` | Linha sob os cards, bordas das setas |
| `--color-accent` | `#b68235` | Dourado: hover de links, foco visível |
| `--color-accent-light` | `#e1ad66` | Kicker e CTA do hero |
| `--color-hero-text` | `#f8f4f4` | Texto do hero |
| `--radius-container` / `--radius-card` / `--radius-button` | 24px / 16px / 4px | Caixas / cards e retrato / botões |
| `--space-page` | 16px → 32px → 50px | Recuo lateral da página (mobile → tablet → desktop) |
| `--space-container` | 24px → 40px → 56px | Respiro interno das caixas |

### Tipografia

- **H1 e H2:** Space Grotesk (`--font-display`), fonte variável com Light 300, Regular 400, Medium 500 e Bold 700 num único arquivo. Os títulos usam 400 por padrão. Ela não tem itálico, então o `<em>` do H1 usa itálico simulado pelo navegador.
- **Logo do header:** Inter, "welinton" em 300 (light) e "carmelo" em 700, colados e em minúsculas (como no print de referência); o link se anuncia como "Welinton Carmelo" para leitores de tela.
- **Corpo:** Lora 400, 15px, line-height 1.55.
- **Números:** `font-variant-numeric: tabular-nums`.
- **Tamanhos fluidos com `clamp()`:**
  - H1 do hero: 40px → 92px.
  - H2 de Trabalhos (galeria, Barlow Condensed): 32px → 52px.
  - H2 de Sobre: 32px → 44px.
  - Números da faixa: 44px → 60px.

### Fundos atuais por seção

| Seção | Fundo |
|---|---|
| Header | Preto, linha inferior `#2a2a2a` |
| Hero | Card de vídeo (placeholder listrado) com degradê escuro na base, para o texto ter contraste |
| Números | **Preto**, sem caixa; só a faixa animada aparece |
| Trabalhos | **Vidro** (`Panel variant="glass"`) |
| Sobre | **Vidro** |
| Rodapé | **Vidro** |

**Coluna central:** header, hero, seções e rodapé usam a classe global `.container` (`app/globals.css`): `width: min(1240px, 100% - 40px)` centralizada, então abaixo de 1280px sobram 20px de cada lado. O fundo e a borda do header ocupam a tela toda; só o conteúdo fica na coluna. Seções (`Panel`): 40px até a próxima; caixas internas com 100% da coluna. Hero: 24px em cima e 40px embaixo, card com 780px de altura a partir de 1024px (no mobile, até 80% da tela). Rodapé: 24px em cima e embaixo, sem borda.

**Temporário:** a página tem fundo bege (`--color-page`, `#D9D4C3`) e o `Panel variant="glass"` está sem caixa: o conteúdo de Trabalhos, Sobre e rodapé fica direto sobre o fundo, com texto preto (`--color-ink`). Detalhes que eram brancos ficaram laranja (`--color-accent`): os ícones do rodapé. Novos painéis virão depois; o vidro antigo está no histórico do Git.

### Responsivo (mobile-first)

Os estilos base são os do mobile, e os breakpoints usam `min-width`: **480px**, **768px**, **1024px** e **1280px** (só para encaixes finos). Testado em 360, 480, 768, 1024 e 1280px, sem scroll horizontal.

| Seção | Mobile | Tablet (768+) | Desktop (1024+) |
|---|---|---|---|
| Header | Logo + ícone de menu (☰/✕), menu abre abaixo | Links em linha | Links em linha |
| Hero | Conteúdo empilhado, botões em largura total | Botões lado a lado | Título à esquerda, botões à direita |
| Números | Faixa animada | Faixa animada | Faixa com **50% da largura**, centralizada |
| Trabalhos | Fileira com scroll e snap (cards de 62vw, até 320px); o centralizado é o ativo | 6 cards sobrepostos (140–200px) | 6 cards sobrepostos (até 260px) |
| Sobre | Texto, retrato **abaixo** | Retrato 240px à esquerda | Retrato 300px à esquerda, texto em 2 colunas justificado |
| Rodapé | Copyright + 3 ícones numa linha | Igual | Igual |

### Interações e animações

- **Abertura do player (cards e hero):** o player "sai" do elemento clicado e vai até o centro da tela em **240ms** (`OPEN_DURATION` em `VideoModal.jsx`). A técnica é FLIP: o player já abre na posição final, e uma animação de `transform` (Web Animations API) o leva da posição de origem até o centro. Junto, o fundo aparece com fade. Com vídeo, ele já começa tocando (`autoPlay`).
- **Card do hero (todas as telas):** card escuro (`#151717`) com o nome (`hero.cardName`) e o @ do Instagram no topo, o showreel sem som, o título, a linha de funções (o kicker, em texto corrido) e os botões; "Assistir showreel" é uma pílula branca. Até 1023px tudo empilhado, com o vídeo em 16:9. No desktop (780px), o vídeo cobre o card inteiro: nome e @ por cima no topo, título e funções embaixo à esquerda, botões embaixo à direita, com degradê no topo e na base para o contraste.
- **Hero:** clicar em **qualquer parte do card** abre o showreel. O CTA do Instagram segue o link normalmente, e o clique não abre o player se a pessoa estiver selecionando texto.
- **Números:** faixa contínua da direita para a esquerda (`@keyframes`, 25s, `linear`), **sem repetir valores**: entra pela direita e sai toda pela esquerda antes de recomeçar. Pausa com o mouse por cima. A velocidade é o `25s` de `.statsList`.
- **Trabalhos:** `Gallery916`. Entrada própria (queda empilhada → leque) quando o palco fica inteiro na tela, por isso a seção não usa o deslize do `Reveal`. Troca de card por clique, setas, dots ou teclado; no mobile, pelo swipe na fileira.
- **Entrada no scroll (Hero, Números, Sobre):** cada seção desliza da esquerda e aparece com fade quando **60% dela fica visível**, ou quando ela ocupa 60% da altura da tela (seções mais altas que a tela, comuns no mobile). A entrada acontece uma vez só.
  - **Proporção:** distância `clamp(1.5rem, 6vw, 4rem)` (24px em 360px, até 64px no desktop) e duração de 550ms no mobile e 700ms a partir de 1024px.
  - **Implementação:** `components/Reveal` + `hooks/useReveal` (IntersectionObserver). No `Panel`, é a prop `reveal`.
  - **Hero:** usa `<Reveal immediate>`, uma animação CSS desde a primeira pintura, para não esperar o JavaScript nem atrasar o LCP.
  - **Sem JavaScript:** o conteúdo só começa escondido com `@media (scripting: enabled)`, então sem JS tudo aparece normalmente.
- **Kicker do Sobre:** quando a seção é revelada (o mesmo IntersectionObserver do `Reveal`, via `data-revealed`), uma onda laranja (`--color-accent`, `#b68235`) passa pelas letras: cada uma acende e volta ao branco. Junto, uma linha cresce branca embaixo do texto, da 1ª letra até 40% da largura, e fica laranja quando a onda termina. Começa no meio da entrada da seção; 45ms entre letras e 700ms por letra (`--kicker-stagger` e `--kicker-glow` em `Kicker.module.css`). Sem JavaScript, a linha já aparece laranja.
- **Menos movimento:** com `prefers-reduced-motion`, as seções aparecem sem deslizar, os kickers aparecem sem a onda (só a linha laranja), a faixa para, a galeria pula a entrada e troca de card com transições curtas (0,15s), sem subir o card ativo, e o scroll suave é desligado.

---

## Acessibilidade

- HTML semântico: um único `h1`, headings em ordem (`h1` → `h2` → `h3`), seções nomeadas por `aria-labelledby`.
- Link "Pular para o conteúdo" no header, visível só com foco por teclado.
- Foco visível dourado em todo elemento interativo. Áreas de toque de no mínimo 44×44px.
- Botões só com ícone têm `aria-label` (menu, setas, fechar, controles do player).
- Galeria: cada card é um botão ("Destacar: …" ou "Assistir: …", `aria-pressed` no ativo); setas e dots com nome; o contador é anunciado (`aria-live`). A moldura do player é um `role="dialog"` com foco inicial no Fechar, Esc fecha, e o foco volta ao card.
- Redes sem endereço aparecem como imagem "(em breve)", sem link quebrado.

## SEO

- `metadata` em `app/layout.jsx`: title, description, canonical, Open Graph (`pt_BR`) e Twitter Card.
- `app/sitemap.js` e `app/robots.js`, gerados a partir da URL do site.
- `<html lang="pt-BR">` e fontes via `next/font`, sem layout shift.
- Imagens (pôsteres dos reels e retrato) via `next/image`, assim que existirem.

## Testes

Para rodar: `npm test`. Os testes cobrem cada seção e componente:

- **Navegação:** menu mobile, âncoras e link de pular conteúdo.
- **Player:** abrir e fechar o player (Hero, cards, foco), controles do player e estado sem vídeo.
- **Galeria 9:16 (`Gallery916.test.jsx`):** cabeçalho, card inicial, destacar, setas/dots/teclado, abrir a moldura com o player do site e fechar por X, Esc e fundo. Os testes rodam com "reduzir movimento", que pula a entrada; a queda e o leque são conferidos no navegador.
- **Faixa de números:** sem cópias.
- **Ordem do conteúdo:** retrato depois do texto e ordem das seções na página.
- **Rodapé:** redes, link do Instagram e ícones só em contorno.

O `vitest.setup.js` tem um polyfill de `<dialog>.showModal/close`, porque o jsdom não implementa esses métodos.

**Limitação:** o jsdom não aplica media queries nem animações. O que depende de breakpoint (por exemplo, o layout de 768px da galeria, a entrada e o swipe) é conferido no navegador.

---

## Vídeos e pôsteres (Vercel Blob)

Os vídeos e pôsteres ficam num **Blob Store público** da Vercel (`store_Rm7Tmby09iTxGh0l`). O site só guarda as URLs, em `content/site.js`; não há SDK nem token no código.

**Enviar um arquivo:**

1. Na Vercel: **Storage** → o store público → aba **Browser** → **Upload**.
2. Use pastas e nomes sem espaço nem acento, por exemplo `reels/cafe-bruma.mp4` e `posters/cafe-bruma.jpg`.
3. Clique no arquivo enviado e copie a URL. Ela tem o formato `https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/reels/cafe-bruma.mp4`.
4. Cole a URL no campo certo do `content/site.js`:
   - reels: `src` e `poster` de cada item em `work.items`;
   - showreel: `hero.showreel.src` e `hero.showreel.poster`; o mesmo vídeo toca sem som no fundo do card do hero.
5. Rode `npm test`, faça o commit e o push. A Vercel publica sozinha.

**Configuração:**

- `next.config.mjs` libera no `next/image` só o domínio do nosso store (`BLOB_HOST`), para os pôsteres.
- O teste `__tests__/blobUrls.test.js` falha se alguma URL do `site.js` for de outro domínio. Se ele falhar com a URL certa do painel, corrija o `BLOB_HOST`.

**Formato dos arquivos:** MP4 (H.264 + AAC), 9:16, 1080×1920 no máximo, de preferência abaixo de 15 MB por reel. Pôster em JPG ou WebP, 1080×1920.

**Cache:** o CDN guarda cada arquivo por até 1 mês. Para trocar um vídeo, envie com **outro nome** (ex.: `cafe-bruma-v2.mp4`) e atualize a URL, em vez de sobrescrever.

---

## Pendências

- [ ] Seção **Contato** (`#contato`). O link do menu já aponta para ela.
- [ ] Links do **X** e do **E-mail** no rodapé: preencher `href` em `social`, no `content/site.js`.
- [ ] Vídeos reais (showreel, fundo do hero, reels): enviar ao Vercel Blob (ver "Vídeos e pôsteres").
- [ ] Retrato do Welinton e pôsteres dos reels.
- [ ] Números reais e, futuramente, a vitrine de logos de marcas na faixa.
- [ ] Imagem de compartilhamento (Open Graph, 1200×630), favicon próprio e JSON-LD.
- [ ] Domínio definitivo e `NEXT_PUBLIC_SITE_URL`.
- [ ] Botão de pausar a faixa de números no toque (WCAG 2.2.2), se desejado.
- [ ] Lighthouse depois do primeiro deploy.

## Arquivos locais (fora do git)

Estão no `.gitignore` e ficam só na máquina de quem desenvolve:

- `README-ESTRUTURA.md`: handoff original de design (layout 2a).
- `Site Welinton Carmelo.dc.html`: protótipo de referência.
- `SKILL.md`: instruções de desenvolvimento usadas no projeto.
- `AGENTS.md`: regras para agentes de IA, que o `next dev` gera automaticamente.

`classical.css` e `support.js` (tokens e runtime do protótipo) ainda estão na raiz e não fazem parte do site.
