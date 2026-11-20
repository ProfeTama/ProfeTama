import { AbsoluteFill, Series } from "remotion";
import { ColacionProps, ESCENAS } from "./config";
import { EscenaFinal, EscenaFotos, EscenaModerna, EscenaRebobinado, EscenaTituloRetro } from "./escenas";

export const Colacion: React.FC<ColacionProps> = (props) => (
  <AbsoluteFill style={{ background: "black" }}>
    <Series>
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
