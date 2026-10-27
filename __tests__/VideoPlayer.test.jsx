import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";

describe("VideoPlayer", () => {
  beforeEach(() => {
    // jsdom não reproduz mídia: simulamos play/pause disparando os eventos nativos
    vi.spyOn(HTMLMediaElement.prototype, "paused", "get").mockImplementation(function paused() {
      return this.isPausedMock ?? true;
    });
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function play() {
      this.isPausedMock = false;
      this.dispatchEvent(new Event("play"));
      return Promise.resolve();
    });
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function pause() {
      this.isPausedMock = true;
      this.dispatchEvent(new Event("pause"));
    });
  });

  afterEach(() => vi.restoreAllMocks());

  test("o som começa em 50% do volume", () => {
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" autoPlay />);
    const video = container.querySelector("video");
    expect(video.volume).toBe(0.5);
    expect(video.muted).toBe(false);
  });

  // Vídeo carregado num navegador que deixa o site mudar o volume (desktop e Android)
  const renderLoaded = () => {
    const utils = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    const video = utils.container.querySelector("video");
    fireEvent.loadedMetadata(video);
    return { ...utils, video };
  };
  const volumeButton = () => screen.getByRole("button", { name: /ajustar volume/i });
  const volumeSlider = () => screen.queryByRole("slider", { name: /^volume$/i });

  test("clicar no ícone de som abre a barra de volume acima dele, em 50%", async () => {
    const user = userEvent.setup();
    renderLoaded();
    expect(volumeSlider()).not.toBeInTheDocument();
    expect(volumeButton()).toHaveAttribute("aria-expanded", "false");

    await user.click(volumeButton());
    expect(volumeButton()).toHaveAttribute("aria-expanded", "true");
    expect(volumeSlider()).toHaveValue("0.5");
    expect(volumeSlider()).toHaveAttribute("aria-valuetext", "50%");
    expect(volumeSlider()).toHaveFocus(); // teclado: setas já mudam o volume
  });

  test("a barra muda o volume do vídeo", async () => {
    const user = userEvent.setup();
    const { video } = renderLoaded();
    await user.click(volumeButton());

    fireEvent.change(volumeSlider(), { target: { value: "0.8" } });
    expect(video.volume).toBe(0.8);
    expect(volumeSlider()).toHaveAttribute("aria-valuetext", "80%");
  });

  test("volume em 0 silencia (ícone de mudo); subir o volume tira do mudo", async () => {
    const user = userEvent.setup();
    const { video } = renderLoaded();
    await user.click(volumeButton());

    fireEvent.change(volumeSlider(), { target: { value: "0" } });
    expect(video.muted).toBe(true);
    expect(volumeButton()).toHaveAttribute("data-muted", "true");

    fireEvent.change(volumeSlider(), { target: { value: "0.3" } });
    expect(video.muted).toBe(false);
    expect(video.volume).toBe(0.3);
  });

  test("a barra fecha com novo clique no ícone, com Esc ou clicando fora", async () => {
    const user = userEvent.setup();
    renderLoaded();

    await user.click(volumeButton());
    await user.click(volumeButton());
    expect(volumeSlider()).not.toBeInTheDocument();

    await user.click(volumeButton());
    await user.keyboard("{Escape}");
    expect(volumeSlider()).not.toBeInTheDocument();
    expect(volumeButton()).toHaveFocus();

    await user.click(volumeButton());
    await user.click(screen.getByText("0:00 / 0:00"));
    expect(volumeSlider()).not.toBeInTheDocument();
  });

  test("Esc com a barra aberta não fecha o player junto", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(
      <div onKeyDown={onKeyDown}>
        <VideoPlayer src="/reel.mp4" title="Showreel" />
      </div>
    );
    fireEvent.loadedMetadata(document.querySelector("video"));
    await user.click(volumeButton());
    await user.keyboard("{Escape}");
    expect(onKeyDown).not.toHaveBeenCalled();
  });

  test("onde o site não controla o volume (iPhone), o ícone só liga e desliga o som", async () => {
    // iOS: o volume é sempre o do aparelho; atribuir não tem efeito
    vi.spyOn(HTMLMediaElement.prototype, "volume", "set").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "volume", "get").mockReturnValue(1);
    const user = userEvent.setup();
    renderLoaded();

    expect(screen.queryByRole("button", { name: /ajustar volume/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /desativar som/i }));
    expect(screen.getByRole("button", { name: /ativar som/i })).toBeInTheDocument();
    expect(volumeSlider()).not.toBeInTheDocument();
  });

  test("sem vídeo mostra o estado vazio e desativa os controles", () => {
    render(<VideoPlayer title="Showreel" />);
    expect(screen.getByText(/vídeo em breve/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reproduzir/i })).toBeDisabled();
    expect(screen.getByRole("slider", { name: /progresso/i })).toBeDisabled();
  });

  test("com vídeo alterna entre reproduzir e pausar", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer src="/reel.mp4" title="Showreel" />);

    await user.click(screen.getByRole("button", { name: /reproduzir/i }));
    expect(screen.getByRole("button", { name: /pausar/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /pausar/i }));
    expect(screen.getByRole("button", { name: /reproduzir/i })).toBeInTheDocument();
  });

  test("mostra o tempo atual e a duração", () => {
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    const video = container.querySelector("video");

    Object.defineProperty(video, "duration", { value: 30, configurable: true });
    fireEvent.loadedMetadata(video);
    expect(screen.getByText("0:00 / 0:30")).toBeInTheDocument();
  });
});
