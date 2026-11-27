import { random, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { COLORES_M } from "./config";

/** Figuras estilo Memphis (como en la invitación): zigzag, rosquilla con puntos, triángulo rayado, cruz, etc. */
export const Figura: React.FC<{ tipo: number; color: string; tam?: number }> = ({ tipo, color, tam = 70 }) => {
  const s = tam;
  switch (tipo % 10) {
    case 0: // zigzag
      return (
        <svg width={s * 1.6} height={s * 0.6} viewBox="0 0 160 60" style={{ overflow: "visible" }}>
          <path d="M5 50 L30 10 L55 50 L80 10 L105 50 L130 10 L155 50" fill="none" stroke={color} strokeWidth="9" strokeLinejoin="miter" />
        </svg>
      );
    case 1: // rosquilla con trama de puntos
      return (
        <svg width={s * 1.3} height={s * 1.3} viewBox="0 0 100 100">
          <defs>
            <pattern id={`pt-${color.slice(1)}`} width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="4" cy="4" r="2.4" fill={color} />
            </pattern>
          </defs>
          <circle cx="50" cy="50" r="34" fill="none" stroke={`url(#pt-${color.slice(1)})`} strokeWidth="26" />
        </svg>
      );
    case 2: // triángulo rayado
      return (
        <svg width={s} height={s} viewBox="0 0 100 100">
          <defs>
            <clipPath id="tri">
              <path d="M50 5 L95 92 L5 92 Z" />
            </clipPath>
          </defs>
          <g clipPath="url(#tri)">
            {Array.from({ length: 12 }, (_, i) => (
              <rect key={i} x={i * 14 - 40} y="-20" width="6" height="160" fill={color} transform="rotate(30 50 50)" />
            ))}
          </g>
        </svg>
      );
    case 3: // cruz
      return (
        <svg width={s * 0.5} height={s * 0.5} viewBox="0 0 40 40">
          <path d="M20 4 V36 M4 20 H36" stroke={color} strokeWidth="7" strokeLinecap="round" />
        </svg>
      );
    case 4: // círculo de contorno
      return (
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="18" fill="none" stroke={color} strokeWidth="6" />
        </svg>
      );
    case 5: // chevrons >>
      return (
        <svg width={s} height={s * 0.6} viewBox="0 0 100 60">
          <path d="M10 8 L35 30 L10 52 M45 8 L70 30 L45 52" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 6: // garabato ondulado
      return (
        <svg width={s * 0.6} height={s * 1.4} viewBox="0 0 40 100">
          <path d="M20 4 C40 16 0 30 20 42 S0 70 20 82 S30 96 20 98" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
        </svg>
      );
    case 7: // rayo
      return (
        <svg width={s * 0.8} height={s} viewBox="0 0 70 90">
          <path d="M40 2 L8 50 L30 50 L20 88 L62 34 L38 34 Z" fill={color} />
        </svg>
      );
    case 8: // grilla de puntos
      return (
        <svg width={s} height={s} viewBox="0 0 60 60">
          {Array.from({ length: 25 }, (_, i) => (
            <circle key={i} cx={6 + (i % 5) * 12} cy={6 + Math.floor(i / 5) * 12} r="3.4" fill={color} />
          ))}
        </svg>
      );
    default: // cuadrado / rombo
      return (
        <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 50 50">
          <rect x="10" y="10" width="30" height="30" fill={color} transform="rotate(20 25 25)" />
        </svg>
      );
  }
};

/** Figuras repartidas en lugares dados, aparecen con rebote y quedan flotando */
export const Confeti: React.FC<{ lugares: [number, number][]; semilla: string; desde?: number; tam?: number }> = ({
  lugares,
  semilla,
  desde = 0,
  tam = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {lugares.map(([x, y], i) => {
        const t = frame - desde - (i % 12) * 2;
        const s = spring({ frame: t, fps, config: { damping: 10, stiffness: 160 } });
        const tipo = Math.floor(random(`${semilla}-t${i}`) * 10);
        const color = COLORES_M[Math.floor(random(`${semilla}-c${i}`) * COLORES_M.length)];
        const rot = random(`${semilla}-r${i}`) * 360 + Math.sin((frame + i * 13) / 22) * 8;
        const flota = Math.sin((frame + i * 17) / 18) * 5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y + flota,
              transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (0.7 + random(`${semilla}-s${i}`) * 0.6)})`,
            }}
          >
            <Figura tipo={tipo} color={color} tam={tam} />
          </div>
        );
      })}
    </>
  );
};
