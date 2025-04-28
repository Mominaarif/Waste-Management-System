import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  ChangeEvent,
} from "react";
import {
  GoogleMap,
  LoadScript,
  Polygon,
  InfoWindow,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import Userdef from "./Modals/Userdef";
import { getAuth, User } from "firebase/auth";

ChartJS.register(ArcElement, Tooltip, Legend);

interface LatLng {
  lat: number;
  lng: number;
}

interface WasteCategory {
  [key: string]: number;
}

interface WasteCategories {
  residential: WasteCategory;
  commercial: WasteCategory;
  industrial: WasteCategory;
  hazardous: WasteCategory;
}

interface PolygonData {
  id: number;
  name: string;
  paths: LatLng[];
  wasteCategories: WasteCategories;
  options: google.maps.PolygonOptions;
  position?: LatLng; // Add this line
}

const containerStyle: React.CSSProperties = {
  width: "100%",
  height: "calc(100vh - 85px)",
  position: "fixed",
  top: "0",
  zIndex: 1,
  boxSizing: "border-box",
};

const libraries: ("drawing" | "geometry" | "places")[] = [
  "drawing",
  "geometry",
  "places",
];
const center: LatLng = { lat: 30.3, lng: 67.3 };

interface SubCategory {
  id: string;
  name: string;
  value: string;
}

declare global {
  interface Window {
    initMap?: () => void;
  }
}

interface MainCategory {
  id: string;
  name: string;
  isDone: boolean;
}
interface FormData {
  ucName: string;
  population: string;
  households: string;
  incomeGroup: string;
  growthRate: string;
  forecast: string;
  generationRate: string;
  area: string;
  //   wasteCategories: {
  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  selectedSubcategories: Array<{
    mainCategoryId: string;
    subCategoryId: string;
    subCategory: SubCategory;
  }>;
  selectedOtherSubcategories: string[];
}
interface GeneateMap1Props {
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  fPopulation: string;
  fForecast: string;
  fGrowthRate: string;
  fGenerationRate: string;
  fSubCategories: SubCategory[];
  newSubCatName: string;
  setNewSubCatName: React.Dispatch<React.SetStateAction<string>>;
  newSubCatValue: string;
  setNewSubCatValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddSubCategory: () => void;
  isPolygonDrawn: boolean;
}

const GeneateMap1 = ({}) => {
  const [viewType, setViewType] = useState<
    "district" | "unionCouncil" | "province"
  >("district");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "residential"
  );

  const [roundedArea, setRoundedArea] = useState<number | undefined>();
  const [
    existingPolygon,
    setExistingPolygon,
  ] = useState<google.maps.Polygon | null>(null);

  const navigate = useNavigate();

  // const [roundedArea, setRoundedArea] = useState<number | undefined>();
  const [adminBoundaries, setAdminBoundaries] = useState<PolygonData[]>([]);
  const [selectedBoundary, setSelectedBoundary] = useState<PolygonData | null>(
    null
  );

  const [dataOption, setDataOption] = useState<number | undefined>();

  const [isPolygonDrawn, setIsPolygonDrawn] = React.useState<boolean>(false);
  const [
    selectedPolygon,
    setSelectedPolygon,
  ] = React.useState<google.maps.Polygon | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );
  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  // Load administrative boundaries
  useEffect(() => {
    const loadAdminBoundaries = async () => {
      try {
        const url = getGeoJsonUrl();
        const response = await fetch(url);
        const data = await response.json();

        const boundaries = data.features.map((feature: any, index: number) => ({
          id: index,
          name: feature.properties.name || feature.properties.DISTRICT,
          paths: feature.geometry.coordinates[0]
            .filter((coord: any) => Array.isArray(coord) && coord.length === 2)
            .map((coord: [number, number]) => {
              const [lng, lat] = coord;
              return {
                lat: parseFloat(lat as any),
                lng: parseFloat(lng as any),
              };
            }),
          wasteCategories: generateWasteCategories(),
          options: {
            strokeColor: "#0f6175",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#ada5a5",
            fillOpacity: 0.35,
          },
        }));

        setAdminBoundaries(boundaries);
      } catch (error) {
        console.error("Error loading administrative boundaries:", error);
      }
    };

    loadAdminBoundaries();
  }, [viewType]);

  const getGeoJsonUrl = () => {
    switch (viewType) {
      case "unionCouncil":
        return "/Union_Council_VF.json";
      case "province":
        return "/Provinces_VF.json";
      default:
        return "/District_Boundary.json";
    }
  };

  const generateWasteCategories = (): WasteCategories => ({
    residential: generateRandomWaste(),
    commercial: generateRandomWaste(),
    industrial: generateRandomWaste(),
    hazardous: generateRandomWaste(),
  });

  const generateRandomWaste = (): WasteCategory => ({
    paper: Math.floor(Math.random() * 500) + 50,
    cardboard: Math.floor(Math.random() * 300) + 30,
    plastic: Math.floor(Math.random() * 200) + 20,
    metal: Math.floor(Math.random() * 100) + 10,
    organic: Math.floor(Math.random() * 600) + 60,
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    initializeDrawingManager(map);
  }, []);

  const initializeDrawingManager = (map: google.maps.Map) => {
    // Remove existing DrawingManager if already present
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setMap(null);
      google.maps.event.clearInstanceListeners(drawingManagerRef.current);
    }

    // Create new DrawingManager
    const manager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: false,
        draggable: false,
        fillColor: "#000",
        fillOpacity: 0.2,
        strokeColor: "#000",
        strokeWeight: 1,
      },
    });

    manager.setMap(map);
    drawingManagerRef.current = manager;

    // Handle drawing complete

    window.google.maps.event.addListener(
      manager,
      "overlaycomplete",
      (event: google.maps.drawing.OverlayCompleteEvent) => {
        if (event.type === window.google.maps.drawing.OverlayType.POLYGON) {
          const polygon = event.overlay as google.maps.Polygon;
          calculateArea(polygon);

          manager.setOptions({
            drawingMode: null,
            drawingControl: false,
          });

          polygon.setOptions({
            editable: false,
            draggable: false,
          });

          setIsPolygonDrawn(true);

          window.google.maps.event.addListener(polygon, "click", () => {
            setSelectedPolygon(polygon);
            // const modal = document.getElementById(
            //   "my_modal_2"
            // ) as HTMLDialogElement | null;
            // if (modal) {
            //   modal.showModal();
            // }
          });

          window.google.maps.event.addListener(
            polygon.getPath(),
            "set_at",
            () => calculateArea(polygon)
          );
          window.google.maps.event.addListener(
            polygon.getPath(),
            "insert_at",
            () => calculateArea(polygon)
          );
        }
      }
    );
  };

  const calculateArea = (polygon: google.maps.Polygon) => {
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    setRoundedArea(Math.round(area * 100) / 100);
  };

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places?.[0]?.geometry?.location) {
      mapRef.current?.panTo(places[0].geometry.location);
      mapRef.current?.setZoom(14);
    }
  };

  const handleBoundaryClick = (
    boundary: PolygonData,
    event: google.maps.MapMouseEvent
  ) => {
    setSelectedBoundary({
      ...boundary,
      position: event.latLng?.toJSON() || { lat: 0, lng: 0 },
    });
  };

  const handleDataOptionChange = () => {
    const selectedOption = (document.querySelector(
      'input[name="dataDef"]:checked'
    ) as HTMLInputElement).value;
    setDataOption(Number(selectedOption));
  };

  useEffect(() => {
    if (dataOption === 0) {
      //   DefaultDataValues();
      alert("Proceeded to default data");
    } else if (dataOption === 1) {
      const modal = document.getElementById(
        "my_modal_3"
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }

      const modal1 = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      if (modal1) {
        modal1.close();
      }
    }
  }, [dataOption]);

  const [formData, setFormData] = useState<FormData>({
    ucName: "",
    households: "",
    incomeGroup: "",
    population: "",
    growthRate: "",
    forecast: "",
    generationRate: "",
    area: "",
    mainCategories: [
      { id: "biodegradables", name: "Biodegradables", isDone: false },
      { id: "combustibles", name: "Combustibles", isDone: false },
      { id: "recyclables", name: "Recyclables", isDone: false },
      { id: "residues", name: "Residues", isDone: false },
    ],
    subCategories: [],
    selectedSubcategories: [],
    selectedOtherSubcategories: [],
  });

  const getRemainingSubcategories = () => {
    const allSelected = [
      ...formData.selectedSubcategories,
      ...formData.selectedOtherSubcategories.map((id) => ({
        subCategoryId: id,
      })),
    ];
    const selectedIds = new Set(allSelected.map((item) => item.subCategoryId));
    return formData.subCategories.filter((sc) => !selectedIds.has(sc.id));
  };

  const firstThreeDone = formData.mainCategories
    .slice(0, 3)
    .every((mc) => mc.isDone);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    if (!user) {
      alert("You must be logged in to submit data");
      return;
    }

    if (!isPolygonDrawn) {
      alert("Please draw a polygon on the map before submitting--");
      return;
    }

    try {
      const polygonPath = selectedPolygon
        ?.getPath()
        .getArray()
        .map((latLng) => ({
          lat: latLng.lat(),
          lng: latLng.lng(),
        }));

      const dataToSave = {
        ...formData,
        area: roundedArea,
        polygonPath,
        createdAt: new Date(),
        createdBy: user.uid,
      };
      console.log(dataToSave);

      setRoundedArea(0);
      setFormData({
        ucName: "",
        population: "",
        households: "",
        incomeGroup: "",
        growthRate: "",
        forecast: "",
        generationRate: "",
        area: "",
        mainCategories: [
          { id: "biodegradables", name: "Biodegradables", isDone: false },
          { id: "combustibles", name: "Combustibles", isDone: false },
          { id: "recyclables", name: "Recyclables", isDone: false },
          { id: "residues", name: "Residues", isDone: false },
        ],
        subCategories: [],
        selectedSubcategories: [],
        selectedOtherSubcategories: [],
      });

      if (selectedPolygon) {
        selectedPolygon.setMap(null);
      }
      setRoundedArea(undefined);
      setIsPolygonDrawn(false);
      setSelectedPolygon(null);

      navi();
      
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data");
    }
  };

  useEffect(() => {
    if (firstThreeDone) {
      const remaining = getRemainingSubcategories();
      setFormData((prev) => {
        const newIds = remaining
          .map((sub) => sub.id)
          .filter((id) => !prev.selectedOtherSubcategories.includes(id));

        return {
          ...prev,
          selectedOtherSubcategories: [
            ...prev.selectedOtherSubcategories,
            ...newIds,
          ],
        };
      });
    }
  }, [firstThreeDone]);

  const [newSubCatName, setNewSubCatName] = useState("");
  const [newSubCatValue, setNewSubCatValue] = useState("");

  const handleAddSubCategory = () => {
    if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

    const newSubCategory = {
      id: `s${formData.subCategories.length + 1}`,
      name: newSubCatName.trim(),
      value: newSubCatValue.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, newSubCategory],
    }));

    setNewSubCatName("");
    setNewSubCatValue("");
  };

  const navi = () => {
    alert("Data submitted successfully!" + formData.population);
    navigate("/waste-categories", { state: formData });

  };
  console.log(formData.subCategories[0])
  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box rounded-none h-[100vh] max-w-[100vw] w-[100vw]">
    <div className="relative">
      <LoadScript
        googleMapsApiKey="AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"
        libraries={libraries}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={8}
          onLoad={onLoad}
        >
          {/* Search Box */}
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlacesChanged}
          >
            <input
              type="text"
              placeholder="Search location..."
              style={{
                boxSizing: "border-box",
                width: "240px",
                height: "40px",
                marginTop: "10px",
                padding: "0 12px",
                borderRadius: "3px",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                top: "50px",
              }}
            />
          </StandaloneSearchBox>

          {/* Controls */}
          <div
            style={{
              position: "absolute",
              top: "60px",
              left: "10px",
              zIndex: 1,
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "5px",
              display: "flex",
              gap: "10px",
            }}
          >
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as any)}
            >
              <option value="district">District</option>
              <option value="unionCouncil">Union Council</option>
              <option value="province">Province</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="hazardous">Hazardous</option>
            </select>
          </div>

          {/* Administrative Boundaries */}
          {adminBoundaries.map((boundary) => (
            <Polygon
              key={boundary.id}
              paths={boundary.paths}
              options={boundary.options}
              onClick={(e) => handleBoundaryClick(boundary, e)}
            />
          ))}

          {/* Area Display & Draw Polygon */}
          <div
            className="calculation-box"
            style={{
              position: "absolute",
              bottom: 40,
              left: 10,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              padding: 15,
              textAlign: "center",
            }}
          >
            {selectedPolygon && typeof roundedArea === "number" ? (
              <>
                <p>
                  <strong>{roundedArea}</strong>
                </p>
                <p>square meters</p>
                <div className="flex flex-col gap-1 items-start">
                  <p className="text-sm font-bold text-gray-900 pb-1 text-left w-full">
                    Choose Data Source:
                  </p>
                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          id="defaultDef"
                          name="dataDef"
                          type="radio"
                          value={0}
                          onChange={handleDataOptionChange}
                          aria-describedby="defaultDef-description"
                          className="radio radio-xs radio-info border"
                        />
                      </div>
                    </div>
                    <div className="text-sm/6">
                      <label
                        htmlFor="defaultDef"
                        className="font-medium text-gray-900"
                      >
                        Default Data
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 shrink-0 items-center">
                      <div className="group grid size-4 grid-cols-1">
                        <input
                          id="userDef"
                          name="dataDef"
                          type="radio"
                          value={1}
                          onChange={handleDataOptionChange}
                          aria-describedby="defaultDef-description"
                          className="radio radio-xs radio-info border"
                        />
                      </div>
                    </div>
                    <div className="text-sm/6">
                      <label
                        htmlFor="userDef"
                        className="font-medium text-gray-900"
                      >
                        User Define Data
                      </label>
                    </div>
                  </div>
                </div>
              </>
            ) : typeof roundedArea === "number" ? (
              <>
                <p>
                  <strong>{roundedArea}</strong>
                </p>
                <p>square meters</p>
              </>
            ) : (
              <p>Click the map to draw a polygon.</p>
            )}
          </div>

          {/* Selected Boundary Info */}
          {selectedBoundary && (
            <InfoWindow
              position={selectedBoundary.position}
              onCloseClick={() => setSelectedBoundary(null)}
            >
              <div style={{ padding: "10px", minWidth: "250px" }}>
                <h3>{selectedBoundary.name}</h3>
                <h4>{selectedCategory} Waste</h4>
                <ul>
                  {Object.entries(
                    selectedBoundary.wasteCategories[
                      selectedCategory as keyof WasteCategories
                    ]
                  ).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value} kg
                    </li>
                  ))}
                </ul>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      <Userdef
        // handleSubmit={handleSubmit}
        // handleInputChange={handleInputChange}
        roundedArea={roundedArea}

        // fPopulation={fPopulation}
        // fForecast={fForecast}
        // fGrowthRate={fGrowthRate}
        // fGenerationRate={fGenerationRate}
        // fSubCategories={fSubCategories}

        // newSubCatName={newSubCatName}
        // setNewSubCatName={setNewSubCatName}
        // newSubCatValue={newSubCatValue}
        // setNewSubCatValue={setNewSubCatValue}
        // handleAddSubCategory={handleAddSubCategory}

        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        // isPolygonDrawn={isPolygonDrawn}
        fPopulation={formData.population}
        fForecast={formData.forecast}
        fGrowthRate={formData.growthRate}
        fGenerationRate={formData.generationRate}
        fSubCategories={formData.subCategories}
        newSubCatName={newSubCatName}
        setNewSubCatName={setNewSubCatName}
        newSubCatValue={newSubCatValue}
        setNewSubCatValue={setNewSubCatValue}
        handleAddSubCategory={handleAddSubCategory}
      />
    </div>
    </div>
    <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
    </dialog>
  );
};

export default GeneateMap1;
