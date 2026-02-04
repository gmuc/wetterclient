import type { WeatherResponse } from '../types/Weather';

export const fetchWeatherByZip = async (zip: string): Promise<WeatherResponse> => {
  // In der Produktion stünde hier: `await fetch(`https://api.deinserver.de/weather/${zip}`)`
  // Für den Test laden wir die lokale Datei:
  const response = await fetch(`/${zip}.json`);
  
  if (!response.ok) {
    throw new Error('Wetterdaten konnten nicht geladen werden. Datei vorhanden?');
  }
  
  return response.json();
};