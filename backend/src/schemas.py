from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Code snippet to analyze")
    language: str