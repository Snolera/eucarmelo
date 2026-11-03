// ---- Leque (coverflow): por distância até o card ativo (0 = ativo, 1 = vizinho...) ----
// x: deslocamento em px a partir do centro; scale: tamanho
// Do 3º vizinho em diante o card some (opacity 0); o tamanho do card fica no CSS
export const FAN = {
  desktop: { x: [0, 215, 385, 520], scale: [1, 0.84, 0.7, 0.6] },
  mobile: { x: [0, 96, 150, 180], scale: [1, 0.82, 0.66, 0.56] },
};
export const VISIBLE_RANGE = 2; // vizinhos visíveis de cada lado
export const SWIPE_MIN = 40; // px de arraste para trocar de card

// ---- Entrada em duas fases (queda → pausa empilhado → leque) ----
export const DROP_DISTANCE = 520; // px acima do centro de onde os cards caem
export const DROP_STAGGER = 0.08; // s entre cada card na queda
export const STACK_HOLD_MS = 500; // pausa com os cards empilhados
export const FAN_STAGGER = 0.06; // s entre cada "anel" do leque, a partir do centro
// Fração do palco que precisa estar visível; 0.99 evita arredondamento subpixel do threshold 1.
export const FULL_VIEW = 0.99;
export const MIN_VIEW = 0.5; // limite inferior quando o palco é mais alto que a tela

export const SPRING = { type: "spring", stiffness: 260, damping: 28, mass: 0.9 };
export const DROP_SPRING = { type: "spring", stiffness: 210, damping: 24, mass: 1 };
export const FAN_SPRING = { type: "spring", stiffness: 170, damping: 22, mass: 0.9 };

export const MOBILE_QUERY = "(max-width: 767px)";

// Distância circular com sinal: com 6 cards e o ativo no 0, o card 5 está a -1 (à esquerda)
export function circularDistance(index, active, count) {
  let d = (((index - active) % count) + count) % count;
  if (d > count / 2) d -= count;
  return d;
}

// Posição final de um card no leque (valores numéricos: o Motion anima entre eles)
export function getFanState(distance, fan) {
  const abs = Math.abs(distance);
  const step = Math.min(abs, fan.x.length - 1);
  return {
    x: fan.x[step] * Math.sign(distance),
    y: 0,
    scale: fan.scale[step],
    opacity: abs > VISIBLE_RANGE ? 0 : 1,
    zIndex: 20 - abs,
  };
}
