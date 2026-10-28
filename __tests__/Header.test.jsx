import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/sections/Header/Header";

describe("Header", () => {
  test("mostra o logo e os links de navegação com âncoras", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    // Logo "welinton" + "carmelo" (negrito) colados; leitor de tela ouve "Welinton Carmelo"
    const logo = screen.getByRole("link", { name: "Welinton Carmelo" });
    expect(logo).toHaveAttribute("href", "/");
    expect(logo).toHaveTextContent("welintoncarmelo");
    expect(logo.querySelector("[data-logo-bold]")).toHaveTextContent("carmelo");

    const nav = screen.getByRole("navigation", { name: /principal/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Trabalhos" })).toHaveAttribute("href", "#trabalhos");
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "#sobre");
    expect(screen.getByRole("link", { name: "Contato" })).toHaveAttribute("href", "#contato");
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
