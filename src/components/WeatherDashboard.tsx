import React from 'react';

// Typ-Definition für unsere Mock-Daten
interface Forecast {
  time: string;
  temp: number;
  icon: string;
  rainChance: string;
}

const WeatherDashboard: React.FC = () => {
  // Mock-Daten basierend auf der BR-Struktur
  const hourlyData: Forecast[] = [
    { time: '14:00', temp: 12, icon: '☀️', rainChance: '0%' },
    { time: '15:00', temp: 13, icon: '⛅', rainChance: '10%' },
    { time: '16:00', temp: 12, icon: '☁️', rainChance: '20%' },
    { time: '17:00', temp: 10, icon: '🌧️', rainChance: '80%' },
    { time: '18:00', temp: 9, icon: '🌧️', rainChance: '90%' },
  ];

  return (
    <div className="container mt-4">
      {/* Header Bereich: Ort & Aktuelles Wetter */}
      <div className="card shadow-sm mb-4 bg-primary text-white">
        <div className="card-body text-center">
          <h1 className="display-4">Bad Kissingen</h1>
          <p className="lead">Freitag, 30. Januar 2026</p>
          <div className="d-flex justify-content-center align-items-center">
            <span style={{ fontSize: '4rem' }}>☀️</span>
            <span className="display-1 fw-bold ms-3">12°C</span>
          </div>
          <p>Gefühlt wie 10°C • Sonnig</p>
        </div>
      </div>

      {/* Stündliche Vorhersage (Horizontaler Scroll-Effekt wie beim BR) */}
      <h3 className="mb-3">Stündliche Vorhersage</h3>
      <div className="d-flex flex-nowrap overflow-auto pb-3" style={{ gap: '1rem' }}>
        {hourlyData.map((item, index) => (
          <div key={index} className="card shadow-sm text-center" style={{ minWidth: '120px' }}>
            <div className="card-header bg-light small fw-bold">{item.time}</div>
            <div className="card-body">
              <div style={{ fontSize: '1.5rem' }}>{item.icon}</div>
              <div className="fw-bold">{item.temp}°C</div>
              <div className="text-muted small mt-2">
                <i className="bi bi-droplet"></i> {item.rainChance}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail-Tabelle (Ähnlich wie die Wicket-Listenansichten) */}
      <div className="mt-5">
        <h4>Details heute</h4>
        <table className="table table-hover mt-3">
          <tbody>
            <tr>
              <td>Sonnenscheindauer</td>
              <td className="text-end fw-bold">5 h 30 min</td>
            </tr>
            <tr>
              <td>Regenrisiko</td>
              <td className="text-end fw-bold">5 %</td>
            </tr>
            <tr>
              <td>Windgeschwindigkeit</td>
              <td className="text-end fw-bold">12 km/h</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WeatherDashboard;