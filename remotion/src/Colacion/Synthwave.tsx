import { AbsoluteFill, useCurrentFrame } from "remotion";
import { NEON } from "./config";

/** Fondo retro: cielo degradado, sol a franjas y grilla en perspectiva */
export const Synthwave: React.FC<{ subidaSol?: number }> = ({ subidaSol = 1 }) => {
  const frame = useCurrentFrame();
  const avance = (frame * 4) % 80;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NEON.noche} 0%, #2a0a4a 38%, #8a1a6b 52%, ${NEON.noche} 52.2%)` }}>
      {/* estrellas */}
      {Array.from({ length: 60 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 37.3) % 100}%`,
            top: `${(i * 13.7) % 45}%`,
            width: i % 7 === 0 ? 4 : 2,
            height: i % 7 === 0 ? 4 : 2,
            borderRadius: 2,
            background: "white",
            opacity: 0.4 + 0.6 * Math.abs(Math.sin((frame + i * 9) / 12)),
          }}
        />
      ))}
      {/* sol */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: `${52 - 30 * subidaSol}%`,
          width: 560,
          height: 560,
          marginLeft: -280,
          borderRadius: "50%",
          background: `linear-gradient(180deg, ${NEON.amarillo} 0%, ${NEON.naranja} 45%, ${NEON.rosa} 100%)`,
          boxShadow: `0 0 120px ${NEON.rosa}, 0 0 240px ${NEON.naranja}`,
          WebkitMaskImage:
            "linear-gradient(180deg, #000 0 52%, transparent 52% 56%, #000 56% 64%, transparent 64% 69%, #000 69% 76%, transparent 76% 82%, #000 82% 88%, transparent 88% 95%, #000 95%)",
        }}
      />
      {/* recorte del sol por el horizonte */}
      <div style={{ position: "absolute", left: 0, right: 0, top: "52%", bottom: 0, background: NEON.noche }} />
      {/* grilla */}
      <div
        style={{
          position: "absolute",
          left: "-50%",
          right: "-50%",
          top: "52%",
          height: "120%",
          transformOrigin: "50% 0%",
          transform: "perspective(500px) rotateX(70deg)",
          backgroundImage: `linear-gradient(${NEON.rosa} 3px, transparent 3px), linear-gradient(90deg, ${NEON.rosa} 3px, transparent 3px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `0 ${avance}px`,
          filter: `drop-shadow(0 0 8px ${NEON.rosa})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: 60,
          background: `linear-gradient(180deg, transparent, ${NEON.rosa}88, transparent)`,
          filter: "blur(10px)",
        }}
      />
    </AbsoluteFill>
  );
};
