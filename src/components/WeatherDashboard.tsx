import React, { useEffect, useState } from 'react';
import type { WeatherResponse } from '../types/Weather';
import { fetchWeatherByZip } from '../services/WeatherService';

import '../styles/WeatherDashboard.scss';

const WeatherDashboard: React.FC = () => {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [zip] = useState('81677');
  const [openDayIndex, setOpenDayIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchWeatherByZip(zip)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fehler beim Laden:", err);
        setLoading(false);
      });
  }, [zip]);

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;
  if (!data || !data.days) return <div className="alert alert-warning">Keine Wetterdaten gefunden.</div>;

  const parseDate = (dateIso: string) => {
    const [day, month, year] = dateIso.split('T')[0].split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const formatTemp = (t: string | undefined) => {
    if (!t) return "--";
    return Math.round(parseFloat(t.replace(',', '.')));
  };

  return (
    <div className="weather-container shadow-sm border overflow-hidden">
      <div className="tabs-container">
        {data.days.map((day, index) => {
          const date = parseDate(day.dateIso);
          const isActive = openDayIndex === index;
          
          return (
            <div 
              key={`${day.dateIso}-${index}`} 
              onClick={() => setOpenDayIndex(index)}
              className={`day-tab ${isActive ? 'active' : ''}`}
            >
              {isActive ? (
                /* AKTIVER TAB INHALT */
                <>
                  <div className="tab-header-top">
                    <div className="date-info">
                      <div className="day-label">
                        {date.toLocaleDateString('de-DE', { weekday: 'long' })}, {date.getDate()}.{date.getMonth() + 1}.
                      </div>
                      <div className="status-text">{day.weatherSituationName}</div>
                    </div>
                    <div className="main-temp">
                      <span className="temp-max">{formatTemp(day.maxTemperature)}°</span>
                    </div>
                  </div>
                  
                  {/* Stundenliste direkt im Tab */}
                  <div className="hours-scroll-area">
                    {day.timedforecasts.dayDetails.map((hour, hIndex) => (
                      <div key={hIndex} className="hour-item">
                        <div className="hour-time">{hour.hourFormatted}</div>
                        <div className="hour-icon">☁️</div>
                        <div className="hour-temp">{formatTemp(hour.temperature)}°</div>
                        <div className="hour-precip">{hour.precipitationProbability}%</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* INAKTIVER TAB INHALT */
                <div className="inaktive-content">
                  <span className="day-label">
                    {index === 0 ? "Heute" : date.toLocaleDateString('de-DE', { weekday: 'short' })}
                  </span>
                  <div className="weather-icon">☁️</div>
                  <span className="temp-max">{formatTemp(day.maxTemperature)}°</span>
                  <span className="temp-min">{formatTemp(day.minTemperature)}°</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherDashboard;