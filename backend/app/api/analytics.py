from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
from app.core.config import settings
from supabase import create_client

router = APIRouter()

# Initialize Supabase client
supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

class AnalyticsEvent(BaseModel):
    board_id: str
    user_id: str
    event_type: str
    event_data: Dict[str, Any]

@router.post("/track")
async def track_event(event: AnalyticsEvent):
    """
    Track user interaction event
    """
    try:
        result = supabase.table('analytics_events').insert({
            'board_id': event.board_id,
            'user_id': event.user_id,
            'event_type': event.event_type,
            'event_data': event.event_data,
        }).execute()
        
        return {"status": "tracked", "id": result.data[0]['id'] if result.data else None}
    except Exception as e:
        print(f"Analytics error: {e}")
        return {"status": "error", "message": str(e)}

@router.get("/board/{board_id}/friction")
async def get_friction_metrics(board_id: str):
    """
    Get friction metrics (repeated rapid clicks, etc.)
    """
    try:
        # Get rapid click patterns (same event_type within 1 second)
        events = supabase.table('analytics_events')\
            .select('*')\
            .eq('board_id', board_id)\
            .order('created_at', desc=True)\
            .limit(1000)\
            .execute()
        
        # Simple friction analysis: count rapid repeated events
        friction_score = 0
        if events.data:
            event_types = [e['event_type'] for e in events.data]
            # Count consecutive duplicates
            for i in range(len(event_types) - 1):
                if event_types[i] == event_types[i + 1]:
                    friction_score += 1
        
        return {
            "friction_score": friction_score,
            "total_events": len(events.data) if events.data else 0,
            "board_id": board_id
        }
    except Exception as e:
        print(f"Friction metrics error: {e}")
        return {"friction_score": 0, "total_events": 0, "error": str(e)}