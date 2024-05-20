import postgres from "postgres";
import { config } from "./config";

const sql = postgres(
  `postgres://${config.POSTGRES_USER}:${config.POSTGRES_PASSWORD}@${config.POSTGRES_HOST}:${config.POSTGRES_PORT}/${config.POSTGRES_DB}`,
);

export default sql;
