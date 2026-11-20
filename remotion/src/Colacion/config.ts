// VIDEO 3 del acto: la Promo 2026 es "chupada" por la TV y aparece en el aula de los 80.
// Ajustes del vídeo: cambia aquí textos, fotos y años.
export type Foto = { archivo: string; ancho: number; alto: number };

export type ColacionProps = {
  promocion: string;
  anioActual: number;
  anioRetro: number;
  /** Texto de la cinta de noticias */
  titularNoticia: string;
  /** Fotos dentro de public/fotos (no se suben a GitHub). Vacío = marcadores de colores. */
  fotos: Foto[];
};

const H: [number, number] = [1672, 941]; // horizontal
const V: [number, number] = [941, 1672]; // vertical
const foto = (archivo: string, [ancho, alto]: [number, number]): Foto => ({ archivo, ancho, alto });

export const PROPS_POR_DEFECTO: ColacionProps = {
  promocion: "Promo 2026",
  anioActual: 2026,
  anioRetro: 1986,
  titularNoticia: "LA PROMO 2026 INICIA UN VIAJE EN EL TIEMPO",
  fotos: [
    foto("foto10.jpg", H), // ronda con el grabador
    foto("foto1.jpg", V),
    foto("foto2.jpg", H),
    foto("foto3.jpg", H),
    foto("foto4.jpg", [1040, 1513]),
    foto("foto7.jpg", H),
    foto("foto5.jpg", H),
    foto("foto6.jpg", V),
    foto("foto8.jpg", H),
    foto("foto9.jpg", [1670, 942]), // foto grupal para cerrar
  ],
};

export const FPS = 30;
// Duración de cada escena (frames).
// Si las cambias, vuelve a generar la música: python3 scripts/banda_sonora.py
export const ESCENAS = {
  canal: 54, // 1,8 s  cambio de canal + lluvia
  noticia: 66, // 2,2 s  flash de noticiero "Mientras tanto..."
  cuenta: 120, // 4 s    cuenta regresiva 3-2-1 que sigue... hasta 1986
  tv: 60, // 2 s    la TV se los chupa
  tituloRetro: 60, // 2 s    "Bienvenidos a 1986" (entra la música, 120 BPM)
  fotos: 450, // 15 s   1,5 s por foto
  final: 120, // 4 s    atrapados en 1986: "VOLVER A 2026" → ERROR
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
