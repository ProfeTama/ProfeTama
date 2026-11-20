// Ajustes del vídeo: cambia aquí textos, fotos y años.
export type ColacionProps = {
  institucion: string;
  promocion: string;
  anioActual: number;
  anioRetro: number;
  /** Nombres de archivo dentro de public/fotos (ej. "foto1.jpg"). Vacío = marcadores. */
  fotos: string[];
};

export const PROPS_POR_DEFECTO: ColacionProps = {
  institucion: "Nombre de la Institución",
  promocion: "Promoción 2026",
  anioActual: 2026,
  anioRetro: 1989,
  fotos: [],
};

export const FPS = 30;
// Duración de cada escena (frames)
export const ESCENAS = {
  moderno: 120, // 4 s
  rebobinado: 90, // 3 s
  tituloRetro: 120, // 4 s
  fotos: 300, // 10 s
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
