from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

router = APIRouter()

class AnalyticsEvent(BaseModel):
    board_id: str
    user_id: str
    event_type: str  # "click", "drag", "resize", "delete", etc.
    event_data: Dict[str, Any]
    timestamp: datetime = None

@router.post("/track")
async def track_event(event: AnalyticsEvent):
    """
    Track user interaction event
    """
    # Will store to Supabase analytics table
    return {"status": "tracked"}

@router.get("/board/{board_id}/friction")
async def get_friction_metrics(board_id: str):
    """
    Get friction metrics (repeated rapid clicks, etc.)
    """
    # Will query Supabase for patterns
    return {"friction_score": 0, "events": []}