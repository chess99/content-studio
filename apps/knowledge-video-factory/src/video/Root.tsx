import React from "react";
import {Composition} from "remotion";
import {KnowledgeVideo} from "./KnowledgeVideo";
import {KnowledgeCover} from "./KnowledgeCover";
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
  brand: {tagline: "用数据校准判断", series: "市场温度计"},
  cover: {titleLines: ["知识视频"], stat: ""},
};

export const RemotionRoot: React.FC = () => <>
  <Composition
    id="KnowledgeVideo"
    component={KnowledgeVideo}
    durationInFrames={defaultProps.totalFrames}
    fps={defaultProps.fps}
    width={defaultProps.width}
    height={defaultProps.height}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({durationInFrames: props.totalFrames, fps: props.fps, width: props.width, height: props.height})}
  />
  <Composition
    id="KnowledgeCover"
    component={KnowledgeCover}
    durationInFrames={1}
    fps={defaultProps.fps}
    width={defaultProps.width}
    height={defaultProps.height}
    defaultProps={defaultProps}
    calculateMetadata={({props}) => ({durationInFrames: 1, fps: props.fps, width: props.width, height: props.height})}
  />
</>;
