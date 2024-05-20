import { useEffect, useState } from "react";
import { Result } from "types";

export const useLocation = () => {
  const [location, setLocation] = useState<Result<GeolocationPosition>>({
    kind: "empty",
  });

  useEffect(
    () =>
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation({ kind: "ok", data: position }),
        (error) => setLocation({ kind: "error", error: error.message }),
      ),
    [],
  );

  return location;
};
