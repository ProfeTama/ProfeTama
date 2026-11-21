import { loadFont as marker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as caveat } from "@remotion/google-fonts/Caveat";
import { loadFont as bungee } from "@remotion/google-fonts/Bungee";

export const MARCADOR = marker("normal", { subsets: ["latin"] }).fontFamily;
export const MANUSCRITA = caveat("normal", { weights: ["700"], subsets: ["latin"] }).fontFamily;
export const RETRO = bungee("normal", { subsets: ["latin"] }).fontFamily;
