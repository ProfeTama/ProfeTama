import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const HolaMundo: React.FC<{ titulo: string }> = ({ titulo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const escala = spring({ frame, fps, config: { damping: 12 } });
  const opacidad = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1e1b4b",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          color: "white",
          fontFamily: "sans-serif",
          fontSize: 110,
          opacity: opacidad,
          transform: `scale(${escala})`,
        }}
      >
        {titulo}
      </h1>
    </AbsoluteFill>
  );
};
