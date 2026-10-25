// Matchers extras do jest-dom (toBeInTheDocument, toHaveAttribute...)
import "@testing-library/jest-dom/vitest";

// jsdom não implementa <dialog>.showModal/close: polyfill mínimo para os testes
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}
