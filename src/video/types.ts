export type DataPoint = {year: number; value: number};

export type Caption = {
  text: string;
  startFrame: number;
  endFrame: number;
};

export type VisualSpec = {
  template: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  stat?: string;
  statSuffix?: string;
  leftLabel?: string;
  rightLabel?: string;
  numerator?: string;
  denominator?: string;
  points?: DataPoint[];
  highlightYears?: number[];
  cards?: Array<{value?: string; title: string; body?: string; tone?: "blue" | "red" | "gold"}>;
  current?: number;
  low?: number;
  high?: number;
  median?: number;
  peak?: number;
  conclusion?: string;
  bullets?: string[];
  sources?: string[];
  [key: string]: unknown;
};

export type PreparedScene = {
  id: string;
  from: number;
  durationInFrames: number;
  audioStartFrame: number;
  audioPath: string;
  displayText: string;
  sourceIds: string[];
  template: string;
  visual: VisualSpec;
  captions: Caption[];
};

export type VideoProps = {
  project: string;
  title: string;
  seriesLabel: string;
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  scenes: PreparedScene[];
  coverMode?: boolean;
};
