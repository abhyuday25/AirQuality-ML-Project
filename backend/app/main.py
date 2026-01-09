from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Change these lines to direct imports
from .model_loader import predict_aqi, get_importance
from .city_stats import get_all_cities, get_worst_city
from .schemas import PollutantInput

app = FastAPI()
# ... rest of your code

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/cities")
def list_cities():
    return get_all_cities()

@app.post("/predict")
def predict(data: PollutantInput, model_type: str = "rf"):
    return predict_aqi(data, model_type)

@app.get("/worst-city")
def worst_city():
    return get_worst_city()

@app.get("/feature-impact")
def impact():
    return get_importance()