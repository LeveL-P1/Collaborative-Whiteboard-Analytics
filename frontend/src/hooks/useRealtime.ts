import { useEffect } from "react"
import { io, Socket } from "socket.io-client"
import type { StrokeEvent } from "../models/realtime"

let socket: Socket | null = null

export function useRealtime(
  sessionId: string,
  onRemoteEvent: (event: StrokeEvent) => void
) {
  useEffect(() => {
    socket = io("http://localhost:4000")

    socket.emit("join-session", sessionId)

    socket.on("stroke-event", (event: StrokeEvent) => {
      onRemoteEvent(event)
    })

    return () => {
      socket?.disconnect()
    }
  }, [sessionId, onRemoteEvent])

  const emitEvent = (event: StrokeEvent) => {
    socket?.emit("stroke-event", { sessionId, event })
  }

  return { emitEvent }
}
