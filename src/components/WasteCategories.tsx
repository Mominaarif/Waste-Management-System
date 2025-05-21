import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  useCallback,
  FormEvent,
} from "react";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import { getAuth, User } from "firebase/auth";
import GeneateMap1 from "./Map1";
import Userdef from "./Modals/Userdef";
import { useLocation, useNavigate } from "react-router-dom";
import { CardTitle } from "./ui/card";
import { Bar } from "react-chartjs-2";

declare global {
  interface Window {
    initMap?: () => void;
  }
}

interface SubCategory {
  id: string;
  name: string;
  value: string;
}

interface RecoveryData {
  recoveryDataBiodegradables: Array<{
    name: string;
    value: number;
    recovered: number;
  }>;
  recoveryDataCombustibles: Array<{
    name: string;
    value: number;
    recovered: number;
  }>;
  recoveryDataRecyclables: Array<{
    name: string;
    value: number;
    recovered: number;
  }>;
  recoveryDataResidues: Array<{
    name: string;
    value: number;
    recovered: number;
  }>;
}

interface MainCategory {
  id: string;
  name: string;
  isDone: boolean;
}

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
// interface WasteCategory {
//   checked: boolean;
//   subcategories: {
//     [key: string]: Subcategory;
//   };
// }

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
  selectedOtherSubcategories: Array<{
    mainCategoryId: string;
    subCategoryId: string;
    subCategory: SubCategory;
  }>;
}

const containerStyle = {
  width: "calc(100% + (350px))",
  height: "60vh",
  top: "0",
  left: "-180px",
  // border: "2px solid #73AD21",
  zIndex: 1,
  boxSizing: "border-box",
};

const paragraphStyle = {
  fontFamily: "Open Sans",
  margin: 0,
  fontSize: 13,
};

const formLabelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 15px 0",
  display: "inline-block",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 15px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const checkboxStyle = {
  marginRight: "10px",
};

const submitButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  width: "100%",
  fontSize: "16px",
};

export default function WasteCategories(open: any) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );

  // const formData = location.state;
  // const [dataOption, setDataOption] =  useState<number | undefined>();

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

  // const handleDataOptionChange = () => {
  //   const selectedOption = (document.querySelector(
  //     'input[name="dataDef"]:checked'
  //   ) as HTMLInputElement).value;
  //   setDataOption(Number(selectedOption));
  // };
  const firstThreeDone = formData.mainCategories
    .slice(0, 3)
    .every((mc: any) => mc.isDone);

  const handleCompleteCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      mainCategories: prev.mainCategories.map((mc) =>
        mc.id === categoryId ? { ...mc, isDone: true } : mc
      ),
    }));
  };
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

  const [idValue, setIdValue] = useState("");
  const [IDValue, setIDValue] = useState("");

  const getId = () => {
    const id = Math.random()
      .toString(36)
      .substring(2, 9);
    return id;
  };

  useEffect(() => {
    setIdValue(getId());
  }, []);
  useEffect(() => {
    console.log(idValue + formData.ucName);
    setIDValue(idValue + formData.ucName);
  }, [formData.ucName]);
  console.log(IDValue);

  useEffect(() => {
    if (firstThreeDone) {
      const residuesCategory = formData.mainCategories[3]; // 4th item
      if (!residuesCategory) return;

      const selectedIds = new Set([
        ...formData.selectedSubcategories.map((s: any) => s.subCategoryId),
        ...formData.selectedOtherSubcategories.map((s: any) => s.subCategoryId),
      ]);

      const remaining = formData.subCategories.filter(
        (sub: any) => !selectedIds.has(sub.id)
      );

      const newOtherSubcategories = remaining.map((sub: any) => ({
        mainCategoryId: residuesCategory.id, // hard-coded to 4th category
        subCategoryId: sub.id,
        subCategory: {
          id: sub.id,
          name: sub.name,
          value: sub.value,
        },
      }));

      setFormData((prev: any) => ({
        ...prev,
        selectedOtherSubcategories: [
          ...prev.selectedOtherSubcategories,
          ...newOtherSubcategories,
        ],
      }));
    }
  }, [firstThreeDone]);

  console.log(formData.selectedOtherSubcategories);

  const [newSubCatName, setNewSubCatName] = useState("");
  const [newSubCatValue, setNewSubCatValue] = useState("");
  const [subCatError, setSubCatError] = useState("");
  const [totalSubCatValue, setTotalSubCatValue] = useState(0);

  //   const handleAddSubCategory = () => {
  //     if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

  //     const totalWasteGenerated = formData.subCategories.reduce((sum, subCat) => {
  //       let percentage;// Ensure it's a number
  //       if (parseFloat(subCat.value) === 0) {
  //         percentage = newSubCatValue.trim() === "0" ? 0 : parseFloat(newSubCatValue);
  //       }
  //       else {
  //         percentage = parseFloat(subCat.value);
  //       }
  //       return sum + percentage;

  //     }, 0);
  // const newSubCategory = {
  //       id: `s${formData.subCategories.length + 1}`,
  //       name: newSubCatName.trim(),
  //       value: newSubCatValue.trim(),
  //     };
  //     // let newSubCategory:any;
  //     if (totalWasteGenerated + parseFloat(newSubCatValue) > 100) {
  //       setSubCatError("Total waste generated cannot exceed 100%");
  //       return;
  //     } else {
  //       setSubCatError("");

  //     }

  //     setFormData((prev) => ({
  //       ...prev,
  //       subCategories: [...prev.subCategories, newSubCategory],
  //     }));

  //     // Clear inputs
  //     setNewSubCatName("");
  //     setNewSubCatValue("");
  //     console.log("sum", totalWasteGenerated);
  //   };

  const handleAddSubCategory = () => {
    if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

    const parsedNewValue = parseFloat(newSubCatValue.trim());

    if (isNaN(parsedNewValue)) {
      setSubCatError("Please enter a valid number.");
      return;
    }

    const totalWasteGenerated = formData.subCategories.reduce((sum, subCat) => {
      const percentage = parseFloat(subCat.value) || 0;
      return sum + percentage;
    }, 0);

    if (totalWasteGenerated + parsedNewValue > 100) {
      setSubCatError("Total waste generated cannot exceed 100%");
      return;
    } else {
      setSubCatError("");
    }

    const newSubCategory = {
      id: `s${formData.subCategories.length + 1}`,
      name: newSubCatName.trim(),
      value: newSubCatValue.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, newSubCategory],
    }));

    // 🟢 Update total value state
    setTotalSubCatValue(totalWasteGenerated + parsedNewValue);

    // Clear inputs
    setNewSubCatName("");
    setNewSubCatValue("");
  };

  const isSubCategoryTotalValid = () => {
    const total = formData.subCategories.reduce((sum, sub) => {
      const num = parseFloat(sub.value);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    return total === 100;
  };

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
  const [toast, setToast] = useState<{ message: string; type: string }>({
    message: "",
    type: "",
  });
  // const [roundedArea, setRoundedArea] =  useState<number | undefined>();
  const [adminBoundaries, setAdminBoundaries] = useState<PolygonData[]>([]);
  const [selectedBoundary, setSelectedBoundary] = useState<PolygonData | null>(
    null
  );

  const [dataOption, setDataOption] = useState<number | undefined>();

  const [isPolygonDrawn, setIsPolygonDrawn] = useState<boolean>(false);
  const [
    selectedPolygon,
    setSelectedPolygon,
  ] = useState<google.maps.Polygon | null>(null);

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
          setSelectedPolygon(polygon);
          // window.google.maps.event.addListener(polygon, "click", () => {
          //   setSelectedPolygon(polygon);
          // });

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

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places?.[0]?.geometry?.location) {
      mapRef.current?.panTo(places[0].geometry.location);
      mapRef.current?.setZoom(14);
    }
  };

  const calculateArea = (polygon: google.maps.Polygon) => {
    const area = google.maps.geometry.spherical.computeArea(polygon.getPath());
    const roundedArea = Math.round(area * 100) / 100;

    console.log("Area (m²):", roundedArea);
    setRoundedArea(roundedArea);
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
      // alert("Proceeded to default data");
    } else if (dataOption === 1) {
      const modal = document.getElementById(
        "my_modal_3"
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.showModal();
      }
    }
  }, [dataOption]);

  useEffect(() => {
    if (isPolygonDrawn) {
      const modal = document.getElementById(
        "my_modal_1"
      ) as HTMLDialogElement | null;
      if (modal) {
        modal.close();
      }
    }
  }, [isPolygonDrawn]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const auth = getAuth();
    const user: User | null = auth.currentUser;

    // const user = auth.currentUser;
    console.log("User:", user);

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
      if (!polygonPath || polygonPath.length === 0) {
        console.error("Polygon path is missing.");
        // setError("Please draw a polygon before saving.");
        return;
      }

      const dataToSave = {
        ...formData,
        area: roundedArea,
        polygonPath: polygonPath, // must be a valid array, not undefined

        createdAt: new Date(),
        createdBy: user.uid,
      };
      console.log(dataToSave);

      calculate();
      calculate1();
      // storeData();

      // Create a document with UC name as ID
      await setDoc(doc(db, "wasteData", IDValue), dataToSave);
      setToast({ message: "Data Saved Successfully", type: "success" });
      calculateOutputs();
      alert("Data saved successfully!");

      // setRoundedArea(0);
      // setFormData({
      //   ucName: "",
      //   population: "",
      //   households: "",
      //   incomeGroup: "",
      //   growthRate: "",
      //   forecast: "",
      //   generationRate: "",
      //   area: "",
      //   mainCategories: [
      //     { id: "biodegradables", name: "Biodegradables", isDone: false },
      //     { id: "combustibles", name: "Combustibles", isDone: false },
      //     { id: "recyclables", name: "Recyclables", isDone: false },
      //     { id: "residues", name: "Residues", isDone: false },
      //   ],
      //   subCategories: [],
      //   selectedSubcategories: [],
      //   selectedOtherSubcategories: [],
      // });

      // if (selectedPolygon) {
      //   selectedPolygon.setMap(null);
      // }
      // setRoundedArea(undefined);
      // setIsPolygonDrawn(false);
      // setSelectedPolygon(null);

      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
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
      alert("Failed to save data");
    }
  };
  const [totalWasteInput, setTotalWasteInput] = useState<number>(); // in kg/day

  const [totalBioAll, setTotalBioAll] = useState<any>();
  const [totalCombustAll, setTotalCombustAll] = useState<any>();
  const [totalRecucleAll, setTotalRecucleAll] = useState<any>();
  const [totalResidueAll, setTotalResidueAll] = useState<any>();

  useEffect(() => {
    const totalSubCatValue = formData.selectedSubcategories.reduce(
      (sum, subCat) => {
        const val = parseFloat(subCat?.subCategory?.value || "0");
        return sum + (isNaN(val) ? 0 : val);
      },
      0
    );
    const totalSubCatValue1 = formData.selectedOtherSubcategories.reduce(
      (sum, subCat: any) => {
        const val = parseFloat(subCat?.subCategory?.value || "0");
        return sum + (isNaN(val) ? 0 : val);
      },
      0
    );

    setTotalWasteInput(totalSubCatValue + totalSubCatValue1);
  }, [formData.selectedSubcategories, formData.selectedOtherSubcategories]);

  const storeData = () => {
    localStorage.setItem(
      "formData",
      JSON.stringify({
        selectedSubcategories: formData.selectedSubcategories,
        selectedOtherSubcategories: formData.selectedOtherSubcategories,
      })
    );
  };
  console.log(totalWasteInput);
  // console.log(formData.selectedOtherSubcategories);

  const calculate = () => {
    const totalWaste =
      parseFloat(formData.population) * parseFloat(formData.generationRate);

    if (totalWasteInput === 0 || isNaN(totalWaste)) {
      console.warn("Invalid input: Cannot calculate waste");
      return;
    }

    const componentWasteData = formData.selectedSubcategories.map((subCat) => {
      const percentage = parseFloat(subCat?.subCategory?.value || "0");
      const componentWaste = totalWaste * (percentage / (totalWasteInput ?? 1));

      return {
        name: subCat?.subCategory?.name || "Unknown",
        percentage: percentage.toFixed(2),
        waste: componentWaste.toFixed(2),
        mainCategoryId: subCat?.mainCategoryId || "unknown",
      };
    });

    console.log(componentWasteData);

    // Save to localStorage
    localStorage.setItem(
      "componentWasteData",
      JSON.stringify(componentWasteData)
    );
  };

  const calculate1 = () => {
    const totalWaste =
      parseFloat(formData.population) * parseFloat(formData.generationRate);

    if (totalWasteInput === 0 || isNaN(totalWaste)) {
      console.warn("Invalid input: Cannot calculate waste");
      return;
    }

    const componentWasteData = formData.selectedOtherSubcategories.map(
      (subCat: any) => {
        const percentage = parseFloat(subCat?.subCategory?.value || "0");
        const componentWaste =
          totalWaste * (percentage / (totalWasteInput ?? 1));

        return {
          name: subCat?.subCategory?.name || "Unknown",
          percentage: percentage.toFixed(2),
          waste: componentWaste.toFixed(2),
          mainCategoryId: subCat?.mainCategoryId || "unknown",
        };
      }
    );

    console.log(componentWasteData);

    // Save to localStorage
    localStorage.setItem(
      "componentWasteDataOthers",
      JSON.stringify(componentWasteData)
    );
  };

  // const fetchWasteData = async () => {
  //   try {
  //     const querySnapshot = await getDocs(collection(db, "wasteData", IDValue));
  //     const wasteItems = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     console.log("Waste Data:", wasteItems);
  //     return wasteItems;
  //   } catch (error) {
  //     console.error("Error fetching waste data:", error);
  //   }
  // };

  // const [wasteData, setWasteData] = useState<
  //   { id: string; [key: string]: any }[]
  // >([]);
  // console.log(formData);
  // useEffect(() => {
  //   const getData = async () => {
  //     const data = await fetchWasteData();
  //     if (data) setWasteData(data);
  //   };
  //   getData();
  // }, []);

  // const [biodegradables, setBiodegradables] = useState([]);
  // const [combustibles, setCombustibles] = useState([]);
  // const [recyclables, setRecyclables] = useState([]);
  // const [residues, setResidues] = useState([]);

  // useEffect(() => {
  //   const stored = localStorage.getItem("componentWasteData");
  //   if (stored) {
  //     const parsed = JSON.parse(stored);
  //     const filtered = parsed.filter(
  //       (item: any) => item.mainCategoryId === "biodegradables"
  //     );
  //     setBiodegradables(filtered);

  //     const filteredCombustibles = parsed.filter(
  //       (item: any) => item.mainCategoryId === "combustibles"
  //     );
  //     setCombustibles(filteredCombustibles);

  //     const filteredRecyclables = parsed.filter(
  //       (item: any) => item.mainCategoryId === "recyclables"
  //     );
  //     setRecyclables(filteredRecyclables);
  //   }

  //   const stored1 = localStorage.getItem("componentWasteDataOthers");
  //   if (stored1) {
  //     const parsed = stored1 ? JSON.parse(stored1) : null;

  //     setResidues(parsed);
  //   }
  // }, []);

  // console.log("Data From DB: ", wasteData);
  const [results, setResults] = useState<RecoveryData>();

  const calculateOutputs = () => {
    // Constants
    const totalWaste =
      parseFloat(formData.population) * parseFloat(formData.generationRate);

    const totalSubCatValue = formData.selectedSubcategories.reduce(
      (sum, subCat) => {
        const val = parseFloat(subCat?.subCategory?.value || "0");
        return sum + (isNaN(val) ? 0 : val);
      },
      0
    );

    const totalSubCatValueOther = formData.selectedOtherSubcategories.reduce(
      (sum, subCat) => {
        const val = parseFloat(subCat?.subCategory?.value || "0");
        return sum + (isNaN(val) ? 0 : val);
      },
      0
    );

    if (totalWasteInput === 0 || isNaN(totalWaste)) {
      console.warn("Invalid input: Cannot calculate waste");
      return;
    }

    const filteredBiodegradables = formData.selectedSubcategories.filter(
      (item: any) => item.mainCategoryId === "biodegradables"
    );

    const recoveryDataBiodegradables = filteredBiodegradables.map(
      (subCat: any) => {
        const percentage = parseFloat(subCat?.subCategory?.value || "0");
        const componentWaste =
          totalWaste * (percentage / (totalWasteInput ?? 1));

        return {
          name: subCat?.subCategory?.name || "Unknown",
          value: componentWaste,
          recovered: percentage,
        };
      }
    );

    const filteredrecoveryDataCombustibles = formData.selectedSubcategories.filter(
      (item: any) => item.mainCategoryId === "combustibles"
    );

    const recoveryDataCombustibles = filteredrecoveryDataCombustibles.map(
      (subCat: any) => {
        const percentage = parseFloat(subCat?.subCategory?.value || "0");
        const componentWaste =
          totalWaste * (percentage / (totalWasteInput ?? 1));

        return {
          name: subCat?.subCategory?.name || "Unknown",
          value: componentWaste,
          recovered: percentage,
        };
      }
    );

    const filteredRecyclables = formData.selectedSubcategories.filter(
      (item: any) => item.mainCategoryId === "recyclables"
    );

    const recoveryDataRecyclables = filteredRecyclables.map((subCat: any) => {
      const percentage = parseFloat(subCat?.subCategory?.value || "0");
      const componentWaste = totalWaste * (percentage / (totalWasteInput ?? 1));

      return {
        name: subCat?.subCategory?.name || "Unknown",
        value: componentWaste,
        recovered: percentage,
      };
    });

    const recoveryDataResidues = formData.selectedOtherSubcategories.map(
      (subCat: any) => {
        const percentage = parseFloat(subCat?.subCategory?.value || "0");
        const componentWaste =
          totalWaste * (percentage / (totalWasteInput ?? 1));

        return {
          name: subCat?.subCategory?.name || "Unknown",
          value: componentWaste,
          recovered: percentage,
        };
      }
    );

    setResults({
      recoveryDataBiodegradables,
      recoveryDataCombustibles,
      recoveryDataRecyclables,
      recoveryDataResidues,
    });
  };

  const barRef = useRef<any>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.resize();
    }
  }, [open]);

  const wasteDataBiodegradables = results?.recoveryDataBiodegradables.map(
    (item) => ({
      name: item.name,
      value: item.value,
    })
  );

  const wasteDataCombustibles = results?.recoveryDataCombustibles.map(
    (item) => ({
      name: item.name,
      value: item.value,
    })
  );

  const wasteDataRecyclables = results?.recoveryDataRecyclables.map((item) => ({
    name: item.name,
    value: item.value,
  }));

  const wasteDataResidues = results?.recoveryDataResidues.map((item) => ({
    name: item.name,
    value: item.value,
  }));
  console.log(totalBioAll, totalCombustAll, totalRecucleAll, totalResidueAll);
  useEffect(() => {
    const Bio = results?.recoveryDataBiodegradables.reduce(
      (sum, subCat: any) => {
        const val = parseFloat(subCat?.value || "0");
        return sum + (isNaN(val) ? 0 : val) / 1000;
      },
      0
    );
    setTotalBioAll(Bio);

    const Combust = results?.recoveryDataCombustibles.reduce(
      (sum, subCat: any) => {
        const val = parseFloat(subCat?.value || "0");
        return sum + (isNaN(val) ? 0 : val) / 1000;
      },
      0
    );
    setTotalCombustAll(Combust);
    const Recycle = results?.recoveryDataRecyclables.reduce(
      (sum, subCat: any) => {
        const val = parseFloat(subCat?.value || "0");
        return sum + (isNaN(val) ? 0 : val) / 1000;
      },
      0
    );
    setTotalRecucleAll(Recycle);

    const Residues = results?.recoveryDataResidues.reduce(
      (sum, subCat: any) => {
        const val = parseFloat(subCat?.value || "0");
        return sum + (isNaN(val) ? 0 : val) / 1000;
      },
      0
    );
    setTotalResidueAll(Residues);
  }, [results?.recoveryDataBiodegradables]);

  const [wasteDataAll, setWasteDataAll] = useState({
    labels: [
      "Biodegradables Waste",
      "Combustibles Waste",
      "Recyclables Waste",
      "Residues Waste",
    ],
    datasets: [
      {
        label: "Waste by Type (Tons)",
        data: [totalBioAll, totalCombustAll, totalRecucleAll, totalResidueAll],
        backgroundColor: [
          "rgb(22, 163, 74)",
          "rgb(59, 130, 246)",
          "rgb(107, 114, 128)",
          "rgb(220, 38, 38)",
        ],
        borderRadius: 5,
        barThickness: 42,
        borderSkipped: false,
        showLabel: false,
      },
    ],
  });

  console.log( selectedPolygon
        ?.getPath()
        .getArray()
        .map((latLng) => ({
         
          lng: latLng.lng(),
           lat: latLng.lat(),
        })))
  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white pt-10 px-5 md:px-8">
      <form onSubmit={handleSubmit} className="">
        <div className="border p-8 rounded-md">
          <div className="w-full h-full flex flex-col py-5 gap-5 items-start">
            <p
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_1"
                ) as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                }
              }}
              className="bg-violet-700 text-sm not-last:cursor-pointer w-fit text-white px-8 py-2 mt-1 rounded-md shadow-xs hover:bg-violet-600"
            >
              Select The Area
            </p>
            <div className="flex flex-col gap-1 items-start">
              <p className="text-sm font-bold text-gray-900  pb-1 text-left w-full">
                Choose Data Source: {selectedBoundary?.name}
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
          </div>
          {formData.subCategories.length > 0 && (
            <div className="">
              <p className="text-sm font-bold text-gray-900  pb-1 text-left w-full mb-3">
                Main Categories:
              </p>

              <div className="grid grid-cols-2 gap-5">
                {formData.mainCategories.slice(0, 3).map((category: any) => (
                  <div key={category.id} className="border">
                    <div className="flex justify-between items-center bg-violet-700 text-white border-b px-5 py-3">
                      <h2 className="text-sm font-medium text-left w-full">
                        {category.name}
                      </h2>
                      {!category.isDone && (
                        <p
                          onClick={() => handleCompleteCategory(category.id)}
                          className="underline text-sm cursor-pointer w-fit"
                        >
                          Done
                        </p>
                      )}
                    </div>

                    {!category.isDone ? (
                      <div className="space-y-2">
                        <div className=" flex flex-col">
                          {formData.selectedSubcategories
                            .filter(
                              (ss: any) => ss.mainCategoryId === category.id
                            )
                            .map((ss: any) => {
                              const sub = formData.subCategories.find(
                                (sc) => sc.id === ss.subCategoryId
                              );
                              return sub ? (
                                <div
                                  key={sub.id}
                                  className="text-sm flex justify-between items-center border-b px-5 py-2 pl-6"
                                >
                                  {sub.name}
                                  <p
                                    className="text-xs text-red-500 w-[33px]"
                                    onClick={() =>
                                      setTimeout(() => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          selectedSubcategories: prev.selectedSubcategories.filter(
                                            (s) => s.subCategoryId !== sub.id
                                          ),
                                        }));
                                      }, 500)
                                    }
                                  >
                                    ✕
                                  </p>
                                </div>
                              ) : null;
                            })}
                        </div>

                        <select
                          className="w-[calc(100%-20px)] text-sm px-5 py-2"
                          onChange={(e) => {
                            const subId = e.target.value;
                            const sub = formData.subCategories.find(
                              (s: any) => s.id === subId
                            );
                            if (sub) {
                              setTimeout(() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  selectedSubcategories: [
                                    ...prev.selectedSubcategories,
                                    {
                                      mainCategoryId: category.id,
                                      subCategoryId: sub.id,
                                      subCategory: sub,
                                    },
                                  ],
                                }));
                              }, 500);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select subcategory
                          </option>
                          {formData.subCategories
                            .filter(
                              (sc: any) =>
                                !formData.selectedSubcategories.some(
                                  (ss) => ss.subCategoryId === sc.id
                                )
                            )
                            .map((sub: any) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {formData.selectedSubcategories
                          .filter(
                            (ss: any) => ss.mainCategoryId === category.id
                          )
                          .map((ss: any) => {
                            const sub = formData.subCategories.find(
                              (sc) => sc.id === ss.subCategoryId
                            );
                            return sub ? (
                              <div
                                key={sub.id}
                                className="text-sm flex justify-between items-center last:border-0 border-b px-5 py-2"
                              >
                                {sub.name}
                              </div>
                            ) : null;
                          })}
                      </div>
                    )}
                  </div>
                ))}

                {firstThreeDone && (
                  <div className="border">
                    <div className="">
                      <h2 className="text-sm font-normal text-left w-full flex justify-between items-center bg-violet-700 text-white border-b px-5 py-3">
                        Residues
                      </h2>
                      <div className="">
                        {formData.selectedOtherSubcategories.map((sub: any) => (
                          <div
                            key={sub.subCategoryId}
                            className="text-sm flex h-[37px] justify-between items-center last:border-0 border-b px-5 py-2"
                          >
                            <span className="flex-1">
                              {sub.subCategory.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div>
            <button
              type="submit"
              className=" bg-violet-700 cursor-pointer text-white px-8 py-2 mt-5 text-sm rounded-md shadow-md hover:bg-violet-600"
            >
              Proceed
            </button>
            {/* <p
            onClick={calculateOutputs}
            className=" bg-violet-700 cursor-pointer text-white px-8 py-2 mt-5 text-sm rounded-md shadow-md hover:bg-violet-600"
          >
            cal
          </p> */}
          </div>
        </div>
      </form>
      {results && (
        <div className="border p-4 mt-8 rounded-md">
          <div className="">
            <h2>Quantification</h2>
            <div className="flex">
              <table className="   w-fit border-collapse border border-gray-400 mt-4 text-xs">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-400 p-2">
                      Biodegradables
                    </th>
                    <th className="border border-gray-400 p-2">
                      Quantities (tonnes/day)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results?.recoveryDataBiodegradables?.map(
                    (waste: any, index: any) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 p-2">
                          {waste.name}
                        </td>
                        <td className="border border-gray-400 p-2">
                          {waste.value.toFixed(2)}
                        </td>
                        {/* <td className="border border-gray-400 p-2">
                      {waste.recovered.toFixed(2)}
                    </td> */}
                      </tr>
                    )
                  )}
                  <tr className="text-center font-semibold bg-gray-100">
                    <td className="border border-gray-400 p-2">Total</td>
                    <td className="border border-gray-400 p-2">
                      {results?.recoveryDataBiodegradables
                        ?.reduce(
                          (acc: number, waste: any) => acc + waste.value,
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="   w-fit border-collapse border border-gray-400 mt-4 text-xs">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-400 p-2">Combustibles</th>
                    <th className="border border-gray-400 p-2">
                      Quantities (tonnes/day)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results?.recoveryDataCombustibles?.map(
                    (waste: any, index: any) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 p-2">
                          {waste.name}
                        </td>
                        <td className="border border-gray-400 p-2">
                          {waste.value.toFixed(2)}
                        </td>
                        {/* <td className="border border-gray-400 p-2">
                  {waste.recovered.toFixed(2)}
                </td> */}
                      </tr>
                    )
                  )}
                   <tr className="text-center font-semibold bg-gray-100">
                    <td className="border border-gray-400 p-2">Total</td>
                    <td className="border border-gray-400 p-2">
                      {results?.recoveryDataCombustibles
                        ?.reduce(
                          (acc: number, waste: any) => acc + waste.value,
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="   w-fit border-collapse border border-gray-400 mt-4 text-xs">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-400 p-2">Recyclables</th>
                    <th className="border border-gray-400 p-2">
                      Quantities (tonnes/day)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results?.recoveryDataRecyclables?.map(
                    (waste: any, index: any) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 p-2">
                          {waste.name}
                        </td>
                        <td className="border border-gray-400 p-2">
                          {waste.value.toFixed(2)}
                        </td>
                        {/* <td className="border border-gray-400 p-2">
                  {waste.recovered.toFixed(2)}
                </td> */}
                      </tr>
                    )
                  )}
                  <tr className="text-center font-semibold bg-gray-100">
                    <td className="border border-gray-400 p-2">Total</td>
                    <td className="border border-gray-400 p-2">
                      {results?.recoveryDataRecyclables
                        ?.reduce(
                          (acc: number, waste: any) => acc + waste.value,
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="   w-fit border-collapse border border-gray-400 mt-4 text-xs">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-400 p-2">Residues</th>
                    <th className="border border-gray-400 p-2">
                      Quantities (tonnes/day)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results?.recoveryDataResidues?.map(
                    (waste: any, index: any) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 p-2">
                          {waste.name}
                        </td>
                        <td className="border border-gray-400 p-2">
                          {waste.value.toFixed(2)}
                        </td>
                        {/* <td className="border border-gray-400 p-2">
                    {waste.recovered.toFixed(2)}
                  </td> */}
                      </tr>
                    )
                  )}
                  <tr className="text-center font-semibold bg-gray-100">
                    <td className="border border-gray-400 p-2">Total</td>
                    <td className="border border-gray-400 p-2">
                      {results?.recoveryDataResidues
                        ?.reduce(
                          (acc: number, waste: any) => acc + waste.value,
                          0
                        )
                        .toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-5 px-4 mt-5">
            <div className={`${open ? "w-full" : "w-full"} `}>
              <CardTitle className="py-3 text-left">Biodegradables</CardTitle>
              <div className="pl-4 h-[50vh]">
                <Bar
                  ref={barRef}
                  className="h-[100%_!important] min-w-[70vh]"
                  data={
                    wasteDataBiodegradables
                      ? {
                          labels: wasteDataBiodegradables.map(
                            (item) => item.name
                          ),
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: wasteDataBiodegradables.map(
                                (item) => item.value
                              ),
                              backgroundColor: "#4CAF50",
                              borderColor: "#4CAF50",
                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                            },
                          ],
                        }
                      : {
                          labels: [],
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: [],
                              backgroundColor: "#4CAF50",
                              borderColor: "#4CAF50",
                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                            },
                          ],
                        }
                  }
                  {...{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className={`${open ? "w-full" : "w-full"} `}>
              <CardTitle className="py-3 text-left">Combustibles</CardTitle>
              <div className="pl-4 h-[50vh]">
                <Bar
                  ref={barRef}
                  className="h-[100%_!important] min-w-[70vh]"
                  data={
                    wasteDataCombustibles
                      ? {
                          labels: wasteDataCombustibles.map(
                            (item) => item.name
                          ),
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: wasteDataCombustibles.map(
                                (item) => item.value
                              ),
                              backgroundColor: "#FF9800",
                              borderColor: "#FF9800",
                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                            },
                          ],
                        }
                      : {
                          labels: [],
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: [],
                              backgroundColor: "#FF9800",
                              borderColor: "#FF9800",
                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                            },
                          ],
                        }
                  }
                  {...{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className={`${open ? "w-full" : "w-full"} `}>
              <CardTitle className="py-3 text-left">Recyclables</CardTitle>
              <div className="pl-4 h-[50vh]">
                <Bar
                  ref={barRef}
                  className="h-[100%_!important] min-w-[70vh]"
                  data={
                    wasteDataRecyclables
                      ? {
                          labels: wasteDataRecyclables.map((item) => item.name),
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: wasteDataRecyclables.map(
                                (item) => item.value
                              ),
                              backgroundColor: "#2196F3",
                              borderColor: "#2196F3",
                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                            },
                          ],
                        }
                      : {
                          labels: [],
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: [],
                              backgroundColor: "#2196F3",
                              borderColor: "#2196F3",
                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                            },
                          ],
                        }
                  }
                  {...{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className={`${open ? "w-full" : "w-full"} `}>
              <CardTitle className="py-3 text-left">Residues</CardTitle>
              <div className="pl-4 h-[50vh]">
                <Bar
                  ref={barRef}
                  className="h-[100%_!important] min-w-[70vh]"
                  data={
                    wasteDataResidues
                      ? {
                          labels: wasteDataResidues.map((item) => item.name),
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: wasteDataResidues.map((item) => item.value),
                              backgroundColor: ["#9E9E9E"],
                              borderColor: ["#9E9E9E"],

                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                              // showLabel: false,
                            },
                          ],
                        }
                      : {
                          labels: [],
                          datasets: [
                            {
                              label: "Quantities (tonnes/day)",
                              data: [],
                              backgroundColor: ["#9E9E9E"],
                              borderColor: ["#9E9E9E"],

                              borderRadius: 5,
                              barThickness: 42,
                              borderSkipped: false,
                              // showLabel: false,
                            },
                          ],
                        }
                  }
                  {...{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>
          <div
            className={`${
              open ? "w-full" : "w-full"
            } pt-8 flex flex-col items-center justify-center `}
          >
            <CardTitle className="py-3 text-left">
              Waste Categorization
            </CardTitle>
            <div className="pl-4 h-[250px] flex flex-col items-center justify-center ">
              <Bar
                ref={barRef}
                className="h-[100%_!important] min-w-[70vh]"
                data={{
                  labels: [
                    "Biodegradables Waste",
                    "Combustibles Waste",
                    "Recyclables Waste",
                    "Residues Waste",
                  ],
                  datasets: [
                    {
                      label: "Quantities (tonnes/day)",
                      data: [
                        totalBioAll,
                        totalCombustAll,
                        totalRecucleAll,
                        totalResidueAll,
                      ],
                      backgroundColor: [
                        "#4CAF50",
                        "#FF9800",
                        "#2196F3",
                        "#9E9E9E",
                      ],
                      borderColor: ["#4CAF50", "#FF9800", "#2196F3", "#9E9E9E"],

                      borderRadius: 5,
                      barThickness: 42,
                      borderSkipped: false,
                      // showLabel: false,
                    },
                  ],
                }}
                {...{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      )}
      <GeneateMap1
        onLoad={onLoad}
        searchBoxRef={searchBoxRef}
        handlePlacesChanged={handlePlacesChanged}
        viewType={viewType}
        setViewType={setViewType}
        adminBoundaries={adminBoundaries}
        roundedArea={roundedArea}
        selectedBoundary={selectedBoundary}
        setSelectedBoundary={setSelectedBoundary}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleBoundaryClick={handleBoundaryClick}
      />

      <Userdef
        roundedArea={roundedArea}
        totalSubCatValue={totalSubCatValue}
        subCatError={subCatError}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        fPopulation={formData.population}
        fName={formData.ucName}
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
  );
}
