import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoModal from "@/components/VideoModal/VideoModal";
import Work from "@/sections/Work/Work";
import Hero from "@/sections/Hero/Hero";

const ORIGIN = { left: 100, top: 400, width: 160, height: 284 };

// jsdom não tem Element.animate nem matchMedia: simulamos os dois
function mockMotion({ reduced = false } = {}) {
  const animate = vi.fn(() => ({ cancel: vi.fn(), finished: Promise.resolve() }));
  Element.prototype.animate = animate;
  window.matchMedia = vi.fn((query) => ({
    matches: reduced && query.includes("reduce"),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  return animate;
}

afterEach(() => {
  delete Element.prototype.animate;
  delete window.matchMedia;
});

describe("Transição de abertura do player", () => {
  test("com origem, anima do card até o centro em 240ms", () => {
    const animate = mockMotion();
    render(<VideoModal open title="Reel" originRect={ORIGIN} onClose={() => {}} />);

    expect(animate).toHaveBeenCalledTimes(1);
    const [keyframes, options] = animate.mock.calls[0];
    expect(keyframes[0].transform).toMatch(/translate\(.+\) scale\(.+\)/);
    expect(keyframes.at(-1).transform).toBe("none");
    expect(options.duration).toBe(240);
  });

  test("sem origem, abre direto no centro (sem animação)", () => {
    const animate = mockMotion();
    render(<VideoModal open title="Reel" onClose={() => {}} />);
    expect(animate).not.toHaveBeenCalled();
  });

  test("com prefers-reduced-motion, não anima", () => {
    const animate = mockMotion({ reduced: true });
    render(<VideoModal open title="Reel" originRect={ORIGIN} onClose={() => {}} />);
    expect(animate).not.toHaveBeenCalled();
  });

  test("clicar num card de Trabalhos dispara a transição a partir do card", async () => {
    const animate = mockMotion();
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel café bruma/i }));
    expect(screen.getByRole("dialog", { name: "Café Bruma" })).toBeInTheDocument();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  test("clicar no hero dispara a transição a partir do card do hero", async () => {
    const animate = mockMotion();
    const user = userEvent.setup();
    render(<Hero />);

    await user.click(screen.getByRole("heading", { level: 1 }));
    expect(screen.getByRole("dialog", { name: /showreel/i })).toBeInTheDocument();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  test("com spin, vira 360° no eixo vertical (Y), em 3D, durante o trajeto", () => {
    const animate = mockMotion();
    render(<VideoModal open spin title="Reel" originRect={ORIGIN} onClose={() => {}} />);

    const [keyframes, options] = animate.mock.calls[0];
    expect(keyframes[0].transform).toMatch(/^perspective\(.+\).*rotateY\(0deg\)$/);
    expect(keyframes.at(-1).transform).toMatch(/^perspective\(.+\).*rotateY\(360deg\)$/);
    expect(options.duration).toBe(600);
  });

  test("o fundo escurece no mesmo tempo da transição (600ms com giro)", () => {
    mockMotion();
    render(<VideoModal open spin title="Reel" originRect={ORIGIN} onClose={() => {}} />);
    expect(screen.getByRole("dialog").style.getPropertyValue("--modal-duration")).toBe("600ms");
  });

  test("cards de Trabalhos giram; o hero não", async () => {
    const animate = mockMotion();
    const user = userEvent.setup();
    const { unmount } = render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel atelier nó/i }));
    expect(animate.mock.calls[0][0].at(-1).transform).toMatch(/rotateY\(360deg\)/);
    unmount();

    animate.mockClear();
    render(<Hero />);
    await user.click(screen.getByRole("heading", { level: 1 }));
    expect(animate.mock.calls[0][0].at(-1).transform).not.toMatch(/rotate/);
  });
});
