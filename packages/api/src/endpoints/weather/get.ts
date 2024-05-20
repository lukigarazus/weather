import { Request, Response } from "express";
import Z from "zod";
import { WeatherService } from "../../services/weather.service";

const transformStringToFloat = (value: string) =>
  Math.round(parseFloat(value) * 1000) / 1000;

const querySchema = Z.object({
  lon: Z.string().transform(transformStringToFloat),
  lat: Z.string().transform(transformStringToFloat),
  units: Z.enum(["metric", "imperial"]),
});

export const get = async (req: Request, res: Response) => {
  const queryResult = querySchema.safeParse(req.query);

  if (queryResult.error) {
    res.status(400).send("Invalid query parameters");
    return;
  }

  const { lon, lat, units } = queryResult.data;

  const weatherResult = await WeatherService.getWeather(
    lat,
    lon,
    units as "metric" | "imperial",
  );

  if (weatherResult.kind === "error") {
    return res.status(500).send(weatherResult.error);
  } else if (weatherResult.kind === "ok") {
    return res.json(weatherResult.data);
  } else {
    return res.status(404).send("Not found");
  }
};
