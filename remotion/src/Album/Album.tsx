import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MANUSCRITA, RETRO } from "../Cuaderno/fuentes";
import { Cinta, Espiral, Hoja, rasgado, Textura } from "../Cuaderno/papel";
import { PEGATINAS } from "../Cuaderno/pegatinas";
import { AlbumProps, armarAlbum, COLORES_M, HojaAlbum, MEMPHIS, TA } from "./config";
import { Confeti, Figura } from "./memphis";
import { LISTA_PEGATINAS } from "./Recursos";
import { Camara, Celular, Destello, GameBoy, Lentes3D, Patin, Pizza, Rubik, Tele, Vinilo, Walkman } from "./pegatinas2";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1800;
const H = 1000;

// Pegatinas SIN texto


// Las hojas se diseñan con scripts/disenar_hojas.py (paginas.json): fotos completas, sin recorte.
import type { FotoHoja } from "./config";
const EFECTOS = ["caida", "desliza", "giro", "pop", "sube", "zoom"] as const;
type Efecto = (typeof EFECTOS)[number];
const MARCO = 16; // borde blanco del marco (la foto no se toca)

/* ───────── Foto completa con marco rasgado de color + efecto de entrada ───────── */
const FotoPegada: React.FC<{ foto: FotoHoja; t: number; n: number; efecto: Efecto }> = ({ foto, t, n, efecto }) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;
  const { cx, cy, w, h } = foto;
  const sem = `f${n}`;
  const ang = foto.rot;
  const color = COLORES_M[n % COLORES_M.length];
  let tx = 0, ty = 0, rot = ang, esc = 1, opac = 1;
  if (efecto === "caida") {
    const s = spring({ frame: t, fps, config: { damping: 11, stiffness: 140 } });
    ty = (1 - s) * -1100; rot = ang + (1 - s) * 25;
  } else if (efecto === "desliza") {
    const s = spring({ frame: t, fps, config: { damping: 16, stiffness: 120 } });
    tx = (1 - s) * (cx < 900 ? -1500 : 1500); rot = ang + (1 - s) * (cx < 900 ? -20 : 20);
  } else if (efecto === "giro") {
    const s = spring({ frame: t, fps, config: { damping: 13 } });
    esc = s; rot = ang - (1 - s) * 220;
  } else if (efecto === "pop") {
    esc = spring({ frame: t, fps, config: { damping: 9, stiffness: 170 } }) * 0.4 + 0.6;
    opac = interpolate(t, [0, 5], [0, 1], clamp);
  } else if (efecto === "sube") {
    const s = spring({ frame: t, fps, config: { damping: 15 } });
    ty = (1 - s) * 260; opac = interpolate(t, [0, 6], [0, 1], clamp);
  } else {
    esc = spring({ frame: t, fps, config: { damping: 8, stiffness: 160 } });
  }
  const cinta = interpolate(t, [10, 18], [0, 1], clamp);
  const borde = 10; // papel de color que asoma alrededor del borde blanco
  const W = w + 2 * MARCO + 2 * borde;
  const H = h + 2 * MARCO + 2 * borde;
  return (
    <div style={{ position: "absolute", left: cx - W / 2, top: cy - H / 2, width: W, height: H, transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${esc})`, opacity: opac }}>
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(4px 8px 8px rgba(0,0,0,0.35))" }}>
        <div style={{ position: "absolute", inset: 0, background: color, clipPath: rasgado(`${sem}-m`, 1.4, 1.2) }} />
        <div style={{ position: "absolute", left: borde, top: borde, width: w + 2 * MARCO, height: h + 2 * MARCO, background: "#fffdf6" }}>
          <Img src={staticFile(`fotos/${foto.archivo}`)} style={{ position: "absolute", left: MARCO, top: MARCO, width: w, height: h }} />
        </div>
      </div>
      <div style={{ opacity: cinta }}>
        <Cinta color={COLORES_M[(n + 3) % COLORES_M.length]} patron={n} ancho={Math.min(150, w * 0.4)}
          estilo={{ left: -26, top: -6, transform: `rotate(-35deg) scaleX(${cinta})`, transformOrigin: "left" }} />
      </div>
    </div>
  );
};

const PaginaAlbum: React.FC<{ hoja: HojaAlbum; t: number }> = ({ hoja, t }) => {
  const { fps } = useVideoConfig();
  const paso = hoja.paso;
  const finFotos = TA.inicio + (hoja.fotos.length - 1) * paso + 16;
  return (
    <Hoja indice={hoja.indice}>
      {t >= 0
        ? hoja.figuras.map((f, i) => {
            const s = spring({ frame: t - 2 - i * 2, fps, config: { damping: 10, stiffness: 160 } });
            return (
              <div key={`f${i}`} style={{ position: "absolute", left: f.x, top: f.y + Math.sin((t + i * 17) / 18) * 4, transform: `translate(-50%, -50%) rotate(${f.rot}deg) scale(${s})` }}>
                <Figura tipo={f.tipo % 10} color={COLORES_M[Math.floor(f.tipo / 10) % COLORES_M.length]} tam={f.s} />
              </div>
            );
          })
        : null}
      {hoja.fotos.map((foto, i) => (
        <FotoPegada key={i} foto={foto} t={t - TA.inicio - i * paso} n={hoja.primera + i} efecto={EFECTOS[(hoja.indice * 2 + i) % EFECTOS.length]} />
      ))}
      {hoja.pegatinas.map((p, k) => {
        const tt = t - finFotos - k * 6;
        if (tt < 0) return null;
        const s = spring({ frame: tt, fps, config: { damping: 8, stiffness: 170 } });
        const P = LISTA_PEGATINAS[p.tipo % LISTA_PEGATINAS.length][1];
        return (
          <div key={`p${k}`} style={{ position: "absolute", left: p.x, top: p.y, width: 0, height: 0 }}>
            <div style={{ position: "absolute", left: -p.s / 2, top: -p.s / 2, width: p.s, height: p.s, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `rotate(${p.rot + Math.sin(tt / 10) * 4}deg) scale(${s * (p.s / 150)})` }}>
              <P />
            </div>
          </div>
        );
      })}
    </Hoja>
  );
};

/* ───────── Tapa y contratapa estilo Memphis ───────── */
const grilla = (sem: string, cant: number): [number, number][] =>
  Array.from({ length: cant }, (_, i) => [
    ((i % 8) + 0.5) * (W / 8) + (random(`${sem}x${i}`) - 0.5) * 160,
    (Math.floor(i / 8) + 0.5) * (H / Math.ceil(cant / 8)) + (random(`${sem}y${i}`) - 0.5) * 110,
  ]);

const Logo: React.FC<{ t: number; tam: number }> = ({ t, tam }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: t, fps, config: { damping: 9, stiffness: 120 } });
  return (
    <Img
      src={staticFile("album/logo.png")}
      style={{
        width: tam,
        transform: `scale(${s}) rotate(${(1 - s) * -180 + Math.sin(t / 25) * 3}deg)`,
        filter: "drop-shadow(6px 10px 10px rgba(0,0,0,0.5))",
      }}
    />
  );
};

const Tapa: React.FC<{ titulo: string; subtitulo: string; t: number }> = ({ titulo, subtitulo, t }) => {
  const { fps } = useVideoConfig();
  const etiqueta = spring({ frame: t - 14, fps, config: { damping: 11 } });
  // efecto máquina de escribir
  const t1 = 30, v1 = 3.2; // título: una letra cada ~3 frames
  const n1 = Math.max(0, Math.min(titulo.length, Math.floor((t - t1) / v1)));
  const t2 = t1 + titulo.length * v1 + 8, v2 = 1.6;
  const n2 = Math.max(0, Math.min(subtitulo.length, Math.floor((t - t2) / v2)));
  const escribiendo2 = t >= t2;
  const cursor = Math.floor(t / 8) % 2 === 0 ? 1 : 0;
  const Cursor: React.FC<{ color: string; alto: number }> = ({ color, alto }) => (
    <span style={{ display: "inline-block", width: alto * 0.08, height: alto * 0.85, background: color, marginLeft: 6, verticalAlign: "-0.08em", opacity: cursor }} />
  );
  return (
    <AbsoluteFill style={{ background: MEMPHIS.fondo, overflow: "hidden" }}>
      <Confeti lugares={grilla("tapa", 56)} semilla="tapa" desde={0} tam={105} />
      <Textura id="tex-tapa2" opacidad={0.2} />
      <div style={{ position: "absolute", left: 190, top: 40 }}>
        <Logo t={t - 6} tam={270} />
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", paddingTop: 230 }}>
        <div style={{ transform: `rotate(-3deg) scale(${etiqueta})`, filter: "drop-shadow(8px 12px 12px rgba(0,0,0,0.55))" }}>
          <div style={{ background: "#fffdf6", clipPath: rasgado("tapa2", 1.2, 1), padding: "60px 120px", textAlign: "center" }}>
            <div style={{ position: "relative", fontFamily: RETRO, fontSize: 160, color: MEMPHIS.rosa, textShadow: `7px 7px 0 ${MEMPHIS.turquesa}`, lineHeight: 1, whiteSpace: "pre" }}>
              <span style={{ visibility: "hidden" }}>{titulo}</span>
              <span style={{ position: "absolute", left: 0, top: 0 }}>{titulo.slice(0, n1)}{!escribiendo2 ? <Cursor color={MEMPHIS.rosa} alto={160} /> : null}</span>
            </div>
            <div style={{ position: "relative", fontFamily: MANUSCRITA, fontSize: 72, color: "#1d3a8a", marginTop: 16, whiteSpace: "pre" }}>
              <span style={{ visibility: "hidden" }}>{subtitulo}</span>
              <span style={{ position: "absolute", left: 0, top: 0 }}>{subtitulo.slice(0, n2)}{escribiendo2 ? <Cursor color="#1d3a8a" alto={72} /> : null}</span>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Contratapa: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: MEMPHIS.fondo, overflow: "hidden" }}>
    <Confeti lugares={grilla("contra", 56)} semilla="contra" desde={4} tam={105} />
    <Textura id="tex-contra" opacidad={0.2} />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Logo t={t - 10} tam={380} />
    </AbsoluteFill>
  </AbsoluteFill>
);

/** Hoja que gira sobre el espiral izquierdo */
const Girando: React.FC<{ progreso: number; children: React.ReactNode }> = ({ progreso, children }) => {
  const ang = interpolate(progreso, [0, 1], [0, -100]);
  if (ang <= -90) return null;
  const sombra = Math.sin((Math.abs(ang) / 100) * Math.PI) * 0.5;
  return (
    <AbsoluteFill style={{ transformOrigin: "0% 50%", transform: `perspective(2600px) rotateY(${ang}deg)` }}>
      {children}
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${sombra * 0.2}), rgba(0,0,0,${sombra}))` }} />
    </AbsoluteFill>
  );
};

/* ───────── Composición ───────── */
export const Album: React.FC<AlbumProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { hojas } = armarAlbum(props);
  const ultima = hojas[hojas.length - 1];
  const finHojas = ultima.inicio + ultima.duracion - TA.giro; // la última no gira: se da vuelta el álbum

  let actual = -1;
  hojas.forEach((h, i) => {
    if (frame >= h.inicio) actual = i;
  });

  let contenido: React.ReactNode;
  let espiralDerecha = false;
  let volteo = 1; // escala X del cuaderno al darlo vuelta

  if (actual === -1) {
    const giro = interpolate(frame, [TA.tapa - TA.giro, TA.tapa], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    contenido = (
      <>
        <PaginaAlbum hoja={hojas[0]} t={frame - TA.tapa} />
        <Girando progreso={giro}>
          <Tapa titulo={props.tituloTapa} subtitulo={props.subtituloTapa} t={frame} />
        </Girando>
      </>
    );
  } else if (frame >= finHojas) {
    // se da vuelta el álbum: aparece la contratapa (espiral a la derecha)
    const t = frame - finHojas;
    const mitad = TA.volteo / 2;
    if (t < mitad) {
      volteo = interpolate(t, [0, mitad], [1, 0], { ...clamp, easing: Easing.in(Easing.quad) });
      contenido = <PaginaAlbum hoja={ultima} t={frame - ultima.inicio} />;
    } else {
      volteo = interpolate(t, [mitad, TA.volteo], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
      espiralDerecha = true;
      contenido = <Contratapa t={t - mitad} />;
    }
  } else {
    const h = hojas[actual];
    const t = frame - h.inicio;
    const siguiente = hojas[actual + 1];
    const inicioGiro = h.duracion - TA.giro;
    const giro = interpolate(t, [inicioGiro, h.duracion], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    contenido = siguiente ? (
      <>
        {t >= inicioGiro ? <PaginaAlbum hoja={siguiente} t={t - h.duracion} /> : null}
        <Girando progreso={giro}>
          <PaginaAlbum hoja={h} t={t} />
        </Girando>
      </>
    ) : (
      <PaginaAlbum hoja={h} t={t} />
    );
  }

  const fundido = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], clamp);

  // sonidos: vuelta de hoja + "pop" de algunas pegatinas
  const pops: number[] = [];
  hojas.forEach((h) => {
    h.fotos.forEach((_, i) => {
      if ((h.primera + i) % 3 === 1 && (h.primera + i) % 2 === 0) pops.push(h.inicio + TA.inicio + i * h.paso + 14);
    });
    if (h.fotos.length > 1) pops.push(h.inicio + TA.inicio + (h.fotos.length - 1) * h.paso + 18); // primera pegatina decorativa
  });
  const vueltas = [TA.tapa - TA.giro, ...hojas.slice(0, -1).map((h) => h.inicio + h.duracion - TA.giro), finHojas];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fundido, background: "repeating-linear-gradient(90deg, #6b4428 0 140px, #5d3a22 140px 150px, #74492b 150px 300px)" }}>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,220,170,0.18), rgba(0,0,0,0.55))" }} />
        <div
          style={{
            position: "absolute",
            left: (1920 - W) / 2 + (espiralDerecha ? -20 : 20),
            top: (1080 - H) / 2,
            width: W,
            height: H,
            transform: `scaleX(${volteo})`,
            boxShadow: espiralDerecha
              ? "0 30px 70px rgba(0,0,0,0.6), -6px 6px 0 #e9e1c9, -12px 12px 0 #ddd3b6"
              : "0 30px 70px rgba(0,0,0,0.6), 6px 6px 0 #e9e1c9, 12px 12px 0 #ddd3b6",
          }}
        >
          {contenido}
          {espiralDerecha ? (
            <div style={{ position: "absolute", inset: 0, transform: "scaleX(-1)" }}>
              <Espiral />
            </div>
          ) : (
            <Espiral />
          )}
        </div>
      </AbsoluteFill>
      {vueltas.map((f, i) => (
        <Sequence key={`v${i}`} from={f} durationInFrames={30}>
          <Audio src={staticFile("audio/sfx-pagina.mp3")} volume={0.85} />
        </Sequence>
      ))}
      {pops.map((f, i) => (
        <Sequence key={`p${i}`} from={f} durationInFrames={20}>
          <Audio src={staticFile("audio/sfx-pegatina.mp3")} volume={0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
