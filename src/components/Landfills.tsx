import React, { useCallback, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import MapSearch from "./MapSearch";
import { Styles } from "../Styles/GoogleStyles";

// Define container style
const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "calc(100vh - 85px)",
  position: "fixed",
  zIndex: 1,
  boxSizing: "border-box",
};

const libraries: ("places" | "drawing")[] = ["places", "drawing"];

const center = {
  lat: 31.633833529312497,
  lng: 74.41767832303097,
};

type PolygonData = {
  id: number;
  paths: google.maps.LatLngLiteral[];
  name: string;
  info: string;
  center: google.maps.LatLngLiteral;
};

const Landfills = ({ open }: { open?: boolean }) => {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonData | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);

  // Map options with your custom styles
  const mapOptions: google.maps.MapOptions = {
    styles: Styles,
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    minZoom: 10,
    maxZoom: 18
  };

  const polygonOptions: google.maps.PolygonOptions = {
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#32CD32",
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1
  };

  const selectedPolygonOptions: google.maps.PolygonOptions = {
    ...polygonOptions,
    strokeColor: "#0000FF",
    strokeWeight: 3,
    fillColor: "#1E90FF",
    zIndex: 2
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handlePolygonClick = (polygonData: PolygonData) => {
    setSelectedPolygon(polygonData);
    setInfoWindowPosition(polygonData.center);
  };

  const handleLocationSelect = (location: google.maps.LatLngLiteral) => {
    mapRef.current?.panTo(location);
    mapRef.current?.setZoom(14);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const geoJson = JSON.parse(e.target?.result as string);
        const polygonsData = geoJson.features.map((feature: any, index: number) => ({
          id: index,
          paths: feature.geometry.coordinates[0].map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0]
          })),
          name: feature.properties?.name || `Landfill ${index + 1}`,
          info: feature.properties?.info || "No details available",
          center: {
            lat: feature.geometry.coordinates[0][0][1],
            lng: feature.geometry.coordinates[0][0][0]
          }
        }));
        setPolygons(polygonsData);
      } catch (error) {
        console.error("Error parsing GeoJSON:", error);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="w-full bg-white relative">
      <LoadScript
        googleMapsApiKey="AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          options={mapOptions}
        >
          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              paths={polygon.paths}
              options={
                selectedPolygon?.id === polygon.id 
                  ? selectedPolygonOptions 
                  : polygonOptions
              }
              onClick={() => handlePolygonClick(polygon)}
            />
          ))}

          <MapSearch onLocationSelect={handleLocationSelect} />

          {selectedPolygon && infoWindowPosition && (
            <InfoWindow
              position={infoWindowPosition}
              onCloseClick={() => setSelectedPolygon(null)}
            >
              <div className="p-2 max-w-xs">
                <h3 className="font-bold text-lg mb-1">{selectedPolygon.name}</h3>
                <p className="text-sm">{selectedPolygon.info}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <div className="absolute top-2 right-4 bg-white p-1.5 rounded shadow-md z-10">
        <input
          type="file"
          accept=".geojson,.json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-1 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {uploadedFileName && (
          <p className="mt-2 text-sm text-gray-600">
            Uploaded: <span className="font-medium">{uploadedFileName}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Landfills;