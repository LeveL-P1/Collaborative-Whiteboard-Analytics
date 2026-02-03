type ToolbarProps = {
  onUndo: () => void
  onClear: () => void
}

export default function DrawingToolbar({
  onUndo,
  onClear
}: ToolbarProps) {
  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={onUndo} style={{ marginRight: 8 }}>
        Undo
      </button>

      <button onClick={onClear}>
        Clear
      </button>
    </div>
  )
}
