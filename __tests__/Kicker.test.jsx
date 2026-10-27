import { render, screen } from "@testing-library/react";
import Kicker from "@/components/Kicker/Kicker";

describe("Kicker (letras que acendem em laranja na entrada da seção)", () => {
  test("cada letra vira um span com seu índice (--i) para o atraso em sequência", () => {
    const { container } = render(<Kicker>Sobre</Kicker>);
    const letters = container.querySelectorAll("p > span[aria-hidden='true']");
    expect([...letters].map((l) => l.textContent)).toEqual(["S", "o", "b", "r", "e"]);
    expect([...letters].map((l) => l.style.getPropertyValue("--i"))).toEqual(["0", "1", "2", "3", "4"]);
  });

  test("leitor de tela lê o texto inteiro, não letra por letra", () => {
    render(<Kicker>Reels para marcas</Kicker>);
    expect(screen.getByText("Reels para marcas")).toBeInTheDocument();
  });

  test("o kicker informa o total de letras (--n): a linha cresce no tempo da onda inteira", () => {
    const { container } = render(<Kicker>Reels para marcas</Kicker>);
    expect(container.querySelector("p").style.getPropertyValue("--n")).toBe("17");
  });

  test("espaços mantêm o índice da sequência (a onda não 'pula' entre palavras)", () => {
    const { container } = render(<Kicker>A B</Kicker>);
    const letters = container.querySelectorAll("p > span[aria-hidden='true']");
    expect(letters).toHaveLength(3);
    expect(letters[2].style.getPropertyValue("--i")).toBe("2");
  });
});
