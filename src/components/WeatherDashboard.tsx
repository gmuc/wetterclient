import React, { useEffect, useState } from 'react';
import type { WeatherResponse } from '../types/Weather';
import { fetchWeatherByZip } from '../services/WeatherService';

// Import der Styles aus dem neuen Styles-Ordner
import '../styles/WeatherDashboard.scss';

const WeatherDashboard: React.FC = () => {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [zip, setZip] = useState('81677');
  const [openDayIndex, setOpenDayIndex] = useState<number>(0);

  useEffect(() => {
    fetchWeatherByZip(zip)
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Daten konnten nicht geladen werden.");
      });
  }, [zip]);

  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!data) return <div className="container mt-5 text-center px-5 py-5"><div className="spinner-border text-primary"></div></div>;

  // Parser für das JSON-Datumsformat "03-02-2026..."
  const parseDate = (dateIso: string) => {
    const [day, month, year] = dateIso.split('T')[0].split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Hilfsfunktion zum Runden von Temperatur-Strings
  const formatTemp = (t: string | undefined) => {
    if (!t) return "--";
    return Math.round(parseFloat(t.replace(',', '.')));
  };

  return (
    <div className="weather-container mt-4">
      
      {/* 1. TAGES-TABS (Horizontal scrollbar) */}
      <div className="tabs-scroll-wrapper">
        <div className="tabs-container">
          {data.days.map((day, index) => {
            const date = parseDate(day.dateIso);
            const isActive = openDayIndex === index;
            
            // "Heute" Logik für den ersten Eintrag
            const dayLabel = index === 0 ? "Heute" : date.toLocaleDateString('de-DE', { weekday: 'short' });

            return (
              <div 
                key={`${day.dateIso}-${index}`} 
                onClick={() => setOpenDayIndex(index)}
                className={`day-tab ${isActive ? 'active' : ''}`}
              >
                <div className="day-label">
                  {isActive ? (
                    `${date.toLocaleDateString('de-DE', { weekday: 'long' })}, ${date.getDate()}.${date.getMonth() + 1}.`
                  ) : (
                    dayLabel
                  )}
                </div>
                
                {/* Platzhalter für SVG Icons */}
                <div className="weather-icon my-2" style={{ fontSize: '28px' }}>☁️</div>

                <div className="temp-max fw-bold">
                  {formatTemp(day.maxTemperature)}°
                </div>
                <div className="temp-min text-muted small">
                  {formatTemp(day.minTemperature)}°
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. DETAIL-DRAWER (Stundenleiste des ausgewählten Tages) */}
      <div className="detail-drawer mb-5">
        {/* Optionaler Header für den Detailbereich */}
        <div className="p-2 px-3 border-bottom bg-light small d-flex justify-content-between">
          <span className="text-uppercase fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>
            Stündliche Vorhersage
          </span>
          <span className="text-muted fw-normal" style={{ fontSize: '11px' }}>
            {data.days[openDayIndex].weatherSituationName}
          </span>
        </div>

        <div className="d-flex overflow-auto">
          {data.days[openDayIndex].timedforecasts.dayDetails.map((hour, hIndex) => (
            <div key={hIndex} className="hour-item">
              <div className="hour-time mb-2">
                {hour.hourFormatted}
              </div>
              <div className="hour-icon mb-2 fs-4">☁️</div>
              <div className="hour-temp fw-bold">
                {parseFloat(hour.temperature.replace(',', '.')).toFixed(1)}°
              </div>
              <div className="hour-precip text-primary mt-1">
                {hour.precipitationProbability}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;