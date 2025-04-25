from google import genai
from pydantic import BaseModel
from typing import List, Optional
import os


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables.")


class AlgoAnalysis(BaseModel):
    summary: str
    time_complexity: str
    space_complexity: str
    optimizations: list[str]
    language: str


client = genai.Client(api_key=GEMINI_API_KEY)

def generate_algo_analysis(
    code_str: str
) -> AlgoAnalysis:
    response = client.models.generate_content(
    model="gemini-1.5-pro",
    contents=f"Analyze the following algorithm for time/space complexity and suggest optimizations:\n\n {code_str}",
    config={
        "response_mime_type": "application/json",
        "response_schema": AlgoAnalysis,
    })

    # Use the response as a JSON string.
    print(response.text)

    # Use instantiated objects.
    res: AlgoAnalysis = response.parsed

    return res