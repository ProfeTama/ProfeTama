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
import { AlbumProps, armarAlbum, COLORES_M, FotoAlbum, HojaAlbum, MEMPHIS, TA } from "./config";
import { Confeti } from "./memphis";
import { Camara, Celular, Destello, GameBoy, Lentes3D, Patin, Pizza, Rubik, Tele, Vinilo, Walkman } from "./pegatinas2";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const W = 1800;
const H = 1000;

// Pegatinas SIN texto
const STICKERS = [
  PEGATINAS[0], // estrella
  () => <Camara />,
  PEGATINAS[1], // corazón
  () => <GameBoy />,
  PEGATINAS[2], // casete
  () => <Pizza />,
  PEGATINAS[4], // carita
  () => <Tele />,
  PEGATINAS[5], // rayo
  () => <Celular />,
  PEGATINAS[8], // arcoíris
  () => <Destello />,
];

const DECOR = [
  () => <Vinilo />,
  () => <Rubik />,
  () => <Walkman />,
  () => <Patin />,
  () => <Lentes3D />,
  PEGATINAS[2],
  () => <Tele />,
  () => <GameBoy />,
  PEGATINAS[0],
  () => <Camara />,
  PEGATINAS[1],
  () => <Destello />,
];

// Disposición automática tipo "collage justificado": reparte las fotos en 1, 2 o 3 filas
// para que ocupen la mayor superficie posible de la hoja, respetando su forma.
type Lugar = [number, number, number, number];
const AREA = { x: 205, y: 118, w: 1540, h: 780 };
const GAP = 46;

// Divide las fotos en filas que llenan TODO el ancho y TODO el alto de la hoja.
// Cada foto se recorta un poco si hace falta (sin deformar); se elige el reparto que menos recorta.
const disponer = (fotos: FotoAlbum[], semilla: string): Lugar[] => {
  const n = fotos.length;
  const asp = fotos.map((f) => f.ancho / f.alto);
  if (n === 1) {
    const a = Math.max(asp[0], 0.75);
    let h = AREA.h;
    let w = h * a;
    if (w > AREA.w) {
      w = AREA.w;
      h = w / a;
    }
    return [[AREA.x + AREA.w / 2, AREA.y + AREA.h / 2, w, h]];
  }
  // todas las particiones en filas consecutivas (n <= 8)
  const particiones: number[][] = [];
  const rec = (resto: number, acc: number[]) => {
    if (resto === 0) {
      if (acc.length <= 3) particiones.push(acc);
      return;
    }
    for (let k = 1; k <= Math.min(4, resto); k++) rec(resto - k, [...acc, k]);
  };
  rec(n, []);
  let mejor: { costo: number; lugares: Lugar[] } | null = null;
  for (const filas of particiones) {
    const r = filas.length;
    const sumas: number[] = [];
    let idx = 0;
    filas.forEach((k) => {
      sumas.push(asp.slice(idx, idx + k).reduce((x, y) => x + y, 0));
      idx += k;
    });
    // alto ideal de cada fila proporcional a 1/suma de proporciones
    const pesos = sumas.map((s2, fi) => (AREA.w - GAP * (filas[fi] - 1)) / s2);
    const totalAlto = AREA.h - GAP * (r - 1);
    const escala = totalAlto / pesos.reduce((x, y) => x + y, 0);
    const alturas = pesos.map((p) => p * escala);
    let costo = 0;
    const lugares: Lugar[] = [];
    let y = AREA.y;
    idx = 0;
    filas.forEach((k, fi) => {
      const h = alturas[fi];
      const anchoUtil = AREA.w - GAP * (k - 1);
      let x = AREA.x;
      for (let j = 0; j < k; j++) {
        const i = idx + j;
        const w = (asp[i] / sumas[fi]) * anchoUtil;
        const celda = w / h;
        costo += Math.abs(Math.log(celda / asp[i])) * (w * h);
        if (celda / asp[i] > 1.5 || asp[i] / celda > 1.5) costo += 1e12; // recorte excesivo
        const jx = (random(`${semilla}-jx${i}`) - 0.5) * 14;
        const jy = (random(`${semilla}-jy${i}`) - 0.5) * 14;
        lugares[i] = [x + w / 2 + jx, y + h / 2 + jy, w, h];
        x += w + GAP;
      }
      idx += k;
      y += h + GAP;
    });
    if (!mejor || costo < mejor.costo) mejor = { costo, lugares };
  }
  return mejor!.lugares;
};

const EFECTOS = ["caida", "desliza", "giro", "flash", "revelado", "zoom"] as const;
type Efecto = (typeof EFECTOS)[number];

/* ───────── Foto con marco rasgado de color + efecto de entrada ───────── */
const FotoPegada: React.FC<{ foto: FotoAlbum; lugar: Lugar; t: number; n: number; efecto: Efecto; conPegatina: boolean }> = ({
  foto,
  lugar,
  t,
  n,
  efecto,
  conPegatina,
}) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;
  const [cx, cy, mw, mh] = lugar;
  const w = mw;
  const h = mh;
  const sem = `f${n}`;
  const ang = (random(`${sem}-a`) - 0.5) * 7;
  const color = COLORES_M[n % COLORES_M.length];

  let tx = 0;
  let ty = 0;
  let rot = ang;
  let esc = 1;
  let flash = 0;
  let revela = 1;
  let opac = 1;
  if (efecto === "caida") {
    const s = spring({ frame: t, fps, config: { damping: 11, stiffness: 140 } });
    ty = (1 - s) * -1100;
    rot = ang + (1 - s) * 25;
  } else if (efecto === "desliza") {
    const s = spring({ frame: t, fps, config: { damping: 16, stiffness: 120 } });
    tx = (1 - s) * (cx < W / 2 ? -1500 : 1500);
    rot = ang + (1 - s) * (cx < W / 2 ? -20 : 20);
  } else if (efecto === "giro") {
    const s = spring({ frame: t, fps, config: { damping: 13 } });
    esc = s;
    rot = ang - (1 - s) * 220;
  } else if (efecto === "flash") {
    esc = interpolate(t, [0, 8], [1.18, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    flash = interpolate(t, [0, 3, 14], [0, 1, 0], clamp);
    opac = interpolate(t, [0, 2], [0, 1], clamp);
  } else if (efecto === "revelado") {
    esc = spring({ frame: t, fps, config: { damping: 15 } }) * 0.08 + 0.92;
    revela = interpolate(t, [4, 34], [0, 1], clamp);
    opac = interpolate(t, [0, 5], [0, 1], clamp);
  } else {
    const s = spring({ frame: t, fps, config: { damping: 8, stiffness: 160 } });
    esc = s;
  }
  const cinta = interpolate(t, [10, 18], [0, 1], clamp);
  const marco = 26;

  // pegatina
  const tp = t - 14;
  const tipoPeg = Math.floor(random(`${sem}-p`) * STICKERS.length);
  const Peg = STICKERS[tipoPeg];
  const efPeg = n % 3;
  const sp = spring({ frame: tp, fps, config: { damping: 8, stiffness: 170 } });
  const pegEstilo: React.CSSProperties =
    efPeg === 0
      ? { transform: `scale(${sp}) rotate(${(random(`${sem}-r`) - 0.5) * 30 + Math.sin(tp / 9) * 4}deg)` }
      : efPeg === 1
        ? { transform: `perspective(600px) rotateX(${(1 - sp) * 85}deg) scale(${0.6 + sp * 0.4})`, opacity: tp > 0 ? 1 : 0 }
        : { transform: `rotate(${(1 - sp) * 360 + Math.sin(tp / 8) * 5}deg) scale(${sp})` };
  const esquina = Math.floor(random(`${sem}-e`) * 4);
  const posPeg: React.CSSProperties = [
    { right: -60, top: -60 },
    { left: -60, bottom: -60 },
    { right: -60, bottom: -60 },
    { left: -60, top: -60 },
  ][esquina];
  const escPeg = Math.min(1, Math.max(0.5, Math.min(w, h) / 380));

  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2 - marco,
        top: cy - h / 2 - marco,
        width: w + marco * 2,
        height: h + marco * 2,
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${esc})`,
        opacity: opac,
      }}
    >
      {/* marco de papel de color rasgado */}
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(4px 8px 8px rgba(0,0,0,0.35))" }}>
        <div style={{ position: "absolute", inset: 0, background: color, clipPath: rasgado(`${sem}-m`, 1.8, 1.3) }} />
        {/* borde blanco + foto */}
        <div style={{ position: "absolute", inset: marco - 10, background: "#fffdf6", padding: 10 }}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", background: "#ddd" }}>
            {foto.archivo ? (
              <Img
                src={staticFile(`fotos/${foto.archivo}`)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 35%",
                  filter: `sepia(${(1 - revela) * 0.9}) brightness(${0.25 + revela * 0.75}) contrast(1.05)`,
                }}
              />
            ) : (
              <AbsoluteFill style={{ background: "#e8ddd0", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", fontSize: 40, color: "#666" }}>
                Tu foto
              </AbsoluteFill>
            )}
            <AbsoluteFill style={{ background: "white", opacity: flash }} />
          </div>
        </div>
      </div>
      <Textura id={`t-${sem}`} opacidad={0.08} />
      {/* cinta washi */}
      <div style={{ opacity: cinta }}>
        <Cinta
          color={COLORES_M[(n + 3) % COLORES_M.length]}
          patron={n}
          ancho={Math.min(170, w * 0.45)}
          estilo={{ left: -30, top: -8, transform: `rotate(-35deg) scaleX(${cinta})`, transformOrigin: "left" }}
        />
      </div>
      {conPegatina ? (
        <div style={{ position: "absolute", ...posPeg, ...pegEstilo }}>
          <div style={{ transform: `scale(${escPeg})` }}>
            <Peg />
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ───────── Hoja del álbum ───────── */
const lugaresConfeti = (indice: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    out.push([260 + i * 270 + (random(`cx${indice}-${i}`) - 0.5) * 120, 48 + random(`cy${indice}-${i}`) * 20]);
    out.push([300 + i * 260 + (random(`bx${indice}-${i}`) - 0.5) * 120, 958 + random(`by${indice}-${i}`) * 18]);
  }
  return out.filter((_, i) => random(`keep${indice}-${i}`) > 0.35);
};

// Pegatinas retro en las esquinas de la hoja (aparecen después de las fotos)
const ESQUINAS: [number, number][] = [
  [255, 95],
  [1720, 95],
  [1720, 925],
  [255, 925],
  [985, 55],
  [985, 955],
];
const Decoracion: React.FC<{ hoja: HojaAlbum; t: number }> = ({ hoja, t }) => {
  const { fps } = useVideoConfig();
  const n = 3 + (hoja.indice % 2);
  const inicio = TA.inicio + (hoja.fotos.length - 1) * hoja.paso + 18;
  const elegidas = [0, 1, 2, 3, 4, 5].sort((a, b) => random(`de${hoja.indice}${a}`) - random(`de${hoja.indice}${b}`)).slice(0, n);
  return (
    <>
      {elegidas.map((e, k) => {
        const tt = t - inicio - k * 6;
        if (tt < 0) return null;
        const s = spring({ frame: tt, fps, config: { damping: 8, stiffness: 170 } });
        const [x, y] = ESQUINAS[e];
        const D = DECOR[Math.floor(random(`dk${hoja.indice}-${e}`) * DECOR.length)];
        const rot = (random(`dr${hoja.indice}-${e}`) - 0.5) * 40 + Math.sin(tt / 10) * 4;
        return (
          <div key={e} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})` }}>
            <D />
          </div>
        );
      })}
    </>
  );
};

const PaginaAlbum: React.FC<{ hoja: HojaAlbum; t: number }> = ({ hoja, t }) => {
  const n = hoja.fotos.length;
  const lugares = disponer(hoja.fotos, `d${hoja.indice}`);
  const paso = hoja.paso;
  return (
    <Hoja indice={hoja.indice}>
      {t >= 0 ? <Confeti lugares={lugaresConfeti(hoja.indice)} semilla={`h${hoja.indice}`} desde={2} tam={64} /> : null}
      <Decoracion hoja={hoja} t={t} />
      {hoja.fotos.map((foto, i) => {
        const g = hoja.primera + i;
        return (
          <FotoPegada
            key={i}
            foto={foto}
            lugar={lugares[i]}
            t={t - TA.inicio - i * paso}
            n={g}
            efecto={EFECTOS[(hoja.indice * 2 + i) % EFECTOS.length]}
            conPegatina={(hoja.primera + i) % 3 === 1}
          />
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
  const etiqueta = spring({ frame: t - 22, fps, config: { damping: 11 } });
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
            <div style={{ fontFamily: RETRO, fontSize: 160, color: MEMPHIS.rosa, textShadow: `7px 7px 0 ${MEMPHIS.turquesa}`, lineHeight: 1 }}>{titulo}</div>
            <div style={{ fontFamily: MANUSCRITA, fontSize: 72, color: "#1d3a8a", marginTop: 16 }}>{subtitulo}</div>
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
