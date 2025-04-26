from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

# load environment variables
from dotenv import load_dotenv
load_dotenv()

from backend.src.schemas import AnalyzeRequest
from backend.src.llm import generate_algo_analysis
import logging
from fastapi.logger import logger as fastapi_logger



# Initialize FastAPI app
app = FastAPI()

from fastapi.openapi.utils import get_openapi

# add logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("uvicorn")
logger.setLevel(logging.INFO)

# Custom OpenAPI schema generation
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


# add rate limiting
@app.middleware("http")
async def rate_limit(request: Request, call_next):
    # Implement rate limiting logic here
    # For example, you can use a simple in-memory counter or a more sophisticated solution
    # like Redis or a database to track request counts.
    response = await call_next(request)
    return response
