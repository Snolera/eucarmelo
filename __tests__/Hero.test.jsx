import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "@/sections/Hero/Hero";

describe("Hero", () => {
  test("mostra kicker e o h1 com a copy do design", () => {
    render(<Hero />);
    expect(screen.getByText("Videomaker · Conteúdo para Instagram")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Filmes curtos para marcas que vivem no feed." })
    ).toBeInTheDocument();
  });

  test("CTA leva ao direct do Instagram", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /mandar direct/i });
    expect(cta).toHaveAttribute("href", "https://ig.me/m/eucarmelo");
    expect(cta).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  test("clicar em qualquer parte do hero (ex.: no título) abre o player", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.click(screen.getByRole("heading", { level: 1 }));
    expect(screen.getByRole("dialog", { name: /showreel/i })).toBeInTheDocument();
  });

  test("clicar no CTA do Instagram não abre o player", async () => {
    const user = userEvent.setup();
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /mandar direct/i });
    // Evita navegação real no jsdom
    cta.addEventListener("click", (e) => e.preventDefault());

    await user.click(cta);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("fechar o player não o reabre", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    await user.click(screen.getByRole("heading", { level: 1 }));
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("'Assistir showreel' abre o player", async () => {
    const user = userEvent.setup();
    render(<Hero />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /assistir showreel/i }));
    expect(screen.getByRole("dialog", { name: /showreel/i })).toBeInTheDocument();
  });
});
