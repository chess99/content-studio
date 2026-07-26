import React from "react";
import {Audio} from "@remotion/media";
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from "remotion";
import {CaptionLayer} from "./CaptionLayer";
import {SceneRenderer} from "./templates";
import type {VideoProps} from "./types";
import {fontFamily, theme} from "./theme";

export const KnowledgeVideo: React.FC<VideoProps> = (props) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: theme.cream, color: theme.ink, fontFamily}}>
      <div style={{position: "absolute", inset: 0, opacity: 0.35, backgroundImage: `linear-gradient(${theme.creamStrong} 1px, transparent 1px), linear-gradient(90deg, ${theme.creamStrong} 1px, transparent 1px)`, backgroundSize: "72px 72px"}} />
      <div style={{position: "absolute", left: 70, right: 70, top: 70, height: 6, display: "flex", gap: 10}}>
        {props.scenes.map((scene) => <div key={scene.id} style={{flex: scene.durationInFrames, background: frame >= scene.from ? theme.gold : theme.creamStrong, borderRadius: 3}} />)}
      </div>
      <div style={{position: "absolute", left: 76, right: 76, top: 98, display: "flex", justifyContent: "space-between", fontSize: 24, color: theme.inkMuted, fontWeight: 800, letterSpacing: 3}}>
        <span>{props.seriesLabel}</span><span>{props.title}</span>
      </div>

      {props.scenes.map((scene) => (
        <Sequence key={scene.id} from={scene.from} durationInFrames={scene.durationInFrames} premountFor={30}>
          <AbsoluteFill style={{padding: "0 76px 370px"}}>
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
