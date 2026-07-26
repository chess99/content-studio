import React from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {VisualSpec} from "../types";
import {fontFamily, theme} from "../theme";

const panel: React.CSSProperties = {
  width: "100%",
  borderRadius: 44,
  background: "rgba(255,253,248,0.9)",
  border: `2px solid ${theme.creamStrong}`,
  boxShadow: "0 24px 80px rgba(50,42,28,0.08)",
};

const SceneTitle: React.FC<{visual: VisualSpec}> = ({visual}) => (
  <div style={{marginBottom: 54}}>
    {visual.eyebrow ? <div style={{fontSize: 29, color: theme.gold, fontWeight: 800, letterSpacing: 4, marginBottom: 16}}>{visual.eyebrow}</div> : null}
    {visual.title ? <div style={{fontSize: 72, lineHeight: 1.12, fontWeight: 900, color: theme.ink, letterSpacing: -2}}>{visual.title}</div> : null}
    {visual.subtitle ? <div style={{fontSize: 34, lineHeight: 1.5, color: theme.inkMuted, marginTop: 18}}>{visual.subtitle}</div> : null}
  </div>
);

export const HookScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inValue = spring({frame, fps, config: {damping: 13, stiffness: 95}});
  const ring = interpolate(frame, [8, 42], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", transform: `translateY(${(1 - inValue) * 70}px)`, opacity: inValue}}>
      <div style={{fontSize: 31, fontWeight: 800, color: theme.gold, letterSpacing: 6, marginBottom: 40}}>{visual.eyebrow}</div>
      <div style={{fontSize: 104, fontWeight: 950, lineHeight: 1.08, letterSpacing: -5, color: theme.ink, maxWidth: 820}}>{visual.title}</div>
      <div style={{position: "relative", width: 640, height: 640, alignSelf: "center", marginTop: 70}}>
        <svg width="640" height="640" viewBox="0 0 640 640" style={{position: "absolute"}}>
          <circle cx="320" cy="320" r="250" fill="none" stroke={theme.creamStrong} strokeWidth="42" />
          <circle cx="320" cy="320" r="250" fill="none" stroke={theme.red} strokeWidth="42" strokeLinecap="round" pathLength={1} strokeDasharray="0.74 1" strokeDashoffset={0.74 - 0.74 * ring} transform="rotate(135 320 320)" />
        </svg>
        <div style={{position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
          <div style={{fontSize: 112, lineHeight: 1, fontWeight: 950, color: theme.red, letterSpacing: -5}}>{visual.stat}</div>
          <div style={{fontSize: 34, marginTop: 25, color: theme.inkMuted, fontWeight: 700}}>2025 年 · 两种公开口径</div>
        </div>
      </div>
    </div>
  );
};

export const FormulaScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const left = spring({frame: frame - 6, fps, config: {damping: 16}});
  const right = spring({frame: frame - 14, fps, config: {damping: 16}});
  return (
    <div style={{paddingTop: 190}}>
      <SceneTitle visual={visual} />
      <div style={{...panel, padding: "80px 54px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28}}>
        <div style={{width: "100%", display: "flex", alignItems: "center", gap: 30, transform: `translateX(${(1-left)*-80}px)`, opacity: left}}>
          <div style={{flex: 1, padding: "42px 32px", borderRadius: 28, background: theme.blueSoft, fontSize: 47, fontWeight: 900, color: theme.blue, textAlign: "center"}}>{visual.numerator}</div>
        </div>
        <div style={{width: "86%", height: 8, borderRadius: 4, background: theme.ink}} />
        <div style={{width: "100%", display: "flex", alignItems: "center", gap: 30, transform: `translateX(${(1-right)*80}px)`, opacity: right}}>
          <div style={{flex: 1, padding: "42px 32px", borderRadius: 28, background: theme.goldSoft, fontSize: 47, fontWeight: 900, color: theme.ink, textAlign: "center"}}>{visual.denominator}</div>
        </div>
        <div style={{fontSize: 42, fontWeight: 900, color: theme.red, marginTop: 28}}>× 100%</div>
      </div>
    </div>
  );
};

export const LineChartScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const points = visual.points ?? [];
  const progress = interpolate(frame, [10, 95], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const chart = {x: 76, y: 80, width: 780, height: 650};
  const minYear = Math.min(...points.map((p) => p.year));
  const maxYear = Math.max(...points.map((p) => p.year));
  const maxValue = 130;
  const xy = points.map((p) => ({
    ...p,
    x: chart.x + ((p.year - minYear) / (maxYear - minYear)) * chart.width,
    y: chart.y + chart.height - (p.value / maxValue) * chart.height,
  }));
  const path = xy.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const highlights = new Set(visual.highlightYears ?? []);
  return (
    <div style={{paddingTop: 150}}>
      <SceneTitle visual={visual} />
      <div style={{...panel, height: 880, padding: "30px 20px"}}>
        <svg width="100%" height="100%" viewBox="0 0 930 820">
          {[0, 40, 80, 120].map((value) => {
            const y = chart.y + chart.height - (value / maxValue) * chart.height;
            return <g key={value}><line x1={chart.x} y1={y} x2={chart.x + chart.width} y2={y} stroke={theme.creamStrong} strokeWidth="2" /><text x="8" y={y + 10} fontSize="27" fill={theme.inkMuted}>{value}%</text></g>;
          })}
          <rect x={chart.x} y={chart.y + chart.height - (80/maxValue)*chart.height} width={chart.width} height={(20/maxValue)*chart.height} fill={theme.redSoft} opacity="0.65" />
          <path d={path} fill="none" stroke={theme.blue} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1-progress} />
          {xy.filter((p) => highlights.has(p.year) && p.x <= chart.x + chart.width * progress + 5).map((p) => (
            <g key={p.year}>{(() => {
              const labelCenter = Math.min(chart.x + chart.width - 96, Math.max(chart.x + 96, p.x));
              const labelY = p.year === 2025 ? Math.min(chart.y + chart.height - 70, p.y + 34) : Math.max(10, p.y - 90);
              return <>
                <circle cx={p.x} cy={p.y} r="15" fill={p.year === 2007 ? theme.red : theme.gold} stroke={theme.white} strokeWidth="7" />
                <rect x={labelCenter - 90} y={labelY} width="180" height="60" rx="18" fill={theme.ink} />
                <text x={labelCenter} y={labelY + 40} textAnchor="middle" fontSize="23" fontWeight="800" fill={theme.white}>{p.year} · {Math.round(p.value)}%</text>
              </>;
            })()}</g>
          ))}
          {[2005, 2010, 2015, 2020, 2025].map((year) => {
            const x = chart.x + ((year - minYear) / (maxYear - minYear)) * chart.width;
            return <text key={year} x={x} y={780} textAnchor="middle" fontSize="25" fill={theme.inkMuted}>{year}</text>;
          })}
        </svg>
      </div>
    </div>
  );
};

export const CardsScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{paddingTop: 160}}>
      <SceneTitle visual={visual} />
      <div style={{display: "flex", flexDirection: "column", gap: 30}}>
        {(visual.cards ?? []).map((card, index) => {
          const enter = spring({frame: frame - index * 10, fps, config: {damping: 16}});
          const color = card.tone === "red" ? theme.red : card.tone === "gold" ? theme.gold : theme.blue;
          const bg = card.tone === "red" ? theme.redSoft : card.tone === "gold" ? theme.goldSoft : theme.blueSoft;
          return <div key={card.title} style={{...panel, minHeight: 205, padding: "36px 42px", display: "grid", gridTemplateColumns: card.value ? "260px 1fr" : "1fr", alignItems: "center", gap: 35, transform: `translateY(${(1-enter)*55}px)`, opacity: enter}}>
            {card.value ? <div style={{fontSize: 62, fontWeight: 950, color, background: bg, borderRadius: 26, padding: "28px 18px", textAlign: "center"}}>{card.value}</div> : null}
            <div><div style={{fontSize: 42, fontWeight: 900, color: theme.ink}}>{card.title}</div>{card.body ? <div style={{fontSize: 30, lineHeight: 1.5, color: theme.inkMuted, marginTop: 12}}>{card.body}</div> : null}</div>
          </div>;
        })}
      </div>
    </div>
  );
};

export const MeterScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const max = 130;
  const progress = interpolate(frame, [12, 70], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const current = visual.current ?? 78.5;
  const x = 64 + (current / max) * 790 * progress;
  return (
    <div style={{paddingTop: 180}}>
      <SceneTitle visual={visual} />
      <div style={{...panel, padding: "75px 54px", minHeight: 690}}>
        <div style={{position: "relative", height: 180, marginTop: 80}}>
          <div style={{position: "absolute", left: 64, right: 64, top: 70, height: 42, borderRadius: 21, background: `linear-gradient(90deg, ${theme.blueSoft} 0 48%, ${theme.goldSoft} 48% 62%, ${theme.redSoft} 62% 100%)`}} />
          <div style={{position: "absolute", left: x - 4, top: 32, width: 8, height: 118, borderRadius: 4, background: theme.red}} />
          <div style={{position: "absolute", left: x - 70, top: -34, width: 140, textAlign: "center", color: theme.red, fontSize: 35, fontWeight: 950}}>{current.toFixed(1)}%</div>
          {[0, 45, 63, 80, 100, 124].map((value) => <div key={value} style={{position: "absolute", left: 64 + (value/max)*790 - 35, top: 135, width: 70, textAlign: "center", fontSize: 25, color: theme.inkMuted}}>{value}</div>)}
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26, marginTop: 65}}>
          <div style={{borderRadius: 30, background: theme.goldSoft, padding: "32px 34px"}}><div style={{fontSize: 27, color: theme.inkMuted}}>历史中位数</div><div style={{fontSize: 64, fontWeight: 950, color: theme.ink}}>{visual.median}%</div></div>
          <div style={{borderRadius: 30, background: theme.redSoft, padding: "32px 34px"}}><div style={{fontSize: 27, color: theme.inkMuted}}>2007 极端峰值</div><div style={{fontSize: 64, fontWeight: 950, color: theme.red}}>{visual.peak}%</div></div>
        </div>
      </div>
    </div>
  );
};

export const ConclusionScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 14}});
  return (
    <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", opacity: enter, transform: `scale(${0.94 + enter*0.06})`}}>
      <div style={{fontSize: 30, fontWeight: 850, color: theme.gold, letterSpacing: 5, marginBottom: 35}}>{visual.eyebrow}</div>
      <div style={{fontSize: 96, lineHeight: 1.2, fontWeight: 950, color: theme.ink, letterSpacing: -4}}>{visual.conclusion}</div>
      <div style={{height: 8, width: 220, background: theme.red, borderRadius: 4, margin: "58px 0 46px"}} />
      <div style={{display: "flex", flexDirection: "column", gap: 24}}>
        {(visual.bullets ?? []).map((bullet, i) => <div key={bullet} style={{fontSize: 40, fontWeight: 750, color: i === 0 ? theme.blue : theme.inkMuted}}>0{i+1}&nbsp;&nbsp;{bullet}</div>)}
      </div>
    </div>
  );
};

export const SourcesScene: React.FC<{visual: VisualSpec}> = ({visual}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div style={{height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", opacity}}>
      <SceneTitle visual={visual} />
      <div style={{...panel, padding: "46px 44px"}}>
        {(visual.sources ?? []).map((source, index) => <div key={source} style={{display: "grid", gridTemplateColumns: "52px 1fr", gap: 18, padding: "25px 0", borderBottom: index === (visual.sources?.length ?? 0)-1 ? "none" : `2px solid ${theme.creamStrong}`}}><div style={{fontSize: 25, fontWeight: 900, color: theme.gold}}>0{index+1}</div><div style={{fontSize: 31, lineHeight: 1.45, color: theme.ink}}>{source}</div></div>)}
      </div>
      <div style={{fontSize: 31, color: theme.red, fontWeight: 800, marginTop: 50}}>宏观估值研究框架 · 不构成投资建议</div>
    </div>
  );
};

export const SceneRenderer: React.FC<{visual: VisualSpec}> = ({visual}) => {
  switch (visual.template) {
    case "hook-big-number": return <HookScene visual={visual} />;
    case "formula-breakdown": return <FormulaScene visual={visual} />;
    case "line-chart": return <LineChartScene visual={visual} />;
    case "compare-cards":
    case "three-points": return <CardsScene visual={visual} />;
    case "conclusion-meter": return <MeterScene visual={visual} />;
    case "conclusion": return <ConclusionScene visual={visual} />;
    case "sources-card": return <SourcesScene visual={visual} />;
    default: return <CardsScene visual={visual} />;
  }
};
