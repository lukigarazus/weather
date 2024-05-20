import { useEffect, useState } from "react";
import { Result, Weather, resultMap, resultUnwrap } from "types";
import { ICity } from "country-state-city";

import { SearchUSCity } from "./components/SearchUSCity";
import { useLocation } from "./hooks/useLocation";
import { getWeather } from "./services/weather";
import { WeatherComponent } from "./components/Weather";

import "./App.css";

type State =
  | { kind: "loading current location" }
  | {
      kind: "loading weather for current location";
      location: GeolocationPosition;
    }
  | {
      kind: "weather for current location";
      location: GeolocationPosition;
      weather: Result<Weather>;
    }
  | { kind: "error"; error: string }
  | { kind: "loading weather for selected city"; selectedCity: ICity }
  | {
      kind: "weather for selected city";
      selectedCity: ICity;
      weather: Result<Weather>;
    };

const getSelectedCityFromState = (state: State) => {
  if (
    state.kind === "loading weather for selected city" ||
    state.kind === "weather for selected city"
  ) {
    return state.selectedCity;
  }
};

const Loader = ({ state }: { state: State }) =>
  (state.kind === "loading current location" ||
    state.kind === "loading weather for current location" ||
    state.kind === "loading weather for selected city") && (
    <div>Loading...</div>
  );

function App() {
  const [state, setState] = useState<State>({
    kind: "loading current location",
  });

  const [units, setUnits] = useState<"metric" | "imperial">("metric");

  const currentLocationResult = useLocation();

  useEffect(() => {
    if (state.kind === "loading current location")
      switch (currentLocationResult.kind) {
        case "ok":
          setState({
            kind: "loading weather for current location",
            location: currentLocationResult.data,
          });
          break;
        case "error":
          setState({ kind: "error", error: currentLocationResult.error });
          break;
      }
  }, [state.kind, currentLocationResult]);

  useEffect(() => {
    switch (state.kind) {
      case "loading weather for current location":
        getWeather(
          {
            lat: state.location.coords.latitude,
            lon: state.location.coords.longitude,
          },
          units,
        ).then((weather) =>
          setState({
            kind: "weather for current location",
            location: state.location,
            weather,
          }),
        );
        break;
      case "loading weather for selected city": {
        const lat = parseFloat(state.selectedCity.latitude ?? "");
        const lon = parseFloat(state.selectedCity.longitude ?? "");
        if (isNaN(lat) || isNaN(lon))
          setState({ kind: "error", error: "Invalid city" });
        else
          getWeather(
            {
              lat,
              lon,
            },
            units,
          ).then((weather) =>
            setState({
              kind: "weather for selected city",
              selectedCity: state.selectedCity,
              weather,
            }),
          );
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    switch (state.kind) {
      case "weather for current location":
        setState({
          kind: "loading weather for current location",
          location: state.location,
        });
        break;
      case "weather for selected city":
        setState({
          kind: "loading weather for selected city",
          selectedCity: state.selectedCity,
        });
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units]);

  if (state.kind === "error")
    return (
      <div>
        <p>Error: {state.error}</p>
        <p>Please reload the page</p>
      </div>
    );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Loader state={state} />
        <div>
          <select
            onChange={(ev) =>
              setUnits(ev.target.value as "metric" | "imperial")
            }
          >
            <option value="metric" selected={units === "metric"}>
              Metric
            </option>
            <option value="imperial" selected={units === "imperial"}>
              Imperial
            </option>
          </select>
        </div>
        <div>
          {state.kind !== "loading current location" &&
            state.kind !== "loading weather for current location" && (
              <SearchUSCity
                disabled={
                  !(
                    state.kind === "weather for current location" ||
                    state.kind === "weather for selected city"
                  )
                }
                value={getSelectedCityFromState(state)}
                onChange={(city) => {
                  setState({
                    kind: "loading weather for selected city",
                    selectedCity: city,
                  });
                }}
              />
            )}
        </div>
        <div>
          {(state.kind === "weather for current location" ||
            state.kind === "weather for selected city") &&
            resultUnwrap(
              resultMap(state.weather, (weather) => (
                <WeatherComponent
                  location={
                    state.kind === "weather for selected city"
                      ? { kind: "city", name: state.selectedCity.name }
                      : {
                          kind: "your location",
                        }
                  }
                  weather={weather}
                />
              )),
              <div>Could not get weather info</div>,
            )}
        </div>
      </div>
    </div>
  );
}

export default App;
