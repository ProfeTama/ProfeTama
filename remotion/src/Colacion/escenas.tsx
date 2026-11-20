import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ColacionProps, ESCENAS, NEON } from "./config";
import { Glitch, OSD, VHS } from "./efectos";
import { FUENTE_CROMO, FUENTE_MODERNA, FUENTE_NEON, FUENTE_SCRIPT, FUENTE_VHS } from "./fuentes";
import { Synthwave } from "./Synthwave";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ───────────── 1. Presente: estética limpia y moderna ───────────── */
export const EscenaModerna: React.FC<ColacionProps> = ({ institucion, anioActual }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = (d: number) => spring({ frame: frame - d, fps, config: { damping: 200 } });
  const linea = interpolate(frame, [10, 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const glitch = interpolate(frame, [ESCENAS.moderno - 25, ESCENAS.moderno], [0, 0.6], clamp);

  return (
    <Glitch fuerza={glitch}>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 30% 20%, #ffffff 0%, #eef1f7 45%, #dde3ee 100%)",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FUENTE_MODERNA,
          color: "#0f172a",
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            letterSpacing: 14,
            textTransform: "uppercase",
            opacity: entrada(0),
            transform: `translateY(${(1 - entrada(0)) * 30}px)`,
          }}
        >
          {institucion}
        </div>
        <div style={{ width: 520 * linea, height: 2, background: "#0f172a", margin: "36px 0" }} />
        <div
          style={{
            fontSize: 150,
            fontWeight: 800,
            letterSpacing: -4,
            opacity: entrada(12),
            transform: `translateY(${(1 - entrada(12)) * 60}px)`,
          }}
        >
          Acto de Colación
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 44,
            fontWeight: 300,
            letterSpacing: 20,
            opacity: entrada(28),
          }}
        >
          {anioActual}
        </div>
      </AbsoluteFill>
    </Glitch>
  );
};

/* ───────────── 2. Rebobinado: del presente al pasado ───────────── */
export const EscenaRebobinado: React.FC<ColacionProps> = ({ anioActual, anioRetro }) => {
  const frame = useCurrentFrame();
  const d = ESCENAS.rebobinado;
  const anio = Math.round(
    interpolate(frame, [8, d - 15], [anioActual, anioRetro], { ...clamp, easing: Easing.inOut(Easing.quad) }),
  );
  const destello = interpolate(frame, [d - 8, d - 3, d], [0, 1, 0], clamp);
  const lineas = Array.from({ length: 26 }, (_, i) => ({
    y: random(`ly-${i}`) * 100,
    x: ((random(`lx-${i}`) * 3000 + frame * (60 + random(`lv-${i}`) * 90)) % 2600) - 400,
    w: 120 + random(`lw-${i}`) * 400,
  }));

  return (
    <AbsoluteFill style={{ background: "#05010f" }}>
      <Glitch fuerza={0.5 + 0.5 * Math.sin(frame / 2)}>
        <AbsoluteFill style={{ background: `linear-gradient(90deg, #120430, #2a0a4a, #120430)` }} />
        {lineas.map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${l.y}%`,
              right: l.x,
              width: l.w,
              height: 3,
              background: i % 2 ? NEON.cian : NEON.rosa,
              boxShadow: `0 0 12px ${i % 2 ? NEON.cian : NEON.rosa}`,
              opacity: 0.8,
            }}
          />
        ))}
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              fontFamily: FUENTE_VHS,
              fontSize: 380,
              color: "white",
              lineHeight: 1,
              textShadow: `8px 0 ${NEON.rosa}, -8px 0 ${NEON.cian}, 0 0 40px rgba(255,255,255,0.6)`,
            }}
          >
            {anio}
          </div>
        </AbsoluteFill>
      </Glitch>
      <OSD izquierda="◀◀ REW" derecha="●" abajo="SP  -00:00:0" />
      <VHS intensidad={1.4} />
      <AbsoluteFill style={{ background: "white", opacity: destello }} />
    </AbsoluteFill>
  );
};

/* ───────────── 3. Título retro ───────────── */
export const EscenaTituloRetro: React.FC<ColacionProps> = ({ anioRetro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sol = interpolate(frame, [0, 60], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const script = spring({ frame: frame - 20, fps, config: { damping: 10 } });
  const cromo = spring({ frame: frame - 35, fps, config: { damping: 14 } });
  const brillo = interpolate(frame, [50, 100], [-30, 130], clamp);

  return (
    <AbsoluteFill>
      <Synthwave subidaSol={sol} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 140 }}>
        <div
          style={{
            fontFamily: FUENTE_CROMO,
            fontSize: 190,
            fontWeight: 900,
            letterSpacing: 6,
            backgroundImage: `linear-gradient(100deg, transparent ${brillo - 10}%, rgba(255,255,255,0.95) ${brillo}%, transparent ${brillo + 10}%), linear-gradient(180deg, #e8f7ff 0%, #7fd6ff 45%, #1b1b5a 50%, #ff9ee8 70%, #ffffff 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.5)",
            filter: `drop-shadow(0 6px 0 ${NEON.violeta}) drop-shadow(0 0 30px ${NEON.cian})`,
            transform: `scale(${cromo})`,
          }}
        >
          COLACIÓN
        </div>
        <div
          style={{
            position: "absolute",
            top: 170,
            left: 300,
            fontFamily: FUENTE_SCRIPT,
            fontSize: 140,
            color: NEON.rosa,
            transform: `rotate(-8deg) scale(${script})`,
            textShadow: `0 0 10px ${NEON.rosa}, 0 0 30px ${NEON.rosa}, 0 0 60px ${NEON.rosa}`,
          }}
        >
          Acto de
        </div>
      </AbsoluteFill>
      <OSD izquierda="PLAY ▶" abajo={`ENE.01 ${anioRetro}  12:00 AM`} />
      <VHS />
    </AbsoluteFill>
  );
};

/* ───────────── 4. Fotos como polaroids ───────────── */
const Marcador: React.FC<{ n: number }> = ({ n }) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(135deg, ${[NEON.violeta, NEON.rosa, NEON.cian, NEON.naranja][n % 4]}, #1a0533)`,
      justifyContent: "center",
      alignItems: "center",
      fontFamily: FUENTE_VHS,
      fontSize: 90,
      color: "white",
    }}
  >
    FOTO {n + 1}
  </AbsoluteFill>
);

export const EscenaFotos: React.FC<ColacionProps> = ({ fotos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lista = fotos.length ? fotos : ["", "", "", ""];
  const porFoto = ESCENAS.fotos / lista.length;

  return (
    <AbsoluteFill>
      <Synthwave />
      <AbsoluteFill style={{ background: "rgba(11,2,33,0.35)" }} />
      {lista.map((foto, i) => {
        const inicio = i * porFoto;
        const t = frame - inicio;
        if (t < 0) return null;
        const caida = spring({ frame: t, fps, config: { damping: 13, mass: 0.8 } });
        const angulo = (random(`a-${i}`) - 0.5) * 14;
        const dx = (random(`x-${i}`) - 0.5) * 500;
        const actual = frame < inicio + porFoto || i === lista.length - 1;
        const zoom = interpolate(t, [0, porFoto], [1, 1.06], clamp);
        const revelado = interpolate(t, [5, 35], [0, 1], clamp); // como una polaroid revelándose
        return (
          <AbsoluteFill key={i} style={{ justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                width: 760,
                padding: "34px 34px 130px",
                background: "#f7f3ea",
                boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                transform: `translate(${actual ? 0 : dx}px, ${(1 - caida) * -1200}px) rotate(${angulo}deg) scale(${actual ? zoom : 0.75})`,
                opacity: actual ? 1 : 0.55,
                transition: "none",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: 560, overflow: "hidden", background: "#111" }}>
                <div style={{ position: "absolute", inset: 0, filter: `sepia(${0.35 + (1 - revelado) * 0.6}) saturate(1.3) contrast(1.05) brightness(${0.4 + revelado * 0.6})` }}>
                  {foto ? (
                    <Img src={staticFile(`fotos/${foto}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Marcador n={i} />
                  )}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 30,
                  textAlign: "center",
                  fontFamily: FUENTE_SCRIPT,
                  fontSize: 60,
                  color: "#2a1a5e",
                }}
              >
                {["Recuerdos", "Amistad", "Esfuerzo", "Futuro", "Juntos", "Logros"][i % 6]}
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
      <OSD izquierda="PLAY ▶" derecha="REC ●" abajo={`SP  00:0${Math.floor(frame / 30 / 10)}:${String(Math.floor(frame / 30) % 10).padStart(2, "0")}`} />
      <VHS />
    </AbsoluteFill>
  );
};

/* ───────────── 5. Cierre en neón ───────────── */
export const EscenaFinal: React.FC<ColacionProps> = ({ promocion, institucion }) => {
  const frame = useCurrentFrame();
  const d = ESCENAS.final;
  // parpadeo de tubo de neón al encender
  const parpadeo = [0, 0, 1, 0, 1, 1, 0, 1][Math.min(7, Math.floor(frame / 3))] ?? 1;
  const encendido = frame > 24 ? 1 : parpadeo;
  const sub = interpolate(frame, [35, 55], [0, 1], clamp);
  const salida = interpolate(frame, [d - 20, d], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: NEON.noche, opacity: salida }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(circle at 50% 45%, ${NEON.violeta}55, transparent 60%)`,
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 40 }}>
        <div
          style={{
            fontFamily: FUENTE_NEON,
            fontSize: 150,
            color: encendido ? "#ffe9fb" : "#3a1440",
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: encendido
              ? `0 0 8px #fff, 0 0 20px ${NEON.rosa}, 0 0 45px ${NEON.rosa}, 0 0 90px ${NEON.rosa}`
              : "none",
          }}
        >
          {promocion}
        </div>
        <div
          style={{
            fontFamily: FUENTE_CROMO,
            fontSize: 40,
            letterSpacing: 12,
            color: NEON.cian,
            textShadow: `0 0 14px ${NEON.cian}`,
            opacity: sub,
            textTransform: "uppercase",
          }}
        >
          {institucion}
        </div>
      </AbsoluteFill>
      <OSD izquierda={frame > d - 30 ? "■ STOP" : "PLAY ▶"} />
      <VHS intensidad={0.8} />
    </AbsoluteFill>
  );
};
