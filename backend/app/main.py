from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import ai, boards, analytics

app = FastAPI(
    title="Collaborative Whiteboard API",
    description="Backend for high-performance collaborative whiteboard",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
async def root():
    return {"status": "healthy", "message": "Whiteboard API is running"}

# Include routers
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])
app.include_router(boards.router, prefix="/api/boards", tags=["Boards"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])