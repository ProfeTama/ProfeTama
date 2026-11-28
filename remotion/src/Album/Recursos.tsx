// Composiciones auxiliares para exportar las capas del álbum a Canva (PNG transparentes)
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PEGATINAS } from "../Cuaderno/pegatinas";
import { Cinta, Espiral, Hoja } from "../Cuaderno/papel";
import { COLORES_M, MEMPHIS } from "./config";
import { Figura } from "./memphis";
import { Camara, Celular, Destello, GameBoy, Lentes3D, Patin, Pizza, Rubik, Tele, Vinilo, Walkman } from "./pegatinas2";

export const LISTA_PEGATINAS: [string, () => React.ReactElement][] = [
  ["estrella", PEGATINAS[0]],
  ["corazon", PEGATINAS[1]],
  ["casete", PEGATINAS[2]],
  ["carita", PEGATINAS[4]],
  ["rayo", PEGATINAS[5]],
  ["arcoiris", PEGATINAS[8]],
  ["camara", () => <Camara />],
  ["celular", () => <Celular />],
  ["gameboy", () => <GameBoy />],
  ["tele", () => <Tele />],
  ["pizza", () => <Pizza />],
  ["destello", () => <Destello />],
  ["vinilo", () => <Vinilo />],
  ["rubik", () => <Rubik />],
  ["walkman", () => <Walkman />],
  ["patin", () => <Patin />],
  ["lentes3d", () => <Lentes3D />],
];
export const N_FIG = 10 * COLORES_M.length; // figuras Memphis
export const N_CINTA = 3 * COLORES_M.length;
export const TOTAL_RECURSOS = LISTA_PEGATINAS.length + N_FIG + N_CINTA;

/** 400x400 transparente: un recurso por frame */
export const Recursos: React.FC = () => {
  const f = useCurrentFrame();
  let el: React.ReactNode;
  if (f < LISTA_PEGATINAS.length) {
    const P = LISTA_PEGATINAS[f][1];
    el = <div style={{ transform: "scale(2)" }}><P /></div>;
  } else if (f < LISTA_PEGATINAS.length + N_FIG) {
    const k = f - LISTA_PEGATINAS.length;
    el = <Figura tipo={k % 10} color={COLORES_M[Math.floor(k / 10)]} tam={140} />;
  } else {
    const k = f - LISTA_PEGATINAS.length - N_FIG;
    el = (
      <div style={{ position: "relative", width: 380, height: 110 }}>
        <Cinta color={COLORES_M[Math.floor(k / 3)]} patron={k % 3} ancho={380} estilo={{ left: 0, top: 0, height: 110 }} />
      </div>
    );
  }
  return <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", backgroundColor: "transparent" }}>{el}</AbsoluteFill>;
};

/** Fondos 1920x1080: hoja rayada (varias variantes de manchas) + escritorio + espiral */
export const FondoHoja: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #6b4428 0 140px, #5d3a22 140px 150px, #74492b 150px 300px)" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,220,170,0.18), rgba(0,0,0,0.55))" }} />
      <div style={{ position: "absolute", left: 80, top: 40, width: 1800, height: 1000, boxShadow: "0 30px 70px rgba(0,0,0,0.6), 6px 6px 0 #e9e1c9, 12px 12px 0 #ddd3b6" }}>
        <Hoja indice={f} />
        <Espiral />
      </div>
    </AbsoluteFill>
  );
};

/** Fondo de tapa/contratapa sin logo ni título (frame 0 tapa, 1 contratapa) */
export const FondoTapa: React.FC = () => {
  const f = useCurrentFrame();
  const derecha = f === 1;
  return (
    <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, #6b4428 0 140px, #5d3a22 140px 150px, #74492b 150px 300px)" }}>
      <div style={{ position: "absolute", left: derecha ? 40 : 80, top: 40, width: 1800, height: 1000, background: MEMPHIS.fondo, overflow: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,0.6)" }}>
        <div style={{ position: "absolute", inset: 0, transform: derecha ? "scaleX(-1)" : undefined }}>
          <Espiral />
        </div>
      </div>
    </AbsoluteFill>
  );
};
