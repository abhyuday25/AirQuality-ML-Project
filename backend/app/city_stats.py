import pandas as pd

df = pd.read_csv('../data/air_quality_india.csv').dropna()

def get_worst_city():
    stats = df.groupby('City')['AQI'].mean().reset_index()
    worst = stats.loc[stats['AQI'].idxmax()]
    return {"city": worst['City'], "avg_aqi": round(worst['AQI'], 2)}

def get_all_cities():
    return sorted(df['City'].unique().tolist())