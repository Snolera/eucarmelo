// Regras do coverflow: funções puras, sem React, fáceis de ajustar e testar

export const VISIBLE_SIDE = 3; // cards visíveis de cada lado do central

const SWIPE_MIN_DISTANCE = 40; // arraste mínimo (px) para trocar de card
const SWIPE_MAX_SKIP = 2; // máximo de cards pulados por gesto
const SWIPE_STEP_RATIO = 0.6; // fração da largura do card que vale 1 passo
const VELOCITY_PROJECTION = 0.25; // peso da velocidade: gesto rápido anda mais

export const spring = { type: "spring", stiffness: 170, damping: 26, mass: 0.6 };

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Índice do card do meio: 6 → 3º, 7 → 4º
export function getMiddleIndex(count) {
  return Math.max(0, Math.floor((count - 1) / 2));
}

// Posição 3D de um card conforme a distância até o central (offset 0)
export function getCardPose(offset) {
  if (offset === 0) return { x: "0%", rotateY: 0, scale: 1, opacity: 1 };

  const distance = Math.abs(offset);
  const side = Math.sign(offset);

  return {
    x: `${side * (58 + (distance - 1) * 30)}%`,
    rotateY: side * -45,
    scale: 0.82 - (distance - 1) * 0.08,
    opacity: distance > VISIBLE_SIDE ? 0 : 1 - distance * 0.18,
  };
}

// Converte um arraste em quantidade de cards a andar (negativo = voltar)
export function getSwipeSteps(offsetX, velocityX, cardWidth) {
  const projected = offsetX + velocityX * VELOCITY_PROJECTION;
  if (Math.abs(projected) < SWIPE_MIN_DISTANCE) return 0;

  const steps = clamp(Math.round(Math.abs(projected) / (cardWidth * SWIPE_STEP_RATIO)), 1, SWIPE_MAX_SKIP);
  return -Math.sign(projected) * steps;
}
