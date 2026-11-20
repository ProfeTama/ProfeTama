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
import { ColacionProps, ESCENAS, Foto, NEON } from "./config";
import { Glitch, OSD, VHS } from "./efectos";
import { FUENTE_CROMO, FUENTE_NEON, FUENTE_SCRIPT, FUENTE_VHS } from "./fuentes";
import { Synthwave } from "./Synthwave";
import { Lluvia } from "./tv";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ───────────── 1. Cuenta regresiva que "se lo toma muy en serio" ───────────── */
export const EscenaCuenta: React.FC<ColacionProps> = ({ anioActual, anioRetro }) => {
  const frame = useCurrentFrame();
  const d = ESCENAS.cuenta;
  const porNumero = 15;
  const fase3 = 3 * porNumero; // 3, 2, 1
  const enNumeros = frame < fase3;
  const numero = 3 - Math.floor(frame / porNumero);
  const barrido = ((frame % porNumero) / porNumero) * 360;
  // después del "1" sigue... ahora en años, acelerando
  const anio = Math.round(
    interpolate(frame, [fase3 + 4, d - 18], [anioActual, anioRetro], { ...clamp, easing: Easing.in(Easing.cubic) }),
  );
  const llego = frame >= d - 18;
  const temblor = enNumeros ? 0 : interpolate(frame, [fase3, d - 18], [0.15, 1], clamp);
  const destello = interpolate(frame, [d - 18, d - 15, d - 6], [0, 1, 0], clamp);
  const rew = !enNumeros && !llego;

  return (
    <AbsoluteFill style={{ background: "#0d0d0d" }}>
      <Glitch fuerza={llego ? 0 : temblor * 0.6}>
        {enNumeros ? (
          // líder de película clásico
          <AbsoluteFill style={{ background: "#9a9a9a", justifyContent: "center", alignItems: "center" }}>
            <div
              style={{
                position: "absolute",
                width: 1500,
                height: 1500,
                borderRadius: "50%",
                background: `conic-gradient(rgba(0,0,0,0.35) ${barrido}deg, transparent ${barrido}deg)`,
              }}
            />
            <div style={{ position: "absolute", width: 2, top: 0, bottom: 0, background: "#222" }} />
            <div style={{ position: "absolute", height: 2, left: 0, right: 0, background: "#222" }} />
            {[760, 640].map((s) => (
              <div key={s} style={{ position: "absolute", width: s, height: s, borderRadius: "50%", border: "8px solid #f2f2f2" }} />
            ))}
            <div style={{ fontFamily: FUENTE_CROMO, fontWeight: 900, fontSize: 480, color: "#111", lineHeight: 1 }}>
              {numero}
            </div>
          </AbsoluteFill>
        ) : (
          <AbsoluteFill style={{ background: "linear-gradient(90deg, #120430, #2a0a4a, #120430)", justifyContent: "center", alignItems: "center" }}>
            {Array.from({ length: 26 }, (_, i) => {
              const x = ((random(`lx-${i}`) * 3000 + frame * (60 + random(`lv-${i}`) * 120) * temblor) % 2600) - 400;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: `${random(`ly-${i}`) * 100}%`,
                    right: x,
                    width: 120 + random(`lw-${i}`) * 400,
                    height: 3,
                    background: i % 2 ? NEON.cian : NEON.rosa,
                    boxShadow: `0 0 12px ${i % 2 ? NEON.cian : NEON.rosa}`,
                    opacity: 0.8,
                  }}
                />
              );
            })}
            <div
              style={{
                fontFamily: FUENTE_VHS,
                fontSize: llego ? 440 : 380,
                color: llego ? NEON.amarillo : "white",
                lineHeight: 1,
                textShadow: `8px 0 ${NEON.rosa}, -8px 0 ${NEON.cian}, 0 0 40px rgba(255,255,255,0.6)`,
              }}
            >
              {anio}
            </div>
          </AbsoluteFill>
        )}
      </Glitch>
      {rew ? <OSD izquierda="◀◀ REW" derecha="●" /> : null}
      <VHS intensidad={enNumeros ? 0.6 : 1.3} />
      <AbsoluteFill style={{ background: "white", opacity: destello }} />
    </AbsoluteFill>
  );
};

/* ───────────── 2. La TV se los chupa ───────────── */
export const EscenaTV: React.FC<ColacionProps> = ({ promocion }) => {
  const frame = useCurrentFrame();
  const d = ESCENAS.tv;
  const giro = frame * 14;
  const succion = interpolate(frame, [8, 40], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const zoom = interpolate(frame, [38, d], [1, 9], { ...clamp, easing: Easing.in(Easing.quad) });
  const blanco = interpolate(frame, [d - 8, d], [0, 1], clamp);
  const pantallaW = 760;
  const pantallaH = 560;

  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2a1a12 0%, #0b0705 70%)" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `scale(${zoom})`, transformOrigin: "50% 46%" }}>
        {/* mueble de la TV */}
        <div
          style={{
            position: "relative",
            width: 1100,
            height: 780,
            borderRadius: 60,
            background: "linear-gradient(180deg, #5a3a22, #3b2414)",
            boxShadow: "0 40px 120px rgba(0,0,0,0.8), inset 0 4px 0 rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            padding: 60,
            gap: 50,
            transform: `rotate(${Math.sin(frame / 2) * succion * 1.5}deg)`,
          }}
        >
          {/* pantalla */}
          <div
            style={{
              position: "relative",
              width: pantallaW,
              height: pantallaH,
              borderRadius: "40px / 60px",
              overflow: "hidden",
              background: "#000",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.9), 0 0 0 18px #1a1a1a",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -400,
                background: `repeating-conic-gradient(from ${giro}deg, ${NEON.violeta} 0deg 12deg, ${NEON.noche} 12deg 24deg, ${NEON.rosa} 24deg 36deg, ${NEON.noche} 36deg 48deg)`,
                opacity: 0.9,
              }}
            />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle, #fff 0%, transparent 18%, rgba(0,0,0,0.6) 70%)" }} />
            {/* partículas que van hacia el centro */}
            {Array.from({ length: 40 }, (_, i) => {
              const ang = random(`pa-${i}`) * Math.PI * 2 + frame * 0.08;
              const r = ((1 - ((frame * 0.02 + random(`pr-${i}`)) % 1)) * 600) * (1 - succion * 0.3);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: pantallaW / 2 + Math.cos(ang) * r,
                    top: pantallaH / 2 + Math.sin(ang) * r,
                    width: 8,
                    height: 8,
                    background: i % 2 ? NEON.cian : NEON.amarillo,
                    boxShadow: `0 0 10px ${i % 2 ? NEON.cian : NEON.amarillo}`,
                  }}
                />
              );
            })}
            {/* "Promo 2026" chupada por la pantalla */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transform: `rotate(${succion * 720}deg) scale(${1 - succion})`,
                opacity: 1 - succion * 0.6,
              }}
            >
              <div
                style={{
                  fontFamily: FUENTE_CROMO,
                  fontWeight: 900,
                  fontSize: 84,
                  color: "white",
                  textShadow: `0 0 20px ${NEON.cian}, 6px 6px 0 ${NEON.rosa}`,
                  whiteSpace: "nowrap",
                }}
              >
                {promocion.toUpperCase()}
              </div>
            </div>
            <AbsoluteFill
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 2px, transparent 2px, transparent 4px)",
              }}
            />
          </div>
          {/* panel de perillas */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center", flex: 1 }}>
            {[0, 1].map((k) => (
              <div
                key={k}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at 35% 35%, #ddd, #555)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.6)",
                  transform: `rotate(${k ? -frame * 9 : frame * 6}deg)`,
                  position: "relative",
                }}
              >
                <div style={{ position: "absolute", left: 50, top: 8, width: 10, height: 40, background: "#222", borderRadius: 4 }} />
              </div>
            ))}
            <div style={{ width: 140, height: 160, background: "repeating-linear-gradient(0deg, #2a1a10 0 8px, #6b4a30 8px 14px)", borderRadius: 10 }} />
          </div>
        </div>
      </AbsoluteFill>
      <VHS intensidad={0.6} />
      <AbsoluteFill style={{ background: "white", opacity: blanco }} />
    </AbsoluteFill>
  );
};

/* ───────────── 3. Bienvenidos a 1986 ───────────── */
export const EscenaTituloRetro: React.FC<ColacionProps> = ({ anioRetro, fechaRetro }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sol = interpolate(frame, [0, 40], [0.3, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const script = spring({ frame: frame - 4, fps, config: { damping: 10 } });
  const cromo = spring({ frame, fps, config: { damping: 12 } });
  const brillo = interpolate(frame, [15, 55], [-30, 130], clamp);
  const flash = interpolate(frame, [0, 8], [1, 0], clamp);

  return (
    <AbsoluteFill>
      <Synthwave subidaSol={sol} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingBottom: 120 }}>
        <div
          style={{
            fontFamily: FUENTE_CROMO,
            fontSize: 330,
            fontWeight: 900,
            letterSpacing: 10,
            backgroundImage: `linear-gradient(100deg, transparent ${brillo - 10}%, rgba(255,255,255,0.95) ${brillo}%, transparent ${brillo + 10}%), linear-gradient(180deg, #e8f7ff 0%, #7fd6ff 45%, #1b1b5a 50%, #ff9ee8 70%, #ffffff 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "2px rgba(255,255,255,0.5)",
            filter: `drop-shadow(0 8px 0 ${NEON.violeta}) drop-shadow(0 0 30px ${NEON.cian})`,
            transform: `scale(${cromo})`,
          }}
        >
          {anioRetro}
        </div>
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 330,
            fontFamily: FUENTE_SCRIPT,
            fontSize: 130,
            color: NEON.rosa,
            transform: `rotate(-8deg) scale(${script})`,
            textShadow: `0 0 10px ${NEON.rosa}, 0 0 30px ${NEON.rosa}, 0 0 60px ${NEON.rosa}`,
          }}
        >
          Bienvenidos a
        </div>
      </AbsoluteFill>
      <OSD izquierda="PLAY ▶" abajo={`${fechaRetro} ${anioRetro}`} />
      <VHS />
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* ───────────── 4. Fotos grandes, sin textos ───────────── */
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

const Imagen: React.FC<{ foto: Foto; n: number; estilo?: React.CSSProperties }> = ({ foto, n, estilo }) =>
  foto.archivo ? (
    <Img src={staticFile(`fotos/${foto.archivo}`)} style={{ width: "100%", height: "100%", objectFit: "cover", ...estilo }} />
  ) : (
    <Marcador n={n} />
  );

export const EscenaFotos: React.FC<ColacionProps> = ({ fotos, anioRetro, fechaRetro }) => {
  const frame = useCurrentFrame();
  const lista: Foto[] = fotos.length ? fotos : Array.from({ length: 6 }, () => ({ archivo: "", ancho: 16, alto: 9 }));
  const porFoto = ESCENAS.fotos / lista.length;
  const i = Math.min(lista.length - 1, Math.floor(frame / porFoto));
  const t = frame - i * porFoto;
  const foto = lista[i];

  // tamaño: ocupa casi toda la pantalla
  const k = Math.min(960 / foto.alto, 1720 / foto.ancho);
  const w = foto.ancho * k;
  const h = foto.alto * k;
  const zoom = interpolate(t, [0, porFoto], [1.0, 1.05], clamp);
  const lado = i % 2 ? 1 : -1;
  const deriva = interpolate(t, [0, porFoto], [-12, 12], clamp) * lado;
  const glitch = interpolate(t, [0, 7], [1, 0], clamp);
  const revelado = interpolate(t, [0, 10], [0, 1], clamp);
  const segundos = Math.floor(frame / 30);
  const hora = `${String(15 + Math.floor(segundos / 60)).padStart(2, "0")}:${String(24 + (segundos % 60)).padStart(2, "0")}`;

  return (
    <AbsoluteFill style={{ background: NEON.noche }}>
      {/* fondo: la misma foto desenfocada */}
      <AbsoluteFill style={{ filter: "blur(40px) brightness(0.45) saturate(1.3)", transform: "scale(1.2)" }}>
        <Imagen foto={foto} n={i} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NEON.violeta}33, ${NEON.rosa}22)` }} />
      <Glitch fuerza={glitch}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div
            style={{
              width: w,
              height: h,
              padding: 14,
              background: "#f7f3ea",
              boxShadow: "0 30px 90px rgba(0,0,0,0.7)",
              transform: `translateX(${deriva}px) rotate(${lado * 1.2}deg) scale(${zoom})`,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                overflow: "hidden",
                filter: `sepia(${0.1 + (1 - revelado) * 0.5}) contrast(1.06) saturate(1.1) brightness(${0.6 + revelado * 0.4})`,
              }}
            >
              <Imagen foto={foto} n={i} />
            </div>
          </div>
        </AbsoluteFill>
      </Glitch>
      <OSD izquierda="PLAY ▶" derecha="REC ●" abajo={`${fechaRetro} ${anioRetro}  ${hora}`} />
      <VHS intensidad={0.8} />
    </AbsoluteFill>
  );
};

/* ───────────── 5. Atrapados en el pasado: intentan volver… ERROR ───────────── */
export const EscenaFinal: React.FC<ColacionProps> = ({ promocion, anioActual, anioRetro }) => {
  const frame = useCurrentFrame();
  const d = ESCENAS.final;
  const parpadeo = [0, 0, 1, 0, 1, 1, 0, 1][Math.min(7, Math.floor(frame / 3))] ?? 1;
  const encendido = frame > 24 ? 1 : parpadeo;
  const sub = interpolate(frame, [20, 35], [0, 1], clamp);
  // barra de "volver" que se traba en 99 %
  const progreso = interpolate(frame, [45, 80], [0, 99], { ...clamp, easing: Easing.out(Easing.quad) });
  const error = frame >= 88;
  const sinSenal = frame >= 100;
  const glitch = error ? interpolate(frame, [88, 100], [1, 0.4], clamp) : 0;

  if (sinSenal) {
    return (
      <AbsoluteFill>
        <Lluvia />
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "rgba(0,0,0,0.85)", border: "4px solid white", padding: "24px 70px", fontFamily: FUENTE_VHS, fontSize: 100, color: "white", letterSpacing: 6 }}>
            SIN SEÑAL
          </div>
        </AbsoluteFill>
        <VHS intensidad={0.7} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: NEON.noche }}>
      <Glitch fuerza={glitch}>
        <AbsoluteFill style={{ backgroundImage: `radial-gradient(circle at 50% 40%, ${NEON.violeta}55, transparent 60%)` }} />
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 170 }}>
          <div
            style={{
              fontFamily: FUENTE_NEON,
              fontSize: 170,
              color: encendido ? "#ffe9fb" : "#3a1440",
              lineHeight: 1.1,
              textShadow: encendido ? `0 0 8px #fff, 0 0 20px ${NEON.rosa}, 0 0 45px ${NEON.rosa}, 0 0 90px ${NEON.rosa}` : "none",
            }}
          >
            {promocion}
          </div>
          <div
            style={{
              marginTop: 20,
              fontFamily: FUENTE_CROMO,
              fontWeight: 900,
              fontSize: 54,
              letterSpacing: 10,
              color: NEON.cian,
              textShadow: `0 0 14px ${NEON.cian}`,
              opacity: sub,
            }}
          >
            ATRAPADOS EN {anioRetro}
          </div>
          {frame >= 40 ? (
            <div style={{ marginTop: 90, width: 1100, fontFamily: FUENTE_VHS, color: error ? "#ff3b3b" : "white", fontSize: 70 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>▶▶ VOLVER A {anioActual}</span>
                <span style={{ opacity: !error && frame > 80 && Math.floor(frame / 5) % 2 ? 0.2 : 1 }}>
                  {error ? "ERROR" : `${Math.round(progreso)}%`}
                </span>
              </div>
              <div style={{ marginTop: 16, height: 46, border: `5px solid ${error ? "#ff3b3b" : "white"}`, padding: 6 }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progreso}%`,
                    background: error ? "#ff3b3b" : `repeating-linear-gradient(90deg, ${NEON.cian} 0 28px, transparent 28px 36px)`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </AbsoluteFill>
      </Glitch>
      <OSD izquierda={error ? "■ STOP" : "PLAY ▶"} />
      <VHS intensidad={error ? 1.5 : 0.8} />
    </AbsoluteFill>
  );
};
