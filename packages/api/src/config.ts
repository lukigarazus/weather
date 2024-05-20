import "dotenv/config";

export const config = {
  PORT: process.env.API_PORT!,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY!,
  POSTGRES_HOST: process.env.POSTGRES_HOST!,
  POSTGRES_PORT: +process.env.POSTGRES_PORT!,
  POSTGRES_DB: process.env.POSTGRES_DB!,
  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
};
