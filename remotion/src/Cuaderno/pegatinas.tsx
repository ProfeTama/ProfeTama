import { MARCADOR, RETRO } from "./fuentes";
import { PALETA } from "./config";

// Pegatinas troqueladas: borde blanco grueso + sombra
const borde = { stroke: "white", strokeWidth: 10, paintOrder: "stroke", strokeLinejoin: "round" } as const;
const sombra: React.CSSProperties = { filter: "drop-shadow(3px 5px 4px rgba(0,0,0,0.35))", overflow: "visible" };

const Estrella = () => (
  <svg width="150" height="150" viewBox="0 0 100 100" style={sombra}>
    <path d="M50 4 L62 36 L96 38 L69 59 L79 93 L50 73 L21 93 L31 59 L4 38 L38 36 Z" fill={PALETA.amarillo} {...borde} />
    <path d="M40 40 L46 32" stroke="white" strokeWidth="5" strokeLinecap="round" />
  </svg>
);
const Corazon = () => (
  <svg width="140" height="130" viewBox="0 0 100 92" style={sombra}>
    <path d="M50 88 C10 60 2 40 10 22 C20 2 44 6 50 24 C56 6 80 2 90 22 C98 40 90 60 50 88 Z" fill={PALETA.rosa} {...borde} />
    <ellipse cx="30" cy="28" rx="8" ry="5" fill="white" opacity="0.7" transform="rotate(-30 30 28)" />
  </svg>
);
const Rayo = () => (
  <svg width="110" height="160" viewBox="0 0 70 100" style={sombra}>
    <path d="M42 2 L8 56 L32 56 L22 98 L62 38 L38 38 Z" fill={PALETA.turquesa} {...borde} />
  </svg>
);
const Carita = () => (
  <svg width="140" height="140" viewBox="0 0 100 100" style={sombra}>
    <circle cx="50" cy="50" r="44" fill={PALETA.amarillo} {...borde} />
    <ellipse cx="36" cy="40" rx="5" ry="9" fill="#222" />
    <ellipse cx="64" cy="40" rx="5" ry="9" fill="#222" />
    <path d="M26 58 Q50 84 74 58" fill="none" stroke="#222" strokeWidth="6" strokeLinecap="round" />
  </svg>
);
const Casete = () => (
  <svg width="200" height="130" viewBox="0 0 150 96" style={sombra}>
    <rect x="4" y="4" width="142" height="88" rx="8" fill={PALETA.violeta} {...borde} />
    <rect x="18" y="14" width="114" height="34" rx="4" fill="#fbf6e6" />
    <rect x="18" y="24" width="114" height="6" fill={PALETA.rosa} />
    <circle cx="50" cy="64" r="11" fill="#fbf6e6" />
    <circle cx="100" cy="64" r="11" fill="#fbf6e6" />
    <rect x="62" y="58" width="26" height="12" fill="#2a1d4a" />
  </svg>
);
const Burbuja: React.FC<{ texto: string }> = ({ texto }) => (
  <svg width="200" height="150" viewBox="0 0 140 105" style={sombra}>
    <path d="M10 10 H130 V72 H58 L30 98 L36 72 H10 Z" fill={PALETA.rosa} {...borde} />
    <text x="70" y="52" textAnchor="middle" fontFamily={RETRO} fontSize="30" fill="white" stroke="#7a1745" strokeWidth="2" paintOrder="stroke">
      {texto}
    </text>
  </svg>
);
const Insignia = () => (
  <svg width="160" height="160" viewBox="0 0 100 100" style={sombra}>
    <circle cx="50" cy="50" r="44" fill={PALETA.turquesa} {...borde} />
    <circle cx="50" cy="50" r="34" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" />
    <text x="50" y="46" textAnchor="middle" fontFamily={RETRO} fontSize="20" fill="white">80's</text>
    <text x="50" y="68" textAnchor="middle" fontFamily={RETRO} fontSize="20" fill={PALETA.amarillo}>90's</text>
  </svg>
);
const Arcoiris = () => (
  <svg width="180" height="110" viewBox="0 0 120 70" style={sombra}>
    {[PALETA.rosa, PALETA.naranja, PALETA.amarillo, PALETA.turquesa, PALETA.violeta].map((c, i) => (
      <path key={c} d={`M${10 + i * 8} 64 A${50 - i * 8} ${50 - i * 8} 0 0 1 ${110 - i * 8} 64`} fill="none" stroke={c} strokeWidth="8" />
    ))}
    <path d="M6 64 A54 54 0 0 1 114 64" fill="none" stroke="white" strokeWidth="4" style={{ display: "none" }} />
  </svg>
);
const Nota: React.FC<{ texto: string }> = ({ texto }) => (
  <div
    style={{
      background: PALETA.amarillo,
      padding: "18px 24px",
      fontFamily: MARCADOR,
      fontSize: 34,
      color: "#3a2a00",
      boxShadow: "3px 6px 10px rgba(0,0,0,0.25)",
      width: 200,
      textAlign: "center",
    }}
  >
    {texto}
  </div>
);

export const PEGATINAS = [
  () => <Estrella />,
  () => <Corazon />,
  () => <Casete />,
  () => <Burbuja texto="¡RAD!" />,
  () => <Carita />,
  () => <Rayo />,
  () => <Insignia />,
  () => <Burbuja texto="WOW!" />,
  () => <Arcoiris />,
  () => <Nota texto="¡No te olvides!" />,
];

/** Garabatos de birome */
export const Garabato: React.FC<{ tipo: number; color?: string; progreso: number }> = ({ tipo, color = "#1d3a8a", progreso }) => {
  const caminos = [
    "M10 60 C40 10, 70 110, 100 60 S160 10, 190 60", // ola
    "M20 80 L60 20 L100 80 M60 20 L60 0", // flecha
    "M100 10 L112 45 L150 45 L120 68 L132 105 L100 82 L68 105 L80 68 L50 45 L88 45 Z", // estrella
    "M100 60 m-50 0 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0 M80 50 l0 0 M120 50 l0 0 M75 75 q25 20 50 0", // carita
    "M10 50 Q30 10 50 50 T90 50 T130 50 T170 50", // rulos
    "M30 100 L60 20 L90 100 M40 70 L80 70 M120 30 L120 100 M110 40 L130 30", // "A!"
  ];
  return (
    <svg width="200" height="120" viewBox="0 0 200 120" style={{ overflow: "visible" }}>
      <path
        d={caminos[tipo % caminos.length]}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progreso}
        opacity={0.85}
      />
    </svg>
  );
};
