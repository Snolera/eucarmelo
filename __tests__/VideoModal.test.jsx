import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import VideoModal from "@/components/VideoModal/VideoModal";

describe("VideoModal", () => {
  test("aberto, mostra o diálogo com título e player", () => {
    render(<VideoModal open title="Showreel" onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Showreel" })).toBeInTheDocument();
    expect(screen.getByText(/vídeo em breve/i)).toBeInTheDocument();
  });

  test("fechado, não renderiza o player", () => {
    render(<VideoModal open={false} title="Showreel" onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText(/vídeo em breve/i)).not.toBeInTheDocument();
  });

  test("botão fechar chama onClose", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<VideoModal open title="Showreel" onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /fechar/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
