import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import About from "@/sections/About/About";
import { about } from "@/content/site";
import { headingName } from "./helpers";

const follows = (a, b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("About", () => {
  test("seção com âncora #sobre, nomeada pelo h2", () => {
    const { container } = render(<About />);
    expect(container.querySelector("section#sobre")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: headingName(about.title) })
    ).toBeInTheDocument();
  });

  test("mostra a pílula e todos os parágrafos da copy", () => {
    render(<About />);
    expect(screen.getByText(about.kicker)).toBeInTheDocument();
    about.paragraphs.forEach((text) => expect(screen.getByText(text)).toBeInTheDocument());
  });

  test("ordem do mobile no HTML: título, retrato, texto", () => {
    const { container } = render(<About />);
    const title = screen.getByRole("heading", { level: 2 });
    const figure = container.querySelector("figure");
    const firstParagraph = screen.getByText(about.paragraphs[0]);
    expect(follows(title, figure)).toBe(true);
    expect(follows(figure, firstParagraph)).toBe(true);
  });

  test("retrato é import local com dimensões e blur", () => {
    expect(about.portrait.src).toEqual(
      expect.objectContaining({
        width: expect.any(Number),
        height: expect.any(Number),
        blurDataURL: expect.stringMatching(/^data:image/),
      })
    );
  });

  test("mostra o retrato dentro do figure, com alt e blur", () => {
    const { container } = render(<About />);
    const img = screen.getByRole("img", { name: about.portrait.alt });
    expect(container.querySelector("figure")).toContainElement(img);
    // placeholder="blur" vira background-image com o blurDataURL
    expect(img.getAttribute("style")).toMatch(/background-image/);
  });

  // Rosto fica à direita do meio da foto: o recorte 4:5 desloca para centralizar o rosto
  test("recorte do retrato deslocado para centralizar o rosto", () => {
    const css = readFileSync(resolve(__dirname, "../sections/About/About.module.css"), "utf8");
    const image = css.match(/\.aboutPortraitImage\s*\{([^}]*)\}/)[1];
    expect(image).toMatch(/object-position:\s*56%\s+center/);
  });
});
