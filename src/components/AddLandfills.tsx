import React, { useCallback, useEffect, useRef, useState } from "react";
import Toast from "./Toast";

import {
  GoogleMap,
  LoadScript,
  Polygon,
  InfoWindow,
} from "@react-google-maps/api";
import MapSearch from "./MapSearch";
import { Styles } from "../Styles/GoogleStyles";
import * as turf from "@turf/turf";

import {
  doc,
  setDoc,
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, User } from "firebase/auth";
import { CloudUpload, PilcrowRightIcon } from "lucide-react";
import { redirect, useNavigate } from "react-router-dom";

// Google Maps container style
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
  id: string;
  paths: google.maps.LatLngLiteral[];
  name: string;
  info: string;
  center: google.maps.LatLngLiteral;
  areaSqMeters: number;
  areaKm2: string;
};

const AddLandfills = ({ open }: { open?: boolean }) => {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonData | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const navigate = useNavigate();

  const polygonOptions: google.maps.PolygonOptions = {
    strokeColor: "#009F6B",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#00AD83",
    fillOpacity: 0.35,
    clickable: true,
    draggable: false,
    editable: false,
    zIndex: 1,
  };

  const selectedPolygonOptions: google.maps.PolygonOptions = {
    ...polygonOptions,
    strokeColor: "#3F7D58",
    strokeWeight: 3,
    fillColor: "#328E6E",
    zIndex: 2,
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

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   setUploadedFileName(file.name);
  //   const reader = new FileReader();

  //   reader.onload = async (e) => {
  //     try {
  //       const auth = getAuth();
  //       const user: User | null = auth.currentUser;

  //       if (!user) {
  //         alert("You must be logged in to upload.");
  //         return;
  //       }

  //       const geoJson = JSON.parse(e.target?.result as string);

  //       if (!geoJson.features || !Array.isArray(geoJson.features)) {
  //         throw new Error("Invalid GeoJSON structure.");
  //       }

  //       const newPolygons: PolygonData[] = geoJson.features.map((feature: any, index: number) => {
  //         const coords = feature.geometry.coordinates[0];

  //         return {
  //           id: `landfill_${Date.now()}_${index}`,
  //           paths: coords.map((coord: number[]) => ({
  //             lat: coord[1],
  //             lng: coord[0],
  //           })),
  //           name: feature.properties?.name || `Landfill ${index + 1}`,
  //           info: feature.properties?.info || "No details available",
  //           areaSqMeters: turf.area(feature),
  //           areaKm2: (turf.area(feature) / 1_000_000).toFixed(2),
  //           center: {
  //             lat: coords[0][1],
  //             lng: coords[0][0],
  //           },
  //         };
  //       });

  //       for (const polygon of newPolygons) {
  //         await setDoc(doc(db, "landfillsData", polygon.id), polygon);
  //       }

  //       setPolygons((prev) => [...prev, ...newPolygons]);
  //       alert("Data saved successfully!");
  //     } catch (error) {
  //       console.error("Error parsing or uploading GeoJSON:", error);
  //       alert("Failed to process GeoJSON file.");
  //     }
  //   };

  //   reader.readAsText(file);
  // };

 const [toast, setToast] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const auth = getAuth();
        const user: User | null = auth.currentUser;

        if (!user) {
          alert("You must be logged in to upload.");
          return;
        }

        const content = e.target?.result as string;

        let newPolygons: PolygonData[] = [];

        if (file.name.endsWith(".kml")) {
          const parser = new DOMParser();
          const kml = parser.parseFromString(content, "application/xml");
          const placemarks = Array.from(kml.getElementsByTagName("Placemark"));

          newPolygons = placemarks
            .map((placemark, index) => {
              const name = placemark.getElementsByTagName("name")[0]?.textContent || `KML Landfill ${index + 1}`;
              const polygon = placemark.getElementsByTagName("Polygon")[0];
              const coordinates = polygon?.getElementsByTagName("coordinates")[0]?.textContent;

              if (!coordinates) return null;

              const coordsList = coordinates.trim().split(/\s+/).map((coordStr) => {
                const [lng, lat] = coordStr.split(",").map(Number);
                return { lat, lng };
              });

              const turfPolygon = turf.polygon([[...coordsList.map(c => [c.lng, c.lat])]]);
              const areaSqMeters = turf.area(turfPolygon);

              return {
                id: `kml_landfill_${Date.now()}_${index}`,
                paths: coordsList,
                name,
                info: "Uploaded from KML file",
                center: coordsList[0],
                areaSqMeters,
                areaKm2: (areaSqMeters / 1_000_000).toFixed(2),
              };
            })
            .filter(Boolean) as PolygonData[];

        } else {
          // GeoJSON handling
          const geoJson = JSON.parse(content);

          if (!geoJson.features || !Array.isArray(geoJson.features)) {
            throw new Error("Invalid GeoJSON structure.");
          }

          newPolygons = geoJson.features.map((feature: any, index: number) => {
            const coords = feature.geometry.coordinates[0];

            return {
              id: `landfill_${Date.now()}_${index}`,
              paths: coords.map((coord: number[]) => ({
                lat: coord[1],
                lng: coord[0],
              })),
              name: feature.properties?.name || `Landfill ${index + 1}`,
              info: feature.properties?.info || "No details available",
              areaSqMeters: turf.area(feature),
              areaKm2: (turf.area(feature) / 1_000_000).toFixed(2),
              center: {
                lat: coords[0][1],
                lng: coords[0][0],
              },
            };
          });
        }

        for (const polygon of newPolygons) {
          await setDoc(doc(db, "landfillsData", polygon.id), polygon);
        }
 setToast({ message: "File uploaded Successfully!", type: "success" });
  setTimeout(() => {
          navigate("/landfills"); 
        }, 2000); 
        // navigate("/landfills"); 

        setPolygons((prev) => [...prev, ...newPolygons]);
        // alert("File uploaded and polygons saved successfully!");
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process file.");
      }
    };

    reader.readAsText(file);
  };




  const fetchLandfills = async () => {
    try {
      const snapshot = await getDocs(collection(db, "landfillsData"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PolygonData[];
      setPolygons(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchLandfills();
  }, []);
  const closeToast = () => {
    console.log("Closing toast");
    setToast({ message: "", type: "" });
  };
  return (
    <div className="w-full bg-white relative">
      {toast.message || toast.type ? (
          <Toast
            message={toast.message || ""}
            type={toast.type || ""}
            onClose={closeToast}
            timeout={3000}
          />
        ) : null}
      <LoadScript
        googleMapsApiKey="AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          options={{
            styles: Styles,
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            minZoom: 10,
            maxZoom: 18,
          }}
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
                <p className="text-sm">Size: {selectedPolygon.areaKm2} km²</p>
                <p className="text-xs text-gray-500">{selectedPolygon.info}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      <div className="absolute w-full h-full top-0 bg-white/60 p-1.5 rounded shadow-md z-10">

        {uploadedFileName ? (
          <div className="w-full h-full flex justify-center items-center ">
          <div className=" bg-white w-4/5 p-4 rounded-lg shadow-md ">
          <p className="mt-2 text-sm text-gray-600">
            Uploaded: <span className="font-medium">{uploadedFileName}</span>
          </p>
          </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            <div className="col-span-full bg-white w-4/5 p-4 rounded-lg shadow-md">
            <div className="col-span-full bg-white ">
              {/* <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                Cover photo
              </label> */}
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <CloudUpload className="mx-auto size-12 text-gray-300" />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative w-full flex items-center justify-center text-center cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      {/* <input id="file-upload" name="file-upload" type="file" className="sr-only" /> */}
                      <input
                        type="file"
                        id="file-upload" name="file-upload"
                        accept=".geojson,.json,.kml"
                        onChange={handleFileUpload}
                        className=" sr-only"
                      />
                    </label>
                    {/* <p className="pl-1">or drag and drop</p> */}
                  </div>
                  <p className="text-xs/5 text-gray-600">GEOJSON, JSON, KML</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
      {/* </div>
</div> */}
      {/* <div className="absolute top-2 right-4 bg-white p-1.5 rounded shadow-md z-10">
        <input
          type="file"
          accept=".geojson,.json,.kml"

          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-1 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:cursor-pointer
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {uploadedFileName && (
          <p className="mt-2 text-sm text-gray-600">
            Uploaded: <span className="font-medium">{uploadedFileName}</span>
          </p>
        )}
      </div> */}
    </div>
  );
};

export default AddLandfills;
