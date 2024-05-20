import { City, type ICity } from "country-state-city";
import { useCallback, useMemo } from "react";
import { Search } from "./Search";

const labelFromCity = (city: ICity) =>
  `${city.name}, ${city.stateCode}, ${city.countryCode}`;

const cityToCityOption = (city: ICity): { id: string; label: string } => ({
  id: labelFromCity(city),
  label: labelFromCity(city),
});

export const SearchUSCity = ({
  value,
  onChange,
  disabled,
}: {
  disabled?: boolean;
  value: ICity | undefined;
  onChange: (value: ICity) => void;
}) => {
  const usCities = useMemo(() => City.getCitiesOfCountry("US") || [], []);
  const usCityOptions = useMemo(
    () => usCities.map(cityToCityOption),
    [usCities],
  );
  const selectedCityOption = useMemo(
    () => value && cityToCityOption(value),
    [value],
  );
  const onChangeInternal = useCallback(
    (option: { id: string; label: string }) => {
      const city = usCities.find(
        (city) => labelFromCity(city) === option.label,
      );
      if (city) onChange(city);
    },
    [usCities, onChange],
  );
  return (
    <Search
      value={selectedCityOption}
      options={usCityOptions}
      onChange={onChangeInternal}
      disabled={disabled}
    />
  );
};
