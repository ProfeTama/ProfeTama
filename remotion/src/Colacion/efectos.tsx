import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { FUENTE_VHS } from "./fuentes";

/** Líneas de escaneo + ruido + banda de tracking estilo VHS */
export const VHS: React.FC<{ intensidad?: number }> = ({ intensidad = 1 }) => {
  const frame = useCurrentFrame();
  const bandaY = ((frame * 7) % 140) - 20; // en %
  const ruido = Array.from({ length: 14 }, (_, i) => ({
    y: random(`y-${frame}-${i}`) * 100,
    h: 1 + random(`h-${frame}-${i}`) * 3,
    o: random(`o-${frame}-${i}`) * 0.25 * intensidad,
  }));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 4px)",
          opacity: 0.8 * intensidad,
        }}
      />
      {ruido.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${r.y}%`,
            height: r.h,
            background: "white",
            opacity: r.o,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${bandaY}%`,
          height: 60,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.10), transparent)",
          filter: "blur(2px)",
          opacity: intensidad,
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/** Texto de pantalla (OSD) de videocasetera */
export const OSD: React.FC<{ izquierda: string; derecha?: string; abajo?: string }> = ({
  izquierda,
  derecha,
  abajo,
}) => {
  const frame = useCurrentFrame();
  const estilo: React.CSSProperties = {
    position: "absolute",
    fontFamily: FUENTE_VHS,
    fontSize: 64,
    color: "white",
    textShadow: "3px 0 rgba(255,0,80,0.7), -3px 0 rgba(0,200,255,0.7)",
    letterSpacing: 2,
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ ...estilo, top: 50, left: 70 }}>{izquierda}</div>
      {derecha ? (
        <div style={{ ...estilo, top: 50, right: 70, opacity: Math.floor(frame / 15) % 2 ? 1 : 0.2 }}>
          {derecha}
        </div>
      ) : null}
      {abajo ? <div style={{ ...estilo, bottom: 50, left: 70, fontSize: 52 }}>{abajo}</div> : null}
    </AbsoluteFill>
  );
};

/** Desplaza franjas horizontales al azar (glitch) */
export const Glitch: React.FC<{ fuerza: number; children: React.ReactNode }> = ({ fuerza, children }) => {
  const frame = useCurrentFrame();
  const franjas = 8;
  if (fuerza <= 0.01) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill>
      {Array.from({ length: franjas }, (_, i) => {
        const dx = (random(`g-${frame}-${i}`) - 0.5) * 160 * fuerza;
        const top = (i / franjas) * 100;
        const bottom = 100 - ((i + 1) / franjas) * 100;
        return (
          <AbsoluteFill
            key={i}
            style={{
              clipPath: `inset(${top}% 0 ${bottom}% 0)`,
              transform: `translateX(${dx}px)`,
              filter: `hue-rotate(${dx * 2}deg)`,
            }}
          >
            {children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
