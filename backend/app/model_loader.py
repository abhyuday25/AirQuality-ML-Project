import joblib
import numpy as np
import os

# Adjust paths to look into the ml/models folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
RF_PATH = os.path.join(BASE_DIR, "ml", "models", "random_forest.pkl")
LR_PATH = os.path.join(BASE_DIR, "ml", "models", "linear_regression.pkl")
ENC_PATH = os.path.join(BASE_DIR, "ml", "models", "city_encoder.pkl")

rf = joblib.load(RF_PATH)
lr = joblib.load(LR_PATH)
encoder = joblib.load(ENC_PATH)

def predict_aqi(data, model_type):
    # Prepare features in the exact order the model was trained
    city_idx = encoder.transform([data.city])[0]
    features = [[
        city_idx, data.pm25, data.pm10, data.no, data.no2, 
        data.nox, data.co, data.so2, data.o3, 
        data.benzene, data.toluene, data.xylene
    ]]
    
    model = rf if model_type == "rf" else lr
    prediction = model.predict(features)[0]
    
    # Categorize
    if prediction <= 50:
        cat, col = "Good", "#10b981"
    elif prediction <= 100:
        cat, col = "Moderate", "#f59e0b"
    else:
        cat, col = "Poor", "#ef4444"
        
    return {"aqi": round(float(prediction), 2), "category": cat, "color": col}

def get_importance():
    return dict(zip(
        ['City', 'PM2.5', 'PM10', 'NO', 'NO2', 'NOx', 'CO', 'SO2', 'O3', 'Benzene', 'Toluene', 'Xylene'], 
        rf.feature_importances_.tolist()
    ))