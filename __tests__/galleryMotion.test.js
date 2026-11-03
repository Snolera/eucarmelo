import { FAN, getFanState, toTransform } from "@/components/Gallery916/motion-config";

// O Motion só acelera na GPU (WAAPI) a propriedade `transform` inteira; x/y/scale soltos
// rodam em JS, quadro a quadro, e engasgam no celular
describe("posições do leque como transform (animação na GPU)", () => {
  test("toTransform monta translate + scale numa string só", () => {
    expect(toTransform({ x: -150, y: 20, scale: 0.66 })).toBe("translateX(-150px) translateY(20px) scale(0.66)");
  });

  test("getFanState devolve transform, opacity e zIndex (sem x/y/scale soltos)", () => {
    expect(getFanState(1, FAN.desktop)).toEqual({
      transform: "translateX(215px) translateY(0px) scale(0.84)",
      opacity: 1,
      zIndex: 19,
    });
    expect(getFanState(-3, FAN.mobile)).toEqual({
      transform: "translateX(-180px) translateY(0px) scale(0.56)",
      opacity: 0,
      zIndex: 17,
    });
  });

  test("o card ativo fica no centro, em tamanho cheio", () => {
    expect(getFanState(0, FAN.desktop).transform).toBe("translateX(0px) translateY(0px) scale(1)");
  });
});
