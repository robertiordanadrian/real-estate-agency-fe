import { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect: (addr: {
    street: string;
    number: string;
    city: string;
    latitude: number | null;
    longitude: number | null;
    formattedAddress: string;
  }) => void;
  error?: boolean;
  required?: boolean;
}

// =========
// ✅ READY
// =========
export const GoogleAddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  error,
  required,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setReady(true);
      return;
    }

    const handle = setInterval(() => {
      if (window.google?.maps?.places) {
        clearInterval(handle);
        setReady(true);
      }
    }, 300);

    return () => clearInterval(handle);
  }, []);

  useEffect(() => {
    if (!ready || !inputRef.current) return;

    if (autocompleteRef.current) {
      google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "ro" },
      fields: ["address_components", "geometry", "formatted_address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.address_components) return;

      let street = "";
      let number = "";
      let city = "";

      for (const comp of place.address_components) {
        if (comp.types.includes("route")) street = comp.long_name;
        if (comp.types.includes("street_number")) number = comp.long_name;
        if (comp.types.includes("locality")) city = comp.long_name;
        if (comp.types.includes("postal_town") && !city) city = comp.long_name;
        if (comp.types.includes("administrative_area_level_1") && !city) city = comp.long_name;
      }

      const latitude = place.geometry?.location?.lat() ?? null;
      const longitude = place.geometry?.location?.lng() ?? null;

      onChange(`${street} ${number}`.trim());

      onSelect({
        street,
        number,
        city,
        latitude,
        longitude,
        formattedAddress: place.formatted_address ?? "",
      });
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [ready]);

  return (
    <TextField
      inputRef={inputRef}
      label="Adresa"
      fullWidth
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Cauta adresa..."
      error={error}
      required={required}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
    />
  );
};
