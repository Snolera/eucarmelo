import { render, screen, within } from "@testing-library/react";
import Footer from "@/sections/Footer/Footer";
import { roles, social } from "@/content/site";

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

  test("4 redes na ordem do layout: TikTok, Instagram, WhatsApp e E-mail", () => {
    render(<Footer />);
    const nav = screen.getByRole("navigation", { name: /redes sociais/i });
    const names = within(nav)
      .getAllByRole("listitem")
      .map((li) => li.firstElementChild.getAttribute("aria-label").replace(" (em breve)", ""));
    expect(names).toEqual(["TikTok", "Instagram", "WhatsApp", "E-mail"]);
  });

  test("Instagram é um link externo para o perfil", () => {
    render(<Footer />);
    const link = screen.getByRole("link", { name: "Instagram" });
    expect(link).toHaveAttribute("href", "https://instagram.com/eucarmelo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  // Vale para o conteúdo atual do site.js: rede com href vira link; href null aparece sem link (nada quebrado)
  test("cada rede vira link quando tem endereço e fica 'em breve' quando não tem", () => {
    render(<Footer />);
    social.forEach(({ label, href }) => {
      if (href) {
        expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
      } else {
        expect(screen.getByRole("img", { name: `${label} (em breve)` })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: label })).not.toBeInTheDocument();
      }
    });
  });
});
