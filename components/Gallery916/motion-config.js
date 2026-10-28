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

// Motion não interpola var(--…) em boxShadow/borderColor: valores literais dos tokens.
export const SHADOW_SM = "0 1px 2px rgba(43, 43, 45, 0.14)";
export const SHADOW_MD = "0 3px 10px rgba(43, 43, 45, 0.16)";
export const SHADOW_LG = "0 12px 32px rgba(43, 43, 45, 0.22)";
export const BORDER_ACCENT = "rgba(89, 128, 166, 1)";
export const BORDER_DIVIDER = "rgba(29, 31, 32, 0.16)";

export const MOBILE_QUERY = "(max-width: 767px)";
