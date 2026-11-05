import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Work from "@/sections/Work/Work";
import { work } from "@/content/site";
import { PREVIEW_SECONDS } from "@/hooks/usePreviewLoop";

// O Motion guarda "reduzir movimento" na 1ª leitura: mock controlável (igual ao ServicesTimeline.test)
const motionPrefs = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionPrefs.reduced,
}));

let play;
let pause;

// Sem IntersectionObserver a entrada da galeria é pulada (introDone = true) e o card conta como visível
beforeEach(() => {
  motionPrefs.reduced = false;
  delete window.IntersectionObserver;
  window.matchMedia = vi.fn((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});
afterEach(() => {
  vi.restoreAllMocks();
  delete window.matchMedia;
  delete window.IntersectionObserver;
});

const cards = () => screen.getAllByRole("article");
const previewOf = (i) => cards()[i].querySelector("video");

describe("Portfólio: prévia em autoplay no card em destaque", () => {
  test("só o card ativo tem vídeo: sem som, em loop, inline e decorativo, tocando pelo JS", () => {
    render(<Work />);
    const video = previewOf(2);

    expect(cards().filter((c) => c.querySelector("video"))).toHaveLength(1);
    expect(video).toHaveAttribute("src", work.items[2].video);
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute("loop");
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("aria-hidden", "true");
    expect(video).not.toHaveAttribute("autoplay");
    expect(play.mock.contexts).toContain(video);
  });

  test("os outros cards ficam só com a capa (nenhum vídeo baixado)", () => {
    render(<Work />);
    cards().forEach((card, i) => {
      if (i === 2) return;
      expect(card.querySelector("video")).not.toBeInTheDocument();
      expect(card.querySelector("img")).toBeInTheDocument();
    });
  });

  test("ao trocar de card, a prévia passa para o novo ativo e o anterior volta à capa", async () => {
    const user = userEvent.setup();
    render(<Work />);
    await user.click(screen.getByRole("button", { name: "Próximo" }));

    expect(previewOf(2)).not.toBeInTheDocument();
    expect(previewOf(3)).toHaveAttribute("src", work.items[3].video);
  });

  test(`a prévia toca só os ${PREVIEW_SECONDS} primeiros segundos e recomeça`, () => {
    render(<Work />);
    const video = previewOf(2);
    Object.defineProperty(video, "currentTime", { value: 4, writable: true });

    fireEvent.timeUpdate(video);
    expect(video.currentTime).toBe(4);

    video.currentTime = PREVIEW_SECONDS + 0.2;
    fireEvent.timeUpdate(video);
    expect(video.currentTime).toBe(0);
  });

  test("Assistir pausa a prévia e abre o player com o vídeo inteiro, do início", async () => {
    const user = userEvent.setup();
    render(<Work />);
    const preview = previewOf(2);
    pause.mockClear();

    await user.click(screen.getByRole("button", { name: `Assistir: ${work.items[2].title}` }));
    const player = screen.getByRole("dialog", { name: work.items[2].title }).querySelector("video");

    expect(pause.mock.contexts).toContain(preview);
    expect(player).toHaveAttribute("src", work.items[2].video);
    expect(player.currentTime).toBe(0);
    expect(within(screen.getByRole("dialog")).getByRole("slider", { name: /progresso/i })).toBeInTheDocument();
  });

  test("com 'reduzir movimento' nenhum card toca vídeo", () => {
    motionPrefs.reduced = true;
    render(<Work />);
    expect(document.querySelector("article video")).not.toBeInTheDocument();
  });

  test("antes da entrada da galeria terminar, nenhum card toca vídeo", () => {
    // Observer que nunca dispara: a entrada não termina
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    render(<Work />);
    expect(document.querySelector("article video")).not.toBeInTheDocument();
  });
});
