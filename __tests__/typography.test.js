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

  test("Playfair não é carregado nem referenciado", () => {
    expect(read("app/layout.jsx")).not.toMatch(/Playfair/);
    expect(read("app/globals.css")).not.toMatch(/--font-accent|--font-playfair/);
  });
});
