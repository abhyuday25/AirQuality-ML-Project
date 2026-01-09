import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, AlertTriangle, Wind, BarChart3 } from 'lucide-react';
import './App.css';

function App() {
  // State for data
  const [cities, setCities] = useState([]);
  const [worstCity, setWorstCity] = useState({ name: '', avg_aqi: 0 });
  const [importance, setImportance] = useState([]);
  const [prediction, setPrediction] = useState(null);
  
  // State for User Inputs
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [modelType, setModelType] = useState('rf');
  const [pollutants, setPollutants] = useState({
    pm25: 110, pm10: 150, co: 1.5, no2: 25, o3: 40, so2: 12
  });

  useEffect(() => {
    // Initial Load: Cities and Stats
    axios.get('http://127.0.0.1:8000/cities').then(res => setCities(res.data));
    axios.get('http://127.0.0.1:8000/worst-city').then(res => setWorstCity(res.data));
    axios.get('http://127.0.0.1:8000/feature-impact').then(res => {
      const formatted = Object.entries(res.data).map(([name, value]) => ({
        name, value: parseFloat((value * 100).toFixed(2))
      })).sort((a, b) => b.value - a.value);
      setImportance(formatted);
    });
  }, []);

  const handleInputChange = (e) => {
    setPollutants({ ...pollutants, [e.target.name]: parseFloat(e.target.value) });
  };

  const getPrediction = async () => {
    const payload = {
      city: selectedCity,
      ...pollutants,
      no: 15, nox: 30, benzene: 1, toluene: 2, xylene: 1 // Defaulting minor pollutants
    };
    const res = await axios.post(`http://127.0.0.1:8000/predict?model_type=${modelType}`, payload);
    setPrediction(res.data);
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <div className="logo">AirIntel <span className="v2">v2.0</span></div>
        <div className="nav-item active"><Activity size={20}/> Dashboard</div>
        <div className="nav-group">CITY CONFIGURATION</div>
        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="city-dropdown">
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        
        <div className="nav-group">POLLUTANT INPUTS</div>
        {Object.keys(pollutants).map(key => (
          <div key={key} className="slider-box">
            <label>{key.toUpperCase()}: {pollutants[key]}</label>
            <input type="range" name={key} min="0" max="500" value={pollutants[key]} onChange={handleInputChange} />
          </div>
        ))}
      </nav>

      <main className="content">
        <header className="top-bar">
          <div className="model-toggle">
            <button className={modelType === 'rf' ? 'active' : ''} onClick={() => setModelType('rf')}>Random Forest</button>
            <button className={modelType === 'lr' ? 'active' : ''} onClick={() => setModelType('lr')}>Linear Baseline</button>
          </div>
          <button className="primary-btn" onClick={getPrediction}>Analyze Air Quality</button>
        </header>

        <div className="main-grid">
          {/* Prediction Result */}
          <div className="glass-card prediction-box">
            <div className="card-header"><Wind size={18}/> Predicted AQI Index</div>
            {prediction ? (
              <div className="aqi-display">
                <h1 style={{ color: prediction.color }}>{prediction.aqi}</h1>
                <p className="category-label">{prediction.category}</p>
                <div className="gauge-bg"><div className="gauge-fill" style={{width: `${Math.min(prediction.aqi/5, 100)}%`, backgroundColor: prediction.color}}></div></div>
              </div>
            ) : <div className="placeholder-text">Adjust sliders and click Analyze</div>}
          </div>

          {/* Worst City Insight */}
          <div className="glass-card info-box">
            <div className="card-header"><AlertTriangle size={18} color="#ef4444"/> Regional Critical Alert</div>
            <div className="worst-city-stat">
              <span className="label">Worst Recorded:</span>
              <span className="value">{worstCity.name}</span>
              <span className="sub-value">{worstCity.avg_aqi} Avg AQI</span>
            </div>
          </div>

          {/* Feature Importance */}
          <div className="glass-card chart-box">
            <div className="card-header"><BarChart3 size={18}/> Global Feature Impact</div>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={importance} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={70} stroke="#94a3b8" fontSize={12} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {importance.map((e, i) => <Cell key={i} fill={i < 3 ? '#6366f1' : '#334155'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;