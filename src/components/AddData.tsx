// import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
// import MapSearch from './MapSearch';

// import { doc, setDoc } from "firebase/firestore"; // For Firestore functions
// import { db } from "../firebase"; // Import your Firebase configuration file
// import { getAuth } from "firebase/auth";
// import { useGoogleMapsLoader } from "../hooks/useGoogleMapsLoader";

// declare global {
//   interface Window {
//     google: typeof google;
//   }
// }

// type WasteSubcategory = {
//   checked: boolean;
//   value: string;
// };

// type WasteCategory = {
//   checked: boolean;
//   subcategories: {
//     [key: string]: WasteSubcategory;
//   };
// };

// type FormData = {
//   [key: string]: any; // fallback
//   wasteCategories: {
//     [key: string]: WasteCategory;
//   };
// };

// type Props = {
//   formData: FormData;
//   setFormData: React.Dispatch<React.SetStateAction<FormData>>;
// };

// const paragraphStyle = {
//   fontFamily: 'Open Sans',
//   margin: 0,
//   fontSize: 13,
// };

// const formLabelStyle = {
//   display: 'block',
//   marginBottom: '5px',
//   fontWeight: 'bold',
// };

// const selectStyle = {
//   width: '100%',
//   padding: '8px',
//   margin: '5px 0 15px 0',
//   borderRadius: '4px',
//   border: '1px solid #ccc',
//   fontSize: '14px',
// };

// const checkboxStyle = {
//   marginRight: '10px',
// };

// const submitButtonStyle = {
//   backgroundColor: '#4CAF50',
//   color: 'white',
//   padding: '10px 15px',
//   border: 'none',
//   borderRadius: '4px',
//   cursor: 'pointer',
//   width: '100%',
//   fontSize: '16px',
// };



// const Map2 = ({ open }: any) => {


//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapRef = useRef<google.maps.Map | null>(null);
//   const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);

//   const [isPolygonDrawn, setIsPolygonDrawn] = useState(false);
//   const [selectedPolygon, setSelectedPolygon] = useState<google.maps.Polygon | null>(null);
//   const [roundedArea, setRoundedArea] = useState<number | null>(null)

//   const loaded = useGoogleMapsLoader();

//   const [formData, setFormData] = useState<FormData>({
//     ucName: '',
//     population: '',
//     households: '',
//     incomeGroup: '',
//     wasteCategories: {
//       Residential: {
//         checked: false,
//         subcategories: {
//           Paper: { checked: false, value: '' },
//           Cardboard: { checked: false, value: '' },
//           LightPlastic: { checked: false, value: '' },
//           DensePlastic: { checked: false, value: '' },
//           TextileWaste: { checked: false, value: '' },
//           FoodWaste: { checked: false, value: '' },
//           YardWaste: { checked: false, value: '' },
//           Metals: { checked: false, value: '' },
//           Glass: { checked: false, value: '' },
//           Diapers: { checked: false, value: '' },
//           AnimalDunk: { checked: false, value: '' },
//           Wood: { checked: false, value: '' },
//           Electronic: { checked: false, value: '' },
//           Leather: { checked: false, value: '' },
//           CDWaste: { checked: false, value: '' }, // Construction and Demolition Waste
//         }
//       },
//       Commercial: {
//         checked: false,
//         subcategories: {
//           Paper: { checked: false, value: '' },
//           Cardboard: { checked: false, value: '' },
//           LightPlastic: { checked: false, value: '' },
//           DensePlastic: { checked: false, value: '' },
//           TextileWaste: { checked: false, value: '' },
//           FoodWaste: { checked: false, value: '' },
//           YardWaste: { checked: false, value: '' },
//           Metals: { checked: false, value: '' },
//           Glass: { checked: false, value: '' },
//           Diapers: { checked: false, value: '' },
//           AnimalDunk: { checked: false, value: '' },
//           Wood: { checked: false, value: '' },
//           Electronic: { checked: false, value: '' },
//           Leather: { checked: false, value: '' },
//           CDWaste: { checked: false, value: '' },
//         }
//       },
//       Industrial: {
//         checked: false,
//         subcategories: {
//           Paper: { checked: false, value: '' },
//           Cardboard: { checked: false, value: '' },
//           LightPlastic: { checked: false, value: '' },
//           DensePlastic: { checked: false, value: '' },
//           TextileWaste: { checked: false, value: '' },
//           FoodWaste: { checked: false, value: '' },
//           YardWaste: { checked: false, value: '' },
//           Metals: { checked: false, value: '' },
//           Glass: { checked: false, value: '' },
//           Diapers: { checked: false, value: '' },
//           AnimalDunk: { checked: false, value: '' },
//           Wood: { checked: false, value: '' },
//           Electronic: { checked: false, value: '' },
//           Leather: { checked: false, value: '' },
//           CDWaste: { checked: false, value: '' },
//         }
//       },
//       Hazardous: {
//         checked: false,
//         subcategories: {
//           Needles: { checked: false, value: '' },
//           Syringes: { checked: false, value: '' },
//           Scalpels: { checked: false, value: '' },
//           InfusionSets: { checked: false, value: '' },
//           SawsKnives: { checked: false, value: '' },
//           Blades: { checked: false, value: '' },
//           Chemicals: { checked: false, value: '' },
//         }
//       }
//     },
//   });

//   // useEffect(() => {
//   //   // const googleMapsScript = document.createElement('script');
//   //   // googleMapsScript.src =
//   //   //   'https://maps.googleapis.com/maps/api/js?key=AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA&libraries=drawing,geometry';

//   //   // googleMapsScript.onload = () => {
//   //   //   console.log('Google Maps script loaded!');
//   //   //   // Now safe to use google.maps
//   //   // };

//   //   // document.head.appendChild(googleMapsScript);

//   //   googleMapsScript.addEventListener('load', () => {
//   //     if (!mapContainerRef.current) return;

//   //     const map = new window.google.maps.Map(mapContainerRef.current, {
//   //       center: { lat: 31.5204, lng: 74.3587 },
//   //       zoom: 12,
//   //       mapTypeId: 'satellite',
//   //     });

//   //     mapRef.current = map;

//   //     const drawingManager = new window.google.maps.drawing.DrawingManager({
//   //       drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
//   //       drawingControlOptions: {
//   //         position: google.maps.ControlPosition.TOP_CENTER,
//   //         drawingModes: [google.maps.drawing.OverlayType.POLYGON as google.maps.drawing.OverlayType],
//   //       },
//   //       polygonOptions: {
//   //         editable: false,
//   //         draggable: false,
//   //       },
//   //     });

//   //     drawingManagerRef.current = drawingManager;
//   //     drawingManager.setMap(map);

//   //     window.google.maps.event.addListener(
//   //       drawingManager,
//   //       'overlaycomplete',
//   //       (event: google.maps.drawing.OverlayCompleteEvent) => {
//   //         if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
//   //           const polygon = event.overlay as google.maps.Polygon;
//   //           calculateArea(polygon);

//   //           drawingManager.setOptions({
//   //             drawingMode: null,
//   //             drawingControl: false,
//   //           });

//   //           polygon.setOptions({
//   //             editable: false,
//   //             draggable: false,
//   //           });

//   //           setIsPolygonDrawn(true);
//   //           setSelectedPolygon(polygon);

//   //           window.google.maps.event.addListener(polygon, 'click', () => {
//   //             setSelectedPolygon(polygon);
//   //           });

//   //           window.google.maps.event.addListener(polygon.getPath(), 'set_at', () => calculateArea(polygon));
//   //           window.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => calculateArea(polygon));
//   //         }
//   //       }
//   //     );
//   //   });

//   //   function calculateArea(polygon: google.maps.Polygon) {
//   //     const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
//   //     setRoundedArea(Math.round(area * 100) / 100);
//   //   }
//   // }, []);


//   // useEffect(() => {
//   //   if (!window.google) {
//   //     // const script = document.createElement("script");
//   //     // script.src =
//   //     //   "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing,geometry";
//   //     // script.async = true;
//   //     // script.onload = () => {
//   //     //   console.log("Google Maps script loaded!");
//   //     // };
//   //     // document.body.appendChild(script);

//   //     const googleMapsScript = document.createElement('script');
//   //   googleMapsScript.src =
//   //     'https://maps.googleapis.com/maps/api/js?key=AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA&libraries=drawing,geometry';

//   //   googleMapsScript.onload = () => {
//   //     console.log('Google Maps script loaded!');
//   //     // Now safe to use google.maps
//   //   };

//   //   document.head.appendChild(googleMapsScript);
//   //   }
//   // }, []);
//   // const mapsLoaded = useGoogleMapsLoader();


//   useEffect(() => {
//     if (!loaded || !mapRef.current) return;

//     const map = new window.google.maps.Map(mapContainerRef.current as HTMLDivElement, {
//       center: { lat: 33.6844, lng: 73.0479 },
//       zoom: 12,
//     });

//     const drawingManager = new window.google.maps.drawing.DrawingManager({
//       drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
//       drawingControl: true,
//       drawingControlOptions: {
//         position: window.google.maps.ControlPosition.TOP_CENTER,
//         drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
//       },
//     });

//     drawingManager.setMap(map);

//     window.google.maps.event.addListener(
//       drawingManager,
//       "overlaycomplete",
//       function (event: any) {
//         console.log("Polygon drawn:", event.overlay.getPath().getArray());
//       }
//     );
//   }, [loaded]);



//   const handleFormChange = (
//     e: any,
//     formData: FormData,
//     setFormData: React.Dispatch<React.SetStateAction<FormData>>
//   ) => {
//     const { name, value, type, checked } = e.target;

//     if (type === "checkbox") {
//       if (Object.keys(formData.wasteCategories).includes(name)) {
//         // It's a main category
//         setFormData((prevData) => ({
//           ...prevData,
//           wasteCategories: {
//             ...prevData.wasteCategories,
//             [name]: {
//               ...prevData.wasteCategories[name],
//               checked,
//             },
//           },
//         }));
//       } else {
//         // It's a subcategory
//         const [mainCategory, subCategory] = name.split("_");
//         setFormData((prevData) => ({
//           ...prevData,
//           wasteCategories: {
//             ...prevData.wasteCategories,
//             [mainCategory]: {
//               ...prevData.wasteCategories[mainCategory],
//               subcategories: {
//                 ...prevData.wasteCategories[mainCategory].subcategories,
//                 [subCategory]: {
//                   ...prevData.wasteCategories[mainCategory].subcategories[subCategory],
//                   checked,
//                 },
//               },
//             },
//           },
//         }));
//       }
//     } else if (name.includes("Value")) {
//       const [mainCategory, subCategory] = name.split("Value")[0].split("_");
//       setFormData((prevData) => ({
//         ...prevData,
//         wasteCategories: {
//           ...prevData.wasteCategories,
//           [mainCategory]: {
//             ...prevData.wasteCategories[mainCategory],
//             subcategories: {
//               ...prevData.wasteCategories[mainCategory].subcategories,
//               [subCategory]: {
//                 ...prevData.wasteCategories[mainCategory].subcategories[subCategory],
//                 value,
//               },
//             },
//           },
//         },
//       }));
//     } else {
//       // Generic form inputs
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async () => {
//     console.log('Form Data:', formData);
//     // Get the currently logged-in user
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (!user) {
//       alert("No user logged in!");
//       return;
//     }

//     const userUID = user.uid; // Capture user UID
//     const userEmail = user.email;

//     if (!selectedPolygon) {
//       alert("Please draw a polygon on the map before submitting.");
//       return;
//     }

//     // Extract polygon coordinates
//     const polygonCoordinates = selectedPolygon.getPath().getArray().map(coord => ({
//       lat: coord.lat(),
//       lng: coord.lng()
//     }));

//     const infoWindow = new window.google.maps.InfoWindow({
//       content: `<div><strong>${formData.ucName}</strong></div>`,
//       position: selectedPolygon.getPath().getAt(0),
//     });

//     infoWindow.open(mapRef.current);

//     if (selectedPolygon) {
//       selectedPolygon.setMap(null);
//     }
//     setSelectedPolygon(null);

//     try {
//       // Save data to Firestore
//       const docRef = doc(db, "wasteData", formData.ucName); // Collection: wasteData, Document: ucName
//       await setDoc(docRef, {
//         ...formData,
//         userUID: userUID,
//         userEmail: userEmail,
//         polygonCoordinates: polygonCoordinates
//       });

//       console.log("Data saved to Firestore successfully!");
//     } catch (error) {
//       console.error("Error saving data to Firestore:", error);
//     }

//     setFormData({
//       ucName: '',
//       population: '',
//       households: '',
//       incomeGroup: '',
//       wasteCategories: {
//         Residential: {
//           checked: false,
//           subcategories: {
//             Paper: { checked: false, value: '' },
//             Cardboard: { checked: false, value: '' },
//             LightPlastic: { checked: false, value: '' },
//             DensePlastic: { checked: false, value: '' },
//             TextileWaste: { checked: false, value: '' },
//             FoodWaste: { checked: false, value: '' },
//             YardWaste: { checked: false, value: '' },
//             Metals: { checked: false, value: '' },
//             Glass: { checked: false, value: '' },
//             Diapers: { checked: false, value: '' },
//             AnimalDunk: { checked: false, value: '' },
//             Wood: { checked: false, value: '' },
//             Electronic: { checked: false, value: '' },
//             Leather: { checked: false, value: '' },
//             CDWaste: { checked: false, value: '' }, // Construction and Demolition Waste
//           }
//         },
//         Commercial: {
//           checked: false,
//           subcategories: {
//             Paper: { checked: false, value: '' },
//             Cardboard: { checked: false, value: '' },
//             LightPlastic: { checked: false, value: '' },
//             DensePlastic: { checked: false, value: '' },
//             TextileWaste: { checked: false, value: '' },
//             FoodWaste: { checked: false, value: '' },
//             YardWaste: { checked: false, value: '' },
//             Metals: { checked: false, value: '' },
//             Glass: { checked: false, value: '' },
//             Diapers: { checked: false, value: '' },
//             AnimalDunk: { checked: false, value: '' },
//             Wood: { checked: false, value: '' },
//             Electronic: { checked: false, value: '' },
//             Leather: { checked: false, value: '' },
//             CDWaste: { checked: false, value: '' },
//           }
//         },
//         Industrial: {
//           checked: false,
//           subcategories: {
//             Paper: { checked: false, value: '' },
//             Cardboard: { checked: false, value: '' },
//             LightPlastic: { checked: false, value: '' },
//             DensePlastic: { checked: false, value: '' },
//             TextileWaste: { checked: false, value: '' },
//             FoodWaste: { checked: false, value: '' },
//             YardWaste: { checked: false, value: '' },
//             Metals: { checked: false, value: '' },
//             Glass: { checked: false, value: '' },
//             Diapers: { checked: false, value: '' },
//             AnimalDunk: { checked: false, value: '' },
//             Wood: { checked: false, value: '' },
//             Electronic: { checked: false, value: '' },
//             Leather: { checked: false, value: '' },
//             CDWaste: { checked: false, value: '' },
//           }
//         },
//         Hazardous: {
//           checked: false,
//           subcategories: {
//             Needles: { checked: false, value: '' },
//             Syringes: { checked: false, value: '' },
//             Scalpels: { checked: false, value: '' },
//             InfusionSets: { checked: false, value: '' },
//             SawsKnives: { checked: false, value: '' },
//             Blades: { checked: false, value: '' },
//             Chemicals: { checked: false, value: '' },
//           }
//         }
//       },
//     });
//   };



//   const handleLocationSelect = (location: any) => {
//     if (mapRef.current) {
//       mapRef.current.panTo(location);
//       mapRef.current.setZoom(12);
//     }
//   };

//   if (!loaded) return <p>Loading map...</p>;

//   return (
//     <>
//       <div ref={mapContainerRef} id="map" style={{ height: '100%', width: '100%' }}></div>

//       <div
//         className="calculation-box"
//         style={{
//           height: 75,
//           width: 150,
//           position: 'absolute',
//           bottom: 40,
//           left: 10,
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           padding: 15,
//           textAlign: 'center',
//         }}
//       >
//         <p style={paragraphStyle}>Click the map to draw a polygon.</p>
//         <div id="calculated-area">
//           {roundedArea && (
//             <>
//               <p style={paragraphStyle}>
//                 <strong>{roundedArea}</strong>
//               </p>
//               <p style={paragraphStyle}>square meters</p>
//             </>
//           )}
//         </div>
//       </div>
//       {selectedPolygon && (
//         <div
//           className="form-box"
//           style={{
//             position: 'absolute',
//             bottom: 120,
//             left: 10,
//             backgroundColor: 'rgba(255, 255, 255, 0.9)',
//             padding: 15,
//             width: 300,
//             zIndex: 1,
//             maxHeight: '400px',
//             overflow: 'auto',
//           }}
//         >
//           <h2>Polygon Details</h2>

//           <label style={formLabelStyle} htmlFor="ucName">UC Name</label>
//           <input
//             type="text"
//             id="ucName"
//             name="ucName"
//             style={{
//               width: '100%',
//               padding: '8px',
//               margin: '5px 0 15px 0',
//               display: 'inline-block',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               boxSizing: 'border-box',
//             }}
//             value={formData.ucName}
//             onChange={(e) => handleFormChange(e, formData, setFormData)}
//           />

//           <label style={formLabelStyle} htmlFor="population">Population</label>
//           <input
//             type="text"
//             id="population"
//             name="population"
//             style={{
//               width: '100%',
//               padding: '8px',
//               margin: '5px 0 15px 0',
//               display: 'inline-block',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               boxSizing: 'border-box',
//             }}
//             value={formData.population}
//             onChange={(e) => handleFormChange(e, formData, setFormData)}
//           />

//           <label style={formLabelStyle} htmlFor="households">Households</label>
//           <input
//             type="text"
//             id="households"
//             name="households"
//             style={{
//               width: '100%',
//               padding: '8px',
//               margin: '5px 0 15px 0',
//               display: 'inline-block',
//               border: '1px solid #ccc',
//               borderRadius: '4px',
//               boxSizing: 'border-box',
//             }}
//             value={formData.households}
//             onChange={(e) => handleFormChange(e, formData, setFormData)}

//           />

//           {/* Dropdown for Income Group */}
//           <label style={formLabelStyle} htmlFor="incomeGroup">Income Group</label>
//           <select
//             id="incomeGroup"
//             name="incomeGroup"
//             style={selectStyle}
//             value={formData.incomeGroup}
//             onChange={(e) => handleFormChange(e, formData, setFormData)}

//           >
//             <option value="">Select Income Group</option>
//             <option value="High Income Group">High Income Group</option>
//             <option value="Higher-Middle Income Group">Higher-Middle Income Group</option>
//             <option value="Lower-Middle Income Group">Lower-Middle Income Group</option>
//             <option value="Low Income Group">Low Income Group</option>
//           </select>

//           <h3>Waste Categories</h3>

//           {Object.entries(formData.wasteCategories).map(([categoryName, categoryData]) => (
//             <div key={categoryName}>
//               <label>
//                 <input
//                   type="checkbox"
//                   name={categoryName}
//                   style={checkboxStyle}
//                   checked={categoryData.checked}
//                   onChange={(e) => handleFormChange(e, formData, setFormData)}

//                 />
//                 {categoryName}
//               </label>

//               {categoryData.checked &&
//                 Object.entries(categoryData.subcategories).map(([subcategoryName, subcategoryData]) => (
//                   <div key={`${categoryName}_${subcategoryName}`}>
//                     <label>
//                       <input
//                         type="checkbox"
//                         name={`${categoryName}_${subcategoryName}`}
//                         style={checkboxStyle}
//                         checked={subcategoryData.checked}
//                         onChange={(e) => handleFormChange(e, formData, setFormData)}

//                       />
//                       {subcategoryName}
//                     </label>

//                     {subcategoryData.checked && (
//                       <input
//                         type="text"
//                         name={`${categoryName}_${subcategoryName}Value`}
//                         style={{
//                           width: '100%',
//                           padding: '8px',
//                           margin: '5px 0 15px 0',
//                           display: 'inline-block',
//                           border: '1px solid #ccc',
//                           borderRadius: '4px',
//                           boxSizing: 'border-box',
//                         }}
//                         placeholder={`Enter value for ${subcategoryName}`}
//                         value={subcategoryData.value}
//                         onChange={(e) => handleFormChange(e, formData, setFormData)}

//                       />
//                     )}
//                   </div>
//                 ))}
//             </div>
//           ))}

//           <button style={submitButtonStyle} onClick={handleSubmit}>
//             Submit
//           </button>
//         </div>
//       )}
//     </>
//   );
// };

// export default Map2;








// //googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAo_mqWaTaovIAeSAUFCI9lBNNIwxx6_bE&libraries=drawing,geometry`;






























import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
// Extend the Window interface to include initMap
declare global {
  interface Window {
    initMap?: () => void;
  }
}
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, User } from "firebase/auth";

// Define types for form data
interface Subcategory {
  checked: boolean;
  value: string;
}

interface WasteCategory {
  checked: boolean;
  subcategories: {
    [key: string]: Subcategory;
  };
}

interface FormData {
  ucName: string;
  population: string;
  households: string;
  incomeGroup: string;
  wasteCategories: {
    Residential: WasteCategory;
    Commercial: WasteCategory;
    Industrial: WasteCategory;
    Hazardous: WasteCategory;
  };
}

const paragraphStyle = {
  fontFamily: 'Open Sans',
  margin: 0,
  fontSize: 13,
};

const containerStyle = {
  width: "calc(100% + (350px))",
  height: "60vh",
  top: "0",
  left: "-180px",
  // border: "2px solid #73AD21",
  zIndex: 1,
  boxSizing: "border-box",
};

const formLabelStyle = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0 15px 0',
  display: 'inline-block',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
};

const selectStyle = {
  width: '100%',
  padding: '8px',
  margin: '5px 0 15px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px',
};

const checkboxStyle = {
  marginRight: '10px',
};

const submitButtonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
  fontSize: '16px',
};

const AddData = ({ open }: any) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(null);
  const [roundedArea, setRoundedArea] = React.useState<number | undefined>();
  const [isPolygonDrawn, setIsPolygonDrawn] = React.useState<boolean>(false);
  const [selectedPolygon, setSelectedPolygon] = React.useState<google.maps.Polygon | null>(null);
  const [formData, setFormData] = useState<FormData>({
    ucName: '',
    population: '',
    households: '',
    incomeGroup: '',
    wasteCategories: {
      Residential: {
        checked: false,
        subcategories: {
          Paper: { checked: false, value: '' },
          Cardboard: { checked: false, value: '' },
          LightPlastic: { checked: false, value: '' },
          DensePlastic: { checked: false, value: '' },
          TextileWaste: { checked: false, value: '' },
          FoodWaste: { checked: false, value: '' },
          YardWaste: { checked: false, value: '' },
          Metals: { checked: false, value: '' },
          Glass: { checked: false, value: '' },
          Diapers: { checked: false, value: '' },
          AnimalDunk: { checked: false, value: '' },
          Wood: { checked: false, value: '' },
          Electronic: { checked: false, value: '' },
          Leather: { checked: false, value: '' },
          CDWaste: { checked: false, value: '' },
        }
      },
      Commercial: {
        checked: false,
        subcategories: {
          Paper: { checked: false, value: '' },
          Cardboard: { checked: false, value: '' },
          LightPlastic: { checked: false, value: '' },
          DensePlastic: { checked: false, value: '' },
          TextileWaste: { checked: false, value: '' },
          FoodWaste: { checked: false, value: '' },
          YardWaste: { checked: false, value: '' },
          Metals: { checked: false, value: '' },
          Glass: { checked: false, value: '' },
          Diapers: { checked: false, value: '' },
          AnimalDunk: { checked: false, value: '' },
          Wood: { checked: false, value: '' },
          Electronic: { checked: false, value: '' },
          Leather: { checked: false, value: '' },
          CDWaste: { checked: false, value: '' },
        }
      },
      Industrial: {
        checked: false,
        subcategories: {
          Paper: { checked: false, value: '' },
          Cardboard: { checked: false, value: '' },
          LightPlastic: { checked: false, value: '' },
          DensePlastic: { checked: false, value: '' },
          TextileWaste: { checked: false, value: '' },
          FoodWaste: { checked: false, value: '' },
          YardWaste: { checked: false, value: '' },
          Metals: { checked: false, value: '' },
          Glass: { checked: false, value: '' },
          Diapers: { checked: false, value: '' },
          AnimalDunk: { checked: false, value: '' },
          Wood: { checked: false, value: '' },
          Electronic: { checked: false, value: '' },
          Leather: { checked: false, value: '' },
          CDWaste: { checked: false, value: '' },
        }
      },
      Hazardous: {
        checked: false,
        subcategories: {
          Needles: { checked: false, value: '' },
          Syringes: { checked: false, value: '' },
          Scalpels: { checked: false, value: '' },
          InfusionSets: { checked: false, value: '' },
          SawsKnives: { checked: false, value: '' },
          Blades: { checked: false, value: '' },
          Chemicals: { checked: false, value: '' },
        }
      }
    },
  });

  useEffect(() => {
    const googleMapsScript = document.createElement('script');

    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA&libraries=drawing,geometry`;
    window.document.head.appendChild(googleMapsScript);

    googleMapsScript.addEventListener('load', () => {
      if (mapContainerRef.current) {
        const map = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: 31.5204, lng: 74.3587 },
          zoom: 12,
          mapTypeId: 'satellite' as google.maps.MapTypeId,
          // styles: Styles,
        });

        mapRef.current = map;

        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon' as google.maps.drawing.OverlayType],
          },
          polygonOptions: {
            editable: false,
            draggable: false,
          },
        });

        drawingManagerRef.current = drawingManager;
        drawingManager.setMap(map);

        window.google.maps.event.addListener(
          drawingManager,
          'overlaycomplete',
          (event: google.maps.drawing.OverlayCompleteEvent) => {
            if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
              const polygon = event.overlay as google.maps.Polygon;
              calculateArea(polygon);

              drawingManager.setOptions({
                drawingMode: null,
                drawingControl: false,
              });

              polygon.setOptions({
                editable: false,
                draggable: false,
              });

              setIsPolygonDrawn(true);

              window.google.maps.event.addListener(polygon, 'click', () => {
                setSelectedPolygon(polygon);
              });

              window.google.maps.event.addListener(polygon.getPath(), 'set_at', () => calculateArea(polygon));
              window.google.maps.event.addListener(polygon.getPath(), 'insert_at', () => calculateArea(polygon));
            }
          }
        );
      }
    });

    function calculateArea(polygon: google.maps.Polygon) {
      const area = window.google.maps.geometry.spherical.computeArea(polygon.getPath());
      setRoundedArea(Math.round(area * 100) / 100);
    }

    // Cleanup function
    return () => {
      googleMapsScript.removeEventListener('load', () => { });
      window.document.head.removeChild(googleMapsScript);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category: keyof FormData['wasteCategories']) => {
    setFormData(prev => ({
      ...prev,
      wasteCategories: {
        ...prev.wasteCategories,
        [category]: {
          ...prev.wasteCategories[category],
          checked: !prev.wasteCategories[category].checked
        }
      }
    }));
  };

  const handleSubcategoryChange = (
    category: keyof FormData['wasteCategories'],
    subcategory: string,
    field: keyof Subcategory,
    value: boolean | string
  ) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (field === 'checked') {
        newData.wasteCategories[category].subcategories[subcategory].checked = value as boolean;
      } else {
        newData.wasteCategories[category].subcategories[subcategory].value = value as string;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (!user) {
      alert('You must be logged in to submit data');
      return;
    }

    if (!isPolygonDrawn) {
      alert('Please draw a polygon on the map before submitting');
      return;
    }

    try {
      const polygonPath = selectedPolygon?.getPath().getArray().map(latLng => ({
        lat: latLng.lat(),
        lng: latLng.lng()
      }));

      const dataToSave = {
        ...formData,
        area: roundedArea,
        polygonPath,
        createdAt: new Date(),
        createdBy: user.uid
      };

      // Create a document with UC name as ID
      await setDoc(doc(db, "wasteData", formData.ucName), dataToSave);
      alert('Data saved successfully!');

      // Reset form and map
      setFormData({
        ucName: '',
        population: '',
        households: '',
        incomeGroup: '',
        wasteCategories: {
          Residential: {
            checked: false,
            subcategories: {
              Paper: { checked: false, value: '' },
              Cardboard: { checked: false, value: '' },
              LightPlastic: { checked: false, value: '' },
              DensePlastic: { checked: false, value: '' },
              TextileWaste: { checked: false, value: '' },
              FoodWaste: { checked: false, value: '' },
              YardWaste: { checked: false, value: '' },
              Metals: { checked: false, value: '' },
              Glass: { checked: false, value: '' },
              Diapers: { checked: false, value: '' },
              AnimalDunk: { checked: false, value: '' },
              Wood: { checked: false, value: '' },
              Electronic: { checked: false, value: '' },
              Leather: { checked: false, value: '' },
              CDWaste: { checked: false, value: '' },
            }
          },
          Commercial: {
            checked: false,
            subcategories: {
              Paper: { checked: false, value: '' },
              Cardboard: { checked: false, value: '' },
              LightPlastic: { checked: false, value: '' },
              DensePlastic: { checked: false, value: '' },
              TextileWaste: { checked: false, value: '' },
              FoodWaste: { checked: false, value: '' },
              YardWaste: { checked: false, value: '' },
              Metals: { checked: false, value: '' },
              Glass: { checked: false, value: '' },
              Diapers: { checked: false, value: '' },
              AnimalDunk: { checked: false, value: '' },
              Wood: { checked: false, value: '' },
              Electronic: { checked: false, value: '' },
              Leather: { checked: false, value: '' },
              CDWaste: { checked: false, value: '' },
            }
          },
          Industrial: {
            checked: false,
            subcategories: {
              Paper: { checked: false, value: '' },
              Cardboard: { checked: false, value: '' },
              LightPlastic: { checked: false, value: '' },
              DensePlastic: { checked: false, value: '' },
              TextileWaste: { checked: false, value: '' },
              FoodWaste: { checked: false, value: '' },
              YardWaste: { checked: false, value: '' },
              Metals: { checked: false, value: '' },
              Glass: { checked: false, value: '' },
              Diapers: { checked: false, value: '' },
              AnimalDunk: { checked: false, value: '' },
              Wood: { checked: false, value: '' },
              Electronic: { checked: false, value: '' },
              Leather: { checked: false, value: '' },
              CDWaste: { checked: false, value: '' },
            }
          },
          Hazardous: {
            checked: false,
            subcategories: {
              Needles: { checked: false, value: '' },
              Syringes: { checked: false, value: '' },
              Scalpels: { checked: false, value: '' },
              InfusionSets: { checked: false, value: '' },
              SawsKnives: { checked: false, value: '' },
              Blades: { checked: false, value: '' },
              Chemicals: { checked: false, value: '' },
            }
          }
        },
      });

      if (selectedPolygon) {
        selectedPolygon.setMap(null);
      }
      setRoundedArea(undefined);
      setIsPolygonDrawn(false);
      setSelectedPolygon(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  return (
    <div className='h-[calc(100vh-85px)] flex relative'>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ flex: 1, height: '100%' }} />

      {/* {roundedArea && (
        <p style={paragraphStyle}>
          <strong>Area:</strong> {roundedArea} square meters
        </p>
      )} */}

      <div
        className="calculation-box"
        style={{
          height: 100,
          width: 150,
          position: 'absolute',
          bottom: 40,
          left: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 15,
          textAlign: 'center',
        }}
      >
        <p style={paragraphStyle}>Click the map to draw a polygon.</p>
        <div id="calculated-area">
          {roundedArea && (
            <>
              <p style={paragraphStyle}>
                <strong>{roundedArea}</strong>
              </p>
              <p style={paragraphStyle}>square meters</p>
            </>
          )}
        </div>
      </div>


      {/* Form Container */}
      {selectedPolygon && (
        < div style={{ width: '350px', padding: '20px', overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
          <h2 style={{ marginTop: 0 }}>Waste Management Data</h2>


          <form onSubmit={handleSubmit}>
            <label style={formLabelStyle}>UC Name:</label>
            <input
              type="text"
              name="ucName"
              value={formData.ucName}
              onChange={handleInputChange}
              style={{ ...inputStyle } as React.CSSProperties}
              required
            />

            <label style={formLabelStyle}>Population:</label>
            <input
              type="number"
              name="population"
              value={formData.population}
              onChange={handleInputChange}
              style={{ ...inputStyle } as React.CSSProperties}
              required
            />

            <label style={formLabelStyle}>Households:</label>
            <input
              type="number"
              name="households"
              value={formData.households}
              onChange={handleInputChange}
              style={{ ...inputStyle } as React.CSSProperties}
              required
            />

            <label style={formLabelStyle}>Income Group:</label>
            <select
              name="incomeGroup"
              value={formData.incomeGroup}
              onChange={handleInputChange}
              style={selectStyle}
              required
            >
              <option value="">Select Income Group</option>
              <option value="Low">Low</option>
              <option value="Middle">Middle</option>
              <option value="High">High</option>
            </select>

            <h3>Waste Categories</h3>

            {Object.entries(formData.wasteCategories).map(([category, categoryData]) => (
              <div key={category}>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryData.checked}
                    onChange={() => handleCategoryChange(category as keyof FormData['wasteCategories'])}
                    style={checkboxStyle}
                  />
                  {category}
                </label>

                {categoryData.checked && (
                  <div style={{ marginLeft: '20px', marginBottom: '15px' }}>
                    {Object.entries(categoryData.subcategories).map(([subcategory, subcategoryData]) => (
                      <div key={subcategory} style={{ marginBottom: '5px' }}>
                        <label>
                          <input
                            type="checkbox"
                            checked={subcategoryData.checked}
                            onChange={() => handleSubcategoryChange(
                              category as keyof FormData['wasteCategories'],
                              subcategory,
                              'checked',
                              !subcategoryData.checked
                            )}
                            style={checkboxStyle}
                          />
                          {subcategory}
                        </label>

                        {subcategoryData.checked && (
                          <input
                            type="number"
                            placeholder="Amount (kg)"
                            value={subcategoryData.value}
                            onChange={(e) => handleSubcategoryChange(
                              category as keyof FormData['wasteCategories'],
                              subcategory,
                              'value',
                              e.target.value
                            )}
                            style={{ ...inputStyle, width: '80%', margin: '5px 0 5px 20px' } as React.CSSProperties}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button type="submit" style={submitButtonStyle}>
              Submit Data
            </button>
          </form>
        </div>
      )
      }
    </div >
  );
};

export default AddData;