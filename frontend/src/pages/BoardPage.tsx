/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { RoomProvider } from '@/lib/liveblocks.config'
import { Whiteboard } from '@/components/Whiteboard'

export function BoardPage() {
  const { boardId } = useParams<{ boardId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [board, setBoard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!boardId) return

    loadBoard()
  }, [boardId, user])

  const loadBoard = async () => {
    if (!user || !boardId) return

    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('id', boardId)
        .single()

      if (error) throw error

      // Check if user has access
      if (data.owner_id !== user.id && !data.is_public) {
        setError('You do not have access to this board')
        return
      }

      setBoard(data)
    } catch (err: any) {
      console.error('Error loading board:', err)
      setError(err.message || 'Failed to load board')
    } finally {
      setLoading(false)
    }
  }

  const updateBoardTitle = async (newTitle: string) => {
    if (!boardId) return

    try {
      await supabase
        .from('boards')
        .update({ title: newTitle })
        .eq('id', boardId)

      setBoard({ ...board, title: newTitle })
    } catch (error) {
      console.error('Error updating title:', error)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading board...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (!board || !boardId) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-gray-600">Board not found</div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back
          </button>
          <input
            type="text"
            value={board.title}
            onChange={(e) => updateBoardTitle(e.target.value)}
            className="text-lg font-semibold border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {user?.user_metadata?.name || user?.email}
          </span>
        </div>
      </header>

      {/* Whiteboard Canvas */}
      <div className="flex-1">
        <RoomProvider
          id={boardId}
          initialPresence={{
            cursor: null,
            name: user?.user_metadata?.name || user?.email || 'Anonymous',
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
          }}
        >
          <Whiteboard boardId={boardId} />
        </RoomProvider>
      </div>
    </div>
  )
}