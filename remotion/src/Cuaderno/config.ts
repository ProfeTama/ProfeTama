// PLANTILLA "Cuaderno retro": collage de fotos en un cuadernillo con papel rasgado,
// cinta washi y pegatinas. Cambia aquí las fotos y los textos.
export type FotoCuaderno = { archivo: string; ancho: number; alto: number };

export type CuadernoProps = {
  /** Texto principal de la tapa */
  tituloTapa: string;
  /** Texto secundario de la tapa */
  subtituloTapa: string;
  /** Una nota escrita a mano por página (deja "" para que no haya texto) */
  notas: string[];
  /** Cuántas fotos por página: 1, 2 o 3 */
  fotosPorPagina: 1 | 2 | 3;
  /** Archivos en public/fotos */
  fotos: FotoCuaderno[];
  /** Música en public/audio ("" = sin música) */
  musica: string;
};

const H = (archivo: string): FotoCuaderno => ({ archivo, ancho: 1672, alto: 941 });
const V = (archivo: string): FotoCuaderno => ({ archivo, ancho: 941, alto: 1672 });

export const CUADERNO_POR_DEFECTO: CuadernoProps = {
  tituloTapa: "Promo 2026",
  subtituloTapa: "nuestro cuaderno de recuerdos",
  notas: ["¡Los mejores!", "Recuerdos ♥", "¡Qué época!", "Amigos x siempre", "Promo 2026 ★"],
  fotosPorPagina: 2,
  fotos: [
    H("foto10.jpg"),
    V("foto1.jpg"),
    H("foto2.jpg"),
    H("foto3.jpg"),
    { archivo: "foto4.jpg", ancho: 1040, alto: 1513 },
    H("foto7.jpg"),
    H("foto5.jpg"),
    V("foto6.jpg"),
    H("foto8.jpg"),
    H("foto9.jpg"),
  ],
  musica: "audio/musica-cuaderno.wav",
};

// Tiempos (frames a 30 fps)
export const T = {
  tapa: 75, // tapa visible + apertura
  giro: 24, // vuelta de página
  porFoto: 42, // cada foto que se pega
  inicioPagina: 10, // espera antes de la 1.ª foto de cada página
  pausa: 36, // tiempo para mirar la página completa
  final: 60, // cierre del cuaderno
};

export type Pagina = { inicio: number; duracion: number; fotos: FotoCuaderno[]; indice: number };

export const armarPaginas = (p: CuadernoProps) => {
  const paginas: Pagina[] = [];
  let inicio = T.tapa;
  for (let i = 0; i < p.fotos.length; i += p.fotosPorPagina) {
    const fotos = p.fotos.slice(i, i + p.fotosPorPagina);
    const duracion = T.inicioPagina + fotos.length * T.porFoto + T.pausa + T.giro;
    paginas.push({ inicio, duracion, fotos, indice: paginas.length });
    inicio += duracion;
  }
  return { paginas, total: inicio + T.final };
};

export const PALETA = {
  rosa: "#ff5fa2",
  amarillo: "#ffd23f",
  turquesa: "#2ec4b6",
  violeta: "#8e6cff",
  naranja: "#ff8c42",
  celeste: "#5bc0eb",
  tinta: "#1d3a8a",
};
