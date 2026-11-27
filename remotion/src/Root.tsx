import { Composition } from "remotion";
import { HolaMundo } from "./HolaMundo";
import { Colacion } from "./Colacion/Colacion";
import { DURACION_TOTAL, FPS, PROPS_POR_DEFECTO } from "./Colacion/config";
import { Cuaderno } from "./Cuaderno/Cuaderno";
import { Album } from "./Album/Album";
import { ALBUM_POR_DEFECTO, armarAlbum } from "./Album/config";
import { armarPaginas, CUADERNO_POR_DEFECTO } from "./Cuaderno/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Colacion"
        component={Colacion}
        durationInFrames={DURACION_TOTAL}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={PROPS_POR_DEFECTO}
      />
      <Composition
        id="AlbumPromo"
        component={Album}
        durationInFrames={armarAlbum(ALBUM_POR_DEFECTO).total}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={ALBUM_POR_DEFECTO}
        calculateMetadata={({ props }) => ({ durationInFrames: armarAlbum(props).total })}
      />
      <Composition
        id="CuadernoRetro"
        component={Cuaderno}
        durationInFrames={armarPaginas(CUADERNO_POR_DEFECTO).total}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={CUADERNO_POR_DEFECTO}
        calculateMetadata={({ props }) => ({ durationInFrames: armarPaginas(props).total })}
      />
      <Composition
        id="HolaMundo"
        component={HolaMundo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ titulo: "¡Hola, soy ProfeTama!" }}
      />
    </>
  );
};
