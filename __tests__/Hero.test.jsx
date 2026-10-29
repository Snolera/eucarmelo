import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Hero from "@/sections/Hero/Hero";
import { hero } from "@/content/site";

// jsdom não implementa play/pause de <video>: espiões que só registram as chamadas
let play;
let pause;
beforeEach(() => {
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  delete window.matchMedia;
});

const backgroundVideo = (container) => container.querySelector("video[aria-hidden='true']");

describe("Hero", () => {
  test("mostra kicker e o h1 com a copy do design", () => {
    render(<Hero />);
    expect(screen.getByText("Direção / Roteiro / Montagem / Produção / Criação")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Filmes curtos para marcas que vivem no feed." })
    ).toBeInTheDocument();
  });

  test("o topo do card não tem nome nem @ (o @ fica só no botão do direct)", () => {
    render(<Hero />);
    expect(screen.queryByText("welinton.carmelo")).not.toBeInTheDocument();
    expect(screen.queryByText("@eucarmelo")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /@eucarmelo/ })).toBeInTheDocument();
  });

  test("CTA leva ao direct do Instagram", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: new RegExp(hero.cta, "i") });
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
    const cta = screen.getByRole("link", { name: new RegExp(hero.cta, "i") });
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

  // Botão "Assistir showreel" comentado no Hero.jsx (some no mobile e no desktop)
  test("o botão 'Assistir showreel' não aparece; o direct continua", () => {
    render(<Hero />);
    expect(screen.queryByRole("button", { name: /assistir showreel/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(hero.cta, "i") })).toBeInTheDocument();
  });

  // Para reativar junto com o botão:
  // test("'Assistir showreel' abre o player", async () => {
  //   const user = userEvent.setup();
  //   render(<Hero />);
  //
  //   expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  //   await user.click(screen.getByRole("button", { name: /assistir showreel/i }));
  //   expect(screen.getByRole("dialog", { name: /showreel/i })).toBeInTheDocument();
  // });

  test("o card mostra o showreel de fundo: sem som, em loop, tocando sozinho", () => {
    const { container } = render(<Hero />);
    const video = backgroundVideo(container);
    expect(video).toHaveAttribute("src", hero.showreel.src);
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    // O autoplay é pelo JS (respeita "reduzir movimento"); sem ele, o preload volta a valer
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("preload", "metadata");
    expect(play).toHaveBeenCalled();
  });

  test("com 'reduzir movimento', o vídeo de fundo fica parado", () => {
    window.matchMedia = (query) => ({ matches: query.includes("reduce"), media: query });
    render(<Hero />);
    expect(play).not.toHaveBeenCalled();
  });

  test("o player abre o mesmo vídeo do início, com som; o fundo pausa e volta ao fechar", async () => {
    const user = userEvent.setup();
    const { container } = render(<Hero />);
    play.mockClear();

    await user.click(screen.getByRole("heading", { level: 1 }));
    const dialog = screen.getByRole("dialog", { name: /showreel/i });
    const playerVideo = dialog.querySelector("video");
    expect(playerVideo).toHaveAttribute("src", hero.showreel.src);
    expect(playerVideo.muted).toBe(false);
    expect(playerVideo.currentTime).toBe(0);
    expect(pause.mock.contexts).toContain(backgroundVideo(container));

    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(play.mock.contexts).toContain(backgroundVideo(container));
  });
});
