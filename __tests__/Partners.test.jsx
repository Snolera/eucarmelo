import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { render, screen, within } from "@testing-library/react";
import Partners from "@/sections/Partners/Partners";
import { partners } from "@/content/site";

describe("Partners", () => {
  test("mostra um logo por marca, com o nome no alt", () => {
    render(<Partners />);
    const section = screen.getByRole("region", { name: /marcas parceiras/i });
    const items = within(section).getAllByRole("listitem");

    expect(items).toHaveLength(partners.length);
    partners.forEach((partner, i) => {
      expect(within(items[i]).getByRole("img", { name: partner.name })).toBeInTheDocument();
    });
  });

  // Já recortados (1080×660) e brancos: o CSS não precisa de filter/blend, que fazia a faixa tremer
  test("logos locais (import estático) já recortados em 1080×660", () => {
    expect(partners).toHaveLength(6);
    partners.forEach(({ logo }) => {
      expect(logo).toMatchObject({ width: 1080, height: 660 });
      expect(logo.src).toMatch(/^\/[a-z]+\.png$/); // nome sem espaço, acento ou parênteses
    });
  });

  test("logos carregam sob demanda (fora da dobra)", () => {
    render(<Partners />);
    screen.getAllByRole("img").forEach((img) => expect(img).toHaveAttribute("loading", "lazy"));
  });

  // Firefox arredonda cada logo para o pixel físico: com posições fracionadas, cada um "pula" numa hora (tremido)
  // Múltiplos de 8px viram pixel inteiro nos DPRs comuns (1; 1,25; 1,5; 2; 2,625; 2,75; 3)
  test("largura do logo e espaço em px múltiplos de 8, sem vw", () => {
    const css = readFileSync(resolve(__dirname, "../sections/Partners/Partners.module.css"), "utf8");
    const values = [...css.matchAll(/--partners-(?:logo|gap):\s*([^;]+);/g)].map((m) => m[1].trim());

    expect(values.length).toBeGreaterThanOrEqual(2);
    values.forEach((value) => {
      expect(value).toMatch(/^\d+px$/);
      expect(parseInt(value, 10) % 8).toBe(0);
    });
  });

  // Mesma área visual (critério do dev); logos muito largos param no limite de 90% da largura da caixa
  test("logos com a mesma área visível (±10%), centralizados", async () => {
    const boxes = await Promise.all(
      partners.map(async ({ logo }) => {
        const file = resolve(__dirname, "../content/media/partners", logo.src.slice(1));
        const { data, info } = await sharp(file).extractChannel(3).raw().toBuffer({ resolveWithObject: true });
        let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i] < 8) continue;
          const x = i % info.width, y = Math.floor(i / info.width);
          x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
        }
        return { w: x1 - x0 + 1, h: y1 - y0 + 1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
      }),
    );
    const free = boxes.filter((b) => b.w < 1080 * 0.9 - 2).map((b) => b.w * b.h);
    const mean = free.reduce((a, b) => a + b) / free.length;

    free.forEach((area) => expect(Math.abs(area / mean - 1)).toBeLessThan(0.1));
    boxes.forEach((b) => {
      expect(Math.abs(b.cx - 540)).toBeLessThan(3);
      expect(Math.abs(b.cy - 330)).toBeLessThan(3);
    });
  });

  test("faixa infinita: lista + cópia idêntica escondida dos leitores de tela", () => {
    const { container } = render(<Partners />);
    const [list, copy] = container.querySelectorAll("ul");

    expect(container.querySelectorAll("ul")).toHaveLength(2);
    expect(list).not.toHaveAttribute("aria-hidden");
    expect(copy).toHaveAttribute("aria-hidden", "true");
    expect(copy.querySelectorAll("li")).toHaveLength(partners.length);
    copy.querySelectorAll("img").forEach((img) => expect(img).toHaveAttribute("alt", ""));
  });

  test("leitores de tela ouvem cada marca uma vez só", () => {
    render(<Partners />);
    expect(screen.getAllByRole("img")).toHaveLength(partners.length);
  });
});
