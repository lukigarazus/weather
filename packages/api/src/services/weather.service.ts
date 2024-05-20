import { Result, Weather, resultMap, resultAsyncFlatDefault } from "types";

import sql from "../db";
import { OpenWeather } from "../thirdParty/openWeather";

const DESCRIPTIONS_SEPARATOR = ",";
const CACHE_INTERVAL = sql`'1 minute'`;

type WeatherCache = {
  id: number;
  lat: number;
  lon: number;
  time: number;
  temperature: number;
  description: string;
  units: "metric" | "imperial";
  locationName?: string;
};

const weatherCacheToWeather = (weatherCache: WeatherCache): Weather => ({
  time: weatherCache.time,
  temperature: weatherCache.temperature,
  descriptions: weatherCache.description.split(DESCRIPTIONS_SEPARATOR),
  units: weatherCache.units,
  coords: {
    lat: weatherCache.lat,
    lon: weatherCache.lon,
  },
  locationName: weatherCache.locationName,
});

const getWeatherCache = async (
  lat: number,
  lon: number,
  units: "metric" | "imperial",
): Promise<Result<WeatherCache>> => {
  try {
    const result = await sql<WeatherCache[]>`
    SELECT * FROM weatherCache
    WHERE lat = ${lat} AND lon = ${lon} AND units = ${units} AND time > NOW() - INTERVAL ${CACHE_INTERVAL}
    ORDER BY time DESC
    LIMIT 1
  `;
    return result[0]
      ? { kind: "ok", data: result[0] }
      : { kind: "error", error: "Not found" };
  } catch (error) {
    return { kind: "error", error };
  }
};

const getWeather = async (
  lat: number,
  lon: number,
  units: "metric" | "imperial",
): Promise<Result<Weather>> => {
  const cacheResult = await getWeatherCache(lat, lon, units);

  return resultAsyncFlatDefault(
    resultMap(cacheResult, weatherCacheToWeather),
    async () => {
      let weatherResult: Result<Weather> | undefined;
      try {
        const openWeatherResult = await OpenWeather.getWeatherFromCoords(
          {
            lat,
            lon,
          },
          units,
        );

        weatherResult = resultMap(
          openWeatherResult,
          (openWeather) =>
            ({
              time: openWeather.dt,
              temperature: openWeather.main.temp,
              descriptions: openWeather.weather.map((w) => w.description),
              units,
              coords: {
                lat,
                lon,
              },
              locationName: openWeather.name,
            }) as Weather,
        );
      } catch (error) {
        console.error("Failed to fetch weather", error);
        return { kind: "error", error };
      }

      if (weatherResult?.kind === "ok") {
        try {
          const weather = weatherResult.data;
          await sql`
    INSERT INTO weatherCache (lat, lon, time, temperature, description, units, locationName)
    VALUES (${lat}, ${lon}, ${new Date(weather.time).toISOString()}, ${
      weather.temperature
    }, ${weather.descriptions.join(DESCRIPTIONS_SEPARATOR)}, ${
      weather.units
    }, ${weatherResult.data.locationName!})
  `;
        } catch (error) {
          console.error("Failed to cache weather", error);
        }
      }

      return weatherResult;
    },
  );
};

export const WeatherService = {
  cleanup: async () => {
    await sql`DROP TABLE weatherCache`;
    await sql`DROP FUNCTION weatherCache_delete_old_rows`;
    await sql`DROP TRIGGER weatherCache_delete_old_rows_trigger ON weatherCache`;

    console.log("Weather service cleaned up");
  },
  init: async () => {
    await sql`CREATE TABLE weatherCache (
      id SERIAL PRIMARY KEY,
      lat REAL NOT NULL,
      lon REAL NOT NULL,
      time TIMESTAMPTZ NOT NULL,
      temperature REAL NOT NULL,
      description TEXT NOT NULL,
      units TEXT NOT NULL,
      locationName TEXT
)`;
    await sql`CREATE FUNCTION weatherCache_delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM weatherCache WHERE time < (NOW() - INTERVAL ${CACHE_INTERVAL});
  RETURN NEW;
END;
$$;
`;

    await sql`CREATE TRIGGER weatherCache_delete_old_rows_trigger
    AFTER INSERT ON weatherCache 
    EXECUTE PROCEDURE weatherCache_delete_old_rows();`;

    console.log("Weather service initialized");
  },
  getWeather,
};
