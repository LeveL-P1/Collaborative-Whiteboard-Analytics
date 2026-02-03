import type { Stroke } from "./stroke"

export type StrokeEvent =
  | { type: "STROKE_START"; stroke: Stroke }
  | { type: "STROKE_UPDATE"; stroke: Stroke }
  | { type: "STROKE_END"; stroke: Stroke }
