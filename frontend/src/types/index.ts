/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Board {
  id: string;
  title: string;
  owner_id: string;
  content: any; // tldraw document
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoardPermission {
  board_id: string;
  user_id: string;
  role: 'viewer' | 'editor' | 'owner';
}

export interface AnalyticsEvent {
  id: string;
  board_id: string;
  user_id: string;
  event_type: string;
  event_data: any;
  created_at: string;
}

export interface AIProvider {
  id: 'claude' | 'openai';
  name: string;
  enabled: boolean;
}