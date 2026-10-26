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
| Fontes | `next/font/google`: **Space Grotesk** (H1/H2), **Cormorant Garamond** (logo, H3, números, botões) e **Lora** (corpo) |
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
components/     Peças reutilizáveis (Button, Panel, Kicker, Gallery, ReelCard, Reveal, VideoPlayer, VideoModal, SocialIcon)
hooks/          Lógica reutilizável (useVideoPlayer, useRingRotation, useReveal)
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
| `Gallery` | Client | Anel 3D de reels (motion) + reel ativo no modal |
| `VideoModal`, `VideoPlayer` | Client | `<dialog>` e controles do vídeo |

### Player de vídeo

- **`VideoPlayer`:** player próprio, sempre em **9:16** (o conteúdo é gravado no celular), com play/pause, barra de progresso, tempo e som. Sem `src`, mostra "Vídeo em breve" e desativa os controles.
- **`VideoModal`:** usa o `<dialog>` nativo com `showModal()`, que já traz foco preso, Esc para fechar e fundo inerte. Também fecha clicando fora. Todo fechamento passa pelo `dialog.close()`, que devolve o foco a quem abriu o modal.
- **Um único modal por seção:** o Hero e a `Gallery` têm um modal cada um, alimentado com o reel ativo.
- **Hospedagem dos vídeos:** ainda está em estudo, e o código só precisa da URL. Opções que encaixam: Vercel Blob, Cloudflare Stream, Mux.

### Hooks

- **`useVideoPlayer`:** o estado do `<video>` vem dos eventos nativos (o elemento é a fonte da verdade) e expõe `togglePlay`, `toggleMute` e `seek`. Também tem a função `formatTime` (`75` vira `"1:15"`).
- **`useRingRotation({ total, speed, dragFactor, paused })`:** controla a rotação do anel 3D com um `MotionValue`.
  - **Autoplay:** 8°/s, em loop contínuo (o mouse por cima não pausa). Para só com foco dentro do anel (teclado) e com o player aberto (`paused`). Fica desligado com `prefers-reduced-motion`.
  - **Arrasto:** gira o anel e, ao soltar, encaixa no card mais próximo, com inércia. Um clique logo depois de um arrasto não abre o player.
  - **Teclado:** `focusIndex(i)` traz para a frente o card focado, pelo caminho mais curto.

### Componentes compartilhados

- **`Panel`:** a caixa arredondada das seções. Props:
  - `variant`: `"solid"` (cinza do layout base) ou `"glass"` (vidro).
  - `as`: a tag externa (`section` por padrão, `footer` no rodapé).
- **`Button`:** botão outline. Vira `<a>` quando recebe `href`, e links externos ganham `target="_blank"` e `rel="noopener noreferrer"`. Variantes `light`, `accent` e `white`; tamanhos `md` e `lg`.
- **`Kicker`:** rótulo pequeno em caixa alta acima dos títulos.
- **`ReelCard`:** card 9:16 com moldura. O botão invisível cobre o card inteiro e abre o player. No anel 3D, a legenda some quando o card está de costas (`backface-visibility`), para não aparecer espelhada.
- **`Gallery`:** anel 3D com os reels de `work.items`. Cada card é girado em Y (`--angle`) e empurrado para fora em Z (`--radius`). Sem botões de controle: gira sozinho e com o arrasto. CSS mobile-first, com cards de ~144px em 360px até 240px no desktop.
- **`SocialIcon`:** ícones de X, Instagram e E-mail só em contorno, que herdam a cor do texto.

---

## Design

O ponto de partida foi o **layout 2a** do protótipo de handoff (local, fora do git). Desde então o projeto mudou bastante, e **o que vale é o que está descrito aqui.**

### Tokens (`app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-bg` | `#000000` | Fundo do site |
| `--color-container` | `#666666` | Caixa `Panel` sólida |
| `--color-text` | `#ffffff` | Texto principal |
| `--color-text-footer` | `#b3b3b3` | Texto e ícones do rodapé |
| `--color-divider` | `#2a2a2a` | Linha do header |
| `--color-card-line` | `rgba(255,255,255,.35)` | Linha sob os cards, bordas das setas |
| `--color-accent` | `#b68235` | Dourado: hover de links, foco visível |
| `--color-accent-light` | `#e1ad66` | Kicker e CTA do hero |
| `--color-hero-text` | `#f8f4f4` | Texto do hero |
| `--color-logo-dot` | `#ff0000` | Ponto vermelho do logo "welinton**.**carmelo" |
| `--radius-container` / `--radius-card` / `--radius-button` | 24px / 16px / 4px | Caixas / cards e retrato / botões |
| `--space-page` | 16px → 32px → 50px | Recuo lateral da página (mobile → tablet → desktop) |
| `--space-container` | 24px → 40px → 56px | Respiro interno das caixas |

### Tipografia

- **H1 e H2:** Space Grotesk (`--font-display`), fonte variável com Light 300, Regular 400, Medium 500 e Bold 700 num único arquivo. Os títulos usam 400 por padrão. Ela não tem itálico, então o `<em>` do H1 usa itálico simulado pelo navegador.
- **Logo, H3, números e botões:** Cormorant Garamond (`--font-heading`), em 400, e 600 nos nomes de clientes e botões.
- **Corpo:** Lora 400, 15px, line-height 1.55.
- **Números:** `font-variant-numeric: tabular-nums`.
- **Tamanhos fluidos com `clamp()`:**
  - H1 do hero: 40px → 92px.
  - H2 de Trabalhos: 36px → 56px.
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

O **vidro** são três camadas: um brilho diagonal translúcido (`rgba(255,255,255,.14)` → `.02`), uma borda clara (`.16`) e um reflexo interno no topo (`inset`). Há também um `backdrop-filter` para quando algo passar por trás. Ajuste em `components/Panel/Panel.module.css`; a mudança vale para todas as seções de vidro.

### Responsivo (mobile-first)

Os estilos base são os do mobile, e os breakpoints usam `min-width`: **480px**, **768px**, **1024px** e **1280px** (só para encaixes finos). Testado em 360, 480, 768, 1024 e 1280px, sem scroll horizontal.

| Seção | Mobile | Tablet (768+) | Desktop (1024+) |
|---|---|---|---|
| Header | Logo + ícone de menu (☰/✕), menu abre abaixo | Links em linha | Links em linha |
| Hero | Conteúdo empilhado, botões em largura total | Botões lado a lado | Título à esquerda, botões à direita |
| Números | Faixa animada | Faixa animada | Faixa com **50% da largura**, centralizada |
| Trabalhos | **Anel 3D** de 6 reels (~144px), swipe horizontal gira | Anel (208px) | Anel (240px) |
| Sobre | Texto, retrato **abaixo** | Retrato 240px à esquerda | Retrato 300px à esquerda, texto em 2 colunas justificado |
| Rodapé | Copyright + 3 ícones numa linha | Igual | Igual |

### Interações e animações

- **Abertura do player (cards e hero):** o player "sai" do elemento clicado e vai até o centro da tela em **240ms** (`OPEN_DURATION` em `VideoModal.jsx`). A técnica é FLIP: o player já abre na posição final, e uma animação de `transform` (Web Animations API) o leva da posição de origem até o centro. Junto, o fundo aparece com fade. Com vídeo, ele já começa tocando (`autoPlay`).
- **Hero:** clicar em **qualquer parte do card** abre o showreel. O CTA do Instagram segue o link normalmente, e o clique não abre o player se a pessoa estiver selecionando texto.
- **Números:** faixa contínua da direita para a esquerda (`@keyframes`, 25s, `linear`), **sem repetir valores**: entra pela direita e sai toda pela esquerda antes de recomeçar. Pausa com o mouse por cima. A velocidade é o `25s` de `.statsList`.
- **Trabalhos:** anel 3D (`components/Gallery`) que gira sozinho e aceita arrastar. No toque, o swipe horizontal gira o anel e o vertical continua rolando a página (`touch-action: pan-y`).
- **Entrada no scroll (Hero, Números, Trabalhos, Sobre):** cada seção desliza da esquerda e aparece com fade quando **60% dela fica visível**, ou quando ela ocupa 60% da altura da tela (seções mais altas que a tela, comuns no mobile). A entrada acontece uma vez só.
  - **Proporção:** distância `clamp(1.5rem, 6vw, 4rem)` (24px em 360px, até 64px no desktop) e duração de 550ms no mobile e 700ms a partir de 1024px.
  - **Implementação:** `components/Reveal` + `hooks/useReveal` (IntersectionObserver). No `Panel`, é a prop `reveal`.
  - **Hero:** usa `<Reveal immediate>`, uma animação CSS desde a primeira pintura, para não esperar o JavaScript nem atrasar o LCP.
  - **Sem JavaScript:** o conteúdo só começa escondido com `@media (scripting: enabled)`, então sem JS tudo aparece normalmente.
- **Menos movimento:** com `prefers-reduced-motion`, as seções aparecem sem deslizar, a faixa para, o anel começa sem autoplay e encaixa sem animação, e o scroll suave é desligado.

---

## Acessibilidade

- HTML semântico: um único `h1`, headings em ordem (`h1` → `h2` → `h3`), seções nomeadas por `aria-labelledby`.
- Link "Pular para o conteúdo" no header, visível só com foco por teclado.
- Foco visível dourado em todo elemento interativo. Áreas de toque de no mínimo 44×44px.
- Botões só com ícone têm `aria-label` (menu, setas, fechar, controles do player).
- Anel de reels: foco pelo teclado para a rotação e gira o anel até o card. Sem botão de pausa, por decisão de layout (ver pendências).
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
- **Anel 3D:** 6 cards a 60°, sem botões de controle, abrir o player e foco pelo teclado. Os testes com `prefers-reduced-motion` ficam em `GalleryReducedMotion.test.jsx`, porque o motion lê essa preferência uma vez por módulo.
- **Faixa de números:** sem cópias.
- **Ordem do conteúdo:** retrato depois do texto e ordem das seções na página.
- **Rodapé:** redes, link do Instagram e ícones só em contorno.

O `vitest.setup.js` tem um polyfill de `<dialog>.showModal/close`, porque o jsdom não implementa esses métodos.

**Limitação:** o jsdom não aplica media queries nem animações. O que depende de breakpoint (por exemplo, o tamanho dos cards do anel e o swipe) é conferido no navegador.

---

## Pendências

- [ ] Seção **Contato** (`#contato`). O link do menu já aponta para ela.
- [ ] Links do **X** e do **E-mail** no rodapé: preencher `href` em `social`, no `content/site.js`.
- [ ] Vídeos reais (showreel, fundo do hero, reels) e onde hospedá-los.
- [ ] Retrato do Welinton e pôsteres dos reels.
- [ ] Números reais e, futuramente, a vitrine de logos de marcas na faixa.
- [ ] Imagem de compartilhamento (Open Graph, 1200×630), favicon próprio e JSON-LD.
- [ ] Domínio definitivo e `NEXT_PUBLIC_SITE_URL`.
- [ ] Botão de pausar a faixa de números no toque (WCAG 2.2.2), se desejado.
- [ ] Forma de pausar o anel de reels com mouse/toque (WCAG 2.2.2): hoje só o foco pelo teclado para a rotação.
- [ ] Lighthouse depois do primeiro deploy.

## Arquivos locais (fora do git)

Estão no `.gitignore` e ficam só na máquina de quem desenvolve:

- `README-ESTRUTURA.md`: handoff original de design (layout 2a).
- `Site Welinton Carmelo.dc.html`: protótipo de referência.
- `SKILL.md`: instruções de desenvolvimento usadas no projeto.
- `AGENTS.md`: regras para agentes de IA, que o `next dev` gera automaticamente.

`classical.css` e `support.js` (tokens e runtime do protótipo) ainda estão na raiz e não fazem parte do site.
