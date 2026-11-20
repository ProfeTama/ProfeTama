import { loadFont as inter } from "@remotion/google-fonts/Inter";
import { loadFont as monoton } from "@remotion/google-fonts/Monoton";
import { loadFont as vt323 } from "@remotion/google-fonts/VT323";
import { loadFont as kaushan } from "@remotion/google-fonts/KaushanScript";
import { loadFont as orbitron } from "@remotion/google-fonts/Orbitron";

export const FUENTE_MODERNA = inter("normal", { weights: ["300", "800"], subsets: ["latin"] }).fontFamily;
export const FUENTE_NEON = monoton("normal", { subsets: ["latin"] }).fontFamily;
export const FUENTE_VHS = vt323("normal", { subsets: ["latin"] }).fontFamily;
export const FUENTE_SCRIPT = kaushan("normal", { subsets: ["latin"] }).fontFamily;
export const FUENTE_CROMO = orbitron("normal", { weights: ["900"], subsets: ["latin"] }).fontFamily;
