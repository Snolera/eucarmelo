import { act, render, screen, within } from "@testing-library/react";
import Services from "@/sections/Services/Services";
import { services } from "@/content/site";
import { FIRST_DELAY, STAGGER } from "@/hooks/useTimelineReveal";
import { capFraction } from "@/hooks/useTimelineLine";

// "Reduzir movimento" controlado pelo teste (o Motion guarda a preferência na 1ª leitura)
const motionPrefs = vi.hoisted(() => ({ reduced: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionPrefs.reduced,
}));

// IntersectionObserver falso: guarda callback, opções e elementos observados
let observers = [];
class FakeIO {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    this.observe = vi.fn((el) => this.targets.push(el));
    this.disconnect = vi.fn();
    observers.push(this);
  }
}

const READING_LINE_BOTTOM = 640; // 80% de uma tela de 800px
const headingObserver = () => observers.find((o) => !o.options.rootMargin);
const dotsObserver = () => observers.find((o) => o.options.rootMargin);

// Cabeçalho 100% visível
const revealHeading = () =>
  act(() =>
    headingObserver().callback([
      { intersectionRatio: 1, intersectionRect: { height: 200 }, rootBounds: { height: 800 } },
    ])
  );

// Os `n` primeiros pontos cruzaram a linha de leitura (o 1º pode já estar acima da tela)
const crossDots = (n) =>
  act(() =>
    dotsObserver().callback(
      dotsObserver().targets.slice(0, n).map((target, i) => ({
        target,
        isIntersecting: i > 0,
        boundingClientRect: { top: i === 0 ? -50 : 500 + i },
        rootBounds: { bottom: READING_LINE_BOTTOM },
      }))
    )
  );

const advance = (ms) => act(() => vi.advanceTimersByTime(ms));
const steps = () => within(screen.getByRole("list")).getAllByRole("listitem");
const shown = () => steps().map((s) => s.getAttribute("data-shown"));
const timeline = () => screen.getByRole("list").parentElement;

describe("Serviços: linha do tempo animada", () => {
  beforeEach(() => {
    observers = [];
    vi.useFakeTimers();
    motionPrefs.reduced = false;
    window.IntersectionObserver = FakeIO;
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.IntersectionObserver;
  });

  test("a caixa não anima: só o cabeçalho usa o Reveal", () => {
    const { container } = render(<Services />);
    expect(container.querySelectorAll("[data-revealed]")).toHaveLength(1);
    expect(container.querySelector("[data-revealed]")).toContainElement(
      screen.getByRole("heading", { level: 2 })
    );
  });

  test("cards começam escondidos e o 1º só entra depois do cabeçalho", () => {
    render(<Services />);
    expect(shown()).toEqual(["false", "false", "false"]);
    expect(timeline()).toHaveAttribute("data-active", "false");

    crossDots(1); // ponto passou da linha, mas o cabeçalho ainda não entrou
    advance(1000);
    expect(shown()).toEqual(["false", "false", "false"]);

    revealHeading();
    advance(FIRST_DELAY - 1);
    expect(shown()[0]).toBe("false");
    advance(1);
    expect(shown()).toEqual(["true", "false", "false"]);
    expect(timeline()).toHaveAttribute("data-active", "true");
  });

  test("pontos que já passaram da linha (âncora #servicos) entram em cascata", () => {
    render(<Services />);
    revealHeading();
    crossDots(3);

    advance(FIRST_DELAY);
    expect(shown()).toEqual(["true", "false", "false"]);
    advance(STAGGER);
    expect(shown()).toEqual(["true", "true", "false"]);
    advance(STAGGER);
    expect(shown()).toEqual(["true", "true", "true"]);
    expect(dotsObserver().disconnect).toHaveBeenCalled();
  });

  test("ponto abaixo da linha de leitura não revela", () => {
    render(<Services />);
    revealHeading();
    act(() =>
      dotsObserver().callback([
        { target: dotsObserver().targets[0], isIntersecting: false, boundingClientRect: { top: 700 }, rootBounds: { bottom: READING_LINE_BOTTOM } },
      ])
    );
    advance(1000);
    expect(shown()[0]).toBe("false");
  });

  test("uma vez só: subir a tela não esconde o card", () => {
    render(<Services />);
    revealHeading();
    crossDots(1);
    advance(FIRST_DELAY);
    act(() =>
      dotsObserver().callback([
        { target: dotsObserver().targets[0], isIntersecting: false, boundingClientRect: { top: 900 }, rootBounds: { bottom: READING_LINE_BOTTOM } },
      ])
    );
    advance(1000);
    expect(shown()[0]).toBe("true");
  });

  // Desktop: o CSS atrasa linha, ponto e card de cada passo por --i × 250ms
  test("cada passo expõe a própria posição (--i) para o atraso do desktop", () => {
    render(<Services />);
    steps().forEach((step, i) => expect(step.style.getPropertyValue("--i")).toBe(String(i)));
  });

  test("reduzir movimento: tudo visível, sem esperar o scroll", () => {
    motionPrefs.reduced = true;
    render(<Services />);
    expect(shown()).toEqual(["true", "true", "true"]);
  });

  test("sem IntersectionObserver: tudo visível", () => {
    delete window.IntersectionObserver;
    render(<Services />);
    expect(shown()).toEqual(["true", "true", "true"]);
  });
});

describe("capFraction (até onde a linha pode ir)", () => {
  const box = (top, height) => ({ getBoundingClientRect: () => ({ top, height }) });
  const track = box(100, 400); // linha de 100px a 500px na tela
  const dots = [box(94.5, 11), box(294.5, 11), box(394.5, 11)]; // centros em 100, 300 e 400

  test("vai até o centro do próximo ponto ainda apagado", () => {
    expect(capFraction(track, dots, 0)).toBe(0);
    expect(capFraction(track, dots, 1)).toBe(0.5);
    expect(capFraction(track, dots, 2)).toBe(0.75);
  });

  test("com todos os pontos acesos, a linha pode chegar ao fim", () => {
    expect(capFraction(track, dots, 3)).toBe(1);
  });
});
