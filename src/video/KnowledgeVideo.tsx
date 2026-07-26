import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from "remotion";
import {CaptionLayer} from "./CaptionLayer";
import {SceneRenderer} from "./templates";
import type {VideoProps} from "./types";
import {fontFamily, theme} from "./theme";

export const KnowledgeVideo: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  const sceneIndex = Math.max(0, props.scenes.findIndex((scene) => frame >= scene.from && frame < scene.from + scene.durationInFrames));
  const progress = Math.min(1, frame / Math.max(1, props.totalFrames - 1));

  return (
    <AbsoluteFill style={{background: theme.paper, color: theme.ink, fontFamily}}>
      <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: theme.red}} />
      <div style={{position: "absolute", left: 72, right: 72, top: 62, height: 2, background: theme.ink}} />
      <div style={{position: "absolute", left: 72, right: 72, top: 82, display: "flex", justifyContent: "space-between", alignItems: "baseline", color: theme.ink, fontWeight: 800}}>
        <span style={{fontSize: 25, letterSpacing: 4}}>{props.seriesLabel}</span>
        <span style={{fontSize: 24, color: theme.inkMuted, letterSpacing: 2}}>0{sceneIndex + 1} / 0{props.scenes.length}</span>
      </div>
      <div style={{position: "absolute", left: 72, right: 72, bottom: 112, height: 3, background: theme.divider}}>
        <div style={{height: "100%", width: `${progress * 100}%`, background: theme.red}} />
      </div>

      {props.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} premountFor={30}>
          <AbsoluteFill style={{padding: "0 72px 355px 84px"}}>
            <SceneRenderer visual={scene.visual} />
          </AbsoluteFill>
          <Sequence from={scene.audioStartFrame}>
            <Audio src={staticFile(scene.audioPath)} volume={1} />
          </Sequence>
          {props.coverMode ? null : <CaptionLayer captions={scene.captions} />}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
