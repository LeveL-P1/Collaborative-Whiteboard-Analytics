from pydantic import BaseModel
from typing import List, Dict, Any, Literal

class DiagramGenerationRequest(BaseModel):
    prompt: str
    provider: Literal["claude", "openai"] = "claude"
    board_id: str

class ShapeData(BaseModel):
    type: str
    x: float
    y: float
    props: Dict[str, Any]

class DiagramGenerationResponse(BaseModel):
    shapes: List[ShapeData]
    provider_used: str
    tokens_used: int