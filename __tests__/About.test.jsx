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

  test("sem foto, mostra o placeholder do retrato (sem <img>)", () => {
    const { container } = render(<About />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("figure")).toBeInTheDocument();
  });
});
