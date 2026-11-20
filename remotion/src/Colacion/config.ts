// Ajustes del vídeo: cambia aquí textos, fotos y años.
export type Foto = { archivo: string; ancho: number; alto: number; texto: string };

export type ColacionProps = {
  institucion: string;
  promocion: string;
  anioActual: number;
  anioRetro: number;
  /** Fotos dentro de public/fotos. Vacío = marcadores de colores. */
  fotos: Foto[];
};

export const PROPS_POR_DEFECTO: ColacionProps = {
  institucion: "Nombre de la Institución",
  promocion: "Promoción 2026",
  anioActual: 2026,
  anioRetro: 1989,
  fotos: [
    { archivo: "foto1.jpg", ancho: 941, alto: 1672, texto: "Volar alto" },
    { archivo: "foto2.jpg", ancho: 1672, alto: 941, texto: "Amistad" },
    { archivo: "foto3.jpg", ancho: 1672, alto: 941, texto: "Risas" },
    { archivo: "foto4.jpg", ancho: 1040, alto: 1513, texto: "Compañeros" },
    { archivo: "foto5.jpg", ancho: 1672, alto: 941, texto: "Juntos" },
    { archivo: "foto6.jpg", ancho: 941, alto: 1670, texto: "Para siempre" },
  ],
};

export const FPS = 30;
// Duración de cada escena (frames)
export const ESCENAS = {
  moderno: 120, // 4 s
  rebobinado: 90, // 3 s
  tituloRetro: 120, // 4 s
  fotos: 360, // 12 s (se reparte entre las fotos)
  final: 120, // 4 s
};
export const DURACION_TOTAL = Object.values(ESCENAS).reduce((a, b) => a + b, 0);

export const NEON = {
  rosa: "#ff2bd6",
  cian: "#29f4ff",
  violeta: "#7b2ff7",
  naranja: "#ff9a3c",
  amarillo: "#ffe45c",
  noche: "#0b0221",
};
