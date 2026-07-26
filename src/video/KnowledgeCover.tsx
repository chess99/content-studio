import React from "react";
import {AbsoluteFill} from "remotion";
import {BrandMark} from "./BrandMark";
import type {DataPoint, VideoProps} from "./types";
import {fontFamily, numberFontFamily, theme} from "./theme";

const Chart: React.FC<{points: DataPoint[]; peakLabel?: string; currentLabel?: string}> = ({points, peakLabel, currentLabel}) => {
  if (points.length < 2) return null;
  const chart = {x: 34, y: 46, width: 860, height: 300};
  const minYear = Math.min(...points.map((point) => point.year));
  const maxYear = Math.max(...points.map((point) => point.year));
  const maxValue = Math.max(130, ...points.map((point) => point.value));
  const projected = points.map((point) => ({
    ...point,
    x: chart.x + ((point.year - minYear) / (maxYear - minYear)) * chart.width,
    y: chart.y + chart.height - (point.value / maxValue) * chart.height,
  }));
  const path = projected.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ");
  const peak = projected.reduce((best, point) => point.value > best.value ? point : best, projected[0]);
  const current = projected[projected.length - 1];
  return (
    <svg width="100%" height="100%" viewBox="0 0 930 410" style={{fontFamily}}>
      <line x1={chart.x} y1={chart.y + chart.height} x2={chart.x + chart.width} y2={chart.y + chart.height} stroke={theme.divider} strokeWidth="3" />
      <path d={path} fill="none" stroke={theme.blue} strokeWidth="7" strokeLinejoin="miter" />
      <circle cx={peak.x} cy={peak.y} r="11" fill={theme.ink} />
      <circle cx={current.x} cy={current.y} r="14" fill={theme.red} stroke={theme.paper} strokeWidth="5" />
      <text x={Math.min(peak.x + 24, 695)} y={Math.max(28, peak.y - 24)} fontSize="25" fontWeight="800" fill={theme.ink}>{peakLabel}</text>
      <text x={current.x - 8} y={current.y - 30} textAnchor="end" fontSize="25" fontWeight="850" fill={theme.red}>{currentLabel}</text>
      <text x={chart.x} y="395" fontFamily={numberFontFamily} fontSize="22" fill={theme.inkMuted}>{minYear}</text>
      <text x={chart.x + chart.width} y="395" textAnchor="end" fontFamily={numberFontFamily} fontSize="22" fill={theme.inkMuted}>{maxYear}</text>
    </svg>
  );
};

export const KnowledgeCover: React.FC<VideoProps> = (props) => {
  const cover = props.cover ?? {};
  const brand = props.brand ?? {};
  const points = props.scenes.find((scene) => scene.template === "line-chart")?.visual.points ?? [];
  const titleLines = cover.titleLines ?? [props.title];
  return (
    <AbsoluteFill style={{background: theme.paper, color: theme.ink, fontFamily, padding: "74px 72px 72px 84px"}}>
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: theme.red}} />
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 25, borderBottom: `3px solid ${theme.ink}`}}>
        <BrandMark tagline={brand.tagline} />
        <div style={{fontFamily: numberFontFamily, fontSize: 24, fontWeight: 850, letterSpacing: 2, color: theme.inkMuted}}>{brand.series ?? "市场温度计"} · {brand.issue ?? "001"}</div>
      </div>

      <div style={{marginTop: 104}}>
        <div style={{fontSize: 94, lineHeight: 1.12, fontWeight: 950, letterSpacing: -4}}>
          {titleLines.map((line, index) => <div key={line} style={{color: index === 1 ? theme.red : theme.ink}}>{line}</div>)}
        </div>
        <div style={{display: "flex", alignItems: "baseline", gap: 22, marginTop: 76, padding: "32px 0 26px", borderTop: `9px solid ${theme.ink}`, borderBottom: `3px solid ${theme.ink}`}}>
          <div style={{fontFamily: numberFontFamily, fontSize: 128, lineHeight: 1, fontWeight: 950, letterSpacing: -7}}>{cover.stat ?? "接近 80%"}</div>
        </div>
        <div style={{fontSize: 28, lineHeight: 1.4, color: theme.inkMuted, marginTop: 18}}>{cover.statNote}</div>
      </div>

      <div style={{height: 430, marginTop: 78, borderTop: `3px solid ${theme.divider}`, borderBottom: `3px solid ${theme.divider}`}}>
        <Chart points={points} peakLabel={cover.peakLabel} currentLabel={cover.currentLabel} />
      </div>

      <div style={{marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div style={{fontSize: 27, fontWeight: 800}}>高位，不等于 2007 式极端泡沫</div>
        <div style={{width: 80, height: 8, background: theme.red}} />
      </div>
    </AbsoluteFill>
  );
};
