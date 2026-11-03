import { render, screen, within } from "@testing-library/react";
import Services from "@/sections/Services/Services";
import { services } from "@/content/site";

describe("Serviços", () => {
  test("âncora #servicos nomeada pelo h2, com pílula e texto de apoio", () => {
    const { container } = render(<Services />);
    expect(container.querySelector("section#servicos")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "O que eu resolvo e pra quem" })).toBeInTheDocument();
    expect(screen.getByText(services.kicker)).toBeInTheDocument();
    expect(screen.getByText(services.lead)).toBeInTheDocument();
  });

  test("3 cards, cada um com número, h3, 'Pra quem' e 'O que resolve'", () => {
    render(<Services />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(3);

    services.items.forEach((item, i) => {
      const card = within(cards[i]);
      expect(card.getByText(item.n)).toBeInTheDocument();
      expect(card.getByRole("heading", { level: 3, name: item.title })).toBeInTheDocument();
      expect(card.getByText("Pra quem")).toBeInTheDocument();
      expect(card.getByText(item.who)).toBeInTheDocument();
      expect(card.getByText("O que resolve")).toBeInTheDocument();
      expect(card.getByText(item.what)).toBeInTheDocument();
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

  test("rótulo e texto formam pares de definição (dt/dd)", () => {
    const { container } = render(<Services />);
    expect(container.querySelectorAll("dl")).toHaveLength(3);
    expect(container.querySelectorAll("dt")).toHaveLength(6);
    expect(container.querySelectorAll("dd")).toHaveLength(6);
  });
});
