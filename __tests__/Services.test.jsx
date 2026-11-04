import { render, screen, within } from "@testing-library/react";
import Services from "@/sections/Services/Services";
import { services } from "@/content/site";
import { headingName } from "./helpers";

describe("Serviços", () => {
  test("âncora #servicos nomeada pelo h2, com pílula e texto de apoio", () => {
    const { container } = render(<Services />);
    expect(container.querySelector("section#servicos")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: headingName(services.title) })).toBeInTheDocument();
    expect(screen.getByText(services.kicker)).toBeInTheDocument();
    expect(screen.getByText(services.lead)).toBeInTheDocument();
  });

  test("3 cards, cada um começando pelo h3 (sem número antes)", () => {
    render(<Services />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);

    services.items.forEach((item, i) => {
      const card = within(cards[i]);
      expect(cards[i].firstElementChild).toBe(card.getByRole("heading", { level: 3, name: item.title }));
      if (item.text) expect(card.getByText(item.text)).toBeInTheDocument();
    });
  });

  test("linha do tempo: lista ordenada, cada passo com marcador decorativo e o card", () => {
    render(<Services />);
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps).toHaveLength(services.items.length);

    steps.forEach((step) => {
      const marker = step.querySelector("[data-timeline-marker]");
      expect(marker).toHaveAttribute("aria-hidden", "true"); // ponto e linha não vão para o leitor de tela
      expect(within(step).getByRole("article")).toBeInTheDocument();
    });
  });
});
