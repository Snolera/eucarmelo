# Welinton Carmelo — site (@eucarmelo)

Site one-page do **Welinton Carmelo**, videomaker de conteúdo para Instagram (gravação no celular). O público são marcas que querem contratar reels, e a ação principal é mandar um **direct no Instagram** (`ig.me/m/eucarmelo`).

- Idioma: somente português (`pt-BR`).
- Status: layout v2 portado. Header, Hero, Marcas parceiras, Portfólio, Serviços, Sobre, Galeria de Fotos e Contato (rodapé) prontos.
- Vídeos, fotos, retrato e redes ainda são **placeholders**, aguardando o material real.

---

## Stack

| Uso | Ferramenta |
|---|---|
| Framework | **Next.js 16.4** (App Router, Turbopack, `cacheComponents`) |
| UI | **React 19**, **JavaScript** (sem TypeScript) |
| Estilos | **CSS Modules** + variáveis globais em `app/globals.css` |
| Fontes | `next/font/google`: **Space Grotesk** (todos os h1/h2/h3 e parágrafos), **Inter** (logo, pílulas, tags/ano/botão dos cards) |
| Ícones | `lucide-react` (interface) + SVG próprio para as redes sociais |
| Animação | `motion` (entrada e leque do Portfólio) + CSS (`transform`/`opacity`) no resto |
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
sections/       Blocos da página, na ordem: Header, Hero, Partners, Work, Services, About, Photos, Footer
components/     Peças reutilizáveis (Panel, SectionHeading, Kicker, Logo, Button, Reveal,
                Gallery916, PhotoGrid, PhotoLightbox, VideoPlayer, VideoModal, SocialIcon)
hooks/          Lógica reutilizável (useVideoPlayer, useGalleryIntro, useMediaQuery, useReveal)
content/        site.js: toda a copy, links e mídia
lib/            Utilitários (siteUrl.js)
__tests__/      Testes de cada seção e componente
```

Cada componente e cada seção tem um `Nome.jsx` e um `Nome.module.css` ao lado. Não existe pasta `pages/`: ela ativaria o Pages Router.

### Conteúdo

Todo texto, link e mídia fica em **`content/site.js`**. Para trocar uma copy, adicionar um projeto ou ligar um vídeo, edite esse arquivo e não os componentes.

| Export | Conteúdo |
|---|---|
| `instagram` | handle, link do direct e do perfil |
| `roles` | linha de funções (hero e rodapé) |
| `nav` | links do menu (`#trabalhos`, `#servicos`, `#sobre`, `#contato`) |
| `hero` | título, CTA e showreel |
| `partners` | marcas da faixa (`{ name, logo }`, logos em `content/media/partners/`) |
| `work` | Portfólio: pílula, título e projetos (`title`, `tag`, `duration`, `year`, `desc`, `image`, `alt`, `video`) |
| `services` | pílula, título, texto de apoio e os 3 serviços (`title` e `text` opcional) |
| `about` | pílula, título, parágrafos e retrato |
| `photos` | pílula, título, texto de apoio (`lead`) e fotos (`alt`, `thumb`, `full`) |
| `social` | redes do rodapé (TikTok, Instagram, WhatsApp, E-mail) |
| `footer` | copyright |

**Títulos das seções:** `*palavra*` vira destaque (Space Grotesk 700, sem itálico) e `\n` quebra a linha. Exemplo: `"Por trás de *cada*\n*projeto*"`.

Mídia com `src: null` (vídeo, retrato) mostra um placeholder; rede com `href: null` aparece apagada, sem link.

---

## Arquitetura

### Server × Client Components

As seções são **Server Components** sempre que possível; o JavaScript só vai para o navegador onde há interação:

| Componente | Tipo | Por quê |
|---|---|---|
| `Hero`, `Partners`, `Work`, `Services`, `About`, `Photos`, `Footer` | Server | Conteúdo estático |
| `Header` | Client | Abre e fecha o menu mobile |
| `ServicesTimeline` | Client | Entrada do cabeçalho e da linha do tempo dos Serviços (scroll) |
| `HeroCard` | Client | Card do hero inteiro clicável, abre o showreel |
| `Gallery916` | Client | Leque do Portfólio (estado, teclado, swipe, entrada) |
| `PhotoGrid`, `PhotoLightbox` | Client | Abrir e fechar a foto ampliada |
| `VideoModal`, `VideoPlayer` | Client | `<dialog>` e controles do vídeo |

### Player de vídeo

- **`VideoPlayer`:** player próprio, sempre em **9:16**, com play/pause, barra de progresso, tempo e som (começa em 50%, barra de volume vertical). Sem `src`, mostra "Vídeo em breve" e desativa os controles.
- **`VideoModal`:** o player padrão do site, usado pelo showreel do Hero **e** pelo Portfólio. Usa o `<dialog>` nativo com `showModal()` (foco preso, Esc fecha, fundo inerte) e fecha clicando fora. Todo fechamento passa pelo `dialog.close()`, que devolve o foco a quem abriu.
- **Hospedagem:** Vercel Blob (store público). Ver "Vídeos e pôsteres".

### Hooks

- **`useVideoPlayer`:** o estado do `<video>` vem dos eventos nativos; expõe `togglePlay`, `toggleMute`, `setVolume` e `seek`. Onde o navegador não deixa mudar o volume (iPhone), o ícone só liga e desliga o som.
- **`useGalleryIntro(stageRef, reduceMotion)`:** entrada do Portfólio. Quando o palco fica inteiro na tela (`useInView` do motion), os cards caem empilhados no centro, pausam 200ms e abrem em leque. Com "reduzir movimento" ou sem IntersectionObserver, vai direto para o leque.
- **`useMediaQuery(query)`:** `true` enquanto a media query casa; o Portfólio usa para trocar os valores do leque em 768px.
- **`useReveal`:** IntersectionObserver da entrada no scroll (usado pelo `Reveal`, que tem `onReveal` para avisar quando revelou).
- **`useTimelineReveal(count, { ready, skip })`:** revela os passos da linha do tempo em ordem, uma vez só, quando o ponto cruza a linha de leitura (80% da tela).
- **`useTimelineLine(trackRef, dots, shown)`:** `scaleY` da linha dos Serviços ligado ao scroll, que só cresce e para no próximo ponto apagado (`capFraction`).

### Componentes compartilhados

- **`Panel`:** a caixa escura arredondada de todas as seções, na coluna central. Props: `as` (tag externa: `section` por padrão, `footer` no rodapé) e `reveal` (entrada no scroll só do conteúdo; a caixa fica parada). O `className` da seção vai em quem envolve o conteúdo.
- **`SectionHeading`:** cabeçalho centralizado (pílula + H2 + texto de apoio opcional). Converte `*destaque*` e `\n` do `site.js` (`parseEmphasis`).
- **`Kicker`:** a pílula em caixa alta ("PORTFÓLIO", "SOBRE").
- **`Logo`:** "welinton" light + "carmelo" negrito, colados; anuncia "Welinton Carmelo" ao leitor de tela. Usado no header e no rodapé, com o tamanho vindo de quem usa.
- **`Button`:** botão outline; vira `<a>` com `href`, e links externos ganham `target="_blank"` e `rel="noopener noreferrer"`.
- **`Gallery916`:** o Portfólio em leque (coverflow). 6 cards (236×360 no mobile, 270×400 a partir de 768px), o ativo no centro e até 2 vizinhos visíveis de cada lado, menores e sem escurecimento. As posições ficam em `FAN` (`motion-config.js`). Clique num card inativo o traz para o centro; **Assistir** no card ativo abre o `VideoModal`, que sai do card (FLIP). Controles: setas, ← → do teclado (fora de campos e com o player fechado), swipe (40px) e, só no mobile, bolinhas de posição.
- **`PhotoGrid` + `PhotoLightbox`:** grid de miniaturas e foto ampliada em `<dialog>` nativo (X, Esc ou clique no fundo fecham).
- **`SocialIcon`:** TikTok e WhatsApp preenchidos, Instagram e E-mail em contorno, herdando a cor do texto.

---

## Design

Fonte do layout: protótipo **Welinton Carmelo v2** (handoff local). O que vale é o que está descrito aqui.

### Tokens (`app/globals.css`)

| Token | Valor | Uso |
|---|---|---|
| `--color-page` | `#EAEAEA` | Fundo da página, atrás das caixas |
| `--color-surface-dark` | `#151717` | Header, hero e caixas de todas as seções |
| `--color-card` | `#232626` | Cards do Portfólio, moldura do retrato, fundo das fotos |
| `--color-text` / `--color-text-soft` / `--color-text-muted` | `#fff` / 80% / `#a3a6a8` | Texto principal / descrições / rótulos pequenos |
| `--color-pill-bg` / `--color-pill-text` | branco 8% / `#d9d9d9` | Pílulas e copyright |
| `--color-line` | branco 12% | Bordas dos cards de serviço e divisórias |
| `--color-accent` | `#b68235` | Links e foco visível |
| `--color-accent-light` | `#e1ad66` | CTA do hero, pontos da linha dos serviços, hover dos ícones e do Assistir |
| `--radius-container` | 20px → 24px | Caixas e card do hero |
| `--space-gutter` | 12px → 20px | Recuo lateral da coluna central (`.container`, até 1240px) |
| `--space-section` | 16px → 40px | Espaço entre uma caixa e a próxima |
| `--space-box-y` / `--space-box-x` | 48 → 102px / 20 → 56px | Respiro interno das caixas |
| `--header-offset` | 96px | `scroll-margin-top` das âncoras (header fixo) |

### Tipografia

- **H1 (hero):** Space Grotesk 400, 46px → 92px, entrelinha 1 no mobile e 0.95 a partir de 768px. O protótipo usa 0.86/0.7; os valores foram aumentados para as linhas não encostarem. O `<em>` ("no feed.") é o itálico simulado da própria Space Grotesk.
- **H2 das seções:** Space Grotesk 300, 40px → 60px, com palavras em destaque em Space Grotesk 700, sem itálico.
- **H2 do Sobre:** Space Grotesk 400, 32px → 44px, entrelinha 1.05 (protótipo: 0.92).
- **Cards:** título (H3) e descrição em Space Grotesk; tags, ano e botão em Inter. **Pílulas:** Inter.
- **Corpo:** Space Grotesk 15px, entrelinha 1.5.

### Responsivo (mobile-first)

Os estilos base são os do mobile e os breakpoints usam `min-width`: **768px** (principal, o mesmo do protótipo) e **1024px** (Sobre). Medidas fluidas com `clamp()`.

| Seção | Mobile | 768px+ |
|---|---|---|
| Header | Logo + ☰; menu abre abaixo com links grandes (28px) | Links em linha (14px) |
| Hero | Botão do direct em largura total, abaixo do texto | Título à esquerda, botão em pílula à direita |
| Portfólio | Leque compacto + bolinhas de posição | Leque largo, só as setas |
| Serviços | Linha do tempo vertical: ponto e linha dourada à esquerda de cada serviço | Igual até 1023px; a partir de 1024px, linha horizontal acima de uma coluna por serviço |
| Sobre | Título, retrato, texto | Retrato à esquerda (240px; 300px a partir de 1024px), título e texto à direita, justificado |
| Galeria de Fotos | 2 colunas; a 1ª foto ocupa as duas, em 4:3 | 3 colunas, todas 4:5 |
| Contato (rodapé) | Centralizado: logo, funções, 4 redes, copyright | Igual |

### Interações e animações

- **Abertura do player (Hero e Portfólio):** o player sai do elemento clicado e vai ao centro em **240ms** (FLIP com Web Animations API, `OPEN_DURATION` em `VideoModal.jsx`), com fade no fundo.
- **Hero:** o showreel sem som cobre o card; clicar em **qualquer parte do card** abre o player (menos no CTA ou selecionando texto).
- **Marcas parceiras:** faixa infinita de logos da direita para a esquerda (25s por volta, `linear`): lista + cópia `aria-hidden` (alt vazio), trilha anda -50% e recomeça sem emenda; pausa com o mouse por cima. Logos PNG 1080×660 já brancos com fundo transparente (sem `filter`/`mix-blend-mode`, que faziam a faixa tremer); trilha com `will-change: transform`. Logo e espaço em **px múltiplos de 8** por breakpoint (152/48 → 176/56 em 768 → 192/64 em 1024 → 208/72 em 1280), sem `vw`: o Firefox arredonda cada imagem para o pixel físico e, com posições fracionadas, cada logo "pulava" numa hora diferente.
- **Portfólio:** entrada própria (queda empilhada → leque) quando o palco fica inteiro na tela, por isso a seção não usa o `Reveal`. Queda e troca de card animam só `transform` e `opacity`, que o Motion roda na GPU (Web Animations API), fora da thread principal:
  - as posições são uma string `transform` inteira (`toTransform` em `motion-config.js`), não `x`/`y`/`scale` soltos;
  - **não usar `introControls.set(...)`**: ele cria os valores do Motion sem dono e as animações caem para JavaScript quadro a quadro, o que engasga no celular;
  - os cards têm `will-change: transform` (camada própria, sem redesenhar a cada quadro).
- **Vídeo do hero:** pausa quando o hero sai da tela (IntersectionObserver), para não disputar a GPU com as animações abaixo.
- **Entrada no scroll (Hero, Marcas parceiras, Sobre, Fotos):** a caixa escura (e o vídeo do Hero) fica parada e só o **conteúdo** desliza da esquerda com fade, quando 60% da seção fica visível (ou ocupa 60% da tela). Uma vez só. O Hero usa `<Reveal immediate>` (CSS na primeira pintura, não atrasa o LCP). Sem JavaScript, tudo aparece normalmente.
- **Serviços (linha do tempo):** a caixa fica parada e o cabeçalho entra com o `Reveal`; os cards vêm depois (`ServicesTimeline`).
  - **Mobile/tablet (< 1024px):** uma linha única desce com o scroll; a ponta segue uma "linha de leitura" a 80% da altura da tela (`useTimelineLine`: `useScroll` + `useSpring`, só `scaleY`). Quando um ponto cruza essa linha, ele acende e o card sobe 16px com fade (`useTimelineReveal`). O 1º card espera o cabeçalho (300ms); pontos que já passaram (ex.: âncora `#servicos`) entram em cascata (120ms). A linha só cresce e nunca passa de um ponto apagado.
  - **Desktop (1024px+):** quando a fileira de pontos cruza a linha de leitura (e o cabeçalho já entrou), a linha horizontal corre da esquerda (`scaleX`, `linear`) e cada ponto + card entra quando ela chega: `--i × 350ms` (0 · 350 · 700ms, ~1,15s no total). Só CSS (`--tl-step`), disparado pelo `data-active`.
- **Fotos:** miniatura cresce 2% no hover; a foto ampliada entra com fade + escala.
- **Menos movimento:** com `prefers-reduced-motion`, nada desliza, a faixa para, a linha dos Serviços aparece cheia, o Portfólio pula a entrada e troca de card com transições curtas, e o scroll suave é desligado.

---

## Acessibilidade

- HTML semântico: um único `h1`, headings em ordem (`h1` → `h2` → `h3`), seções nomeadas por `aria-labelledby`.
- Link "Pular para o conteúdo" no header, visível só com foco por teclado.
- Foco visível dourado; áreas de toque de no mínimo 44×44px.
- Portfólio: cada card é um `article` nomeado pelo seu `h3`, com `aria-current` no ativo. Só o **Assistir** do card ativo entra no Tab (as setas trocam o card); cards fora do leque ficam `inert`. As bolinhas são decorativas (`aria-hidden`).
- Serviços: linha do tempo em lista ordenada (`ol`/`li`), ponto e linha decorativos (`aria-hidden`); "Pra quem" e "O que resolve" são pares `dt`/`dd`.
- Fotos: cada miniatura é um botão "Ampliar: …"; a foto ampliada é um `<dialog>` com botão "Fechar foto".
- Redes sem endereço aparecem como imagem "(em breve)", apagadas e sem link quebrado.

## SEO

- `metadata` em `app/layout.jsx`: title, description, canonical, Open Graph (`pt_BR`) e Twitter Card.
- `app/sitemap.js` e `app/robots.js`, gerados a partir da URL do site.
- `<html lang="pt-BR">` e fontes via `next/font`, sem layout shift.
- Imagens (capas, fotos, retrato) via `next/image`.

## Testes

Para rodar: `npm test`. Os testes cobrem cada seção e componente:

- **Navegação:** menu mobile, 4 âncoras, link de pular conteúdo e destino de cada âncora.
- **Cabeçalhos:** pílula, `parseEmphasis` (`*destaque*` e `\n`) e nome legível do H2.
- **Portfólio (`Gallery916.test.jsx`):** conteúdo do card, card inicial, destacar por clique, setas/teclado, swipe, bolinhas, Assistir abrindo o player com o vídeo do projeto. Rodam com "reduzir movimento", que pula a entrada; a queda e o leque são conferidos no navegador.
- **Serviços, Sobre, Fotos e Contato:** conteúdo, ordem do HTML, lightbox (abrir e fechar) e redes.
- **Player:** abrir e fechar (Hero, foco), controles e estado sem vídeo.
- **Entrada no scroll:** quais seções deslizam, que a caixa/vídeo do Hero fica fora da animação e o `onReveal`.
- **Linha do tempo dos Serviços (`ServicesTimeline.test.jsx`):** cards esperam o cabeçalho, cascata, ponto abaixo da linha não revela, uma vez só, reduzir movimento e sem IntersectionObserver; `capFraction` (limite da linha). O desenho da linha com o scroll é conferido no navegador.

O `vitest.setup.js` tem um polyfill de `<dialog>.showModal/close`, porque o jsdom não implementa esses métodos.

**Limitação:** o jsdom não aplica media queries nem animações. O que depende de breakpoint ou de animação (leque do mobile, entrada da galeria) é conferido no navegador.

---

## Vídeos e pôsteres (Vercel Blob)

Os vídeos e pôsteres ficam num **Blob Store público** da Vercel (`store_Rm7Tmby09iTxGh0l`). O site só guarda as URLs, em `content/site.js`; não há SDK nem token no código.

**Enviar um arquivo:**

1. Na Vercel: **Storage** → o store público → aba **Browser** → **Upload**.
2. Use pastas e nomes sem espaço nem acento, por exemplo `reels/cafe-bruma.mp4` e `capas/cafe-bruma.jpg`.
3. Clique no arquivo enviado e copie a URL (formato `https://rm7tmby09itxgh0l.public.blob.vercel-storage.com/reels/cafe-bruma.mp4`).
4. Cole a URL no campo certo do `content/site.js`:
   - Portfólio: `video` e `image` (capa) de cada item em `work.items`;
   - showreel: `hero.showreel.src` e `hero.showreel.poster`;
   - fotos: `thumb` e `full` em `photos.items`.
5. Rode `npm test`, faça o commit e o push. A Vercel publica sozinha.

**Configuração:**

- `next.config.mjs` libera no `next/image` só o domínio do store (`BLOB_HOST`). Capas do Portfólio são locais (`content/media/work/<id>.jpg`, um quadro do vídeo, 720×1280).
- O teste `__tests__/blobUrls.test.js` falha se alguma URL do `site.js` for de outro domínio.

**Formato dos arquivos:** MP4 (H.264 + AAC), 9:16, 1080×1920 no máximo, de preferência abaixo de 15 MB. Capas do Portfólio: JPG 720×1280 tirado do próprio vídeo (1º quadro; outro segundo se o início for preto). Fotos em 4:5 (miniatura 800×1000, ampliada 1200×1500).

**Cache:** o CDN guarda cada arquivo por até 1 mês. Para trocar um arquivo, envie com **outro nome** (ex.: `cafe-bruma-v2.mp4`) e atualize a URL.

---

## Pendências

- [ ] Links do **TikTok**, **WhatsApp** e **E-mail** no rodapé: preencher `href` em `social`, no `content/site.js`.
- [x] Vídeos reais (showreel e projetos do Portfólio) no Vercel Blob.
- [x] Capas reais do Portfólio (quadro de cada vídeo).
- [ ] Retrato do Welinton; `alt` descritivo nas fotos da Galeria e nos cards do Portfólio.
- [x] Domínios do `picsum.photos` removidos do `next.config.mjs`.
- [x] Vitrine de logos de marcas na faixa (substituiu os números).
- [ ] Imagem de compartilhamento (Open Graph, 1200×630), favicon próprio e JSON-LD.
- [ ] Domínio definitivo e `NEXT_PUBLIC_SITE_URL`.
- [ ] Botão de pausar a faixa de marcas no toque (WCAG 2.2.2), se desejado.
- [ ] Lighthouse depois do primeiro deploy.

## Arquivos locais (fora do git)

Estão no `.gitignore` e ficam só na máquina de quem desenvolve:

- `SKILL.md`: instruções de desenvolvimento usadas no projeto.
- `AGENTS.md`: regras para agentes de IA, que o `next dev` gera automaticamente.
