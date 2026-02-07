from fastapi import APIRouter, HTTPException
from app.schemas.ai import DiagramGenerationRequest, DiagramGenerationResponse
from app.services.ai_service import ai_service

router = APIRouter()

@router.post("/generate-diagram", response_model=DiagramGenerationResponse)
async def generate_diagram(request: DiagramGenerationRequest):
    """
    Generate diagram from text prompt using AI
    """
    try:
        if request.provider == "claude":
            result = await ai_service.generate_diagram_claude(request.prompt)
        elif request.provider == "openai":
            result = await ai_service.generate_diagram_openai(request.prompt)
        else:
            raise HTTPException(status_code=400, detail="Invalid AI provider")
        
        return DiagramGenerationResponse(
            shapes=result["shapes"],
            provider_used=request.provider,
            tokens_used=result["tokens_used"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))