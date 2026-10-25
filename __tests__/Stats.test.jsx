import { render, screen, within } from "@testing-library/react";
import Stats from "@/sections/Stats/Stats";

describe("Stats", () => {
  test("mostra os 3 números com seus rótulos (uma vez para leitores de tela)", () => {
    render(<Stats />);
    const section = screen.getByRole("region", { name: /números/i });
    const items = within(section).getAllByRole("listitem");

    expect(items).toHaveLength(3);
    expect(within(items[0]).getByText("30M")).toBeInTheDocument();
    expect(within(items[0]).getByText("visualizações geradas")).toBeInTheDocument();
    expect(within(items[1]).getByText("250+")).toBeInTheDocument();
    expect(within(items[2]).getByText("marcas atendidas")).toBeInTheDocument();
  });

  test("faixa animada sem repetição: uma única lista, sem cópias", () => {
    const { container } = render(<Stats />);
    expect(container.querySelectorAll("ul")).toHaveLength(1);
    expect(container.querySelectorAll("li")).toHaveLength(3);
    expect(container.querySelector("[aria-hidden]")).toBeNull();
  });
});
