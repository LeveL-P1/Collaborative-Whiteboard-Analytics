/* eslint-disable @typescript-eslint/no-explicit-any */
//import { TLEditorComponents, TLUiOverrides, createShapeId } from '@tldraw/tldraw'
import {Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'
import { useYjsStore } from '@/hooks/useYjsStore'
import { useCallback,  } from 'react' // useEffect removed
import { useAnalytics } from '@/hooks/useAnalytics'
import { AIDiagramPanel } from './AIDiagramPanel'

interface WhiteboardProps {
  boardId: string
}

export function Whiteboard({ boardId }: WhiteboardProps) {
  const { store } = useYjsStore({ roomId: boardId })
  const { trackEvent } = useAnalytics(boardId)

  // Track tool changes
  const handleMount = useCallback((editor: any) => {
    // Track when tools are selected
    editor.on('change', () => {
      const currentTool = editor.getCurrentToolId()
      trackEvent('tool_selected', { tool: currentTool })
    })

    // Track shape creation
    editor.on('create', (event: any) => {
      trackEvent('shape_created', { 
        shapeType: event.shape?.type,
        shapeId: event.shape?.id 
      })
    })

    // Track shape deletion
    editor.on('delete', (event: any) => {
      trackEvent('shape_deleted', { 
        shapeType: event.shape?.type,
        shapeId: event.shape?.id 
      })
    })
  }, [trackEvent])

  // Handle AI-generated diagrams
  const handleDiagramGenerated = useCallback((shapes: any[]) => {
    if (!store) return

    // This will be implemented when tldraw editor is available
    // For now, just track the event
    trackEvent('ai_diagram_generated', { shapeCount: shapes.length })
  }, [store, trackEvent])

  if (!store) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading whiteboard...</div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      <Tldraw
        onMount={handleMount}
        autoFocus
      />
      
      <AIDiagramPanel 
        boardId={boardId} 
        onDiagramGenerated={handleDiagramGenerated}
      />
    </div>
  )
}