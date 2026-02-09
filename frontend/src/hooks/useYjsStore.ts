import { useRoom } from '@/lib/liveblocks.config'
import { useEffect, useState } from 'react'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import * as Y from 'yjs'

export function useYjsStore({ roomId }: { roomId: string }) {
  const  room = useRoom()
  const [store, setStore] = useState<Y.Doc | null>(null)
  const [provider, setProvider] = useState<LiveblocksYjsProvider | null>(null)

  useEffect(() => {
    const yDoc = new Y.Doc()
    const yProvider = new LiveblocksYjsProvider(room, yDoc)
    
    setStore(yDoc)
    setProvider(yProvider)

    return () => {
      yDoc?.destroy()
      yProvider?.destroy()
    }
  }, [room, roomId])

  return { store, provider }
}