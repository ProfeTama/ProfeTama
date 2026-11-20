import { Composition } from "remotion";
import { HolaMundo } from "./HolaMundo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HolaMundo"
      component={HolaMundo}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ titulo: "¡Hola, soy ProfeTama!" }}
    />
  );
};
