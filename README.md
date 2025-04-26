## Algoracle App

Algoracle is a tool that helps developers analyze algorithm runtime and suggests optimizations and learning resources.

### Tech stack:

- Python FastAPI
- React
- PostgreSQL
- Google Gemini API
- Pydantic for validation and controlling output

Requires Python 3.11 or higher.

### How to run:

1. Create a virtual environment: `python3.11 -m venv [folder name of the virtual env]`
2. Activate the virtual environment:
   - On Linux/Mac: `source [folder name of the virtual env]/bin/activate`
   - On Windows: `[folder name of the virtual env]\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Run the FastAPI application: `uvicorn app:app --reload --host localhost --port 8000`

### Running with Docker:

1. Ensure Docker is installed on your system.
2. Build the Docker image: `docker compose up --build`
3. Follow `docker-compose.yaml` for frontend and backend app URLd

### Frontend setup:

For instructions on how to run the frontend, including setting up the required `.env` file, refer to the `README.md` file located in the frontend directory.

### Deployed fronted(vercel):

https://algo-analyzer-delta.vercel.app/

PENDING:
Backend deployment
