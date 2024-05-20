import express from "express";
import cors from "cors";
import { config } from "./config";
import services from "./services";
import { get as weatherGet } from "./endpoints/weather/get";

const app = express();
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/weather", weatherGet);

Promise.all(
  services.map(async (service) => {
    try {
      await service.cleanup();
    } catch {}
  }),
).then(() =>
  Promise.all(
    services.map((service) => {
      try {
        service.init();
      } catch {}
    }),
  ).then(() => {
    app.listen(config.PORT, () => {
      console.log(`Example app listening on port ${config.PORT}`);
    });
  }),
);
