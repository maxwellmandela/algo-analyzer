from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.src.schemas import AnalyzeRequest


# Initialize FastAPI app
app = FastAPI()

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
    if not request.data:
        raise HTTPException(status_code=400, detail="No data provided")
    # Here you would typically call your analysis function
    # For demonstration, we will just echo the data back
    return request.data

# Run the app (use uvicorn to start the server)
# Command: uvicorn app:app --reload --host localhost --port 8000