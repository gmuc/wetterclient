import React from 'react';

interface WeatherHeaderProps {
  zip: string;
  city: string;
  temperature: number;
  condition: string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ zip, city, temperature, condition }) => {
  return (
    <div className="weather-header-block content-width">
      <div className="search-bar">
        <div className="input-wrapper">
          <input 
            type="text" 
            value={`Wetter in ${zip} ${city}`} 
            readOnly 
            aria-label="Ort suchen"
          />
        </div>
        <span className="search-icon">🔍</span>
      </div>
      <div className="current-condition">
        <div className="current-temp">{temperature}°</div>
        <div className="current-info">
          <p className="city">{city}</p>
          <span className="desc">{condition}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherHeader;