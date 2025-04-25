from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

# load environment variables
from dotenv import load_dotenv
load_dotenv()

from backend.src.schemas import AnalyzeRequest
from backend.src.llm import generate_algo_analysis

# Initialize FastAPI app
app = FastAPI()

from fastapi.openapi.utils import get_openapi

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="AlgOracle API",
        version="1.0.0",
        description="API for analyzing algorithms using LLM(gemini-1.5-pro)",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"message": "Welcome to the analysis API!"}

@app.post("/analyze")
async def analyze(request: AnalyzeRequest):
    try:
        res = generate_algo_analysis(request.code)
        return res
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# Run the app (use uvicorn to start the server)
# Command: uvicorn app:app --reload --host localhost --port 8000