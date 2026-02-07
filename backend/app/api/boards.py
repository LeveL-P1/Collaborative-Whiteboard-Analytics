from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter()

class Board(BaseModel):
    id: str
    title: str
    owner_id: str
    content: dict
    is_public: bool

class CreateBoardRequest(BaseModel):
    title: str
    is_public: bool = False

@router.get("/", response_model=List[Board])
async def list_boards():
    """
    List all boards (will integrate with Supabase)
    """
    # Placeholder - you'll implement Supabase queries here
    return []

@router.post("/", response_model=Board)
async def create_board(request: CreateBoardRequest):
    """
    Create a new board
    """
    # Placeholder - you'll implement Supabase insert here
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.get("/{board_id}", response_model=Board)
async def get_board(board_id: str):
    """
    Get specific board by ID
    """
    # Placeholder - you'll implement Supabase query here
    raise HTTPException(status_code=501, detail="Not implemented yet")