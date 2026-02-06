import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || '',
});

// Type definitions for real-time presence and storage
type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
};

//We'll use Yjs for the actual whiteboard data
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Storage = {
};

export const {
  RoomProvider,
  useRoom,
  useMyPresence,
  useOthers,
  useSelf,
} = createRoomContext<Presence, Storage>(client);