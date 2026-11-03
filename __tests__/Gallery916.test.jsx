import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Work from "@/sections/Work/Work";
import { work } from "@/content/site";

// jsdom não tem matchMedia nem IntersectionObserver. Com "reduzir movimento" a galeria
// pula a entrada (queda + leque) e já fica interativa
function mockBrowser({ reduced = true } = {}) {
  window.matchMedia = vi.fn((query) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
}

const cards = () => screen.getAllByRole("article");
const activeCard = () => cards().find((c) => c.getAttribute("aria-current") === "true");
const activeIs = (i) => expect(activeCard()).toHaveAccessibleName(work.items[i].title);
const watch = (i) => screen.getByRole("button", { name: `Assistir: ${work.items[i].title}` });

beforeEach(() => mockBrowser());
afterEach(() => {
  vi.restoreAllMocks();
  delete window.matchMedia;
  delete window.IntersectionObserver;
});

describe("Portfólio (Gallery916 em leque) na seção Trabalhos", () => {
  test("âncora #trabalhos nomeada pelo h2, com a pílula do kicker", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("section#trabalhos")).toHaveAttribute("aria-labelledby", "work-title");
    expect(screen.getByRole("heading", { level: 2, name: "Por trás de cada projeto" })).toHaveAttribute("id", "work-title");
    expect(screen.getByText(work.kicker)).toBeInTheDocument();
  });

  test("6 cards; começa no 3º (índice 2) ativo", () => {
    render(<Work />);
    expect(cards()).toHaveLength(6);
    activeIs(2);
  });

  test("card: título (h3), ano, descrição, tag, duração e botão Assistir", () => {
    render(<Work />);
    const item = work.items[0];
    const card = cards()[0];
    expect(within(card).getByRole("heading", { level: 3, name: item.title })).toBeInTheDocument();
    expect(within(card).getByRole("img", { name: item.alt })).toBeInTheDocument();
    [item.year, item.desc, item.tag, item.duration].forEach((text) =>
      expect(within(card).getByText(text)).toBeInTheDocument()
    );
    expect(within(card).getByRole("button", { name: `Assistir: ${item.title}` })).toBeInTheDocument();
  });

  test("os vizinhos não são escurecidos: nenhum card tem camada de sombra", () => {
    render(<Work />);
    cards().forEach((card) => {
      expect(card.style.getPropertyValue("--shade")).toBe("");
      expect(card.querySelector("[class*='cardShade']")).toBeNull();
    });
  });

  test("só o Assistir do card ativo entra no Tab", () => {
    render(<Work />);
    expect(watch(2)).not.toHaveAttribute("tabindex", "-1");
    expect(watch(0)).toHaveAttribute("tabindex", "-1");
  });

  test("clicar num card inativo (inclusive no Assistir dele) o destaca, sem abrir o player", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(cards()[0]);
    activeIs(0);
    await user.click(watch(1));
    activeIs(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("setas (com volta circular) e teclado mudam o card ativo", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: "Próximo" }));
    activeIs(3);
    await user.click(cards()[0]);
    await user.click(screen.getByRole("button", { name: "Anterior" }));
    activeIs(5);
    fireEvent.keyDown(window, { key: "ArrowRight" });
    activeIs(0);
  });

  test("setas do teclado dentro de um campo não mexem na galeria", () => {
    render(
      <>
        <Work />
        <input aria-label="Campo" />
      </>
    );
    fireEvent.keyDown(screen.getByLabelText("Campo"), { key: "ArrowRight" });
    activeIs(2);
  });

  test("arrastar o dedo para a esquerda avança; para a direita volta (mínimo de 40px)", () => {
    const { container } = render(<Work />);
    const stage = container.querySelector("[aria-roledescription='carrossel']");
    const swipe = (from, to) => {
      fireEvent.touchStart(stage, { touches: [{ clientX: from }] });
      fireEvent.touchEnd(stage, { changedTouches: [{ clientX: to }] });
    };

    swipe(200, 100);
    activeIs(3);
    swipe(100, 200);
    activeIs(2);
    swipe(100, 80); // 20px: não conta
    activeIs(2);
  });

  test("bolinhas de posição: uma por card, decorativas, com a ativa marcada", () => {
    const { container } = render(<Work />);
    const dots = container.querySelectorAll("[data-dot]");
    expect(dots).toHaveLength(6);
    expect(dots[0].closest("[aria-hidden='true']")).toBeInTheDocument();
    expect(dots[2]).toHaveAttribute("data-active", "true");
  });

  test("Assistir no card ativo abre o player do showreel com o vídeo do projeto", async () => {
    const user = userEvent.setup();
    render(<Work />);
    const item = work.items[2];

    await user.click(watch(2));
    const dialog = screen.getByRole("dialog", { name: item.title });
    const video = dialog.querySelector("video");
    expect(video).toHaveAttribute("src", item.video);
    expect(video).toHaveAttribute("poster", item.image);
    expect(video.volume).toBe(0.5);
    expect(within(dialog).getByRole("slider", { name: /progresso/i })).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: /fechar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("com o player aberto, as setas do teclado não trocam o card", async () => {
    const user = userEvent.setup();
    render(<Work />);
    await user.click(watch(2));
    fireEvent.keyDown(window, { key: "ArrowRight" });
    activeIs(2);
  });

  test("a seção Trabalhos não tem o deslize de entrada (a galeria tem a própria animação)", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("[data-revealed]")).not.toBeInTheDocument();
  });
});
