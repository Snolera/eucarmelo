import { act, render, screen } from "@testing-library/react";
import Reveal from "@/components/Reveal/Reveal";
import Hero from "@/sections/Hero/Hero";
import Stats from "@/sections/Stats/Stats";
import Work from "@/sections/Work/Work";
import About from "@/sections/About/About";
import Footer from "@/sections/Footer/Footer";

// IntersectionObserver falso: guardamos o callback para simular a rolagem
let observers = [];
class FakeIO {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observe = vi.fn();
    this.disconnect = vi.fn();
    observers.push(this);
  }
}

const VIEWPORT = { height: 800 };
// Dispara o callback como se a seção estivesse com `ratio` visível ocupando `visibleHeight` px
const scrollTo = (ratio, visibleHeight) =>
  act(() => {
    observers.forEach((o) =>
      o.callback([
        {
          isIntersecting: ratio > 0,
          intersectionRatio: ratio,
          intersectionRect: { height: visibleHeight },
          rootBounds: VIEWPORT,
        },
      ])
    );
  });

const revealState = () => screen.getByTestId("reveal").getAttribute("data-revealed");

describe("Reveal (animação de entrada no scroll)", () => {
  beforeEach(() => {
    observers = [];
    window.IntersectionObserver = FakeIO;
  });

  afterEach(() => {
    delete window.IntersectionObserver;
  });

  test("começa escondido e revela com 60% da seção visível", () => {
    render(<Reveal data-testid="reveal">conteúdo</Reveal>);
    expect(revealState()).toBe("false");

    scrollTo(0.6, 300);
    expect(revealState()).toBe("true");
  });

  test("com menos de 60% visível, continua escondido", () => {
    render(<Reveal data-testid="reveal">conteúdo</Reveal>);
    scrollTo(0.3, 150);
    expect(revealState()).toBe("false");
  });

  test("seção mais alta que a tela revela quando ocupa 60% da tela", () => {
    render(<Reveal data-testid="reveal">conteúdo</Reveal>);
    // Só 40% da seção aparece, mas isso já ocupa 480px = 60% de 800px
    scrollTo(0.4, 480);
    expect(revealState()).toBe("true");
  });

  test("revela uma vez só: para de observar depois de aparecer", () => {
    render(<Reveal data-testid="reveal">conteúdo</Reveal>);
    scrollTo(0.6, 300);
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  test("sem IntersectionObserver (navegador antigo), mostra direto", () => {
    delete window.IntersectionObserver;
    render(<Reveal data-testid="reveal">conteúdo</Reveal>);
    expect(revealState()).toBe("true");
  });

  test("immediate (Hero): anima ao carregar só com CSS, sem esperar o observer", () => {
    render(
      <Reveal immediate data-testid="reveal">
        conteúdo
      </Reveal>
    );
    expect(revealState()).toBe("true");
    expect(screen.getByTestId("reveal").className).toMatch(/reveal--immediate/);
    expect(observers).toHaveLength(0);
  });

  test("Hero, Números, Trabalhos e Sobre têm a animação; o rodapé não", () => {
    const count = (ui) => render(ui).container.querySelectorAll("[data-revealed]").length;
    expect(count(<Hero />)).toBe(1);
    expect(count(<Stats />)).toBe(1);
    expect(count(<Work />)).toBe(1);
    expect(count(<About />)).toBe(1);
    expect(count(<Footer />)).toBe(0);
  });
});
