import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface PropertyMapProps {
  lat: number | null;
  lng: number | null;
  apiKey: string;
}

// =========
// ✅ READY
// =========
const PropertyMap = ({ lat, lng, apiKey }: PropertyMapProps) => {
  const coords = lat && lng ? { lat, lng } : { lat: 44.4268, lng: 26.1025 };

  return (
    <APIProvider apiKey={apiKey}>
      <div
        style={{
          width: "100%",
          height: "250px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        }}
      >
        <Map center={coords} zoom={lat && lng ? 17 : 6} disableDefaultUI mapId="property-map">
          {lat && lng && <Marker position={coords} />}
        </Map>
      </div>
    </APIProvider>
  );
};

export default PropertyMap;
