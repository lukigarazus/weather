import { Coordinates, Weather, Result } from "types";
import { config } from "../config";

export type OpenWeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain: Record<string, number>;
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

const getWeatherFromCoords = async (
  coords: Coordinates,
  units: "metric" | "imperial",
): Promise<Result<OpenWeatherResponse>> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${config.WEATHER_API_KEY}&units=${units}`,
    );
    const data = await response.json();
    return { kind: "ok", data };
  } catch (error) {
    return { kind: "error", error };
  }
};

export const OpenWeather = {
  getWeatherFromCoords,
};
