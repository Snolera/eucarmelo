import { render, screen } from "@testing-library/react";
import Kicker from "@/components/Kicker/Kicker";
import SectionHeading, { parseEmphasis } from "@/components/SectionHeading/SectionHeading";

describe("Kicker (pílula acima dos títulos)", () => {
  test("mostra o texto inteiro num único parágrafo, sem letras soltas", () => {
    const { container } = render(<Kicker>Portfólio</Kicker>);
    expect(screen.getByText("Portfólio").tagName).toBe("P");
    expect(container.querySelectorAll("span")).toHaveLength(0);
  });
});

describe("parseEmphasis (*destaque* e \\n no texto do site.js)", () => {
  test("separa trechos normais, destaques e quebras de linha", () => {
    expect(parseEmphasis("Por trás de *cada*\n*projeto*")).toEqual([
      { type: "text", value: "Por trás de " },
      { type: "em", value: "cada" },
      { type: "br" },
      { type: "em", value: "projeto" },
    ]);
  });

  test("texto sem marcação vira um trecho só", () => {
    expect(parseEmphasis("Galeria")).toEqual([{ type: "text", value: "Galeria" }]);
  });
});

describe("SectionHeading", () => {
  test("pílula, h2 com id e destaques em <em>; o nome do título fica legível", () => {
    const { container } = render(<SectionHeading kicker="Portfólio" title={"Por trás de *cada*\n*projeto*"} titleId="t" />);
    const h2 = screen.getByRole("heading", { level: 2, name: "Por trás de cada projeto" });
    expect(h2).toHaveAttribute("id", "t");
    expect([...h2.querySelectorAll("em")].map((em) => em.textContent)).toEqual(["cada", "projeto"]);
    expect(h2.querySelector("br")).toBeInTheDocument();
    expect(screen.getByText("Portfólio")).toBeInTheDocument();
    expect(container.querySelector("h2 + p")).toBeNull(); // sem lead, sem parágrafo vazio
  });

  test("lead opcional aparece abaixo do título", () => {
    render(<SectionHeading kicker="Serviços" title="Título" titleId="t" lead="Texto de apoio" />);
    expect(screen.getByText("Texto de apoio")).toBeInTheDocument();
  });
});
