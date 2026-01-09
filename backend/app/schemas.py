from pydantic import BaseModel

class PollutantInput(BaseModel):
    city: str
    pm25: float
    pm10: float
    no: float
    no2: float
    nox: float
    co: float
    so2: float
    o3: float
    benzene: float
    toluene: float
    xylene: float