import { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface PropertyMapProps {
  address: string;
  apiKey: string;
}

const PropertyMap = ({ address, apiKey }: PropertyMapProps) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (!address) return;

    const geocode = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            address
          )}&key=${apiKey}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          setCoords({ lat, lng });
        } else {
          console.warn("Geocoding failed:", data.status);
        }
      } catch (e) {
        console.error("Geocoding error:", e);
      }
    };

    geocode();
  }, [address, apiKey]);

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <div
        style={{
          width: "100%",
          height: "250px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <Map
          center={coords || { lat: 44.4268, lng: 26.1025 }}
          zoom={coords ? 16 : 6}
          disableDefaultUI
          mapId="property-map"
        >
          {coords && <Marker position={coords} />}
        </Map>
      </div>
    </APIProvider>
  );
};

export default PropertyMap;
