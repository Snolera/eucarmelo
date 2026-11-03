import { render, screen } from "@testing-library/react";
import About from "@/sections/About/About";

const follows = (a, b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("About", () => {
  test("seção com âncora #sobre, nomeada pelo h2", () => {
    const { container } = render(<About />);
    expect(container.querySelector("section#sobre")).toBeInTheDocument();
    expect(
      screen.getByRole("region", {
        name: "Um celular, um olhar e o ritmo certo para prender os primeiros segundos.",
      })
    ).toBeInTheDocument();
  });

  test("mostra a pílula e os dois parágrafos da copy", () => {
    render(<About />);
    expect(screen.getByText("Sobre")).toBeInTheDocument();
    expect(screen.getByText(/sou welinton carmelo, videomaker focado/i)).toBeInTheDocument();
    expect(screen.getByText(/trabalho com marcas que querem estar presentes/i)).toBeInTheDocument();
  });

  test("ordem do mobile no HTML: título, retrato, texto", () => {
    const { container } = render(<About />);
    const title = screen.getByRole("heading", { level: 2 });
    const figure = container.querySelector("figure");
    const firstParagraph = screen.getByText(/sou welinton carmelo/i);
    expect(follows(title, figure)).toBe(true);
    expect(follows(figure, firstParagraph)).toBe(true);
  });

  test("sem foto, mostra o placeholder do retrato (sem <img>)", () => {
    const { container } = render(<About />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("figure")).toBeInTheDocument();
  });
});
