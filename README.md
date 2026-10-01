# Welinton Carmello · Portfólio

Site em React + Vite + Tailwind CSS v3, baseado no frame **01 Editorial cinematográfico** do Figma.

## Rodando

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # gera a pasta dist/ para publicar
```

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Textos, nome, menu, contatos | `src/data/site.js` |
| Trabalhos do portfólio | `src/data/projetos.json` |
| Imagens | `public/img/` |
| Cores e fontes | `tailwind.config.js` |

## Links (botões ainda sem clique)

Todo `link: ''` vazio deixa o elemento sem clique. Preencha para ativar:

- Menu: `'#portfolio'`, `'#sobre'`, `'#contato'`
- Instagram: `'https://instagram.com/usuario'`
- WhatsApp: `'https://wa.me/55DDDNUMERO'`
- E-mail: `'mailto:contato@email.com'`
- Card do portfólio: link do Reel (`"link"` no `projetos.json`)

## Vídeos nos cards

Em `projetos.json`, preencha o campo `"video"` com a URL de um MP4 curto (5–8 s, sem som, ~1–2 MB),
por exemplo do Supabase Storage. Enquanto estiver vazio, o card mostra a imagem; preenchido,
toca em loop usando a imagem como capa.

`"imagemMobile"` (opcional) é um recorte vertical usado só no celular.

## Breakpoints

- Celular: até 767px (layout do frame Celular)
- Tablet: 768–1023px (grade de 2 colunas, Sobre lado a lado)
- Computador: a partir de 1024px (layout do frame Computador, conteúdo máx. 1296px)

## Publicar

Suba para o GitHub e importe na Vercel ou Netlify (detecta Vite automaticamente).

## Windows com Smart App Control / Controle de Aplicativos

Este projeto foi configurado para não depender de binários nativos (`.node`), que o
Windows pode bloquear ("An Application Control policy has blocked this file"):

- `@rolldown/binding-wasm32-wasi`: versão WebAssembly do bundler do Vite, usada automaticamente quando o binário nativo é bloqueado.
- Tailwind CSS v3 (JavaScript puro, via PostCSS) em vez do v4.
- `build.cssMinify: false` no `vite.config.js` (evita o lightningcss).

Pode aparecer o aviso `ExperimentalWarning: WASI is an experimental feature`: é normal e pode ser ignorado.
