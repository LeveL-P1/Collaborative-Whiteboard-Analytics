import { useRef, useState } from "react"
import type { Stroke, Point } from "../models/stroke"
import type { StrokeEvent } from "../models/realTime"

export function useCanvas(userId: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)

  const startStroke = (x: number, y: number): StrokeEvent => {
    const stroke: Stroke = {
      strokeId: crypto.randomUUID(),
      userId,
      color: "#000000",
      width: 2,
      points: [{ x, y, t: Date.now() }]
    }

    setCurrentStroke(stroke)

    return { type: "STROKE_START", stroke }
  }

  const updateStroke = (x: number, y: number): StrokeEvent | null => {
    if (!currentStroke) return null

    const point: Point = { x, y, t: Date.now() }

    const updated = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    }

    setCurrentStroke(updated)

    return { type: "STROKE_UPDATE", stroke: updated }
  }

  const endStroke = (): StrokeEvent | null => {
    if (!currentStroke) return null

    setStrokes(prev => [...prev, currentStroke])
    setCurrentStroke(null)

    return { type: "STROKE_END", stroke: currentStroke }
  }

  const applyRemoteEvent = (event: StrokeEvent) => {
    if (event.type === "STROKE_END") {
      setStrokes(prev => [...prev, event.stroke])
    }
  }

  return {
    canvasRef,
    strokes,
    currentStroke,
    startStroke,
    updateStroke,
    endStroke,
    applyRemoteEvent
  }
}
