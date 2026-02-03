import { useEffect } from "react"
import { useCanvas } from "../hooks/useCanvas"
import { useRealtime } from "../hooks/useRealtime"
import { getCanvasCoordinates } from "../utils/canvasMath"
import type { Stroke } from "../models/stroke"

const SESSION_ID = "demo-session"

export default function WhiteboardCanvas() {
  const {
    canvasRef,
    strokes,
    currentStroke,
    startStroke,
    updateStroke,
    endStroke,
    applyRemoteEvent
  } = useCanvas(crypto.randomUUID())

  const { emitEvent } = useRealtime(SESSION_ID, applyRemoteEvent)

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

    stroke.points.forEach(p => ctx.lineTo(p.x, p.y))
    ctx.stroke()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    strokes.forEach(s => drawStroke(ctx, s))
    if (currentStroke) drawStroke(ctx, currentStroke)
  }, [strokes, currentStroke])

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #ccc", cursor: "crosshair" }}
      onMouseDown={e => {
        const { x, y } = getCanvasCoordinates(e)
        const ev = startStroke(x, y)
        emitEvent(ev)
      }}
      onMouseMove={e => {
        if (e.buttons !== 1) return
        const { x, y } = getCanvasCoordinates(e)
        const ev = updateStroke(x, y)
        if (ev) emitEvent(ev)
      }}
      onMouseUp={() => {
        const ev = endStroke()
        if (ev) emitEvent(ev)
      }}
      onMouseLeave={() => {
        const ev = endStroke()
        if (ev) emitEvent(ev)
      }}
    />
  )
}
