/* eslint-disable @typescript-eslint/no-empty-object-type */
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY || '',
  throttle: 16, // 60fps
});

type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
};

type Storage = {};

type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
    avatar?: string;
  };
};

type RoomEvent = {};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useOthers,
    useSelf,
    useStorage,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);