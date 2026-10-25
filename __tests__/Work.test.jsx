import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Work from "@/sections/Work/Work";

describe("Work", () => {
  test("seção com âncora, kicker e h2", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("section#trabalhos")).toBeInTheDocument();
    expect(screen.getByText("Reels para marcas")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Trabalhos selecionados" })).toBeInTheDocument();
  });

  test("mostra 4 cards com cliente (h3) e categoria", () => {
    render(<Work />);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4);
    expect(screen.getByRole("heading", { level: 3, name: "Café Bruma" })).toBeInTheDocument();
    expect(screen.getByText("Gastronomia")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Festival Aurora" })).toBeInTheDocument();
  });

  test("clicar no card abre o player daquele reel, mesmo sem vídeo", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel atelier nó/i }));
    expect(screen.getByRole("dialog", { name: "Atelier Nó" })).toBeInTheDocument();
    expect(screen.getByText(/vídeo em breve/i)).toBeInTheDocument();
  });

  test("fechar o player remove o diálogo", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel café bruma/i }));
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
