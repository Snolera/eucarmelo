import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const read = (path) => readFileSync(resolve(__dirname, "..", path), "utf8");

// Decisão do dev: títulos e parágrafos (inclusive o destaque *palavra*) só em Space Grotesk
describe("Tipografia", () => {
  test("destaque *palavra* dos títulos usa a fonte dos títulos (Space Grotesk)", () => {
    const rule = read("components/SectionHeading/SectionHeading.module.css").match(/\.headingEm\s*\{([^}]*)\}/)[1];
    expect(rule).toMatch(/font-family:\s*var\(--font-heading\)/);
  });

  // Decisão do dev: destaque só pelo peso 700, sem inclinar (o <em> é itálico por padrão)
  test("destaque *palavra* sem itálico", () => {
    const rule = read("components/SectionHeading/SectionHeading.module.css").match(/\.headingEm\s*\{([^}]*)\}/)[1];
    expect(rule).toMatch(/font-style:\s*normal/);
  });

  // Decisão do dev: parágrafos de Sobre, Serviços e Fotografia com o mesmo tamanho (16px = 1rem), linha e cor
  test("tokens do parágrafo no :root: 1rem, linha 1.5 e cor --color-text-soft", () => {
    const root = read("app/globals.css").match(/:root\s*\{([\s\S]*?)\n\}/)[1];
    expect(root).toMatch(/--text-body-size:\s*1rem;/);
    expect(root).toMatch(/--text-body-leading:\s*1\.5;/);
    expect(root).toMatch(/--text-body-color:\s*var\(--color-text-soft\);/);
  });

  test.each([
    ["components/SectionHeading/SectionHeading.module.css", "headingLead"], // Fotografia, Serviços e Sobre (composes)
    ["sections/Services/Services.module.css", "servicesText"], // texto dos cards
  ])("%s .%s usa os tokens do parágrafo", (file, cls) => {
    const rule = read(file).match(new RegExp(`\\.${cls}\\s*\\{([^}]*)\\}`))[1];
    expect(rule).toMatch(/font-size:\s*var\(--text-body-size\)/);
    expect(rule).toMatch(/line-height:\s*var\(--text-body-leading\)/);
    expect(rule).toMatch(/color:\s*var\(--text-body-color\)/);
  });

  test("o Sobre herda o parágrafo do headingLead sem sobrescrever tamanho, linha ou cor", () => {
    const rule = read("sections/About/About.module.css").match(/\.aboutText\s*\{([^}]*)\}/)[1];
    expect(rule).toMatch(/composes:\s*headingLead/);
    expect(rule).not.toMatch(/font-size|line-height|(^|[^-])color:/);
  });

  test("Playfair não é carregado nem referenciado", () => {
    expect(read("app/layout.jsx")).not.toMatch(/Playfair/);
    expect(read("app/globals.css")).not.toMatch(/--font-accent|--font-playfair/);
  });
});
