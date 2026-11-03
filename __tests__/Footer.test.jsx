import { render, screen, within } from "@testing-library/react";
import Footer from "@/sections/Footer/Footer";
import { roles } from "@/content/site";

describe("Footer (Contato)", () => {
  test("rodapé é o destino do link Contato (#contato)", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toHaveAttribute("id", "contato");
  });

  test("logo, linha de funções e copyright", () => {
    render(<Footer />);
    const footer = within(screen.getByRole("contentinfo"));
    expect(footer.getByRole("link", { name: "Welinton Carmelo" })).toHaveTextContent("welintoncarmelo");
    expect(footer.getByText(roles)).toBeInTheDocument();
    expect(footer.getByText("Copyright © 2026 Welinton Carmelo")).toBeInTheDocument();
  });

  test("4 redes na ordem do layout: Facebook, Instagram, X e E-mail", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /redes sociais/i });
    const names = within(nav)
      .getAllByRole("listitem")
      .map((li) => li.firstElementChild.getAttribute("aria-label"));
    expect(names).toEqual(["Facebook (em breve)", "Instagram", "X (em breve)", "E-mail (em breve)"]);
  });

  test("Instagram é um link externo para o perfil", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("href", "https://instagram.com/eucarmelo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  test("redes sem endereço definido aparecem sem link (nada quebrado)", () => {
    render(<Footer />);
    expect(screen.getByRole("img", { name: /facebook.*em breve/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /facebook/i })).not.toBeInTheDocument();
  });
});
