from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

# load environment variables
from dotenv import load_dotenv
load_dotenv()

import logging
from fastapi.logger import logger as fastapi_logger
from backend.src.routes import router

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

# Include routes
app.include_router(router)
