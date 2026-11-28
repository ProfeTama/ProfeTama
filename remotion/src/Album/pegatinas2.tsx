import { MEMPHIS } from "./config";

const borde = { stroke: "white", strokeWidth: 9, paintOrder: "stroke", strokeLinejoin: "round" } as const;
const sombra: React.CSSProperties = { filter: "drop-shadow(3px 5px 4px rgba(0,0,0,0.35))", overflow: "visible" };

export const Camara = () => (
  <svg width="170" height="130" viewBox="0 0 130 100" style={sombra}>
    <rect x="6" y="22" width="118" height="72" rx="12" fill={MEMPHIS.turquesa} {...borde} />
    <rect x="40" y="10" width="40" height="18" rx="4" fill={MEMPHIS.turquesa} {...borde} />
    <circle cx="65" cy="58" r="24" fill="#2b2b2e" stroke="white" strokeWidth="6" />
    <circle cx="65" cy="58" r="12" fill={MEMPHIS.violeta} />
    <circle cx="104" cy="38" r="6" fill={MEMPHIS.amarillo} />
  </svg>
);
export const Celular = () => (
  <svg width="90" height="160" viewBox="0 0 60 110" style={sombra}>
    <rect x="6" y="20" width="48" height="84" rx="8" fill={MEMPHIS.naranja} {...borde} />
    <rect x="40" y="4" width="6" height="20" fill="#555" />
    <rect x="13" y="28" width="34" height="22" rx="3" fill="#c9f2f0" />
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={14 + (i % 3) * 12} y={58 + Math.floor(i / 3) * 12} width="8" height="7" rx="2" fill="#3a2a1a" />
    ))}
  </svg>
);
export const GameBoy = () => (
  <svg width="110" height="160" viewBox="0 0 70 100" style={sombra}>
    <rect x="5" y="4" width="60" height="92" rx="8" fill={MEMPHIS.celeste} {...borde} />
    <rect x="13" y="12" width="44" height="34" rx="3" fill="#2f5d50" />
    <path d="M18 64 h16 M26 56 v16" stroke="#222" strokeWidth="6" />
    <circle cx="48" cy="62" r="5" fill={MEMPHIS.rosa} />
    <circle cx="56" cy="70" r="5" fill={MEMPHIS.rosa} />
  </svg>
);
export const Tele = () => (
  <svg width="150" height="140" viewBox="0 0 110 100" style={sombra}>
    <path d="M40 4 L55 24 L70 4" fill="none" stroke="white" strokeWidth="9" />
    <path d="M40 4 L55 24 L70 4" fill="none" stroke="#555" strokeWidth="4" />
    <rect x="6" y="24" width="98" height="68" rx="12" fill={MEMPHIS.rosa} {...borde} />
    <rect x="16" y="33" width="62" height="50" rx="8" fill="#bff0ff" />
    <circle cx="90" cy="45" r="5" fill="#fff" />
    <circle cx="90" cy="62" r="5" fill="#fff" />
  </svg>
);
export const Pizza = () => (
  <svg width="130" height="130" viewBox="0 0 100 100" style={sombra}>
    <path d="M10 18 Q50 0 90 18 L50 96 Z" fill={MEMPHIS.amarillo} {...borde} />
    <path d="M10 18 Q50 0 90 18" fill="none" stroke={MEMPHIS.naranja} strokeWidth="9" />
    <circle cx="40" cy="36" r="7" fill="#e2402f" />
    <circle cx="60" cy="50" r="7" fill="#e2402f" />
    <circle cx="48" cy="68" r="6" fill="#e2402f" />
  </svg>
);
export const Destello: React.FC<{ color?: string }> = ({ color = MEMPHIS.amarillo }) => (
  <svg width="110" height="110" viewBox="0 0 100 100" style={sombra}>
    <path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4 Z" fill={color} {...borde} />
  </svg>
);

export const Vinilo = () => (
  <svg width="150" height="150" viewBox="0 0 100 100" style={sombra}>
    <circle cx="50" cy="50" r="46" fill="#1b1b1e" {...borde} />
    {[38, 32, 26].map((r) => (
      <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#3a3a40" strokeWidth="1.5" />
    ))}
    <circle cx="50" cy="50" r="15" fill={MEMPHIS.rosa} />
    <circle cx="50" cy="50" r="3" fill="#1b1b1e" />
    <path d="M22 30 A34 34 0 0 1 40 17" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
export const Rubik = () => (
  <svg width="130" height="130" viewBox="0 0 90 90" style={sombra}>
    <rect x="5" y="5" width="80" height="80" rx="8" fill="#1b1b1e" {...borde} />
    {[MEMPHIS.rosa, MEMPHIS.amarillo, MEMPHIS.verde, MEMPHIS.celeste, "#fff", MEMPHIS.naranja, MEMPHIS.verde, MEMPHIS.rosa, MEMPHIS.amarillo].map((c, i) => (
      <rect key={i} x={10 + (i % 3) * 25} y={10 + Math.floor(i / 3) * 25} width="21" height="21" rx="3" fill={c} />
    ))}
  </svg>
);
export const Walkman = () => (
  <svg width="170" height="150" viewBox="0 0 120 105" style={sombra}>
    <path d="M20 40 C20 5 100 5 100 40" fill="none" stroke="white" strokeWidth="12" />
    <path d="M20 40 C20 5 100 5 100 40" fill="none" stroke="#333" strokeWidth="5" />
    <rect x="8" y="34" width="22" height="30" rx="8" fill={MEMPHIS.naranja} {...borde} />
    <rect x="90" y="34" width="22" height="30" rx="8" fill={MEMPHIS.naranja} {...borde} />
    <rect x="30" y="50" width="60" height="50" rx="6" fill={MEMPHIS.celeste} {...borde} />
    <rect x="38" y="58" width="44" height="22" rx="3" fill="#2b2b2e" />
    <circle cx="50" cy="69" r="5" fill="#ddd" />
    <circle cx="70" cy="69" r="5" fill="#ddd" />
  </svg>
);
export const Patin = () => (
  <svg width="150" height="140" viewBox="0 0 110 100" style={sombra}>
    <path d="M30 10 L58 10 L60 55 L98 62 C104 63 104 78 98 78 L18 78 C12 78 12 70 14 62 Z" fill={MEMPHIS.rosa} {...borde} />
    <path d="M34 22 H56 M34 34 H56" stroke="white" strokeWidth="4" strokeLinecap="round" />
    {[30, 56, 84].map((x) => (
      <circle key={x} cx={x} cy="88" r="9" fill={MEMPHIS.amarillo} stroke="white" strokeWidth="5" paintOrder="stroke" />
    ))}
  </svg>
);
export const Lentes3D = () => (
  <svg width="170" height="90" viewBox="0 0 130 65" style={sombra}>
    <rect x="4" y="8" width="122" height="44" rx="10" fill="white" {...borde} />
    <rect x="14" y="16" width="44" height="28" rx="6" fill="#e2402f" />
    <rect x="72" y="16" width="44" height="28" rx="6" fill="#29b6f6" />
  </svg>
);
