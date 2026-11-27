// ÁLBUM "Promo 2026 · Video Final Parte 1"
// Basado en el cuaderno de Canva + elementos Memphis de la invitación del acto.
export type FotoAlbum = { archivo: string; ancho: number; alto: number };
import { FOTOS_ALBUM } from "./fotosAlbum";

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
  hojas: [3, 4, 5, 4, 6, 5, 8, 6, 4, 6, 8, 5, 6, 8, 4, 6, 5, 8, 6, 5, 8, 6, 4, 8, 6, 5, 8, 6, 3],
  duracionObjetivo: 190 * 30,
  fotos: FOTOS_ALBUM,
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

export const TA = { tapa: 90, giro: 24, inicio: 12, aparecer: 24, mirarMin: 40, volteo: 36, contratapa: 75 };

export type HojaAlbum = { inicio: number; duracion: number; fotos: FotoAlbum[]; indice: number; primera: number; paso: number };

export const armarAlbum = (p: AlbumProps) => {
  const sinFinal = p.fotos.slice(0, -1);
  const final = p.fotos[p.fotos.length - 1];
  const grupos: FotoAlbum[][] = [];
  let i = 0;
  let k = 0;
  while (i < sinFinal.length) {
    const n = Math.max(1, Math.min(8, p.hojas[k % p.hojas.length] ?? 6, sinFinal.length - i));
    grupos.push(sinFinal.slice(i, i + n));
    i += n;
    k++;
  }
  if (final) grupos.push([final]); // la foto de todos, sola en la última hoja
  const disponible = p.duracionObjetivo - TA.tapa - TA.contratapa;
  const extraFinal = 60;
  const porHoja = Math.floor((disponible - extraFinal) / grupos.length);
  const hojas: HojaAlbum[] = [];
  let inicio = TA.tapa;
  let primera = 0;
  grupos.forEach((fotos, idx) => {
    const esUltima = idx === grupos.length - 1;
    let duracion = porHoja + (esUltima ? extraFinal : 0);
    if (esUltima) duracion = p.duracionObjetivo - TA.contratapa - inicio + TA.giro; // ajusta el redondeo
    const ventana = duracion - TA.giro - TA.mirarMin - TA.inicio - TA.aparecer;
    const paso = Math.max(6, Math.min(30, Math.floor(ventana / Math.max(1, fotos.length - 1))));
    hojas.push({ inicio, duracion, fotos, indice: idx, primera, paso });
    inicio += duracion;
    primera += fotos.length;
  });
  return { hojas, total: p.duracionObjetivo };
};
