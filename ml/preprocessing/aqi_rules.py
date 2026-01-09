def categorize_aqi(value):
    if value <= 50: return "Good", "#10b981" # Green
    if value <= 100: return "Moderate", "#f59e0b" # Yellow
    return "Poor", "#ef4444" # Red