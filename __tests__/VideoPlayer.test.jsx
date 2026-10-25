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
