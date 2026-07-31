import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from "remotion";
import {CaptionLayer} from "./CaptionLayer";
import {BrandMark} from "./BrandMark";
import {SceneRenderer} from "./templates";
import type {VideoProps} from "./types";
import {fontFamily, theme} from "./theme";

export const KnowledgeVideo: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const series = props.brand?.series ?? props.seriesLabel;
  const seriesLabel = props.brand?.issue ? `${series} · ${props.brand.issue}` : series;

  return (
    <AbsoluteFill style={{background: theme.paper, color: theme.ink, fontFamily}}>
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: theme.red}} />
      <div style={{position: "absolute", left: 72, right: 72, top: 62, height: 2, background: theme.ink}} />
      <div style={{position: "absolute", left: 72, right: 72, top: 78, display: "flex", justifyContent: "space-between", alignItems: "center", color: theme.ink, fontWeight: 800}}>
        <BrandMark tagline={props.brand?.tagline} compact />
        <span style={{fontSize: 23, color: theme.inkMuted, letterSpacing: 2}}>{seriesLabel}</span>
      </div>

      {props.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} premountFor={30}>
          <AbsoluteFill style={{padding: "0 72px 355px 84px"}}>
            <SceneRenderer visual={scene.visual} />
          </AbsoluteFill>
          <Sequence from={scene.audioStartFrame}>
            <Audio src={staticFile(scene.audioPath)} volume={1} playbackRate={scene.audioPlaybackRate ?? 1} />
          </Sequence>
          {props.coverMode ? null : <CaptionLayer captions={scene.captions} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
