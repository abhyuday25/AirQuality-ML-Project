import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PollutantChart from '../components/PollutantChart';

export default function Dashboard() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Delhi');
  const [result, setResult] = useState(null);
  const [importance, setImportance] = useState({});
  const [modelType, setModelType] = useState('rf');

  useEffect(() => {
    axios.get('http://localhost:8000/cities').then(res => setCities(res.data));
    axios.get('http://localhost:8000/feature-impact').then(res => setImportance(res.data));
  }, []);

  const handlePredict = async () => {
    const mockData = { city: selectedCity, pm25: 120, pm10: 150, no: 20, no2: 30, nox: 40, co: 2, so2: 15, o3: 40, benzene: 1, toluene: 2, xylene: 1 };
    const res = await axios.post(`http://localhost:8000/predict?model_type=${modelType}`, mockData);
    setResult(res.data);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400">AirIntel AI</h1>
        <div className="flex gap-4">
          <select 
            className="bg-slate-800 border border-slate-700 p-2 rounded"
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={handlePredict} className="bg-indigo-600 px-6 py-2 rounded-lg font-semibold shadow-lg shadow-indigo-500/20">Analyze</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AQI Indicator */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h2 className="text-slate-400 uppercase text-xs font-bold mb-4">Predicted AQI</h2>
          {result ? (
            <div className="text-center">
              <div className="text-8xl font-black mb-2" style={{ color: result.color }}>{result.aqi}</div>
              <div className="text-2xl font-medium">{result.category}</div>
            </div>
          ) : <div className="text-slate-500 italic">Select city and analyze...</div>}
        </div>

        {/* Feature Importance */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-slate-400 uppercase text-xs font-bold mb-4 text-center">Pollutant Influence (%)</h2>
          <PollutantChart data={importance} />
        </div>
      </div>
    </div>
  );
}