// ÁLBUM "Promo 2026 · Video Final Parte 1"
// Basado en el cuaderno de Canva + elementos Memphis de la invitación del acto.
export type FotoAlbum = { archivo: string; ancho: number; alto: number };

export type AlbumProps = {
  tituloTapa: string;
  subtituloTapa: string;
  /** Cuántas fotos va en cada hoja, en orden (1, 2, 3, 4, 5, 6 u 8). Vacío = automático */
  hojas: number[];
  fotos: FotoAlbum[];
};

const H = (archivo: string): FotoAlbum => ({ archivo, ancho: 1672, alto: 941 });
const V = (archivo: string): FotoAlbum => ({ archivo, ancho: 941, alto: 1672 });

export const ALBUM_POR_DEFECTO: AlbumProps = {
  tituloTapa: "PROMO 2026",
  subtituloTapa: "nuestro cuaderno de recuerdos",
  hojas: [2, 3, 1, 4],
  fotos: [
    H("foto10.jpg"),
    V("foto1.jpg"),
    { archivo: "foto4.jpg", ancho: 1040, alto: 1513 },
    H("foto2.jpg"),
    H("foto3.jpg"),
    H("foto9.jpg"),
    H("foto7.jpg"),
    H("foto5.jpg"),
    V("foto6.jpg"),
    H("foto8.jpg"),
  ],
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

export const TA = { tapa: 90, giro: 24, inicio: 12, mirar: 54, volteo: 36, contratapa: 75 };

// separación entre fotos según cuántas hay en la hoja
export const escalon = (n: number) => (n <= 2 ? 34 : n === 3 ? 28 : n === 4 ? 24 : n === 5 ? 20 : n === 6 ? 18 : 14);

export type HojaAlbum = { inicio: number; duracion: number; fotos: FotoAlbum[]; indice: number; primera: number };

const AUTOMATICO = [2, 3, 1, 4, 2, 5, 1, 6, 2, 8];

export const armarAlbum = (p: AlbumProps) => {
  const hojas: HojaAlbum[] = [];
  let inicio = TA.tapa;
  let i = 0;
  let k = 0;
  while (i < p.fotos.length) {
    let n = p.hojas[k] ?? AUTOMATICO[k % AUTOMATICO.length];
    n = Math.min(n, p.fotos.length - i);
    if (n === 7) n = 6;
    const fotos = p.fotos.slice(i, i + n);
    const duracion = TA.inicio + (fotos.length - 1) * escalon(fotos.length) + 24 + TA.mirar + TA.giro;
    hojas.push({ inicio, duracion, fotos, indice: k, primera: i });
    inicio += duracion;
    i += n;
    k++;
  }
  return { hojas, total: inicio + TA.contratapa };
};
