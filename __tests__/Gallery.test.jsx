import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "@/components/Gallery/Gallery";
import Work from "@/sections/Work/Work";
import { work } from "@/content/site";

// jsdom não implementa matchMedia (usado pelo useReducedMotion do motion)
function mockMatchMedia(reduced = false) {
  window.matchMedia = vi.fn((query) => ({
    matches: reduced && query.includes("reduce"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
}

const activeButton = () => screen.getAllByRole("button").find((b) => b.getAttribute("aria-current") === "true");

afterEach(() => {
  delete window.matchMedia;
  delete Element.prototype.animate;
});

describe("Gallery (coverflow de reels)", () => {
  beforeEach(() => mockMatchMedia());

  test("renderiza os 6 reels com cliente (h3) e categoria", () => {
    render(<Gallery items={work.items} />);
    expect(work.items).toHaveLength(6);
    expect(screen.getAllByRole("listitem")).toHaveLength(6);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(6);
    expect(screen.getByRole("heading", { level: 3, name: "Loja Verso" })).toBeInTheDocument();
    expect(screen.getByText("Beleza")).toBeInTheDocument();
  });

  test("sem botões de controle: os únicos botões são os 6 cards", () => {
    render(<Gallery items={work.items} />);
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  test("abre no card do meio (03): só ele é o card ativo e recebe Tab", () => {
    render(<Gallery items={work.items} />);
    const active = activeButton();
    expect(active).toHaveAccessibleName(/assistir reel studio vila/i);
    const tabbable = screen.getAllByRole("button").filter((b) => b.tabIndex === 0);
    expect(tabbable).toEqual([active]);
  });

  test("clicar num card lateral o traz para o centro, sem abrir o player", async () => {
    const user = userEvent.setup();
    render(<Gallery items={work.items} />);

    await user.click(screen.getByRole("button", { name: /mostrar reel café bruma/i }));
    expect(activeButton()).toHaveAccessibleName(/assistir reel café bruma/i);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("setas, Home e End trocam o card ativo e levam o foco junto", async () => {
    const user = userEvent.setup();
    render(<Gallery items={work.items} />);

    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(activeButton()).toHaveAccessibleName(/festival aurora/i);
    expect(activeButton()).toHaveFocus();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(activeButton()).toHaveAccessibleName(/atelier nó/i);
    await user.keyboard("{End}");
    expect(activeButton()).toHaveAccessibleName(/lume beauty/i);
    await user.keyboard("{ArrowRight}"); // não passa do último
    expect(activeButton()).toHaveAccessibleName(/lume beauty/i);
    await user.keyboard("{Home}");
    expect(activeButton()).toHaveAccessibleName(/café bruma/i);
    expect(activeButton()).toHaveFocus();
  });
});

describe("Gallery na seção Trabalhos", () => {
  beforeEach(() => mockMatchMedia());

  test("a seção mantém kicker, h2 e âncora", () => {
    const { container } = render(<Work />);
    expect(container.querySelector("section#trabalhos")).toBeInTheDocument();
    expect(screen.getByText("Reels para marcas")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Trabalhos selecionados" })).toBeInTheDocument();
  });

  test("clicar no card central abre o player daquele reel (sem giro)", async () => {
    const animate = vi.fn(() => ({ cancel: vi.fn() }));
    Element.prototype.animate = animate;
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel studio vila/i }));
    const dialog = screen.getByRole("dialog", { name: "Studio Vila" });
    expect(within(dialog).getByText(/vídeo em breve/i)).toBeInTheDocument();
    // Transição de 240ms do card até o centro, sem rotateY
    const [keyframes, options] = animate.mock.calls[0];
    expect(options.duration).toBe(240);
    expect(keyframes[0].transform).not.toMatch(/rotate/);
  });

  test("Enter no card ativo abre o player; fechar remove o diálogo", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.tab();
    await user.keyboard("{ArrowLeft}{Enter}");
    expect(screen.getByRole("dialog", { name: "Atelier Nó" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
