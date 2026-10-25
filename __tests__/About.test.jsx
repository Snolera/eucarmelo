import { render, screen } from "@testing-library/react";
import About from "@/sections/About/About";

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

  test("mostra o kicker e os dois parágrafos da copy", () => {
    render(<About />);
    expect(screen.getByText("Sobre")).toBeInTheDocument();
    expect(screen.getByText(/sou welinton carmelo, videomaker focado/i)).toBeInTheDocument();
    expect(screen.getByText(/trabalho com marcas que querem estar presentes/i)).toBeInTheDocument();
  });

  test("retrato vem depois do texto", () => {
    const { container } = render(<About />);
    const lastParagraph = screen.getByText(/trabalho com marcas que querem estar presentes/i);
    const figure = container.querySelector("figure");
    expect(lastParagraph.compareDocumentPosition(figure) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test("sem foto, mostra o placeholder do retrato (sem <img>)", () => {
    const { container } = render(<About />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("figure")).toBeInTheDocument();
  });
});
