import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Gallery from "@/components/Gallery/Gallery";
import { work } from "@/content/site";

// Arquivo próprio: o useReducedMotion do motion lê a preferência uma vez por módulo
// "Reduzir movimento" ativo desde o início (antes do 1º render)
window.matchMedia = (query) => ({
  matches: query.includes("reduce"),
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
});

const ringTransform = (container) => container.querySelector("ul").style.transform;

describe("Gallery com prefers-reduced-motion", () => {
  test("focar um card pelo teclado gira o anel até ele, sem animação", async () => {
    const user = userEvent.setup();
    const { container } = render(<Gallery items={work.items} />);

    // 1º Tab = card 01, 2º Tab = card 02
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: /assistir reel atelier nó/i })).toHaveFocus();
    expect(ringTransform(container)).toMatch(/rotateY\(-60deg\)/);
  });
});
