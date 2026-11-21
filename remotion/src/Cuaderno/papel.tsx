import { AbsoluteFill, random } from "remotion";
import { PALETA } from "./config";

/** Polígono con bordes irregulares, como papel rasgado a mano */
export const rasgado = (semilla: string, amp = 1.6, paso = 1.4) => {
  const pts: string[] = [];
  const r = (k: string) => (random(`${semilla}-${k}`) - 0.5) * 2 * amp;
  for (let x = 0; x <= 100; x += paso) pts.push(`${x}% ${Math.max(0, amp + r(`t${x}`))}%`);
  for (let y = 0; y <= 100; y += paso) pts.push(`${Math.min(100, 100 - amp + r(`r${y}`))}% ${y}%`);
  for (let x = 100; x >= 0; x -= paso) pts.push(`${x}% ${Math.min(100, 100 - amp + r(`b${x}`))}%`);
  for (let y = 100; y >= 0; y -= paso) pts.push(`${Math.max(0, amp + r(`l${y}`))}% ${y}%`);
  return `polygon(${pts.join(",")})`;
};

/** Textura de papel envejecido (estática) */
export const Textura: React.FC<{ id: string; opacidad?: number }> = ({ id, opacidad = 0.35 }) => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: opacidad }}>
    <filter id={id}>
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="4" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0.6 0" />
    </filter>
    <rect width="100%" height="100%" filter={`url(#${id})`} />
  </svg>
);

/** Hoja de cuaderno rayada con margen, perforaciones y manchas */
export const Hoja: React.FC<{ indice: number; children?: React.ReactNode }> = ({ indice, children }) => (
  <AbsoluteFill
    style={{
      background: "#fbf6e6",
      backgroundImage:
        "linear-gradient(90deg, transparent 168px, #e86a6a 168px, #e86a6a 171px, transparent 171px), repeating-linear-gradient(180deg, transparent 0 45px, #9cc3e6 45px 47px)",
      backgroundPosition: "0 0, 0 120px",
      overflow: "hidden",
    }}
  >
    {/* agujeros del espiral */}
    {Array.from({ length: 14 }, (_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 44,
          top: 40 + i * 70,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#3b2a1c",
          boxShadow: "inset 2px 3px 4px rgba(0,0,0,0.8)",
        }}
      />
    ))}
    {/* mancha de café */}
    <div
      style={{
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: "50%",
        right: indice % 2 ? -60 : 1300,
        top: indice % 2 ? 650 : -90,
        background: "radial-gradient(circle, transparent 58%, rgba(150,95,40,0.22) 62%, rgba(150,95,40,0.06) 70%, transparent 74%)",
      }}
    />
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 55% 45%, transparent 55%, rgba(160,120,60,0.28) 100%)" }} />
    <Textura id={`tex-${indice}`} />
    {children}
  </AbsoluteFill>
);

/** Espiral metálico que asoma sobre el borde izquierdo */
export const Espiral: React.FC = () => (
  <div style={{ position: "absolute", left: -34, top: 0, bottom: 0, width: 120, pointerEvents: "none" }}>
    {Array.from({ length: 14 }, (_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          top: 30 + i * 70,
          width: 110,
          height: 40,
          borderRadius: 20,
          border: "7px solid transparent",
          borderTopColor: "#c9ced6",
          borderLeftColor: "#8f96a3",
          transform: "rotate(-8deg)",
          filter: "drop-shadow(2px 3px 2px rgba(0,0,0,0.5))",
        }}
      />
    ))}
  </div>
);

/** Cinta washi con bordes en zigzag */
export const Cinta: React.FC<{ color: string; ancho?: number; estilo: React.CSSProperties; patron?: number }> = ({
  color,
  ancho = 190,
  estilo,
  patron = 0,
}) => {
  const fondos = [
    `repeating-linear-gradient(45deg, ${color} 0 12px, rgba(255,255,255,0.55) 12px 22px)`,
    `radial-gradient(circle, rgba(255,255,255,0.75) 4px, transparent 5px) 0 0/22px 22px, ${color}`,
    `linear-gradient(${color}, ${color})`,
  ];
  const zig = Array.from({ length: 9 }, (_, k) => `${k % 2 ? 4 : 0}% ${(k / 8) * 100}%`).join(",");
  const zag = Array.from({ length: 9 }, (_, k) => `${k % 2 ? 96 : 100}% ${100 - (k / 8) * 100}%`).join(",");
  return (
    <div
      style={{
        position: "absolute",
        width: ancho,
        height: 54,
        background: fondos[patron % fondos.length],
        opacity: 0.82,
        clipPath: `polygon(${zig},${zag})`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
        ...estilo,
      }}
    />
  );
};

export const COLORES = [PALETA.rosa, PALETA.amarillo, PALETA.turquesa, PALETA.violeta, PALETA.naranja, PALETA.celeste];
