export type Point = {
  x: number
  y: number
  t: number
}

export type Stroke = {
  strokeId: string
  userId: string
  color: string
  width: number
  points: Point[]
}
