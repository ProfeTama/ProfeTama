import { AbsoluteFill, Audio, Series, staticFile } from "remotion";
import { ColacionProps, ESCENAS } from "./config";
import { EscenaCanal, EscenaNoticia } from "./tv";
import { EscenaFinal, EscenaFotos, EscenaModerna, EscenaRebobinado, EscenaTituloRetro } from "./escenas";

export const Colacion: React.FC<ColacionProps> = (props) => (
  <AbsoluteFill style={{ background: "black" }}>
    <Audio src={staticFile("audio/banda-sonora.mp3")} />
    <Series>
      <Series.Sequence durationInFrames={ESCENAS.canal}>
        <EscenaCanal />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.noticia}>
        <EscenaNoticia {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.moderno}>
        <EscenaModerna {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.rebobinado}>
        <EscenaRebobinado {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.tituloRetro}>
        <EscenaTituloRetro {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.fotos}>
        <EscenaFotos {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={ESCENAS.final}>
        <EscenaFinal {...props} />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
