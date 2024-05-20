import { Result, Weather, Coordinates } from "types";

export const getWeather = async (
  coords: Coordinates,
  units: "metric" | "imperial" = "metric",
): Promise<Result<Weather>> => {
  try {
    const url =
      import.meta.env.VITE_API_URL +
      `/weather?lat=${coords.lat}&lon=${coords.lon}&units=${units}`;
    const result = await fetch(url);
    const data = await result.json();
    return { kind: "ok", data };
  } catch (e) {
    return {
      kind: "error",
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
};
