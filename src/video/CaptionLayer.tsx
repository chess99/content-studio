import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import type {Caption} from "./types";
import {fontFamily, theme} from "./theme";

export const CaptionLayer: React.FC<{captions: Caption[]}> = ({captions}) => {
  const frame = useCurrentFrame();
  const caption = captions.find((item) => frame >= item.startFrame && frame < item.endFrame);
  if (!caption) return null;
  const opacity = interpolate(frame - caption.startFrame, [0, 4], [0, 1], {extrapolateRight: "clamp"});

  return (
    <div style={{position: "absolute", left: 72, right: 72, bottom: 148, borderTop: `8px solid ${theme.red}`, background: "rgba(17,20,24,0.96)", color: theme.white, fontFamily, fontSize: 45, fontWeight: 700, lineHeight: 1.38, letterSpacing: 0.5, textAlign: "left", padding: "29px 34px 31px", opacity}}>
      {caption.text}
    </div>
  );
};
