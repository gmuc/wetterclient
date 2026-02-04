import React, { useEffect, useState, useRef } from 'react';
import type { WeatherResponse } from '../types/Weather';
import { fetchWeatherByZip } from '../services/WeatherService';
import WeatherHeader from './WeatherHeader';
import '../styles/WeatherDashboard.scss';

const WeatherDashboard: React.FC = () => {
  const [data, setData] = useState<WeatherResponse | null>(null);
  const [zip] = useState('81677');
  const [openDayIndex, setOpenDayIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showArrow, setShowArrow] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchWeatherByZip(zip).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [zip]);

  // Prüfen, ob das Ende erreicht ist
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      // Wenn wir fast am Ende sind (5px Puffer), Pfeil ausblenden
      setShowArrow(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading || !data) return null;

  const parseDate = (dateIso: string) => {
    const [day, month, year] = dateIso.split('T')[0].split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const formatTemp = (t: string | undefined) => Math.round(parseFloat(t?.replace(',', '.') || '0'));

  const today = data.days[0];

  return (
    <div className="weather-app-wrapper">
      <WeatherHeader 
        zip={zip}
        city="München (Bogenhausen)"
        temperature={formatTemp(today.maxTemperature)}
        condition={today.weatherSituationName}
      />

      <div className="accordion-block content-width">
        <div 
          className="tabs-container" 
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {data.days.map((day, index) => {
            const date = parseDate(day.dateIso);
            const isActive = openDayIndex === index;

            return (
              <div 
                key={index} 
                className={`day-tab ${isActive ? 'active' : ''}`}
                onClick={() => setOpenDayIndex(index)}
              >
                {isActive ? (
                  <div className="active-content">
                    <div className="active-title">
                      <h3>{date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' })}</h3>
                      <p>{day.weatherSituationName}</p>
                    </div>
                    <div className="active-temp">{formatTemp(day.maxTemperature)}°</div>
                    <div className="hours-list">
                      {day.timedforecasts.dayDetails.map((h, i) => (
                        <div key={i} className="h-item">
                          <div className="h-time">{h.hourFormatted}</div>
                          <div className="h-icon">☁️</div>
                          <div className="h-temp">{formatTemp(h.temperature)}°</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="inactive-content">
                    <div className="label-section">
                      {index === 0 ? "HEUTE" : date.toLocaleDateString('de-DE', { weekday: 'short' }).toUpperCase()}
                    </div>
                    <div className="upper-half">☁️</div>
                    <div className="lower-half">
                      <span className="t-max">{formatTemp(day.maxTemperature)}°</span>
                      <span className="t-min">{formatTemp(day.minTemperature)}°</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll Pfeil Button */}
        {showArrow && (
          <button className="scroll-arrow" onClick={scrollRight}>
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

export default WeatherDashboard;