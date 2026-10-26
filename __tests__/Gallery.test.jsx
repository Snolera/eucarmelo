import { render, screen, waitFor, within } from "@testing-library/react";
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

// Testes com prefers-reduced-motion ficam em GalleryReducedMotion.test.jsx:
// o motion lê essa preferência uma vez por módulo, então precisam de arquivo próprio

afterEach(() => {
  delete window.matchMedia;
  delete Element.prototype.animate;
});

describe("Gallery (anel 3D de reels)", () => {
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
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(6);
    buttons.forEach((button) => expect(button).toHaveAccessibleName(/assistir reel/i));
  });

  test("anel com 6 cards: cada um a 60° do outro", () => {
    render(<Gallery items={work.items} />);
    const angles = screen.getAllByRole("listitem").map((li) => li.style.getPropertyValue("--angle"));
    expect(angles).toEqual(["0deg", "60deg", "120deg", "180deg", "240deg", "300deg"]);
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

  test("clicar num card abre o player daquele reel (sem giro)", async () => {
    const animate = vi.fn(() => ({ cancel: vi.fn() }));
    Element.prototype.animate = animate;
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel lume beauty/i }));
    const dialog = screen.getByRole("dialog", { name: "Lume Beauty" });
    expect(within(dialog).getByText(/vídeo em breve/i)).toBeInTheDocument();
    // Transição de 240ms do card até o centro, sem rotateY
    const [keyframes, options] = animate.mock.calls[0];
    expect(options.duration).toBe(240);
    expect(keyframes[0].transform).not.toMatch(/rotate/);
  });

  test("depois de fechar o player, o anel volta a girar sozinho", async () => {
    const user = userEvent.setup();
    const { container } = render(<Work />);
    const ring = container.querySelector("ul");

    await user.click(screen.getByRole("button", { name: /assistir reel café bruma/i }));
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    const closedAt = ring.style.transform;
    await waitFor(() => expect(ring.style.transform).not.toBe(closedAt), { timeout: 1000 });
  });

  test("fechar o player remove o diálogo", async () => {
    const user = userEvent.setup();
    render(<Work />);

    await user.click(screen.getByRole("button", { name: /assistir reel café bruma/i }));
    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
