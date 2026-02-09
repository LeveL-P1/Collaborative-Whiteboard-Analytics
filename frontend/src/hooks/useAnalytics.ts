/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from 'react'
import { useAuth } from './useAuth'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

interface AnalyticsEvent {
  board_id: string
  event_type: string
  event_data: any
}

export function useAnalytics(boardId: string) {
  const { user } = useAuth()

  const trackEvent = useCallback(async (eventType: string, eventData: any = {}) => {
    if (!user || !boardId) return

    try {
      await axios.post(`${BACKEND_URL}/api/analytics/track`, {
        board_id: boardId,
        user_id: user.id,
        event_type: eventType,
        event_data: eventData,
      })
    } catch (error) {
      console.error('Analytics tracking error:', error)
      // Fail silently - don't interrupt user experience
    }
  }, [user, boardId])

  return { trackEvent }
}