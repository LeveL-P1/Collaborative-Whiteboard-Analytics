import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import cors from "cors"

const app = express()
app.use(cors())

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
})

io.on("connection", socket => {
  socket.on("join-session", sessionId => {
    socket.join(sessionId)
  })

  socket.on("stroke-event", ({ sessionId, event }) => {
    socket.to(sessionId).emit("stroke-event", event)
  })

  socket.on("disconnect", () => {})
})

httpServer.listen(4000, () => {
  console.log("Realtime server running on port 4000")
})
