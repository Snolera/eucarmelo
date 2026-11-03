import { act, render, screen } from "@testing-library/react";
import Reveal from "@/components/Reveal/Reveal";
import Hero from "@/sections/Hero/Hero";
import Stats from "@/sections/Stats/Stats";
import Work from "@/sections/Work/Work";
import Services from "@/sections/Services/Services";
import About from "@/sections/About/About";
import Photos from "@/sections/Photos/Photos";
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

  test("onReveal avisa uma vez quando revela (ex.: cards dos Serviços esperam o cabeçalho)", () => {
    const onReveal = vi.fn();
    render(
      <Reveal data-testid="reveal" onReveal={onReveal}>
        conteúdo
      </Reveal>
    );
    expect(onReveal).not.toHaveBeenCalled();
    scrollTo(0.6, 300);
    scrollTo(0.8, 400);
    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("reveal")).not.toHaveAttribute("onReveal");
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

  // A caixa escura (fundo) fica parada; só o conteúdo de dentro entra
  test.each([
    ["Números", Stats],
    ["Serviços", Services],
    ["Sobre", About],
    ["Fotos", Photos],
  ])("%s: anima o conteúdo, não a caixa", (_, Section) => {
    const { container } = render(<Section />);
    const box = container.firstElementChild.firstElementChild; // section > caixa escura
    expect(box).not.toHaveAttribute("data-revealed");
    expect(box.firstElementChild).toHaveAttribute("data-revealed");
  });

  test("Hero: o card com o vídeo fica parado; só texto e botão entram", () => {
    const { container } = render(<Hero />);
    const reveal = container.querySelector("[data-revealed]");
    expect(reveal).toContainElement(screen.getByRole("heading", { level: 1 }));
    expect(reveal).toContainElement(screen.getByRole("link", { name: /fale comigo/i }));
    expect(reveal.querySelector("video")).toBeNull();
    expect(reveal.parentElement.querySelector(":scope > video")).toBeInTheDocument();
  });

  // Trabalhos não desliza: a galeria tem a própria entrada (queda + leque)
  test("Hero, Números, Serviços, Sobre e Fotos têm a animação; Trabalhos e o rodapé não", () => {
    const count = (ui) => render(ui).container.querySelectorAll("[data-revealed]").length;
    expect(count(<Hero />)).toBe(1);
    expect(count(<Stats />)).toBe(1);
    expect(count(<Work />)).toBe(0);
    expect(count(<Services />)).toBe(1);
    expect(count(<About />)).toBe(1);
    expect(count(<Photos />)).toBe(1);
    expect(count(<Footer />)).toBe(0);
  });
});
