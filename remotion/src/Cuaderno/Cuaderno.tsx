import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  Loop,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { armarPaginas, CuadernoProps, FotoCuaderno, Pagina, PALETA, T } from "./config";
import { MANUSCRITA, MARCADOR, RETRO } from "./fuentes";
import { Cinta, COLORES, Espiral, Hoja, rasgado, Textura } from "./papel";
import { Garabato, PEGATINAS } from "./pegatinas";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ANCHO_HOJA = 1800;
const ALTO_HOJA = 1000;

// Lugares para las fotos según cuántas hay en la página (centro x, centro y, ancho máx, alto máx)
const LUGARES: Record<number, [number, number, number, number][]> = {
  1: [[990, 520, 1150, 760]],
  2: [
    [590, 530, 710, 660],
    [1380, 490, 710, 660],
  ],
  3: [
    [580, 360, 640, 470],
    [1380, 380, 640, 470],
    [990, 740, 600, 420],
  ],
};

/* ───────── Foto pegada: papel de color + papel blanco rasgado + cinta + pegatina ───────── */
const Recorte: React.FC<{ foto: FotoCuaderno; lugar: [number, number, number, number]; semilla: string; t: number; n: number }> = ({
  foto,
  lugar,
  semilla,
  t,
  n,
}) => {
  const { fps } = useVideoConfig();
  if (t < 0) return null;
  const [cx, cy, mw, mh] = lugar;
  const k = Math.min(mw / foto.ancho, mh / foto.alto);
  const w = foto.ancho * k;
  const h = foto.alto * k;
  const ang = (random(`${semilla}-a`) - 0.5) * 9;
  const pegado = spring({ frame: t, fps, config: { damping: 14, stiffness: 180 } });
  const escala = interpolate(pegado, [0, 1], [1.35, 1]);
  const giro = interpolate(pegado, [0, 1], [ang - 14, ang]);
  const color = COLORES[Math.floor(random(`${semilla}-c`) * COLORES.length)];
  const color2 = COLORES[(n + 2) % COLORES.length];
  const pegatina = spring({ frame: t - 16, fps, config: { damping: 9 } });
  const cinta = spring({ frame: t - 6, fps, config: { damping: 200 } });
  const Peg = PEGATINAS[Math.floor(random(`${semilla}-p`) * PEGATINAS.length)];
  const esquina = random(`${semilla}-e`) > 0.5;
  const margen = 22;

  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2 - margen,
        top: cy - h / 2 - margen,
        width: w + margen * 2,
        height: h + margen * 2,
        transform: `rotate(${giro}deg) scale(${escala})`,
        opacity: interpolate(t, [0, 4], [0, 1], clamp),
      }}
    >
      {/* papeles de color rasgados detrás */}
      <div style={{ position: "absolute", inset: -34, transform: `rotate(${-ang * 0.8 - 4}deg)`, filter: "drop-shadow(2px 4px 4px rgba(0,0,0,0.25))" }}>
        <div style={{ position: "absolute", inset: 0, background: color, clipPath: rasgado(`${semilla}-f1`, 2.4, 2) }} />
      </div>
      <div style={{ position: "absolute", left: "35%", right: -50, top: -50, height: "45%", transform: `rotate(${ang + 6}deg)` }}>
        <div style={{ position: "absolute", inset: 0, background: color2, opacity: 0.9, clipPath: rasgado(`${semilla}-f2`, 3, 3) }} />
      </div>
      {/* papel blanco rasgado con la foto */}
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(4px 8px 8px rgba(0,0,0,0.35))" }}>
        <div style={{ position: "absolute", inset: 0, background: "#fffdf6", clipPath: rasgado(`${semilla}-b`, 1.2, 1.1) }}>
          <div style={{ position: "absolute", inset: margen, overflow: "hidden" }}>
            {foto.archivo ? (
              <Img src={staticFile(`fotos/${foto.archivo}`)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) saturate(1.08) sepia(0.08)" }} />
            ) : (
              <AbsoluteFill style={{ background: `linear-gradient(135deg, ${color}, ${color2})`, justifyContent: "center", alignItems: "center", fontFamily: MARCADOR, fontSize: 70, color: "white" }}>
                FOTO {n + 1}
              </AbsoluteFill>
            )}
          </div>
          <Textura id={`tx-${semilla}`} opacidad={0.12} />
        </div>
      </div>
      {/* cintas */}
      <div style={{ opacity: cinta }}>
        <Cinta color={COLORES[(n + 1) % COLORES.length]} patron={n} estilo={{ left: -40, top: -6, transform: `rotate(-38deg) scaleX(${cinta})` }} />
        <Cinta color={COLORES[(n + 3) % COLORES.length]} patron={n + 1} estilo={{ right: -40, bottom: -6, transform: `rotate(-38deg) scaleX(${cinta})` }} />
      </div>
      {/* pegatina */}
      <div
        style={{
          position: "absolute",
          ...(esquina ? { right: -70, top: -70 } : { left: -70, bottom: -70 }),
          transform: `scale(${pegatina}) rotate(${(random(`${semilla}-r`) - 0.5) * 40}deg)`,
        }}
      >
        <Peg />
      </div>
    </div>
  );
};

/* ───────── Página completa ───────── */
const PaginaCuaderno: React.FC<{ pagina: Pagina; t: number; nota: string; base: number }> = ({ pagina, t, nota, base }) => {
  const lugares = LUGARES[pagina.fotos.length];
  const escrito = interpolate(t, [2, 26], [0, 100], clamp);
  const garabato = interpolate(t, [10, 50], [0, 1], clamp);
  const colorNota = [PALETA.rosa, PALETA.tinta, PALETA.violeta, "#d1495b"][pagina.indice % 4];
  return (
    <Hoja indice={pagina.indice}>
      {nota ? (
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 38,
            fontFamily: MARCADOR,
            fontSize: 74,
            color: colorNota,
            transform: "rotate(-3deg)",
            clipPath: `inset(-20% ${100 - escrito}% -20% -5%)`,
            whiteSpace: "nowrap",
          }}
        >
          {nota}
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 90, top: 40, transform: "rotate(8deg)" }}>
        <Garabato tipo={pagina.indice * 2} progreso={garabato} color={colorNota} />
      </div>
      <div style={{ position: "absolute", left: 230, bottom: 30, transform: "rotate(-6deg)" }}>
        <Garabato tipo={pagina.indice * 2 + 1} progreso={garabato} />
      </div>
      {pagina.fotos.map((foto, i) => (
        <Recorte
          key={i}
          foto={foto}
          lugar={lugares[i]}
          semilla={`p${pagina.indice}-${i}`}
          t={t - T.inicioPagina - i * T.porFoto}
          n={base + i}
        />
      ))}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 24,
          fontFamily: MANUSCRITA,
          fontSize: 40,
          color: PALETA.tinta,
          opacity: 0.7,
        }}
      >
        pág. {pagina.indice + 1}
      </div>
    </Hoja>
  );
};

/* ───────── Tapa del cuaderno, estilo Memphis 80/90 ───────── */
const Tapa: React.FC<{ titulo: string; subtitulo: string; t: number }> = ({ titulo, subtitulo, t }) => {
  const { fps } = useVideoConfig();
  const etiqueta = spring({ frame: t - 6, fps, config: { damping: 12 } });
  const formas = Array.from({ length: 26 }, (_, i) => ({
    x: random(`fx${i}`) * 100,
    y: random(`fy${i}`) * 100,
    tipo: i % 4,
    c: COLORES[i % COLORES.length],
    r: random(`fr${i}`) * 360,
  }));
  return (
    <AbsoluteFill style={{ background: "#1b1b3a", overflow: "hidden" }}>
      {formas.map((f, i) => (
        <div key={i} style={{ position: "absolute", left: `${f.x}%`, top: `${f.y}%`, transform: `rotate(${f.r + t * (i % 2 ? 0.4 : -0.4)}deg)` }}>
          {f.tipo === 0 ? <div style={{ width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: `70px solid ${f.c}` }} /> : null}
          {f.tipo === 1 ? <div style={{ width: 60, height: 60, borderRadius: "50%", background: f.c }} /> : null}
          {f.tipo === 2 ? (
            <svg width="140" height="40" viewBox="0 0 140 40">
              <path d="M5 20 Q22 0 40 20 T75 20 T110 20 T135 20" fill="none" stroke={f.c} strokeWidth="8" strokeLinecap="round" />
            </svg>
          ) : null}
          {f.tipo === 3 ? <div style={{ width: 70, height: 70, backgroundImage: `radial-gradient(${f.c} 5px, transparent 6px)`, backgroundSize: "18px 18px" }} /> : null}
        </div>
      ))}
      <Textura id="tex-tapa" opacidad={0.25} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `rotate(-3deg) scale(${etiqueta})`, filter: "drop-shadow(6px 10px 10px rgba(0,0,0,0.5))" }}>
          <div style={{ background: "#fffdf6", clipPath: rasgado("tapa", 1.2, 1), padding: "60px 110px", textAlign: "center" }}>
            <div style={{ fontFamily: RETRO, fontSize: 150, color: PALETA.rosa, textShadow: `6px 6px 0 ${PALETA.turquesa}`, lineHeight: 1 }}>{titulo}</div>
            <div style={{ fontFamily: MANUSCRITA, fontSize: 70, color: PALETA.tinta, marginTop: 16 }}>{subtitulo}</div>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 200, top: 150, transform: `scale(${spring({ frame: t - 18, fps, config: { damping: 9 } })}) rotate(14deg)` }}>
        {PEGATINAS[0]()}
      </div>
      <div style={{ position: "absolute", left: 260, bottom: 150, transform: `scale(${spring({ frame: t - 24, fps, config: { damping: 9 } })}) rotate(-12deg)` }}>
        {PEGATINAS[2]()}
      </div>
      <div style={{ position: "absolute", right: 300, bottom: 120, transform: `scale(${spring({ frame: t - 30, fps, config: { damping: 9 } })}) rotate(8deg)` }}>
        {PEGATINAS[6]()}
      </div>
    </AbsoluteFill>
  );
};

/** Hoja que gira sobre el espiral (izquierda) */
const Girando: React.FC<{ progreso: number; children: React.ReactNode; cerrar?: boolean }> = ({ progreso, children, cerrar }) => {
  const ang = cerrar ? interpolate(progreso, [0, 1], [-100, 0]) : interpolate(progreso, [0, 1], [0, -100]);
  const sombra = Math.sin((Math.abs(ang) / 100) * Math.PI) * 0.5;
  if (Math.abs(ang) >= 90) return null;
  return (
    <AbsoluteFill style={{ transformOrigin: "0% 50%", transform: `perspective(2600px) rotateY(${ang}deg)`, backfaceVisibility: "hidden" }}>
      {children}
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${sombra * 0.2}), rgba(0,0,0,${sombra}))` }} />
    </AbsoluteFill>
  );
};

/* ───────── Composición ───────── */
export const Cuaderno: React.FC<CuadernoProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { paginas } = armarPaginas(props);
  const nota = (i: number) => props.notas[i] ?? "";
  const base = (i: number) => i * props.fotosPorPagina;

  // página actual
  let actual = -1;
  paginas.forEach((p, i) => {
    if (frame >= p.inicio) actual = i;
  });
  const ultima = paginas.length - 1;
  const finCuaderno = paginas[ultima].inicio + paginas[ultima].duracion;

  let contenido: React.ReactNode;
  if (actual === -1) {
    // tapa abriéndose sobre la página 1
    const giro = interpolate(frame, [T.tapa - T.giro, T.tapa], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    contenido = (
      <>
        <PaginaCuaderno pagina={paginas[0]} t={frame - T.tapa} nota={nota(0)} base={0} />
        <Girando progreso={giro}>
          <Tapa titulo={props.tituloTapa} subtitulo={props.subtituloTapa} t={frame} />
        </Girando>
      </>
    );
  } else if (frame >= finCuaderno) {
    // se cierra el cuaderno
    const p = paginas[ultima];
    const cierre = interpolate(frame, [finCuaderno, finCuaderno + 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    contenido = (
      <>
        <PaginaCuaderno pagina={p} t={frame - p.inicio} nota={nota(ultima)} base={base(ultima)} />
        <Girando progreso={cierre} cerrar>
          <Tapa titulo={props.tituloTapa} subtitulo={props.subtituloTapa} t={100} />
        </Girando>
      </>
    );
  } else {
    const p = paginas[actual];
    const t = frame - p.inicio;
    const inicioGiro = p.duracion - T.giro;
    const giro = interpolate(t, [inicioGiro, p.duracion], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const siguiente = paginas[actual + 1];
    contenido = (
      <>
        {siguiente && t >= inicioGiro ? (
          <PaginaCuaderno pagina={siguiente} t={t - p.duracion} nota={nota(actual + 1)} base={base(actual + 1)} />
        ) : null}
        {siguiente ? (
          <Girando progreso={giro}>
            <PaginaCuaderno pagina={p} t={t} nota={nota(actual)} base={base(actual)} />
          </Girando>
        ) : (
          <PaginaCuaderno pagina={p} t={t} nota={nota(actual)} base={base(actual)} />
        )}
      </>
    );
  }

  const fundido = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* escritorio */}
      <AbsoluteFill
        style={{
          opacity: fundido,
          background: "repeating-linear-gradient(90deg, #6b4428 0 140px, #5d3a22 140px 150px, #74492b 150px 300px)",
        }}
      >
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,220,170,0.18), rgba(0,0,0,0.55))" }} />
        {/* cuaderno */}
        <div
          style={{
            position: "absolute",
            left: (1920 - ANCHO_HOJA) / 2 + 20,
            top: (1080 - ALTO_HOJA) / 2,
            width: ANCHO_HOJA,
            height: ALTO_HOJA,
            boxShadow: "0 30px 70px rgba(0,0,0,0.6), 6px 6px 0 #e9e1c9, 12px 12px 0 #ddd3b6",
          }}
        >
          {contenido}
          <Espiral />
        </div>
      </AbsoluteFill>
      {/* sonidos */}
      {props.musica ? (
        <Loop durationInFrames={16 * 30}>
          <Audio
            src={staticFile(props.musica)}
            volume={() => 0.55 * interpolate(frame, [durationInFrames - 45, durationInFrames], [1, 0], clamp)}
          />
        </Loop>
      ) : null}
      <Sequence from={T.tapa - T.giro} durationInFrames={30}>
        <Audio src={staticFile("audio/sfx-pagina.mp3")} volume={0.8} />
      </Sequence>
      {paginas.map((p, i) => (
        <Sequence key={`s${i}`} from={p.inicio} durationInFrames={p.duracion}>
          {p.fotos.map((_, j) => (
            <Sequence key={j} from={T.inicioPagina + j * T.porFoto} durationInFrames={30}>
              <Audio src={staticFile("audio/sfx-pegar.mp3")} volume={0.9} />
            </Sequence>
          ))}
          {p.fotos.map((_, j) => (
            <Sequence key={`k${j}`} from={T.inicioPagina + j * T.porFoto + 16} durationInFrames={20}>
              <Audio src={staticFile("audio/sfx-pegatina.mp3")} volume={0.6} />
            </Sequence>
          ))}
          {i < paginas.length - 1 ? (
            <Sequence from={p.duracion - T.giro} durationInFrames={30}>
              <Audio src={staticFile("audio/sfx-pagina.mp3")} volume={0.8} />
            </Sequence>
          ) : (
            <Sequence from={p.duracion} durationInFrames={30}>
              <Audio src={staticFile("audio/sfx-pagina.mp3")} volume={0.8} />
            </Sequence>
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
