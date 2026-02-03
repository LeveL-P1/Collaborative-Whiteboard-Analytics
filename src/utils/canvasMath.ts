export function getCanvasCoordinates(
  e: React.MouseEvent<HTMLCanvasElement>
) {
  const rect = e.currentTarget.getBoundingClientRect()

  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}
