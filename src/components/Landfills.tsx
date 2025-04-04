import React, { useCallback, useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import MapSearch from "./MapSearch";

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "calc(100vh - 85px)",
  position: "fixed",
  // top: "68px",
  // left: "-120px",
  // border: "2px solid #73AD21",
  zIndex: 1,
  boxSizing: "border-box",
};

const libraries: "places"[] = ["places"];

const center = {
  lat: 31.633833529312497,
  lng: 74.41767832303097,
};

type PolygonData = {
  id: number;
  paths: { lat: number; lng: number }[];
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
  fillColor: string;
  fillOpacity: number;
  name: string;
  info: string;
  center: { lat: number; lng: number };
};

const options = {};

const Landfills = ({open}:any) => {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonData | null>(
    null
  );
  const [infoWindowPosition, setInfoWindowPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handlePolygonClick = (polygonData: PolygonData) => {
    setSelectedPolygon(polygonData);
    setInfoWindowPosition(polygonData.center);
  };

  const handleLocationSelect = (location: google.maps.LatLngLiteral) => {
    if (mapRef.current) {
      mapRef.current.panTo(location);
      mapRef.current.setZoom(12);
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === "string") {
          try {
            const geoJson = JSON.parse(e.target.result);
            const polygonsData = geoJson.features.map(
              ({ feature, index }: any) => ({
                id: index,
                paths: feature.geometry.coordinates[0].map((coord: any) => ({
                  lat: coord[1],
                  lng: coord[0],
                })),
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#32CD32",
                fillOpacity: 0.35,
                name: feature.properties.name || `Landfill ${index + 1}`,
                info: feature.properties.info || "No details available",
                center: {
                  lat: feature.geometry.coordinates[0][0][1],
                  lng: feature.geometry.coordinates[0][0][0],
                },
              })
            );
            setPolygons(polygonsData);
          } catch (error) {
            console.error("Error parsing the uploaded GeoJSON file:", error);
          }
        } else {
          console.warn("FileReader result is null or undefined");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full bg-white">
      <LoadScript
        googleMapsApiKey="AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          options={options}
        >
          {polygons.map((polygon, index) => (
            <Polygon
              key={index}
              paths={polygon.paths}
              options={{
                strokeColor: polygon.strokeColor,
                strokeOpacity: polygon.strokeOpacity,
                strokeWeight: polygon.strokeWeight,
                fillColor: polygon.fillColor,
                fillOpacity: polygon.fillOpacity,
              }}
              onClick={() => handlePolygonClick(polygon)}
            />
          ))}
          <MapSearch onLocationSelect={handleLocationSelect} />
          {selectedPolygon && infoWindowPosition && (
            <InfoWindow
              position={infoWindowPosition}
              onCloseClick={() => setSelectedPolygon(null)}
            >
              <div style={{ fontFamily: "Arial, sans-serif", padding: "10px" }}>
                <h3>
                  {selectedPolygon.name}
                </h3>
                <p style={{ margin: "0", whiteSpace: "pre-line" }}>
                  {selectedPolygon.info}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      <div
      className="absolute top-[90px] right-[70px] z-2 bg-white rounded-xs text-sm shadow-lg"
        // style={{ position: 'absolute', top: '150px', left: '180px', zIndex: 2, backgroundColor: "white", borderRadius: "5px", fontSize: "15px" }}
      >
        <input
          type="file"
          accept=".geojson"
          onChange={handleFileUpload}
          className="p-[10px] cursor-pointer"
        />
        {uploadedFileName && (
          <p className=" text-sm pl-2 border-t py-2"
          >
            Uploaded File: <strong className=" text-sm">{uploadedFileName}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Landfills;
