// Ajustes del vídeo: cambia aquí textos, fotos y años.
export type Foto = { archivo: string; ancho: number; alto: number; texto: string };

export type ColacionProps = {
  institucion: string;
  promocion: string;
  anioActual: number;
  anioRetro: number;
  /** Fotos dentro de public/fotos. Vacío = marcadores de colores. */
  fotos: Foto[];
  /** Texto de la cinta de noticias */
  titularNoticia: string;
};

export const PROPS_POR_DEFECTO: ColacionProps = {
  institucion: "Nombre de la Institución",
  promocion: "Promoción 2026",
  anioActual: 2026,
  anioRetro: 1989,
  titularNoticia: "LOS EGRESADOS VIAJAN EN EL TIEMPO",
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
// (si las cambias, vuelve a generar la música: python3 scripts/banda_sonora.py)
export const ESCENAS = {
  canal: 54, // 1,8 s  cambio de canal + lluvia
  noticia: 66, // 2,2 s  flash de noticiero "Mientras tanto..."
  moderno: 105, // 3,5 s
  rebobinado: 75, // 2,5 s
  tituloRetro: 120, // 4 s  (entra la música a 120 BPM: 2 compases)
  fotos: 360, // 12 s  (1 compás = 2 s por foto)
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
