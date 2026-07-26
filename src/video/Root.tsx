import React from "react";
import {Composition} from "remotion";
import {KnowledgeVideo} from "./KnowledgeVideo";
import type {VideoProps} from "./types";

const defaultProps: VideoProps = {
  project: "empty",
  title: "知识视频",
  seriesLabel: "知识图解",
  fps: 30,
  width: 1080,
  height: 1920,
  totalFrames: 300,
  scenes: [],
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="KnowledgeVideo"
    component={KnowledgeVideo}
    durationInFrames={defaultProps.totalFrames}
    fps={defaultProps.fps}
    width={defaultProps.width}
    height={defaultProps.height}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({
      durationInFrames: props.totalFrames,
      fps: props.fps,
      width: props.width,
      height: props.height,
    })}
  />
);
