import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Photos from "@/sections/Photos/Photos";
import { photos } from "@/content/site";
import { headingName } from "./helpers";

const thumbs = () => screen.getAllByRole("button", { name: /^ampliar:/i });

describe("Galeria de Fotos", () => {
  test("âncora #galeria nomeada pelo h2, com a pílula e o texto de apoio", () => {
    const { container } = render(<Photos />);
    expect(container.querySelector("section#galeria")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: headingName(photos.title) })).toBeInTheDocument();
    expect(screen.getByText(photos.kicker)).toBeInTheDocument();
    expect(screen.getByText(photos.lead)).toBeInTheDocument();
  });

  test("uma miniatura clicável por foto, com o alt da foto", () => {
    render(<Photos />);
    expect(thumbs()).toHaveLength(photos.items.length);
    expect(within(thumbs()[0]).getByRole("img", { name: photos.items[0].alt })).toBeInTheDocument();
  });

  test("fotos são imports locais: dimensões e blur vêm do arquivo", () => {
    photos.items.forEach(({ image }) =>
      expect(image).toEqual(expect.objectContaining({ width: expect.any(Number), height: expect.any(Number), blurDataURL: expect.stringMatching(/^data:image/) }))
    );
  });

  test("miniatura mostra a versão borrada enquanto carrega", () => {
    render(<Photos />);
    const img = within(thumbs()[0]).getByRole("img");
    expect(img.getAttribute("style")).toMatch(/background-image:.*data:image/);
  });

  test("foto ampliada usa a proporção real do arquivo", async () => {
    const user = userEvent.setup();
    render(<Photos />);
    const { image, alt } = photos.items[4];

    await user.click(thumbs()[4]);
    const img = within(screen.getByRole("dialog")).getByRole("img", { name: alt });
    expect(img).toHaveAttribute("width", String(image.width));
    expect(img).toHaveAttribute("height", String(image.height));
  });

  test("foto ampliada mostra o alt como legenda (figure + figcaption)", async () => {
    const user = userEvent.setup();
    render(<Photos />);
    const { alt } = photos.items[2];

    await user.click(thumbs()[2]);
    // jsdom não nomeia o figure pelo figcaption (navegadores sim): checa a estrutura direto
    const figure = within(screen.getByRole("dialog")).getByRole("figure");
    expect(within(figure).getByRole("img", { name: alt })).toBeInTheDocument();
    expect(figure.querySelector("figcaption")).toHaveTextContent(alt);
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
