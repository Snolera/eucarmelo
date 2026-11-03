import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Photos from "@/sections/Photos/Photos";
import { photos } from "@/content/site";

const thumbs = () => screen.getAllByRole("button", { name: /^ampliar:/i });

describe("Galeria de Fotos", () => {
  test("âncora #galeria nomeada pelo h2, com a pílula", () => {
    const { container } = render(<Photos />);
    expect(container.querySelector("section#galeria")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Galeria de Fotos" })).toBeInTheDocument();
    expect(screen.getByText(photos.kicker)).toBeInTheDocument();
  });

  test("uma miniatura clicável por foto, com o alt da foto", () => {
    render(<Photos />);
    expect(thumbs()).toHaveLength(photos.items.length);
    expect(within(thumbs()[0]).getByRole("img", { name: photos.items[0].alt })).toBeInTheDocument();
  });

  test("clicar numa miniatura abre a foto ampliada", async () => {
    const user = userEvent.setup();
    render(<Photos />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(thumbs()[3]);
    const dialog = screen.getByRole("dialog", { name: "Foto ampliada" });
    expect(within(dialog).getByRole("img", { name: photos.items[3].alt })).toBeInTheDocument();
  });

  test("fecha pelo botão e clicando no fundo; clicar na foto não fecha", async () => {
    const user = userEvent.setup();
    render(<Photos />);

    await user.click(thumbs()[0]);
    await user.click(screen.getByRole("button", { name: "Fechar foto" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(thumbs()[0]);
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("img"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(dialog);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
