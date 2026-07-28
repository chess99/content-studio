import React from "react";
import {theme} from "./theme";

export const BrandMark: React.FC<{tagline?: string; compact?: boolean}> = ({
  tagline = "用数据校准判断",
  compact = false,
}) => (
  <div style={{display: "flex", alignItems: "center", gap: compact ? 13 : 16}}>
    <div style={{position: "relative", width: compact ? 31 : 38, height: compact ? 31 : 38}}>
      <div style={{position: "absolute", left: 2, bottom: 2, width: compact ? 27 : 34, height: 4, background: theme.ink}} />
      <div style={{position: "absolute", left: 2, bottom: 2, width: 4, height: compact ? 27 : 34, background: theme.ink}} />
      <div style={{position: "absolute", left: 0, top: compact ? 8 : 10, width: compact ? 18 : 22, height: 7, background: theme.red}} />
    </div>
    <div style={{fontSize: compact ? 23 : 27, fontWeight: 850, letterSpacing: compact ? 2.5 : 3}}>{tagline}</div>
  </div>
);
