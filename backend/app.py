from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from model import load_model, predict_answer, predict_eligibility

class PredictRequest(BaseModel):
    query: str
    scheme_id: Optional[str] = None
    mode: Optional[str] = "assistant"

class PredictResponse(BaseModel):
    answer: str
    method: str = "Random Forest"

class EligibilityRequest(BaseModel):
    age: int
    income: int
    education: Optional[str] = "other"
    occupation: Optional[str] = "employed"

class EligibilityResponse(BaseModel):
    eligible: Optional[bool]
    score: int
    method: str

app = FastAPI(
    title="SevaAI Python Backend",
    description="ML-powered backend for SevaAI using Random Forest & Decision Tree models",
    version="1.0.0",
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML models on startup
ml_models = load_model()

@app.get("/health")
def health():
    return {
        "status": "ok",
        "ml_models_loaded": ml_models.get('loaded', False),
        "models": {
            "query_classification": "Random Forest + Decision Tree",
            "eligibility_prediction": "Random Forest + Decision Tree"
        }
    }

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    """
    Query classification using Random Forest & Decision Tree.
    Predicts the intent of the user's question and returns appropriate answer.
    """
    answer = predict_answer(ml_models, request.query, scheme_id=request.scheme_id, mode=request.mode)
    return {
        "answer": answer,
        "method": "Random Forest → Decision Tree (fallback)"
    }


@app.post("/predict/stream")
def predict_stream(request: PredictRequest):
    """Stream the prediction in small chunks as Server-Sent Events (SSE-like).
    The client can listen to a text/event-stream and append chunks as they arrive.
    This is a simple generator that yields the final answer split by sentences.
    """
    full_answer = predict_answer(ml_models, request.query, scheme_id=request.scheme_id, mode=request.mode)

    def event_generator():
        # Split into sentences or by line breaks for nicer incremental updates
        parts = [p for p in full_answer.replace('\r', '').split('\n') if p != '']
        if not parts:
            parts = [full_answer]
        for part in parts:
            # SSE data frame
            yield f"data: {part}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/eligibility", response_model=EligibilityResponse)
def check_eligibility(request: EligibilityRequest):
    """
    Eligibility prediction using Random Forest & Decision Tree.
    Predicts if user is eligible and provides a score.
    """
    profile = {
        "age": request.age,
        "income": request.income,
        "education": request.education,
        "occupation": request.occupation
    }
    result = predict_eligibility(profile)
    return result

@app.get("/models")
def get_model_info():
    """Get information about loaded ML models."""
    return {
        "models_loaded": ml_models.get('loaded', False),
        "query_classification": {
            "type": "Random Forest",
            "trees": 20,
            "categories": ["documents", "eligibility", "apply", "deadline", "website"]
        },
        "eligibility_prediction": {
            "type": "Random Forest",
            "trees": 15,
            "features": ["age", "income", "is_student", "is_unemployed"]
        }
    }

