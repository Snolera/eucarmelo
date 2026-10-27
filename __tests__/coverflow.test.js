import { getCardPose, getMiddleIndex, getSwipeSteps } from "@/lib/coverflow";

describe("coverflow (regras puras)", () => {
  test("começa no card do meio", () => {
    expect(getMiddleIndex(6)).toBe(2); // 3º card
    expect(getMiddleIndex(7)).toBe(3);
    expect(getMiddleIndex(0)).toBe(0);
  });

  test("card central fica reto, em escala 1", () => {
    expect(getCardPose(0)).toEqual({ x: "0%", rotateY: 0, scale: 1, opacity: 1 });
  });

  test("cards laterais giram para dentro e diminuem com a distância", () => {
    expect(getCardPose(1)).toMatchObject({ x: "58%", rotateY: -45, scale: 0.82 });
    expect(getCardPose(-2)).toMatchObject({ x: "-88%", rotateY: 45 });
    expect(getCardPose(-2).scale).toBeCloseTo(0.74);
    expect(getCardPose(4).opacity).toBe(0); // além dos 3 visíveis de cada lado
  });

  test("arraste curto não troca de card; longo anda no máximo 2", () => {
    expect(getSwipeSteps(20, 0, 300)).toBe(0);
    expect(getSwipeSteps(-200, 0, 300)).toBe(1); // arrastar para a esquerda avança
    expect(getSwipeSteps(200, 0, 300)).toBe(-1);
    expect(getSwipeSteps(-2000, -3000, 300)).toBe(2);
  });
});
