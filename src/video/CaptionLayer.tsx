import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import type {Caption} from "./types";
import {fontFamily, theme} from "./theme";

export const CaptionLayer: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const caption = captions.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!caption) return null;
  const local = frame - caption.startFrame;
  const opacity = interpolate(local, [0, 5], [0, 1], {extrapolateRight: "clamp"});

  return (
    <div style={{
      position: "absolute",
      left: 86,
      right: 86,
      bottom: 170,
      minHeight: 150,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "28px 38px",
      borderRadius: 30,
      background: "rgba(23,25,29,0.92)",
      color: theme.white,
      fontFamily,
      fontSize: 48,
      fontWeight: 700,
      lineHeight: 1.35,
      letterSpacing: 1,
      textAlign: "center",
      boxShadow: "0 18px 50px rgba(23,25,29,0.18)",
      opacity,
    }}>
      {caption.text}
    </div>
  );
};
