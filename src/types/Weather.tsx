export interface WeatherStationObs {
  stationName: string;
  temperature: string;
  weatherSituationName: string;
  windSpeed: string;
  airHumidity: string;
}

export interface HourlyDetail {
  dateIso: string;
  hourFormatted: string;
  temperature: string;
  weatherSituationName: string;
  weatherSituationStyle: string;
  precipitationProbability: string;
  windSpeed: string;
}

export interface WeatherDay {
  dateIso: string;
  minTemperature: string;
  maxTemperature: string;
  timedforecasts: {
    dayDetails: HourlyDetail[];
  };
}

export interface WeatherResponse {
  locationName: string;
  zipCode: number;
  obs: WeatherStationObs;
  days: WeatherDay[];
}