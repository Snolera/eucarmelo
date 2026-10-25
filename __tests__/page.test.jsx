import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

describe("Home", () => {
  test("renderiza um único h1", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  test("tem header, main com id para o link de pular conteúdo e footer", () => {
    render(<Home />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "conteudo");
  });

  test("seções na ordem: hero, números, trabalhos, sobre", () => {
    render(<Home />);
    const regions = screen.getAllByRole("region").map((r) => r.getAttribute("aria-labelledby") || r.getAttribute("aria-label"));
    expect(regions).toEqual(["hero-title", "Números", "work-title", "about-title"]);
  });
});
