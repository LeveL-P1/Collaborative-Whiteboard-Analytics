from anthropic import Anthropic
from openai import OpenAI
from app.core.config import settings
import json
from typing import List, Dict, Any

class AIService:
    def __init__(self):
        self.anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_diagram_claude(self, prompt: str) -> Dict[str, Any]:
        """
        Uses Claude to convert text prompt into tldraw shapes
        """
        system_prompt = """You are a diagram generation assistant. Convert user descriptions into structured diagram data.
        
Return JSON with this structure:
{
  "shapes": [
    {
      "type": "geo",
      "x": 100,
      "y": 100,
      "props": {
        "geo": "rectangle",
        "w": 200,
        "h": 100,
        "text": "Node 1"
      }
    }
  ]
}

Available shape types: "geo" (rectangles, circles), "arrow" (connections), "text", "draw" (freehand).
For geo shapes, use geo: "rectangle", "ellipse", "diamond", "triangle".
Space shapes logically. Use arrows to show relationships."""

        response = self.anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=system_prompt,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        content = response.content[0].text
        # Parse JSON from response
        try:
            data = json.loads(content)
            return {
                "shapes": data.get("shapes", []),
                "tokens_used": response.usage.input_tokens + response.usage.output_tokens
            }
        except json.JSONDecodeError:
            # If Claude didn't return valid JSON, create a simple error shape
            return {
                "shapes": [{
                    "type": "text",
                    "x": 100,
                    "y": 100,
                    "props": {"text": "Error: Could not parse diagram"}
                }],
                "tokens_used": 0
            }
    
    async def generate_diagram_openai(self, prompt: str) -> Dict[str, Any]:
        """
        Uses OpenAI to convert text prompt into tldraw shapes
        """
        system_prompt = """You are a diagram generation assistant. Convert user descriptions into structured diagram data.

Return ONLY valid JSON with this exact structure:
{
  "shapes": [
    {
      "type": "geo",
      "x": 100,
      "y": 100,
      "props": {
        "geo": "rectangle",
        "w": 200,
        "h": 100,
        "text": "Node 1"
      }
    }
  ]
}

Rules:
- Available shape types: "geo", "arrow", "text"
- For geo: use "rectangle", "ellipse", "diamond", "triangle"
- Space shapes 150-200 pixels apart
- Use arrows to connect related shapes
- Keep text concise"""

        response = self.openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        try:
            data = json.loads(content)
            return {
                "shapes": data.get("shapes", []),
                "tokens_used": response.usage.total_tokens
            }
        except json.JSONDecodeError:
            return {
                "shapes": [{
                    "type": "text",
                    "x": 100,
                    "y": 100,
                    "props": {"text": "Error: Could not parse diagram"}
                }],
                "tokens_used": 0
            }

ai_service = AIService()