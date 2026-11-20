import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { ColacionProps, ESCENAS } from "./config";
import { VHS } from "./efectos";
import { FUENTE_CROMO, FUENTE_MODERNA, FUENTE_VHS } from "./fuentes";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** "Lluvia" de televisor: ruido en blanco y negro distinto en cada frame */
export const Lluvia: React.FC<{ opacidad?: number }> = ({ opacidad = 1 }) => {
  const frame = useCurrentFrame();
  const id = `lluvia-${frame}`;
  return (
    <AbsoluteFill style={{ opacity: opacidad, background: "#777" }}>
      <svg width="100%" height="100%" viewBox="0 0 384 216" preserveAspectRatio="none" style={{ imageRendering: "pixelated" }}>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9 1.4" numOctaves="1" seed={frame} />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="4.5" intercept="-1.75" />
            <feFuncG type="linear" slope="4.5" intercept="-1.75" />
            <feFuncB type="linear" slope="4.5" intercept="-1.75" />
          </feComponentTransfer>
        </filter>
        <rect width="384" height="216" filter={`url(#${id})`} />
      </svg>
      {/* barra de interferencia que rueda */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${((frame * 9) % 130) - 15}%`,
          height: 120,
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.45), transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

const OSDVerde: React.FC<{ texto: string }> = ({ texto }) => (
  <div
    style={{
      position: "absolute",
      top: 60,
      right: 90,
      fontFamily: FUENTE_VHS,
      fontSize: 110,
      color: "#3dff6e",
      textShadow: "0 0 12px #3dff6e, 4px 4px 0 #000",
    }}
  >
    {texto}
  </div>
);

const BarrasDeColor: React.FC = () => {
  const colores = ["#c0c0c0", "#c0c000", "#00c0c0", "#00c000", "#c000c0", "#c00000", "#0000c0"];
  return (
    <AbsoluteFill>
      <div style={{ display: "flex", height: "70%" }}>
        {colores.map((c) => (
          <div key={c} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div style={{ display: "flex", height: "8%" }}>
        {["#0000c0", "#131313", "#c000c0", "#131313", "#00c0c0", "#131313", "#c0c0c0"].map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <div style={{ display: "flex", height: "22%" }}>
        {["#00214c", "#ffffff", "#32006a", "#131313", "#090909", "#131313", "#1d1d1d", "#131313"].map((c, i) => (
          <div key={i} style={{ flex: i < 3 ? 1.3 : 0.8, background: c }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── 0. Cambio de canal + corte de transmisión ───────────── */
export const EscenaCanal: React.FC = () => {
  const frame = useCurrentFrame();
  // encendido del tubo: línea horizontal que se abre
  const abreX = interpolate(frame, [0, 3], [0, 1], clamp);
  const abreY = interpolate(frame, [2, 6], [0.004, 1], clamp);
  const corte = (f: number) => frame >= f && frame < f + 2; // frame negro al girar la perilla
  const canal = frame < 18 ? "CH 02" : frame < 36 ? "CH 07" : "CH 13";
  const salto = (random(`v-${frame}`) - 0.5) * (frame >= 18 && frame < 36 ? 30 : 0); // rollo vertical

  let contenido: React.ReactNode = <Lluvia />;
  if (frame >= 18 && frame < 36) {
    contenido = (
      <AbsoluteFill style={{ transform: `translateY(${salto}px)` }}>
        <BarrasDeColor />
        <Lluvia opacidad={0.25} />
      </AbsoluteFill>
    );
  }
  const avisoVisible = frame >= 38 && Math.floor(frame / 4) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${abreX}, ${abreY})`, filter: frame < 6 ? "brightness(3)" : "none" }}>
        {corte(18) || corte(36) ? null : contenido}
        {frame >= 6 && !corte(18) && !corte(36) ? <OSDVerde texto={canal} /> : null}
        {avisoVisible ? (
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                background: "rgba(0,0,0,0.8)",
                padding: "24px 60px",
                fontFamily: FUENTE_VHS,
                fontSize: 90,
                color: "white",
                letterSpacing: 4,
                border: "4px solid white",
              }}
            >
              TRANSMISIÓN INTERRUMPIDA
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <VHS intensidad={0.7} />
    </AbsoluteFill>
  );
};

/* ───────────── 0b. Flash de noticiero: "Mientras tanto..." ───────────── */
export const EscenaNoticia: React.FC<ColacionProps> = ({ titularNoticia, promocion }) => {
  const frame = useCurrentFrame();
  const d = ESCENAS.noticia;
  const texto = "Mientras tanto...";
  const letras = Math.floor(interpolate(frame, [16, 40], [0, texto.length], clamp));
  const barra = interpolate(frame, [0, 10], [0, 1], { ...clamp });
  const cinta = `ÚLTIMO MOMENTO ★ ${titularNoticia} ★ ACTO DE COLACIÓN · ${promocion.toUpperCase()} ★ `;
  const desplaz = frame * 14;
  const lluviaFinal = interpolate(frame, [d - 6, d], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#020a3a", overflow: "hidden" }}>
      {/* estudio: degradado + rayas diagonales en movimiento */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #2350d8 0%, #0a1f7a 45%, #020a3a 100%)" }} />
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(-30deg, rgba(255,255,255,0.05) 0 40px, transparent 40px 80px)",
          backgroundPosition: `${frame * 3}px 0`,
        }}
      />
      {/* globo terráqueo de alambre */}
      <div
        style={{
          position: "absolute",
          right: -120,
          top: 120,
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: "3px solid rgba(120,180,255,0.35)",
          boxShadow: "0 0 60px rgba(80,140,255,0.3) inset",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 7 }, (_, i) => {
          const fase = ((frame * 1.5 + i * 26) % 180) / 180;
          return (
            <div
              key={`m${i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: `${Math.abs(Math.cos(fase * Math.PI)) * 100}%`,
                transform: "translateX(-50%)",
                border: "2px solid rgba(120,180,255,0.35)",
                borderRadius: "50%",
              }}
            />
          );
        })}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((y) => (
          <div key={y} style={{ position: "absolute", left: 0, right: 0, top: `${y * 100}%`, height: 2, background: "rgba(120,180,255,0.35)" }} />
        ))}
      </div>
      {/* placa ÚLTIMO MOMENTO */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 110,
          transform: `scaleX(${barra})`,
          transformOrigin: "left",
          display: "flex",
          fontFamily: FUENTE_CROMO,
          fontWeight: 900,
          fontSize: 54,
          letterSpacing: 4,
        }}
      >
        <div style={{ background: Math.floor(frame / 8) % 2 ? "#e00000" : "#ff2020", color: "white", padding: "14px 30px" }}>
          ÚLTIMO MOMENTO
        </div>
        <div style={{ background: "white", color: "#0a1f7a", padding: "14px 30px" }}>EN VIVO ●</div>
      </div>
      {/* titular */}
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 120 }}>
        <div
          style={{
            fontFamily: FUENTE_MODERNA,
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: 170,
            color: "white",
            textShadow: "6px 6px 0 #000a, 0 0 40px rgba(120,180,255,0.6)",
          }}
        >
          {texto.slice(0, letras)}
          <span style={{ opacity: Math.floor(frame / 6) % 2 ? 1 : 0 }}>▌</span>
        </div>
      </AbsoluteFill>
      {/* zócalo con cinta */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, height: 100, display: "flex", transform: `translateY(${(1 - barra) * 200}px)` }}>
        <div
          style={{
            background: "#e00000",
            color: "white",
            fontFamily: FUENTE_CROMO,
            fontWeight: 900,
            fontSize: 42,
            padding: "0 36px",
            display: "flex",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          NOTICIAS
        </div>
        <div style={{ flex: 1, background: "#ffd400", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <div
            style={{
              whiteSpace: "nowrap",
              fontFamily: FUENTE_MODERNA,
              fontWeight: 800,
              fontSize: 50,
              color: "#0a1f7a",
              transform: `translateX(${700 - desplaz}px)`,
            }}
          >
            {cinta.repeat(3)}
          </div>
        </div>
      </div>
      <VHS intensidad={0.6} />
      <Lluvia opacidad={lluviaFinal} />
    </AbsoluteFill>
  );
};
