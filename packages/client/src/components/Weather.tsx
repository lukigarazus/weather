import { Weather } from "types";

export const WeatherComponent = ({
  weather,
  location,
}: {
  weather: Weather;
  location: { kind: "your location" } | { kind: "city"; name: string };
}) => {
  return (
    <div>
      <div>
        Weather for{" "}
        {location.kind === "your location" ? "your location" : location.name}
      </div>
      <div>
        {weather.temperature}°{weather.units === "metric" ? "C" : "F"},{" "}
        {weather.descriptions.join(", ")}
      </div>
    </div>
  );
};
