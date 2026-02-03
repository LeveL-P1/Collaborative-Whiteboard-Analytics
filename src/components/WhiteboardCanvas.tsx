import { useEffect } from "react"
import { useCanvas } from "../hooks/useCanvas"
import { getCanvasCoordinates } from "../utils/canvasMath"
import type { Stroke } from "../models/stroke"
import DrawingToolbar from "./DrawingToolbar"

export default function WhiteboardCanvas() {
  const {
    canvasRef,
    strokes,
    currentStroke,
    startStroke,
    updateStroke,
    endStroke,
    undoLastStroke,
    clearCanvas
  } = useCanvas("local-user")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 800
    canvas.height = 600
  }, [])

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    stroke: Stroke
  ) => {
    if (stroke.points.length < 2) return

    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

    stroke.points.forEach(p => {
      ctx.lineTo(p.x, p.y)
    })

    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach(stroke => drawStroke(ctx, stroke))
    if (currentStroke) drawStroke(ctx, currentStroke)
  }, [strokes, currentStroke])

  return (
    <div>
      <DrawingToolbar
        onUndo={undoLastStroke}
        onClear={clearCanvas}
      />

      <canvas
        ref={canvasRef}
        style={{ border: "1px solid #ccc", cursor: "crosshair" }}
        onMouseDown={e => {
          const { x, y } = getCanvasCoordinates(e)
          startStroke(x, y)
        }}
        onMouseMove={e => {
          if (e.buttons !== 1) return
          const { x, y } = getCanvasCoordinates(e)
          updateStroke(x, y)
        }}
        onMouseUp={endStroke}
        onMouseLeave={endStroke}
      />
    </div>
  )
}
