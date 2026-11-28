// ÁLBUM "Promo 2026 · Video Final Parte 1"
// Basado en el cuaderno de Canva + elementos Memphis de la invitación del acto.
export type FotoAlbum = { archivo: string; ancho: number; alto: number };

export type AlbumProps = {
  tituloTapa: string;
  subtituloTapa: string;
  /** Cuántas fotos van en cada hoja (1 a 8). Si faltan valores se repite el patrón. */
  hojas: number[];
  /** Duración total del vídeo en frames (30 fps). 3:10 = 5700 */
  duracionObjetivo: number;
  fotos: FotoAlbum[];
};

export const ALBUM_POR_DEFECTO: AlbumProps = {
  tituloTapa: "PROMO 2026",
  subtituloTapa: "nuestro cuaderno de recuerdos",
  hojas: [3, 4, 2, 4, 5, 3, 4, 2, 5, 4, 3, 4, 5, 2, 4, 3, 5, 4],
  duracionObjetivo: 240 * 30,
  fotos: [],
};

// Colores tomados de la invitación / diploma
export const MEMPHIS = {
  fondo: "#2b2b2e",
  turquesa: "#3fc6c8",
  rosa: "#e8358f",
  amarillo: "#f5e21b",
  violeta: "#8a5cc2",
  verde: "#3ab54a",
  celeste: "#4aa8e0",
  naranja: "#f7941d",
};
export const COLORES_M = [MEMPHIS.turquesa, MEMPHIS.rosa, MEMPHIS.amarillo, MEMPHIS.violeta, MEMPHIS.verde, MEMPHIS.celeste, MEMPHIS.naranja];

export const TA = { tapa: 160, giro: 24, inicio: 12, aparecer: 24, mirarMin: 30, volteo: 36, contratapa: 75 };

import PAGINAS from "./paginas.json";
export type FotoHoja = { archivo: string; cx: number; cy: number; w: number; h: number; rot: number };
export type HojaAlbum = {
  inicio: number; duracion: number; indice: number; primera: number; paso: number;
  fotos: FotoHoja[];
  pegatinas: { x: number; y: number; s: number; tipo: number; rot: number }[];
  figuras: { x: number; y: number; s: number; tipo: number; rot: number }[];
};

export const armarAlbum = (p: AlbumProps) => {
  const paginas = PAGINAS as Omit<HojaAlbum, "inicio" | "duracion" | "indice" | "primera" | "paso">[];
  const extraFinal = 60;
  const disponible = p.duracionObjetivo - TA.tapa - TA.contratapa - extraFinal;
  const porHoja = Math.floor(disponible / paginas.length);
  const hojas: HojaAlbum[] = [];
  let inicio = TA.tapa;
  let primera = 0;
  paginas.forEach((pg, idx) => {
    const esUltima = idx === paginas.length - 1;
    const duracion = esUltima ? p.duracionObjetivo - TA.contratapa - inicio + TA.giro : porHoja;
    const ventana = duracion - TA.giro - TA.mirarMin - TA.inicio - TA.aparecer;
    const paso = Math.max(6, Math.min(26, Math.floor(ventana / Math.max(1, pg.fotos.length - 1))));
    hojas.push({ ...pg, inicio, duracion, indice: idx, primera, paso });
    inicio += duracion;
    primera += pg.fotos.length;
  });
  return { hojas, total: p.duracionObjetivo };
};
