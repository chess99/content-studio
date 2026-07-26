import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {VisualSpec} from "../types";
import {fontFamily, numberFontFamily, theme} from "../theme";

const reveal = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 115, mass: 0.8}});

const SceneTitle: React.FC<{visual: VisualSpec}> = ({visual}) => (
  <div style={{paddingTop: 158, marginBottom: 46}}>
    {visual.eyebrow ? <div style={{display: "flex", alignItems: "center", gap: 16, marginBottom: 15}}><span style={{width: 38, height: 7, background: theme.red}} /><span style={{fontSize: 26, color: theme.inkMuted, fontWeight: 800, letterSpacing: 3}}>{visual.eyebrow}</span></div> : null}
    {visual.title ? <div style={{fontSize: 74, lineHeight: 1.14, fontWeight: 900, color: theme.ink, letterSpacing: -2}}>{visual.title}</div> : null}
    {visual.subtitle ? <div style={{fontSize: 29, lineHeight: 1.45, color: theme.inkMuted, marginTop: 14}}>{visual.subtitle}</div> : null}
  </div>
);

export const HookScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = reveal(frame, fps, 0);
  const second = reveal(frame, fps, 10);
  const line = interpolate(frame, [12, 42], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const stat = String(visual.stat ?? "");
  const parts = stat.split(/[–—-]/);

  return (
    <div style={{height: "100%", paddingTop: 178}}>
      <div style={{fontSize: 28, fontWeight: 850, color: theme.inkMuted, letterSpacing: 4, opacity: first, transform: `translateY(${(1-first)*18}px)`}}>{visual.eyebrow}</div>
      <div style={{fontSize: 98, fontWeight: 950, lineHeight: 1.08, letterSpacing: -5, color: theme.ink, maxWidth: 860, marginTop: 34, opacity: first, transform: `translateY(${(1-first)*28}px)`}}>{visual.title}</div>

      <div style={{marginTop: 98, opacity: second, transform: `translateY(${(1-second)*34}px)`}}>
        <div style={{height: 9, width: `${line*100}%`, background: theme.red, marginBottom: 26}} />
        <div style={{fontFamily: numberFontFamily, fontSize: 134, lineHeight: 0.92, fontWeight: 900, letterSpacing: -8, whiteSpace: "nowrap", color: theme.ink}}>
          <span style={{color: theme.red}}>{parts[0]}</span>
          {parts.length > 1 ? <><span style={{fontSize: 76, margin: "0 12px", color: theme.inkMuted}}>—</span><span>{parts.slice(1).join("—")}</span></> : null}
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 42, borderTop: `2px solid ${theme.divider}`, borderBottom: `2px solid ${theme.divider}`}}>
          <div style={{padding: "24px 18px 24px 0", borderRight: `2px solid ${theme.divider}`}}><div style={{fontSize: 24, color: theme.inkMuted}}>观测年份</div><div style={{fontSize: 35, fontWeight: 850, marginTop: 6}}>2025 年</div></div>
          <div style={{padding: "24px 0 24px 28px"}}><div style={{fontSize: 24, color: theme.inkMuted}}>历史位置</div><div style={{fontSize: 35, fontWeight: 850, color: theme.red, marginTop: 6}}>中高估值区</div></div>
        </div>
      </div>
    </div>
  );
};

export const FormulaScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = reveal(frame, fps, 7);
  return (
    <div>
      <SceneTitle visual={visual} />
      <div style={{borderTop: `10px solid ${theme.ink}`, borderBottom: `3px solid ${theme.ink}`, opacity: enter, transform: `translateY(${(1-enter)*30}px)`}}>
        <div style={{padding: "60px 28px 48px", textAlign: "center", fontSize: 53, fontWeight: 900, color: theme.blue}}>{visual.numerator}</div>
        <div style={{height: 6, background: theme.ink}} />
        <div style={{padding: "48px 28px 60px", textAlign: "center", fontSize: 53, fontWeight: 900}}>{visual.denominator}</div>
      </div>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "28px 0", borderBottom: `2px solid ${theme.divider}`, opacity: enter}}>
        <span style={{fontSize: 29, color: theme.inkMuted}}>股票资产相对实体经济的规模</span><span style={{fontFamily: numberFontFamily, fontSize: 50, fontWeight: 900, color: theme.red}}>× 100%</span>
      </div>
    </div>
  );
};

export const LineChartScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const points = visual.points ?? [];
  const progress = interpolate(frame, [8, 96], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const chart = {x: 74, y: 86, width: 785, height: 650};
  const minYear = Math.min(...points.map((p) => p.year));
  const maxYear = Math.max(...points.map((p) => p.year));
  const maxValue = 130;
  const xy = points.map((p) => ({...p, x: chart.x + ((p.year-minYear)/(maxYear-minYear))*chart.width, y: chart.y + chart.height - (p.value/maxValue)*chart.height}));
  const path = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const highlights = new Set(visual.highlightYears ?? []);
  return (
    <div>
      <SceneTitle visual={visual} />
      <div style={{height: 835, background: theme.graphite, borderTop: `10px solid ${theme.red}`}}>
        <svg width="100%" height="100%" viewBox="0 0 930 820" style={{fontFamily}}>
          <rect x={chart.x} y={chart.y + chart.height - (80/maxValue)*chart.height} width={chart.width} height={(20/maxValue)*chart.height} fill="#65302E" opacity="0.58" />
          {[0, 40, 80, 120].map((value) => { const y = chart.y + chart.height - (value/maxValue)*chart.height; return <g key={value}><line x1={chart.x} y1={y} x2={chart.x+chart.width} y2={y} stroke="#535A63" strokeWidth="2" /><text x="13" y={y+9} fontSize="25" fill="#AEB5BD">{value}%</text></g>; })}
          <path d={path} fill="none" stroke="#E9EDF1" strokeWidth="8" strokeLinejoin="miter" pathLength={1} strokeDasharray="1" strokeDashoffset={1-progress} />
          {xy.filter((p) => highlights.has(p.year) && p.x <= chart.x + chart.width*progress + 6).map((p) => {
            const labelX = Math.min(chart.x+chart.width-64, Math.max(chart.x+64, p.x));
            const labelY = p.year === 2025 ? Math.min(680, p.y+38) : Math.max(18, p.y-74);
            return <g key={p.year}><circle cx={p.x} cy={p.y} r="12" fill={p.year === 2007 ? theme.red : theme.orange} stroke={theme.graphite} strokeWidth="5" /><text x={labelX} y={labelY} textAnchor="middle" fontFamily={numberFontFamily} fontSize="27" fontWeight="800" fill={p.year === 2007 ? "#FF6B62" : "#FFFFFF"}>{p.year} / {Math.round(p.value)}%</text></g>;
          })}
          {[2005, 2010, 2015, 2020, 2025].map((year) => { const x = chart.x + ((year-minYear)/(maxYear-minYear))*chart.width; return <text key={year} x={x} y="785" textAnchor="middle" fontFamily={numberFontFamily} fontSize="24" fill="#AEB5BD">{year}</text>; })}
        </svg>
      </div>
    </div>
  );
};

export const RowsScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div>
      <SceneTitle visual={visual} />
      <div style={{borderTop: `9px solid ${theme.ink}`}}>
        {(visual.cards ?? []).map((row, index) => {
          const enter = reveal(frame, fps, index*8);
          const color = row.tone === "red" ? theme.red : row.tone === "gold" ? theme.orange : theme.blue;
          return <div key={row.title} style={{display: "grid", gridTemplateColumns: row.value ? "245px 1fr" : "100px 1fr", minHeight: row.value ? 210 : 188, borderBottom: `3px solid ${theme.ink}`, opacity: enter, transform: `translateX(${(1-enter)*35}px)`}}>
            <div style={{display: "flex", alignItems: "center", paddingRight: 22, borderRight: `2px solid ${theme.divider}`, fontFamily: numberFontFamily, fontSize: row.value ? 64 : 39, fontWeight: 900, color}}>{row.value ?? `0${index+1}`}</div>
            <div style={{display: "flex", justifyContent: "center", flexDirection: "column", padding: "24px 0 24px 30px"}}><div style={{fontSize: 40, lineHeight: 1.25, fontWeight: 900}}>{row.title}</div>{row.body ? <div style={{fontSize: 28, lineHeight: 1.4, color: theme.inkMuted, marginTop: 10}}>{row.body}</div> : null}</div>
          </div>;
        })}
      </div>
    </div>
  );
};

export const MeterScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const max = 130;
  const progress = interpolate(frame, [10, 68], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const current = visual.current ?? 78.5;
  const x = 26 + (current/max)*840*progress;
  return (
    <div>
      <SceneTitle visual={visual} />
      <div style={{borderTop: `10px solid ${theme.ink}`, paddingTop: 54}}>
        <div style={{fontFamily: numberFontFamily, fontSize: 118, lineHeight: 1, fontWeight: 900, color: theme.red, letterSpacing: -7}}>{current.toFixed(1)}%</div>
        <div style={{fontSize: 29, fontWeight: 800, color: theme.inkMuted, marginTop: 13}}>{String(visual.currentLabel ?? "当前值")}</div>
        <div style={{position: "relative", height: 180, marginTop: 50}}>
          <div style={{position: "absolute", left: 26, width: 840, top: 70, height: 38, background: `linear-gradient(90deg,#D9E3EA 0 48%,#B9C3CC 48% 62%,#E8ABA6 62% 100%)`}} />
          <div style={{position: "absolute", left: x-5, top: 31, width: 10, height: 115, background: theme.red}} />
          {[0,45,63,80,100,124].map((value) => <div key={value} style={{position: "absolute", left: 26+(value/max)*840-32, top: 120, width: 64, textAlign: "center", fontFamily: numberFontFamily, fontSize: 23, color: theme.inkMuted}}>{value}</div>)}
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `3px solid ${theme.ink}`, borderBottom: `3px solid ${theme.ink}`}}>
          <div style={{padding: "30px 24px 30px 0", borderRight: `2px solid ${theme.divider}`}}><div style={{fontSize: 25, color: theme.inkMuted}}>历史中位数</div><div style={{fontFamily: numberFontFamily, fontSize: 66, fontWeight: 900, marginTop: 7}}>{visual.median}%</div></div>
          <div style={{padding: "30px 0 30px 32px"}}><div style={{fontSize: 25, color: theme.inkMuted}}>2007 极端峰值</div><div style={{fontFamily: numberFontFamily, fontSize: 66, fontWeight: 900, color: theme.red, marginTop: 7}}>{visual.peak}%</div></div>
        </div>
      </div>
    </div>
  );
};

export const ConclusionScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = reveal(frame, fps);
  return (
    <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", opacity: enter, transform: `translateY(${(1-enter)*25}px)`}}>
      <div style={{fontSize: 28, fontWeight: 850, color: theme.red, letterSpacing: 5, marginBottom: 32}}>{visual.eyebrow}</div>
      <div style={{borderTop: `12px solid ${theme.ink}`, borderBottom: `12px solid ${theme.ink}`, padding: "46px 0 52px", fontSize: 89, lineHeight: 1.18, fontWeight: 950, letterSpacing: -4}}>{visual.conclusion}</div>
      <div style={{marginTop: 44}}>{(visual.bullets ?? []).map((bullet, i) => <div key={bullet} style={{display: "grid", gridTemplateColumns: "78px 1fr", padding: "20px 0", borderBottom: `2px solid ${theme.divider}`, fontSize: 36, fontWeight: 800}}><span style={{fontFamily: numberFontFamily, color: i === 0 ? theme.red : theme.inkMuted}}>0{i+1}</span><span>{bullet}</span></div>)}</div>
    </div>
  );
};

export const SourcesScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{opacity}}>
      <SceneTitle visual={visual} />
      <div style={{borderTop: `9px solid ${theme.ink}`}}>{(visual.sources ?? []).map((source, index) => <div key={source} style={{display: "grid", gridTemplateColumns: "90px 1fr", padding: "31px 0", borderBottom: `2px solid ${theme.ink}`}}><div style={{fontFamily: numberFontFamily, fontSize: 28, fontWeight: 900, color: theme.red}}>0{index+1}</div><div style={{fontSize: 30, lineHeight: 1.45}}>{source}</div></div>)}</div>
      <div style={{marginTop: 48, padding: "24px 0", borderTop: `3px solid ${theme.red}`, borderBottom: `3px solid ${theme.red}`, fontSize: 30, color: theme.red, fontWeight: 850}}>宏观估值研究框架 · 不构成投资建议</div>
    </div>
  );
};

export const SceneRenderer: React.FC<{visual: VisualSpec}> = ({visual}) => {
  switch (visual.template) {
    case "hook-big-number": return <HookScene visual={visual} />;
    case "formula-breakdown": return <FormulaScene visual={visual} />;
    case "line-chart": return <LineChartScene visual={visual} />;
    case "compare-cards":
    case "three-points": return <RowsScene visual={visual} />;
    case "conclusion-meter": return <MeterScene visual={visual} />;
    case "conclusion": return <ConclusionScene visual={visual} />;
    case "sources-card": return <SourcesScene visual={visual} />;
    default: return <RowsScene visual={visual} />;
  }
};
