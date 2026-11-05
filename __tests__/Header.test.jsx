import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/sections/Header/Header";
import { nav as navItems } from "@/content/site";

describe("Header", () => {
  test("mostra o logo e os 4 links de navegação com âncoras", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    // Logo "welinton" + "carmelo" (negrito) colados; leitor de tela ouve "Welinton Carmelo"
    const logo = screen.getByRole("link", { name: "Welinton Carmelo" });
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveTextContent("welintoncarmelo");
    expect(logo.querySelector("[data-logo-bold]")).toHaveTextContent("carmelo");

    const nav = screen.getByRole("navigation", { name: /principal/i });
    expect(within(nav).getAllByRole("link").map((a) => [a.textContent, a.getAttribute("href")])).toEqual(
      navItems.map((item) => [item.label, item.href]) // copy vem do site.js
    );
    expect(navItems.map((item) => item.href)).toEqual(["#trabalhos", "#servicos", "#sobre", "#contato"]);
  });

  test("tem link para pular direto ao conteúdo", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: /pular para o conteúdo/i })).toHaveAttribute(
      "href",
      "#conteudo"
    );
  });

  test("botão de menu mobile abre e fecha a navegação", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /menu/i });

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("clicar em um link fecha o menu mobile", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /menu/i });

    await user.click(toggle);
    await user.click(screen.getByRole("link", { name: "Sobre" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("Esc fecha o menu mobile", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const toggle = screen.getByRole("button", { name: /menu/i });

    await user.click(toggle);
    await user.keyboard("{Escape}");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
