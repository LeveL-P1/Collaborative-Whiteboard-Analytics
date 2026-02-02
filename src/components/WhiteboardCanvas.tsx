import { useEffect } from "react"
import { useCanvas } from "../hooks/useCanvas"
import type { Stroke } from "../models/stroke"

export default function WhiteboardCanvas() {
  const {
    canvasRef,
    strokes,
    currentStroke,
    startStroke,
    updateStroke,
    endStroke
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

    stroke.points.forEach(point => {
      ctx.lineTo(point.x, point.y)
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

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #ccc", cursor: "crosshair" }}
      onMouseDown={e => {
        const { x, y } = getCanvasCoords(e)
        startStroke(x, y)
      }}
      onMouseMove={e => {
        if (e.buttons !== 1) return
        const { x, y } = getCanvasCoords(e)
        updateStroke(x, y)
      }}
      onMouseUp={endStroke}
      onMouseLeave={endStroke}
    />
  )
}
