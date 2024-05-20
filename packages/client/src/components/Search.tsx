import { useState, useMemo, useRef } from "react";

export function Search<T extends { id: string; label: string }>({
  onChange,
  options,
  filter = (option: T, query: string) =>
    Boolean(option.label.match(new RegExp(query, "i"))),
  renderOption = (option: T) => option.label,
  value,
  disabled,
  limit = 10,
}: {
  onChange: (value: T) => void;
  options: T[];
  filter?: (value: T, query: string) => boolean;
  renderOption?: (value: T) => React.ReactNode;
  value?: T;
  disabled?: boolean;
  limit?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const filteredOptions = useMemo(
    () => options.filter((option) => filter(option, query)).slice(0, limit),
    [options, query, filter, limit],
  );

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <input
        ref={inputRef}
        style={{ width: "100%" }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        value={query}
        type="text"
        onChange={(e) => setQuery(e.target.value)}
      />
      {focused && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            top: "100%",
            border: "1px solid black",
            background: "gray",
          }}
        >
          {filteredOptions.map((option) => (
            <div
              style={{
                cursor: "pointer",
                background: value?.id === option.id ? "red" : "white",
              }}
              key={option.id}
              onClick={() => {
                onChange(option);
                setFocused(false);
                setQuery(option.label);
              }}
            >
              {renderOption(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
