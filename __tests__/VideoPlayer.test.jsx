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

  test("controle de volume: começa em 50% e muda o volume do vídeo", () => {
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    const video = container.querySelector("video");
    fireEvent.loadedMetadata(video);

    const slider = screen.getByRole("slider", { name: /volume/i });
    expect(slider).toHaveValue("0.5");
    expect(slider).toHaveAttribute("aria-valuetext", "50%");

    fireEvent.change(slider, { target: { value: "0.8" } });
    expect(video.volume).toBe(0.8);
    expect(screen.getByRole("slider", { name: /volume/i })).toHaveAttribute("aria-valuetext", "80%");
  });

  test("volume em 0 silencia; subir o volume tira do mudo", () => {
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    const video = container.querySelector("video");
    fireEvent.loadedMetadata(video);
    const slider = () => screen.getByRole("slider", { name: /volume/i });

    fireEvent.change(slider(), { target: { value: "0" } });
    expect(video.muted).toBe(true);
    expect(screen.getByRole("button", { name: /ativar som/i })).toBeInTheDocument();

    fireEvent.change(slider(), { target: { value: "0.3" } });
    expect(video.muted).toBe(false);
    expect(video.volume).toBe(0.3);
  });

  test("no mudo, o controle de volume mostra 0", async () => {
    const user = userEvent.setup();
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    fireEvent.loadedMetadata(container.querySelector("video"));

    await user.click(screen.getByRole("button", { name: /desativar som/i }));
    expect(screen.getByRole("slider", { name: /volume/i })).toHaveValue("0");
  });

  test("onde o site não controla o volume (iPhone), o controle não aparece", () => {
    // iOS: o volume é sempre o do aparelho; atribuir não tem efeito
    vi.spyOn(HTMLMediaElement.prototype, "volume", "set").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "volume", "get").mockReturnValue(1);
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    fireEvent.loadedMetadata(container.querySelector("video"));

    expect(screen.queryByRole("slider", { name: /volume/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /desativar som/i })).toBeInTheDocument();
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

  test("botão de som alterna entre ativar e desativar", async () => {
    const user = userEvent.setup();
    render(<VideoPlayer src="/reel.mp4" title="Showreel" />);

    await user.click(screen.getByRole("button", { name: /desativar som/i }));
    expect(screen.getByRole("button", { name: /ativar som/i })).toBeInTheDocument();
  });

  test("mostra o tempo atual e a duração", () => {
    const { container } = render(<VideoPlayer src="/reel.mp4" title="Showreel" />);
    const video = container.querySelector("video");

    Object.defineProperty(video, "duration", { value: 30, configurable: true });
    fireEvent.loadedMetadata(video);
    expect(screen.getByText("0:00 / 0:30")).toBeInTheDocument();
  });
});
