// import React, { useCallback, useState, useRef, useEffect } from "react";
// import {
//   GoogleMap,
//   LoadScript,
//   Polygon,
//   InfoWindow,
// } from "@react-google-maps/api";
// import MapSearch from "./MapSearch";
// import { Styles } from "../Styles/GoogleStyles";
// import * as turf from '@turf/turf';


// import { doc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { getAuth, User } from "firebase/auth";

// // Define container style
// const containerStyle: React.CSSProperties = {
//   width: "100%",
//   height: "calc(100vh - 85px)",
//   position: "fixed",
//   zIndex: 1,
//   boxSizing: "border-box",
// };

// const libraries: ("places" | "drawing")[] = ["places", "drawing"];

// const center = {
//   lat: 31.633833529312497,
//   lng: 74.41767832303097,
// };

// type PolygonData = {
//   id: number;
//   paths: google.maps.LatLngLiteral[];
//   name: string;
//   info: string;
//   center: google.maps.LatLngLiteral;
//   areaSqMeters: any;
//   areaKm2: any;
// };

// const Landfills = ({ open }: { open?: boolean }) => {
//   const [polygons, setPolygons] = useState<PolygonData[]>([]);
//   const [selectedPolygon, setSelectedPolygon] = useState<PolygonData | null>(null);
//   const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);
//   const [uploadedFileName, setUploadedFileName] = useState<string>("");
//   const mapRef = useRef<google.maps.Map | null>(null);

//   // Map options with your custom styles
//   const mapOptions: google.maps.MapOptions = {
//     styles: Styles,
//     disableDefaultUI: true,
//     zoomControl: true,
//     streetViewControl: false,
//     mapTypeControl: false,
//     fullscreenControl: false,
//     minZoom: 10,
//     maxZoom: 18
//   };

//   const polygonOptions: google.maps.PolygonOptions = {
//     strokeColor: "#009F6B",
//     strokeOpacity: 0.8,
//     strokeWeight: 2,
//     fillColor: "#00AD83",
//     fillOpacity: 0.35,
//     clickable: true,
//     draggable: false,
//     editable: false,
//     zIndex: 1
//   };

//   const selectedPolygonOptions: google.maps.PolygonOptions = {
//     ...polygonOptions,
//     strokeColor: "#3F7D58",
//     strokeWeight: 3,
//     fillColor: "#328E6E",
//     zIndex: 2
//   };

//   const onLoad = useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//   }, []);

//   const handlePolygonClick = (polygonData: PolygonData) => {
//     setSelectedPolygon(polygonData);
//     setInfoWindowPosition(polygonData.center);
//   };

//   const handleLocationSelect = (location: google.maps.LatLngLiteral) => {
//     mapRef.current?.panTo(location);
//     mapRef.current?.setZoom(14);
//   };

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setUploadedFileName(file.name);
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       try {
//         const auth = getAuth();
//         const user: User | null = auth.currentUser;
//         const geoJson = JSON.parse(e.target?.result as string);
//         const polygonsData = geoJson.features.map((feature: any, index: number) => ({
//           id: index,
//           paths: feature.geometry.coordinates[0].map((coord: number[]) => ({
//             lat: coord[1],
//             lng: coord[0]
//           })),
//           name: feature.properties?.name || `Landfill ${index + 1}`,
//           info: feature.properties?.info || "No details available",
//           //  const name = feature.properties?.name || "Unnamed";
//           areaSqMeters: turf.area(feature),
//           areaKm2: (turf.area(feature) / 1_000_000).toFixed(2),
//           center: {
//             lat: feature.geometry.coordinates[0][0][1],
//             lng: feature.geometry.coordinates[0][0][0]
//           }
//         }));
//         setPolygons(polygonsData);


//         for (const polygon of polygonsData) {
//           await addDoc(collection(db, "landfillsData"), polygon);
//           alert("Data saved successfully!");

//         }
//       } catch (error) {
//         console.error("Error parsing GeoJSON:", error);
//       }
//     };

//     reader.readAsText(file);
//   };

//   console.log(polygons)

//   return (
//     <div className="w-full bg-white relative">
//       <LoadScript
//         googleMapsApiKey="AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"
//         libraries={libraries}
//       >
//         <GoogleMap
//           mapContainerStyle={containerStyle}
//           center={center}
//           zoom={13}
//           onLoad={onLoad}
//           options={mapOptions}
//         >
//           {polygons.map((polygon) => (
//             <Polygon
//               key={polygon.id}
//               paths={polygon.paths}
//               options={
//                 selectedPolygon?.id === polygon.id
//                   ? selectedPolygonOptions
//                   : polygonOptions
//               }
//               onClick={() => handlePolygonClick(polygon)}
//             />
//           ))}

//           <MapSearch onLocationSelect={handleLocationSelect} />

//           {selectedPolygon && infoWindowPosition && (
//             <InfoWindow
//               position={infoWindowPosition}
//               onCloseClick={() => setSelectedPolygon(null)}
//             >
//               <div className="p-2 max-w-xs">
//                 <h3 className="font-bold text-lg mb-1">{selectedPolygon.name}</h3>
//                 {/* <p className="text-sm">{selectedPolygon.info}</p> */}
//                 <p className="text-sm">{selectedPolygon.areaSqMeters}</p>
//                 <p className="text-sm">{selectedPolygon.areaKm2}</p>
//               </div>
//             </InfoWindow>
//           )}
//         </GoogleMap>
//       </LoadScript>

//       <div className="absolute top-2 right-4 bg-white p-1.5 rounded shadow-md z-10">
//         <input
//           type="file"
//           accept=".geojson,.json"
//           onChange={handleFileUpload}
//           className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-1 file:px-4
//             file:rounded file:border-0
//             file:text-sm file:font-semibold
//             file:cursor-pointer
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100"
//         />
//         {uploadedFileName && (
//           <p className="mt-2 text-sm text-gray-600">
//             Uploaded: <span className="font-medium">{uploadedFileName}</span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Landfills;







import React, { useCallback, useEffect, useRef, useState } from "react";
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

const Landfills = ({ open }: { open?: boolean }) => {
  const [polygons, setPolygons] = useState<PolygonData[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<PolygonData | null>(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);

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

        const geoJson = JSON.parse(e.target?.result as string);

        if (!geoJson.features || !Array.isArray(geoJson.features)) {
          throw new Error("Invalid GeoJSON structure.");
        }

        const newPolygons: PolygonData[] = geoJson.features.map((feature: any, index: number) => {
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

        for (const polygon of newPolygons) {
          await setDoc(doc(db, "landfillsData", polygon.id), polygon);
        }

        setPolygons((prev) => [...prev, ...newPolygons]);
        alert("Data saved successfully!");
      } catch (error) {
        console.error("Error parsing or uploading GeoJSON:", error);
        alert("Failed to process GeoJSON file.");
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

      {/* <div className="absolute top-2 right-4 bg-white p-1.5 rounded shadow-md z-10">
        <input
          type="file"
          accept=".geojson,.json"
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

export default Landfills;
