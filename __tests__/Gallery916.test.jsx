import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Work from "@/sections/Work/Work";
import Gallery916 from "@/components/Gallery916/Gallery916";
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

const cards = () => screen.getAllByRole("button", { name: /^(assistir|destacar):/i });
const activeCard = () => cards().find((c) => c.getAttribute("aria-pressed") === "true");
const counter = () => screen.getByText(/^\d{2} \/ \d{2}$/);
// O modal tem animação de saída (AnimatePresence): espera ele sair da página
const expectModalClosed = () => waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

beforeEach(() => mockBrowser());
afterEach(() => {
  vi.restoreAllMocks();
  delete window.matchMedia;
  delete window.IntersectionObserver;
});

describe("Galeria 9:16 na seção Trabalhos", () => {
  test("cabeçalho da galeria: kicker com a contagem, h2 e instrução; âncora #trabalhos", () => {
    const { container } = render(<Work />);
    const section = container.querySelector("section#trabalhos");
    expect(section).toHaveAttribute("aria-labelledby", "work-title");
    expect(screen.getByRole("heading", { level: 2, name: work.title })).toHaveAttribute("id", "work-title");
    expect(screen.getByText("Galeria · 06 vídeos")).toBeInTheDocument();
    // Instrução opcional: vazia em site.js, o parágrafo nem é criado
    if (work.lead) expect(screen.getByText(work.lead)).toBeInTheDocument();
  });

  test("sem texto de instrução, não sobra parágrafo vazio no cabeçalho", () => {
    const { container } = render(<Gallery916 items={work.items} kicker="Galeria" title="Título" lead="" />);
    expect(container.querySelector("h2 + p")).not.toBeInTheDocument();
  });

  test("6 cards; começa no 3º (índice 2) ativo", () => {
    render(<Work />);
    expect(cards()).toHaveLength(6);
    expect(activeCard()).toHaveAccessibleName(`Assistir: ${work.items[2].title}`);
    expect(screen.getByRole("button", { name: `Destacar: ${work.items[0].title}` })).toBeInTheDocument();
    expect(counter()).toHaveTextContent("03 / 06");
  });

  test("clicar num card inativo o destaca, sem abrir o player", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: `Destacar: ${work.items[0].title}` }));
    expect(activeCard()).toHaveAccessibleName(`Assistir: ${work.items[0].title}`);
    expect(counter()).toHaveTextContent("01 / 06");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("setas (com volta circular), dots e teclado mudam o card ativo", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: "Próximo" }));
    expect(counter()).toHaveTextContent("04 / 06");
    await user.click(screen.getByRole("button", { name: `Ir para ${work.items[0].title}` }));
    await user.click(screen.getByRole("button", { name: "Anterior" }));
    expect(counter()).toHaveTextContent("06 / 06");
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(counter()).toHaveTextContent("01 / 06");
  });

  test("setas do teclado dentro de um campo (ex.: barra do player) não mexem na galeria", () => {
    render(
      <>
        <Work />
        <input aria-label="Campo" />
      </>
    );
    fireEvent.keyDown(screen.getByLabelText("Campo"), { key: "ArrowRight" });
    expect(counter()).toHaveTextContent("03 / 06");
  });

  test("clicar no card ativo abre a moldura com o player do site (volume em 50%)", async () => {
    const user = userEvent.setup();
    render(<Work />);
    const item = work.items[2];

    await user.click(activeCard());
    const dialog = screen.getByRole("dialog", { name: `Vídeo: ${item.title}` });
    expect(within(dialog).getByText(`03 · ${item.kicker}`)).toBeInTheDocument();
    const video = dialog.querySelector("video");
    expect(video).toHaveAttribute("src", item.video);
    expect(video).toHaveAttribute("poster", item.image);
    expect(video.volume).toBe(0.5);
    // Controles do player do site (não os nativos)
    expect(video).not.toHaveAttribute("controls");
    expect(within(dialog).getByRole("slider", { name: /progresso/i })).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Fechar" })).toHaveFocus();
  });

  test("o modal fecha com X, Esc e clique no fundo; clicar no vídeo não fecha", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(activeCard());
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    await expectModalClosed();
    expect(activeCard()).toHaveFocus(); // foco volta ao card

    await user.click(activeCard());
    await user.keyboard("{Escape}");
    await expectModalClosed();

    await user.click(activeCard());
    await user.click(screen.getByRole("dialog").querySelector("video"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.click(screen.getByRole("dialog"));
    await expectModalClosed();
  });

  test("Esc com a barra de volume aberta fecha só a barra, não o modal", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(activeCard());
    fireEvent.loadedMetadata(screen.getByRole("dialog").querySelector("video"));
    await user.click(screen.getByRole("button", { name: /ajustar volume/i }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("slider", { name: /^volume$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("a seção Trabalhos não tem o deslize de entrada (a galeria tem a própria animação)", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("[data-revealed]")).not.toBeInTheDocument();
  });
});
