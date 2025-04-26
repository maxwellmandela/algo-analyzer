from fastapi import APIRouter, HTTPException
from backend.src.schemas import AnalyzeRequest
from backend.src.llm import generate_algo_analysis

router = APIRouter()

@router.get("/")
def index():
    return {"message": "Welcome to the analysis API!"}

@router.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        res = generate_algo_analysis(request.code)
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
