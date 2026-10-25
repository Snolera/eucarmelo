import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Work from "@/sections/Work/Work";

// Trilho do carrossel (mobile): índice exposto na variável CSS --index
const trackIndex = () => screen.getByRole("list").style.getPropertyValue("--index");

describe("Carrossel de Trabalhos (mobile)", () => {
  test("começa no início: seta anterior desativada, próxima ativa", () => {
    render(<Work />);
    expect(screen.getByRole("button", { name: "Reel anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Próximo reel" })).toBeEnabled();
    expect(trackIndex()).toBe("0");
    expect(screen.getByText("Reels 1 e 2 de 4")).toBeInTheDocument();
  });

  test("seta próxima avança de 2 em 2, revelando 2 cards novos", async () => {
    const user = userEvent.setup();
    render(<Work />);
    const next = screen.getByRole("button", { name: "Próximo reel" });

    await user.click(next);
    expect(trackIndex()).toBe("2");
    expect(screen.getByText("Reels 3 e 4 de 4")).toBeInTheDocument();
    expect(next).toBeDisabled();
  });

  test("seta anterior volta 2 cards", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: "Próximo reel" }));
    await user.click(screen.getByRole("button", { name: "Reel anterior" }));
    expect(trackIndex()).toBe("0");
    expect(screen.getByText("Reels 1 e 2 de 4")).toBeInTheDocument();
  });

  test("arrastar para a esquerda avança 2 e para a direita volta 2", () => {
    render(<Work />);
    const viewport = screen.getByRole("list").parentElement;

    fireEvent.pointerDown(viewport, { clientX: 200 });
    fireEvent.pointerUp(viewport, { clientX: 100 });
    expect(trackIndex()).toBe("2");

    fireEvent.pointerDown(viewport, { clientX: 100 });
    fireEvent.pointerUp(viewport, { clientX: 200 });
    expect(trackIndex()).toBe("0");
  });

  test("arrasto curto não move o trilho", () => {
    render(<Work />);
    const viewport = screen.getByRole("list").parentElement;

    fireEvent.pointerDown(viewport, { clientX: 200 });
    fireEvent.pointerUp(viewport, { clientX: 190 });
    expect(trackIndex()).toBe("0");
  });

  test("focar um card escondido pelo teclado leva à página (par) dele", () => {
    render(<Work />);
    fireEvent.focus(screen.getByRole("button", { name: /assistir reel studio vila/i }));
    expect(trackIndex()).toBe("2");

    fireEvent.focus(screen.getByRole("button", { name: /assistir reel atelier nó/i }));
    expect(trackIndex()).toBe("0");
  });
});
