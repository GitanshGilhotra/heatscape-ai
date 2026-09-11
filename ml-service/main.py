import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from models.uhi_model import uhi_engine
from services.recommendation import calculate_green_recommendation, simulate_cooling_scenario
from services.rag_service import process_rag_query, search_vector_memory

app = FastAPI(
    title="HEATSCAPE AI ML & RAG Engine",
    description="Machine Learning UHI Predictor, Green Infrastructure Optimization & Vector RAG Assistant",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas
class PredictRequest(BaseModel):
    ndvi: float = 0.12
    building_density: float = 85.0
    impervious_ratio: float = 90.0
    humidity: float = 45.0
    ambient_temp: float = 38.0
    model_type: Optional[str] = "xgboost"

class RecommendRequest(BaseModel):
    lst: float = 43.8
    ndvi: float = 0.11
    building_density: float = 88.0
    open_space: Optional[float] = 15.0

class SimulateRequest(BaseModel):
    base_lst: float = 44.5
    tree_cover_pct: float = 20.0
    green_roof_pct: float = 15.0
    reflective_surface_pct: float = 30.0

class ChatRequest(BaseModel):
    message: str
    gemini_key: Optional[str] = None

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "service": "HEATSCAPE AI Python ML Engine",
        "ml_model_loaded": uhi_engine.is_trained,
        "qdrant_vector_store": "ONLINE"
    }

@app.get("/model-stats")
def get_model_stats():
    return {
        "success": True,
        "metrics": uhi_engine.metrics
    }

@app.post("/predict")
def predict_uhi(req: PredictRequest):
    try:
        res = uhi_engine.predict(
            ndvi=req.ndvi,
            building_density=req.building_density,
            impervious_ratio=req.impervious_ratio,
            humidity=req.humidity,
            ambient_temp=req.ambient_temp,
            model_type=req.model_type
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend")
def recommend_green_zone(req: RecommendRequest):
    try:
        res = calculate_green_recommendation(
            lst=req.lst,
            ndvi=req.ndvi,
            building_density=req.building_density,
            open_space=req.open_space
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate")
def simulate_scenario(req: SimulateRequest):
    try:
        res = simulate_cooling_scenario(
            base_lst=req.base_lst,
            tree_cover_pct=req.tree_cover_pct,
            green_roof_pct=req.green_roof_pct,
            reflective_surface_pct=req.reflective_surface_pct
        )
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat_ai_planner(req: ChatRequest):
    try:
        res = process_rag_query(req.message, gemini_key=req.gemini_key)
        return {"success": True, "data": res}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
