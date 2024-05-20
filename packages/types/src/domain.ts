export type Weather = {
  time: number;
  temperature: number;
  descriptions: string[];
  units: "metric" | "imperial";
  coords: Coordinates;
  locationName?: string;
};

export const weatherFixture: Weather = {
  time: 1623780000,
  temperature: 294.15,
  descriptions: ["clear sky"],
  units: "imperial",
  coords: {
    lat: 37.7749,
    lon: -122.4194,
  },
  locationName: "San Francisco",
};

export type Coordinates = {
  lat: number;
  lon: number;
};
