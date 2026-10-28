import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoModal from "@/components/VideoModal/VideoModal";
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

  test("clicar no hero dispara a transição a partir do card do hero", async () => {
    const animate = mockMotion();
    const user = userEvent.setup();
    render(<Hero />);

    await user.click(screen.getByRole("heading", { level: 1 }));
    expect(screen.getByRole("dialog", { name: /showreel/i })).toBeInTheDocument();
    expect(animate).toHaveBeenCalledTimes(1);
  });

  test("o fundo escurece no mesmo tempo da transição (240ms)", () => {
    mockMotion();
    render(<VideoModal open title="Reel" originRect={ORIGIN} onClose={() => {}} />);
    expect(screen.getByRole("dialog").style.getPropertyValue("--modal-duration")).toBe("240ms");
  });

  test("a transição não gira (sem rotate em nenhum quadro)", () => {
    const animate = mockMotion();
    render(<VideoModal open title="Reel" originRect={ORIGIN} onClose={() => {}} />);
    animate.mock.calls[0][0].forEach((frame) => expect(frame.transform).not.toMatch(/rotate/));
  });
});
