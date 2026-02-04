import React, { useEffect, useState } from 'react';
import type { WeatherResponse } from '../types/Weather';
import { fetchWeatherByZip } from '../services/WeatherService';

const WeatherDashboard: React.FC = () => {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zip, setZip] = useState('81677'); // Standard-PLZ entsprechend deiner Datei

  useEffect(() => {
    fetchWeatherByZip(zip)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [zip]);

  if (error) return <div className="alert alert-danger m-4">Fehler: {error}</div>;
  if (!data) return <div className="text-center mt-5"><div className="spinner-border"></div><p>Lade Wetter...</p></div>;

  // Hilfsfunktion zum Formatieren der Strings (z.B. "4.2000" -> "4.2")
  const formatValue = (val: string) => parseFloat(val).toFixed(1);

  return (
    <div className="container mt-4">
      {/* Suchzeile */}
      <div className="row mb-4">
        <div className="col">
          <div className="input-group shadow-sm">
            <input 
              type="text" 
              className="form-control" 
              placeholder="PLZ eingeben..." 
              value={zip} 
              onChange={(e) => setZip(e.target.value)}
            />
            <button className="btn btn-primary">Aktualisieren</button>
          </div>
        </div>
      </div>

      {/* Aktuelle Beobachtung (obs) */}
      <div className="card shadow-sm mb-4 bg-primary text-white border-0">
        <div className="card-body p-4 text-center">
          <h1 className="display-4 fw-bold">{data.locationName}</h1>
          <p className="lead">{data.obs.weatherSituationName}</p>
          <div className="display-1 fw-bold mb-3">{formatValue(data.obs.temperature)}°C</div>
          <div className="d-flex justify-content-center gap-4">
            <span>Wind: {data.obs.windSpeed} km/h</span>
            <span>Feuchte: {data.obs.airHumidity}%</span>
          </div>
        </div>
      </div>

      {/* Stündliche Vorhersage (Scrollbar) */}
      <h3 className="mb-3">Heute</h3>
      <div className="d-flex overflow-auto pb-3 gap-3" style={{ scrollbarWidth: 'thin' }}>
        {data.days[0].timedforecasts.dayDetails.map((hour, index) => (
          <div key={index} className="card shadow-sm text-center border-0" style={{ minWidth: '110px' }}>
            <div className="card-header bg-light py-1 small fw-bold">{hour.hourFormatted}</div>
            <div className="card-body">
              {/* Hier könnte man später Icons basierend auf hour.weatherSituationStyle mappen */}
              <div className="fs-3 mb-1">☁️</div> 
              <div className="fw-bold">{formatValue(hour.temperature)}°</div>
              <div className="text-primary small mt-1">{hour.precipitationProbability}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailtabelle wie in Wicket-ListViews */}
      <div className="mt-5">
        <h4>Wetter-Details</h4>
        <table className="table table-striped table-hover mt-3 shadow-sm rounded overflow-hidden">
          <thead className="table-dark">
            <tr>
              <th>Uhrzeit</th>
              <th>Situation</th>
              <th>Temp.</th>
              <th>Regen</th>
              <th>Wind</th>
            </tr>
          </thead>
          <tbody>
            {data.days[0].timedforecasts.dayDetails.slice(0, 8).map((hour, i) => (
              <tr key={i}>
                <td>{hour.hourFormatted}</td>
                <td>{hour.weatherSituationName}</td>
                <td>{formatValue(hour.temperature)}°C</td>
                <td>{hour.precipitationProbability}%</td>
                <td>{hour.windSpeed} km/h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherDashboard;