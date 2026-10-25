import { render, screen, within } from "@testing-library/react";
import Footer from "@/sections/Footer/Footer";

describe("Footer", () => {
  test("rodapé com o copyright à esquerda", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByText("© 2026 Welinton Carmelo")).toBeInTheDocument();
  });

  test("lista as 3 redes: X, Instagram e E-mail", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /redes sociais/i });
    expect(within(nav).getAllByRole("listitem")).toHaveLength(3);
  });

  test("Instagram é um link externo para o perfil", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: /instagram/i });
    expect(link).toHaveAttribute("href", "https://instagram.com/eucarmelo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  test("redes sem endereço definido aparecem sem link (nada quebrado)", () => {
    render(<Footer />);
    expect(screen.getByRole("img", { name: /x.*em breve/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /e-mail.*em breve/i })).toBeInTheDocument();
  });

  test("ícones são só contorno (sem preenchimento)", () => {
    const { container } = render(<Footer />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs).toHaveLength(3);
    svgs.forEach((svg) => expect(svg).toHaveAttribute("fill", "none"));
  });
});
