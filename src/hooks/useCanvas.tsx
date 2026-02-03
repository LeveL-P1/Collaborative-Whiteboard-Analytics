import { useRef, useState } from "react"
import type { Stroke, Point } from "../models/stroke"

export function useCanvas(userId: string) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null)

  const startStroke = (x: number, y: number) => {
    const newStroke: Stroke = {
      strokeId: crypto.randomUUID(),
      userId,
      color: "#000000",
      width: 2,
      points: [
        {
          x,
          y,
          t: Date.now()
        }
      ]
    }

    setCurrentStroke(newStroke)
  }

  const updateStroke = (x: number, y: number) => {
    if (!currentStroke) return

    const newPoint: Point = {
      x,
      y,
      t: Date.now()
    }

    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, newPoint]
    })
  }

  const endStroke = () => {
    if (!currentStroke) return

    setStrokes(prev => [...prev, currentStroke])
    setCurrentStroke(null)
  }

  const undoLastStroke = () => {
    setStrokes(prev => prev.slice(0, -1))
  }

  const clearCanvas = () => {
    setStrokes([])
    setCurrentStroke(null)
  }

  return {
    canvasRef,
    strokes,
    currentStroke,
    startStroke,
    updateStroke,
    endStroke,
    undoLastStroke,
    clearCanvas
  }
}
