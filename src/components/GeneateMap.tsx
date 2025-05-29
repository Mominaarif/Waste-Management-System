// GeneateMap.tsx

import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import {
    GoogleMap,
    LoadScript,
    Polygon,
    InfoWindow,
} from "@react-google-maps/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import "../Styles/GeneateMap.css";
import { useNavigate } from "react-router-dom";
import MapSearch from "./MapSearch";
import { Button } from "./ui/button";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";

interface WasteData {
    residential: Record<string, number>;
    commercial: Record<string, number>;
    industrial: Record<string, number>;
    hazardous: Record<string, number>;
}

const WasteDataDisplay = ({ data }: { data: WasteData }) => {
    // Get all unique waste types across all categories
    const allWasteTypes = [
        ...new Set([
            ...Object.keys(data.residential),
            ...Object.keys(data.commercial),
            ...Object.keys(data.industrial),
            ...Object.keys(data.hazardous),
        ]),
    ];

    return (
        <div className="p-4 w-full h-[150px] overflow-y-auto overflow-x-auto">
            <h2 className="text-base font-bold mb-4">Waste Composition by Sector</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Waste Type</th>
                            <th className="py-2 px-4 border-b">Residential (kg)</th>
                            <th className="py-2 px-4 border-b">Commercial (kg)</th>
                            <th className="py-2 px-4 border-b">Industrial (kg)</th>
                            <th className="py-2 px-4 border-b">Hazardous (kg)</th>
                            <th className="py-2 px-4 border-b">Total (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allWasteTypes.map((wasteType) => {
                            const residential = data.residential[wasteType] || 0;
                            const commercial = data.commercial[wasteType] || 0;
                            const industrial = data.industrial[wasteType] || 0;
                            const hazardous = data.hazardous[wasteType] || 0;
                            const total = residential + commercial + industrial + hazardous;

                            return (
                                <tr key={wasteType} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b capitalize">{wasteType}</td>
                                    <td className="py-2 px-4 border-b text-right">
                                        {residential}
                                    </td>
                                    <td className="py-2 px-4 border-b text-right">
                                        {commercial}
                                    </td>
                                    <td className="py-2 px-4 border-b text-right">
                                        {industrial}
                                    </td>
                                    <td className="py-2 px-4 border-b text-right">{hazardous}</td>
                                    <td className="py-2 px-4 border-b text-right font-semibold">
                                        {total}
                                    </td>
                                </tr>
                            );
                        })}
                        {/* Totals row */}
                        <tr className="bg-gray-50 font-semibold">
                            <td className="py-2 px-4 border-b">Total</td>
                            <td className="py-2 px-4 border-b text-right">
                                {Object.values(data.residential).reduce(
                                    (sum, val) => sum + val,
                                    0
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                                {Object.values(data.commercial).reduce(
                                    (sum, val) => sum + val,
                                    0
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                                {Object.values(data.industrial).reduce(
                                    (sum, val) => sum + val,
                                    0
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                                {Object.values(data.hazardous).reduce(
                                    (sum, val) => sum + val,
                                    0
                                )}
                            </td>
                            <td className="py-2 px-4 border-b text-right">
                                {Object.values(data.residential).reduce(
                                    (sum, val) => sum + val,
                                    0
                                ) +
                                    Object.values(data.commercial).reduce(
                                        (sum, val) => sum + val,
                                        0
                                    ) +
                                    Object.values(data.industrial).reduce(
                                        (sum, val) => sum + val,
                                        0
                                    ) +
                                    Object.values(data.hazardous).reduce(
                                        (sum, val) => sum + val,
                                        0
                                    )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define interfaces for data structures
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
    city: string;
    paths: LatLng[];
    wasteCategories: WasteCategories;
    options: google.maps.PolygonOptions;
    DISTRICT?: string; // Optional, as it may not always be present
    position?: google.maps.LatLng; // Optional position property
}

interface Legend {
    green: string;
    yellow: string;
    red: string;
}

interface ComparisonResults {
    uc1: {
        population: number;
        totalWaste: number;
        wasteCategories: WasteCategories;
    };
    uc2: {
        population: number;
        totalWaste: number;
        wasteCategories: WasteCategories;
    };
}

interface Props {
    setCurrentValues: (values: any) => void; // Define more specific type if possible
}

// Map container style
const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "calc(100vh - 85px)",
    position: "fixed",
    top: "0",
    //   left: "-120px",
    //   border: "2px solid #73AD21",
    zIndex: 1,
    boxSizing: "border-box",
};

// Libraries for Google Maps
const libraries: "places"[] = ["places"];
const center: LatLng = { lat: 30.3, lng: 67.3 };
const JSON_FILE_URL = "/District_Boundary.json";

// Styling objects
const infoWindowStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    // backgroundColor: '#f9f9f9',
    padding: "15px",
    borderRadius: "12px",
    // boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: "500px",
    minWidth: "300px",
    lineHeight: "1.5",
};

const titleStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#2c3e50",
    textAlign: "center",
    borderBottom: "2px solid #ddd",
    paddingBottom: "8px",
};

const labelStyle: React.CSSProperties = {
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
};

const valueStyle: React.CSSProperties = {
    color: "#2c3e50",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
};

const iconStyle: React.CSSProperties = {
    marginRight: "8px",
    color: "#e74c3c",
};

const pieChartStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
    maxWidth: "650px",
    minWidth: "450px",
    lineHeight: "2.5",
};

const GeneateMap = ({ setCurrentValues, open }: any) => {
    const [showComparisonInputs, setShowComparisonInputs] = useState<boolean>(
        false
    );
    const [viewType, setViewType] = useState<
        "district" | "unionCouncil" | "province"
    >("district");
    const [polygons, setPolygons] = useState<PolygonData[]>([]);
    const [selectedPolygon, setSelectedPolygon] = useState<PolygonData | null>(
        null
    );
    const navigate = useNavigate();
    const [mapKey, setMapKey] = useState<number>(0);
    const [showPieChart, setShowPieChart] = useState<boolean>(false);
    const [forecastYear, setForecastYear] = useState<number>(1);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        "residential"
    );
    const wealthCategories: string[] = [
        "High Income",
        "Higher Middle Income",
        "Lower Middle Income",
        "Low Income",
    ];
    const randomWealthCategory: string =
        wealthCategories[Math.floor(Math.random() * wealthCategories.length)];
    const [population, setPopulation] = useState<number>(0);
    const [households, setHouseholds] = useState<number>(0);
    const [totalWaste, setTotalWaste] = useState<number>(0);
    const mapRef = useRef<google.maps.Map | null>(null);
    const [polygonColors, setPolygonColors] = useState<{ [key: number]: string }>(
        {}
    );
    const [wealthCategory, setWealthCategory] = useState<string>("");
    const [forecastedValues, setForecastedValues] = useState<{
        [key: string]: WasteCategory;
    }>({});
    const GROWTH_RATE: number = 0.024;
    const WASTE_GENERATION_RATE: number = (0.283 + 0.612) / 2;
    const [ucId1, setUcId1] = useState<string>("");
    const [ucId2, setUcId2] = useState<string>("");
    const [
        comparisonResults,
        setComparisonResults,
    ] = useState<ComparisonResults | null>(null);
    const [legend, setLegend] = useState<Legend>({
        green: "",
        yellow: "",
        red: "",
    });

    const handleToggleComparisonInputs = () => {
        setShowComparisonInputs((prev) => !prev);
    };

    const onLoad = useCallback((map: google.maps.Map, url: string) => {
        mapRef.current = map;
        fetch(url)
            .then((response) => response.json())
            .then((data: any) => {
                if (!data || !data.features) {
                    console.error("Invalid data structure:", data);
                    return;
                }

                const polygonsData: PolygonData[] = data.features
                    .map((feature: any, index: number) => {
                        if (feature.geometry.type === "Polygon") {
                            const coordinates = feature.geometry.coordinates[0];

                            const residentialWaste: WasteCategory = {
                                paper: Math.floor(Math.random() * 500) + 50,
                                cardboard: Math.floor(Math.random() * 300) + 30,
                                lightPlastic: Math.floor(Math.random() * 100) + 10,
                                densePlastic: Math.floor(Math.random() * 50) + 5,
                                textile: Math.floor(Math.random() * 200) + 20,
                                foodWaste: Math.floor(Math.random() * 500) + 50,
                                yardWaste: Math.floor(Math.random() * 300) + 30,
                                metals: Math.floor(Math.random() * 100) + 10,
                                glass: Math.floor(Math.random() * 50) + 5,
                                diapers: Math.floor(Math.random() * 100) + 10,
                                animalDunk: Math.floor(Math.random() * 200) + 20,
                                wood: Math.floor(Math.random() * 300) + 30,
                                electronic: Math.floor(Math.random() * 50) + 5,
                                leather: Math.floor(Math.random() * 50) + 5,
                                cdWaste: Math.floor(Math.random() * 50) + 5,
                            };

                            const commercialWaste: WasteCategory = {
                                paper: Math.floor(Math.random() * 300) + 30,
                                cardboard: Math.floor(Math.random() * 200) + 20,
                                lightPlastic: Math.floor(Math.random() * 50) + 5,
                                densePlastic: Math.floor(Math.random() * 25) + 3,
                                textile: Math.floor(Math.random() * 100) + 10,
                                foodWaste: Math.floor(Math.random() * 300) + 30,
                                yardWaste: Math.floor(Math.random() * 200) + 20,
                                metals: Math.floor(Math.random() * 50) + 5,
                                glass: Math.floor(Math.random() * 25) + 3,
                                diapers: Math.floor(Math.random() * 50) + 5,
                                animalDunk: Math.floor(Math.random() * 100) + 10,
                                wood: Math.floor(Math.random() * 100) + 10,
                                electronic: Math.floor(Math.random() * 25) + 3,
                                leather: Math.floor(Math.random() * 25) + 3,
                                cdWaste: Math.floor(Math.random() * 25) + 3,
                            };

                            const industrialWaste: WasteCategory = {
                                paper: Math.floor(Math.random() * 400) + 40,
                                cardboard: Math.floor(Math.random() * 250) + 25,
                                lightPlastic: Math.floor(Math.random() * 75) + 7,
                                densePlastic: Math.floor(Math.random() * 35) + 4,
                                textile: Math.floor(Math.random() * 150) + 15,
                                foodWaste: Math.floor(Math.random() * 400) + 40,
                                yardWaste: Math.floor(Math.random() * 250) + 25,
                                metals: Math.floor(Math.random() * 75) + 7,
                                glass: Math.floor(Math.random() * 35) + 4,
                                diapers: Math.floor(Math.random() * 75) + 7,
                                animalDunk: Math.floor(Math.random() * 150) + 15,
                                wood: Math.floor(Math.random() * 150) + 15,
                                electronic: Math.floor(Math.random() * 35) + 4,
                                leather: Math.floor(Math.random() * 35) + 4,
                                cdWaste: Math.floor(Math.random() * 35) + 4,
                            };

                            const hazardousWaste: WasteCategory = {
                                needles: Math.floor(Math.random() * 100) + 10,
                                syringes: Math.floor(Math.random() * 50) + 5,
                                scalpels: Math.floor(Math.random() * 30) + 3,
                                infusionSets: Math.floor(Math.random() * 20) + 2,
                                sawsKnives: Math.floor(Math.random() * 50) + 5,
                                blades: Math.floor(Math.random() * 50) + 5,
                                chemicals: Math.floor(Math.random() * 100) + 10,
                            };

                            setPopulation(Math.floor(Math.random() * 10000) + 1000);
                            setHouseholds(Math.floor(Math.random() * 500) + 50);
                            setTotalWaste(Math.floor(Math.random() * 1000) + 100);
                            setWealthCategory(randomWealthCategory);

                            return {
                                id: index,
                                city: feature.properties.DISTRICT,
                                paths: coordinates.map((coord: [number, number]) => ({
                                    lat: coord[1],
                                    lng: coord[0],
                                })),
                                wasteCategories: {
                                    residential: residentialWaste,
                                    commercial: commercialWaste,
                                    industrial: industrialWaste,
                                    hazardous: hazardousWaste,
                                },
                                options: {
                                    strokeColor: "#0f6175",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: "#ada5a5",
                                    fillOpacity: 0.35,
                                },
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                setPolygons(polygonsData);
            })
            .catch((error) => console.error("Error loading JSON data:", error));
    }, []);

    const handleLoadMap = (map: google.maps.Map, url: string) => {
        onLoad(map, url);
    };
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setPolygons([]);
            setSelectedPolygon(null);

            let url: string;
            switch (viewType) {
                case "unionCouncil":
                    url = "/Union_Council_VF.json";
                    break;
                case "province":
                    url = "/Provinces_VF.json";
                    break;
                case "district":
                default:
                    url = "/District_Boundary.json";
                    break;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (!data || !data.features) {
                    console.error("Invalid data structure:", data);
                    return;
                }

                const polygonsData: PolygonData[] = data.features
                    .map((feature: any, index: number) => {
                        if (feature.geometry.type === "Polygon") {
                            const coordinates = feature.geometry.coordinates[0];

                            // Your existing waste data generation logic...

                            const residentialWaste: WasteCategory = {
                                paper: Math.floor(Math.random() * 500) + 50,
                                cardboard: Math.floor(Math.random() * 300) + 30,
                                lightPlastic: Math.floor(Math.random() * 100) + 10,
                                densePlastic: Math.floor(Math.random() * 50) + 5,
                                textile: Math.floor(Math.random() * 200) + 20,
                                foodWaste: Math.floor(Math.random() * 500) + 50,
                                yardWaste: Math.floor(Math.random() * 300) + 30,
                                metals: Math.floor(Math.random() * 100) + 10,
                                glass: Math.floor(Math.random() * 50) + 5,
                                diapers: Math.floor(Math.random() * 100) + 10,
                                animalDunk: Math.floor(Math.random() * 200) + 20,
                                wood: Math.floor(Math.random() * 300) + 30,
                                electronic: Math.floor(Math.random() * 50) + 5,
                                leather: Math.floor(Math.random() * 50) + 5,
                                cdWaste: Math.floor(Math.random() * 50) + 5,
                            };

                            const commercialWaste: WasteCategory = {
                                paper: Math.floor(Math.random() * 300) + 30,
                                cardboard: Math.floor(Math.random() * 200) + 20,
                                lightPlastic: Math.floor(Math.random() * 50) + 5,
                                densePlastic: Math.floor(Math.random() * 25) + 3,
                                textile: Math.floor(Math.random() * 100) + 10,
                                foodWaste: Math.floor(Math.random() * 300) + 30,
                                yardWaste: Math.floor(Math.random() * 200) + 20,
                                metals: Math.floor(Math.random() * 50) + 5,
                                glass: Math.floor(Math.random() * 25) + 3,
                                diapers: Math.floor(Math.random() * 50) + 5,
                                animalDunk: Math.floor(Math.random() * 100) + 10,
                                wood: Math.floor(Math.random() * 100) + 10,
                                electronic: Math.floor(Math.random() * 25) + 3,
                                leather: Math.floor(Math.random() * 25) + 3,
                                cdWaste: Math.floor(Math.random() * 25) + 3,
                            };

                            const industrialWaste: WasteCategory = {
                                paper: Math.floor(Math.random() * 400) + 40,
                                cardboard: Math.floor(Math.random() * 250) + 25,
                                lightPlastic: Math.floor(Math.random() * 75) + 7,
                                densePlastic: Math.floor(Math.random() * 35) + 4,
                                textile: Math.floor(Math.random() * 150) + 15,
                                foodWaste: Math.floor(Math.random() * 400) + 40,
                                yardWaste: Math.floor(Math.random() * 250) + 25,
                                metals: Math.floor(Math.random() * 75) + 7,
                                glass: Math.floor(Math.random() * 35) + 4,
                                diapers: Math.floor(Math.random() * 75) + 7,
                                animalDunk: Math.floor(Math.random() * 150) + 15,
                                wood: Math.floor(Math.random() * 150) + 15,
                                electronic: Math.floor(Math.random() * 35) + 4,
                                leather: Math.floor(Math.random() * 35) + 4,
                                cdWaste: Math.floor(Math.random() * 35) + 4,
                            };

                            const hazardousWaste: WasteCategory = {
                                needles: Math.floor(Math.random() * 100) + 10,
                                syringes: Math.floor(Math.random() * 50) + 5,
                                scalpels: Math.floor(Math.random() * 30) + 3,
                                infusionSets: Math.floor(Math.random() * 20) + 2,
                                sawsKnives: Math.floor(Math.random() * 50) + 5,
                                blades: Math.floor(Math.random() * 50) + 5,
                                chemicals: Math.floor(Math.random() * 100) + 10,
                            };
                            setPopulation(Math.floor(Math.random() * 10000) + 1000);
                            setHouseholds(Math.floor(Math.random() * 500) + 50);
                            setTotalWaste(Math.floor(Math.random() * 1000) + 100);
                            setWealthCategory(randomWealthCategory);
                            return {
                                id: index,
                                city: feature.properties.DISTRICT || feature.properties.NAME || `Area ${index}`,
                                paths: coordinates.map((coord: [number, number]) => ({
                                    lat: coord[1],
                                    lng: coord[0],
                                })),
                                wasteCategories: {
                                    residential: residentialWaste,
                                    commercial: commercialWaste,
                                    industrial: industrialWaste,
                                    hazardous: hazardousWaste,
                                },
                                options: {
                                    strokeColor: "#0f6175",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: "#ada5a5",
                                    fillOpacity: 0.35,
                                },
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                setPolygons(polygonsData);

                // Reset map view
                if (mapRef.current) {
                    mapRef.current.panTo(center);
                    mapRef.current.setZoom(8);
                }

            } catch (error) {
                console.error("Error loading JSON data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [viewType]);

    const handleViewChange = (type: "district" | "unionCouncil" | "province") => {
        setViewType(type);
        setSelectedPolygon(null);
    };

    const handleLocationSelect = (location: LatLng) => {
        if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(12);
        }
    };

    const handlePolygonColorChange = (selectedCategory: string = "total") => {
        const newColors: { [key: number]: string } = {};
        const updatedLegend: Legend = {
            green: "",
            yellow: "",
            red: "",
        };

        const polygonPercentages = polygons.map((polygon) => {
            const totalWaste = Object.values(polygon.wasteCategories).reduce(
                (sum, category) => {
                    return (
                        sum +
                        Object.values(category).reduce(
                            (catSum: any, value) => catSum + value,
                            0
                        )
                    );
                },
                0
            );

            let categoryWaste = 0;

            if (selectedCategory === "total") {
                categoryWaste = totalWaste;
            } else if (
                polygon.wasteCategories[selectedCategory as keyof WasteCategories]
            ) {
                categoryWaste = Object.values(
                    polygon.wasteCategories[selectedCategory as keyof WasteCategories]
                ).reduce((catSum, value) => catSum + value, 0);
            }

            const wastePercentage =
                totalWaste === 0 ? 0 : (categoryWaste / totalWaste) * 100;

            return { id: polygon.id, percentage: wastePercentage };
        });

        polygonPercentages.sort((a, b) => a.percentage - b.percentage);

        const totalPolygons = polygonPercentages.length;
        const groupSize = Math.ceil(totalPolygons / 3);

        let greenRange = { min: Infinity, max: -Infinity };
        let yellowRange = { min: Infinity, max: -Infinity };
        let redRange = { min: Infinity, max: -Infinity };

        polygonPercentages.forEach((polygon, index) => {
            if (index < groupSize) {
                newColors[polygon.id] = "#2ecc71";
                greenRange.min = Math.min(greenRange.min, polygon.percentage);
                greenRange.max = Math.max(greenRange.max, polygon.percentage);
            } else if (index < groupSize * 2) {
                newColors[polygon.id] = "#f1c40f";
                yellowRange.min = Math.min(yellowRange.min, polygon.percentage);
                yellowRange.max = Math.max(yellowRange.max, polygon.percentage);
            } else {
                newColors[polygon.id] = "#e74c3c";
                redRange.min = Math.min(redRange.min, polygon.percentage);
                redRange.max = Math.max(redRange.max, polygon.percentage);
            }
        });

        setPolygonColors(newColors);

        updatedLegend.green = `Green: ${greenRange.min.toFixed(
            2
        )}tons - ${greenRange.max.toFixed(2)}tons`;
        updatedLegend.yellow = `Yellow: ${yellowRange.min.toFixed(
            2
        )}tons - ${yellowRange.max.toFixed(2)}tons`;
        updatedLegend.red = `Red: ${redRange.min.toFixed(
            2
        )}tons - ${redRange.max.toFixed(2)}tons`;

        setLegend(updatedLegend);
    };

    const handlePolygonClick = (
        polygonData: PolygonData,
        event: google.maps.MapMouseEvent
    ) => {
        setSelectedPolygon({ ...polygonData, position: event.latLng! });
        setShowPieChart(false);
    };

    const handleCloseClick = () => setSelectedPolygon(null);
    const handleWasteClick = () => setShowPieChart(true);
    const handlePieChartClose = () => setShowPieChart(false);
    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setShowPieChart(true);
    };

    const calculateMainCategoryData = (wasteCategories: WasteCategories) => {
        const mainCategories: { [key: string]: number } = {
            residential: 0,
            commercial: 0,
            industrial: 0,
            hazardous: 0,
        };

        Object.keys(wasteCategories).forEach((category) => {
            const totalInCategory = Object.values(
                wasteCategories[category as keyof WasteCategories]
            ).reduce((sum, value) => sum + value, 0);
            mainCategories[category] = totalInCategory;
        });

        return mainCategories;
    };

    const mainCategoryData = selectedPolygon
        ? calculateMainCategoryData(selectedPolygon.wasteCategories)
        : {};

    const mainPieChartData = {
        labels: Object.keys(mainCategoryData),
        datasets: [
            {
                label: "Total Waste by Category",
                data: Object.values(mainCategoryData),
                backgroundColor: ["#2ecc71", "#3498db", "#e74c3c", "#f1c40f"],
                hoverBackgroundColor: ["#27ae60", "#2980b9", "#c0392b", "#f39c12"],
            },
        ],
    };

    const WasteTable: React.FC<{ wasteData: WasteCategory }> = ({
        wasteData,
    }) => (
        <table className=" w-full">
            <thead>
                <tr className="text-left">
                    <th>Subcategory</th>
                    <th>Amount (kg)</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(wasteData).map(([key, value]) => (
                    <tr key={key}>
                        <td>{key}</td>
                        <td>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    const handleForecastClick = () => {
        if (!selectedPolygon) return;

        const presentPopulation = population;
        const name = selectedPolygon.city;
        const designPeriod = forecastYear;

        const futurePopulation = Math.round(
            presentPopulation * Math.pow(1 + GROWTH_RATE, designPeriod)
        );
        const totalWasteGenerated = Math.round(
            futurePopulation * WASTE_GENERATION_RATE * 365
        );

        const newForecastedValues: { [key: string]: WasteCategory } = {};
        Object.keys(selectedPolygon.wasteCategories).forEach((category) => {
            const wasteData =
                selectedPolygon.wasteCategories[category as keyof WasteCategories];
            const totalWasteInCategory = Object.values(wasteData).reduce(
                (sum, value) => sum + value,
                0
            );

            newForecastedValues[category] = {};

            Object.keys(wasteData).forEach((key) => {
                const subtypeWaste = Math.round(
                    (wasteData[key] / totalWasteInCategory) * totalWasteGenerated
                );
                newForecastedValues[category][key] = subtypeWaste;
            });
        });

        setForecastedValues(newForecastedValues);

        navigate("/forecast", {
            state: {
                forecastedValues: newForecastedValues,
                presentPopulation,
                forecastYear,
                name,
            },
        });
    };

    const handleContourMap = () => {
        if (!selectedPolygon) {
            console.error("Selected polygon not found");
            return;
        }
        const presentPopulation = population;
        const name = selectedPolygon.city;
        // const designPeriod = forecastYear;

        const currentData = {
        wasteCategories: {
            residential: selectedPolygon.wasteCategories.residential,
            commercial: selectedPolygon.wasteCategories.commercial,
            industrial: selectedPolygon.wasteCategories.industrial,
            hazardous: selectedPolygon.wasteCategories.hazardous,
        },
        presentPopulation,
        name,
        forecastYear,
    };

        navigate("/heatmap", {
            state: currentData
        });

        // navigate("/heatmap", {
        //     // state: currentData
        //     state: {name, presentPopulation, forecastYear },
        // });
    };

    const handleComparison = () => {
        setShowModal(!showModal);
        const id1 = parseInt(ucId1, 10);
        const id2 = parseInt(ucId2, 10);

        const polygon1 = polygons.find((p) => p.id === id1 - 1);
        const polygon2 = polygons.find((p) => p.id === id2 - 1);

        if (polygon1 && polygon2) {
            const results: ComparisonResults = {
                uc1: {
                    population: Math.floor(Math.random() * 10000) + 1000,
                    totalWaste: Math.floor(Math.random() * 1000) + 100,
                    wasteCategories: polygon1.wasteCategories,
                },
                uc2: {
                    population: Math.floor(Math.random() * 10000) + 1000,
                    totalWaste: Math.floor(Math.random() * 1000) + 100,
                    wasteCategories: polygon2.wasteCategories,
                },
            };
            setComparisonResults(results);
        } else {
            alert("Invalid UC IDs");
        }
    };

    const pieChartData = {
        labels: selectedPolygon
            ? Object.keys(
                selectedPolygon.wasteCategories[
                selectedCategory as keyof WasteCategories
                ]
            )
            : [],
        datasets: [
            {
                label: "Waste",
                data: selectedPolygon
                    ? Object.values(
                        selectedPolygon.wasteCategories[
                        selectedCategory as keyof WasteCategories
                        ]
                    )
                    : [],
                backgroundColor: [
                    "#2ecc71",
                    "#3498db",
                    "#e74c3c",
                    "#f1c40f",
                    "#9b59b6",
                    "#1abc9c",
                    "#34495e",
                    "#e67e22",
                    "#e84393",
                    "#f368e0",
                    "#74b9ff",
                    "#55efc4",
                ],
                hoverBackgroundColor: [
                    "#27ae60",
                    "#2980b9",
                    "#c0392b",
                    "#f39c12",
                    "#8e44ad",
                    "#16a085",
                    "#2c3e50",
                    "#d35400",
                    "#d63031",
                    "#fd79a8",
                    "#0984e3",
                    "#00b894",
                ],
            },
        ],
    };

    console.log(forecastedValues);
    const polygonsToRender = useMemo(() => {
        return polygons.map((polygon) => (
            <Polygon
                key={`${viewType}-${polygon.id}`}
                options={{
                    ...polygon.options,
                    fillColor: polygonColors[polygon.id] || polygon.options.fillColor,
                }}
                paths={polygon.paths}
                onClick={(event) => handlePolygonClick(polygon, event)}
            />
        ));
    }, [polygons, viewType, polygonColors]);
    return (
        <div className="relative">
            <LoadScript
                googleMapsApiKey="AIzaSyClURLc6gcn9M_AOXj6gUsYYk147-T_FDA"
                libraries={libraries}
            >
                <div className=" absolute top-15 left-5 right-0 bottom-0 z-2 w-fit h-fit">
                    <select
                        onChange={(e) => handlePolygonColorChange(e.target.value)}
                        className=" border  rounded-sm w-50 h-10 text-sm text-black bg-white border-black border-opacity-50 border-solid z-2"
                    >
                        <option value="total">Total Waste</option>
                        <option value="residential">Residential Waste</option>
                        <option value="industrial">Industrial Waste</option>
                        <option value="commercial">Commercial Waste</option>
                        <option value="hazardous">Hazardous Waste</option>
                    </select>

                    <select
                        onChange={(e) =>
                            handleViewChange(
                                e.target.value as "district" | "unionCouncil" | "province"
                            )
                        }
                        style={{
                            position: "absolute",
                            top: "0px",
                            left: "620px",
                            zIndex: 2,
                        }}
                        className=" border  rounded-sm w-50 h-10 text-sm text-black bg-white border-black border-opacity-50 border-solid z-2"
                    >
                        <option value="district">Districts</option>
                        <option value="unionCouncil">Union Councils</option>
                        <option value="province">Provinces</option>
                    </select>

                    {legend.green && legend.yellow && legend.red && (
                        <div className=" border w-fit p-1 mt-1 bg-white">
                            {/* <h4>Legend</h4> */}
                            <p>
                                <span style={{ color: "#2ecc71" }}>■</span> {legend.green}
                            </p>
                            <p>
                                <span style={{ color: "#f1c40f" }}>■</span> {legend.yellow}
                            </p>
                            <p>
                                <span style={{ color: "#e74c3c" }}>■</span> {legend.red}
                            </p>
                        </div>
                    )}
                </div>

                <div
                    style={{
                        position: "absolute",
                        top: "60px",
                        left: "420px",
                        zIndex: 2,
                    }}
                    className=" border  rounded-sm w-50 h-10 text-sm text-black bg-white border-black border-opacity-50 border-solid z-10"
                >
                    <button
                        onClick={handleToggleComparisonInputs}
                        className=" w-full h-full"
                    >
                        {`${showComparisonInputs
                            ? `Hide ${viewType === "district"
                                ? "District"
                                : viewType === "unionCouncil"
                                    ? "UC"
                                    : viewType === "province"
                                        ? "Province"
                                        : viewType
                            } Comparison`
                            : `Show ${viewType === "district"
                                ? "District"
                                : viewType === "unionCouncil"
                                    ? "UC"
                                    : viewType === "province"
                                        ? "Province"
                                        : viewType
                            } Comparison`
                            }`}
                    </button>

                    {showComparisonInputs && (
                        <div
                            style={{ marginTop: "10px" }}
                            className="bg-white w-full p-1.5 flex flex-col justify-center"
                        >
                            <input
                                type="number"
                                placeholder={`Enter ${viewType === "district"
                                    ? "District"
                                    : viewType === "unionCouncil"
                                        ? "UC"
                                        : viewType === "province"
                                            ? "Province"
                                            : viewType
                                    } ID 1`}
                                value={ucId1}
                                className="border p-1 rounded-sm w-full
                                  text-sm text-black bg-white mb-1  z-10"
                                onChange={(e) => setUcId1(e.target.value)}
                                style={{ marginRight: "10px" }}
                            />
                            <input
                                type="number"
                                placeholder={`Enter ${viewType === "district"
                                    ? "District"
                                    : viewType === "unionCouncil"
                                        ? "UC"
                                        : viewType === "province"
                                            ? "Province"
                                            : viewType
                                    } ID 2`}
                                value={ucId2}
                                className="border p-1 rounded-sm w-full text-sm text-black bg-white mb-1 z-10"
                                onChange={(e) => setUcId2(e.target.value)}
                                style={{ marginRight: "10px" }}
                            />
                            <div className="w-full flex justify-center">
                                <Button
                                    onClick={handleComparison}
                                    className="bg-[#386641] w-full transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 rounded-md shadow-md"
                                >
                                    Compare
                                </Button>
                                {/* <button onClick={handleComparison} className='p-1 bg-blue-500 text-white rounded-sm w-fit cursor-pointer'>Compare</button> */}
                            </div>
                        </div>
                    )}
                </div>

                {/* <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={8}
                    key={mapKey}
                    onLoad={(map) => handleLoadMap(map, JSON_FILE_URL)}
                > */}

                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={8}
                    key={`${mapKey}-${viewType}`} // Add viewType to key to force re-render
                    onLoad={(map) => {
                        mapRef.current = map;
                        // Don't load data here - we handle it in useEffect
                    }}
                >
                    {loading && (
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 1000,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            padding: '20px',
                            borderRadius: '8px'
                        }}>
                            Loading {viewType} data...
                        </div>
                    )}
                    <MapSearch onLocationSelect={handleLocationSelect} />
                    {polygons.map((polygon) => (
                        <Polygon
                            key={polygon.id}
                            options={{
                                ...polygon.options,
                                fillColor:
                                    polygonColors[polygon.id] || polygon.options.fillColor,
                            }}
                            paths={polygon.paths}
                            onClick={(event) => handlePolygonClick(polygon, event)}
                        />
                    ))}
                    {selectedPolygon && (
                        <>
                            <InfoWindow
                                position={selectedPolygon.position!}
                                onCloseClick={handleCloseClick}
                            >
                                <div style={infoWindowStyle}>
                                    <div style={titleStyle}>{` ${viewType === "district"
                                    ? "District"
                                    : viewType === "unionCouncil"
                                        ? "UC"
                                        : viewType === "province"
                                            ? "Province"
                                            : viewType
                                    } ${selectedPolygon.id + 1}`}</div>
                                    <div className=" grid grid-cols-2 gap-2">
                                        <div style={labelStyle}>
                                            <span style={iconStyle}>🏷️</span>City ID:
                                        </div>
                                        <div style={valueStyle}>{`${viewType === "district"
                                    ? "District"
                                    : viewType === "unionCouncil"
                                        ? "UC"
                                        : viewType === "province"
                                            ? "Province"
                                            : viewType
                                    } ${selectedPolygon.id +
                                            1}`}</div>
                                        <div style={labelStyle}>
                                            <span style={iconStyle}>👨‍👩‍👧‍👦</span>Population:
                                        </div>
                                        <div style={valueStyle}>{population}</div>
                                        <div style={labelStyle}>
                                            <span style={iconStyle}>🏙️</span>City:
                                        </div>
                                        <div style={valueStyle}>{selectedPolygon.city}</div>
                                        <div style={labelStyle}>
                                            <span style={iconStyle}>🏠</span>Households:
                                        </div>
                                        <div style={valueStyle}>{households}</div>
                                        <div style={labelStyle}>
                                            <span style={iconStyle}>💰</span>Income Group:
                                        </div>
                                        <div style={valueStyle}>{wealthCategory}</div>
                                        <div style={labelStyle}>
                                            <span style={iconStyle}>♻️</span>Total Waste Generated:
                                        </div>

                                        <div style={valueStyle} onClick={handleWasteClick}>
                                            {totalWaste} Tons
                                        </div>
                                    </div>
                                    <div className="mb-[30px] w-full h-[300px]">
                                        <h3 style={labelStyle} className="text-base">
                                            Main Waste Categories
                                        </h3>
                                        <div className="flex w-full justify-center items-center">
                                            <Pie
                                                data={mainPieChartData}
                                                className="w-full h-[300px_!important] flex justify-center items-center"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className="styled-button"
                                            onClick={() => handleCategoryChange("residential")}
                                        >
                                            Residential
                                        </button>
                                        <button
                                            className="styled-button"
                                            onClick={() => handleCategoryChange("commercial")}
                                        >
                                            Commercial
                                        </button>
                                        <button
                                            className="styled-button"
                                            onClick={() => handleCategoryChange("industrial")}
                                        >
                                            Industrial
                                        </button>
                                        <button
                                            className="styled-button"
                                            onClick={() => handleCategoryChange("hazardous")}
                                        >
                                            Hazardous
                                        </button>
                                    </div>
                                    <div className="pt-5">
                                        <h3 style={labelStyle} className="text-base">
                                            Subcategories
                                        </h3>
                                        <WasteTable
                                            wasteData={
                                                selectedPolygon.wasteCategories[
                                                selectedCategory as keyof WasteCategories
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className="forecast-section pt-8">
                                        <select
                                            className="w-full h-10 border border-gray-300 rounded-sm mb-2"
                                            value={forecastYear}
                                            onChange={(e) => setForecastYear(Number(e.target.value))}
                                        >
                                            {[...Array(10)].map((_, index) => (
                                                <option key={index + 1} value={index + 1}>
                                                    {index + 1} Year
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="forecast-section grid grid-cols-2 gap-2">
                                        <button
                                            className="forecast-button"
                                            onClick={handleForecastClick}
                                        >
                                            Forecast
                                        </button>
                                        <button
                                            className="forecast-button"
                                            onClick={handleContourMap}
                                        >
                                            Carbon Footprint Analysis
                                        </button>
                                    </div>
                                </div>
                            </InfoWindow>
                            {showPieChart && (
                                <InfoWindow
                                    position={selectedPolygon.position!}
                                    onCloseClick={handlePieChartClose}
                                >
                                    <div style={pieChartStyle}>
                                        <Pie data={pieChartData} />
                                    </div>
                                </InfoWindow>
                            )}
                        </>
                    )}
                </GoogleMap>
                {comparisonResults && (
                    <Dialog
                        open={showModal}
                        as="div"
                        className="relative z-10 focus:outline-none"
                        onClose={() => setShowModal(false)}
                    >
                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-center justify-center p-4">
                                <DialogPanel
                                    transition
                                    className="relative w-fit h-full rounded-sm p-4 pb-6 border bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                                >
                                    <div className="absolute top-0 right-0 p-2">
                                        <Button
                                            className="cursor-pointer"
                                            onClick={() => setShowModal(false)}
                                        >
                                            <X />
                                        </Button>
                                    </div>
                                    <DialogTitle as="h3" className="text-base font-bold pb-2">
                                        Comparison Results
                                    </DialogTitle>
                                    <div className={`${open ? "w-full" : "w-full"} mt-5`}>
                                        <div>
                                            {/* <h1 className="text-xl py-4 font-semibold text-gray-900">
                                                Comparison Results
                                            </h1> */}
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {viewType === "district"
                                                                ? "District"
                                                                : viewType === "unionCouncil"
                                                                    ? "Union Council"
                                                                    : viewType === "province"
                                                                        ? "Province"
                                                                        : viewType}
                                                        </th>
                                                        <th
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            Population
                                                        </th>
                                                        <th
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            Waste Categories
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {viewType === "district"
                                                                ? "District"
                                                                : viewType === "unionCouncil"
                                                                    ? "Union Council"
                                                                    : viewType === "province"
                                                                        ? "Province"
                                                                        : viewType}{" "}
                                                            {ucId1}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {comparisonResults.uc1.population}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            <WasteDataDisplay
                                                                data={comparisonResults.uc1.wasteCategories}
                                                            />
                                                            {/* {JSON.stringify(comparisonResults.uc1.wasteCategories)} */}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {viewType === "district"
                                                                ? "District"
                                                                : viewType === "unionCouncil"
                                                                    ? "Union Council"
                                                                    : viewType === "province"
                                                                        ? "Province"
                                                                        : viewType}{" "}
                                                            {ucId2}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            {comparisonResults.uc2.population}
                                                        </td>
                                                        <td
                                                            style={{
                                                                border: "1px solid #ccc",
                                                                padding: "8px",
                                                            }}
                                                        >
                                                            <WasteDataDisplay
                                                                data={comparisonResults.uc2.wasteCategories}
                                                            />
                                                            {/* {JSON.stringify(comparisonResults.uc2.wasteCategories)} */}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </DialogPanel>
                            </div>
                        </div>
                    </Dialog>
                )}
            </LoadScript>
        </div>
    );
};

export default GeneateMap;

// import { X } from "lucide-react";
// import { useEffect, useRef, useState, ChangeEvent } from "react";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "../firebase";
// import { getAuth, User } from "firebase/auth";
// import GeneateMap1 from "./Map1";
// import Userdef from "./Modals/Userdef";
// import { useNavigate } from "react-router-dom";

// declare global {
//   interface Window {
//     initMap?: () => void;
//   }
// }

// interface SubCategory {
//   id: string;
//   name: string;
//   value: string;
// }

// interface MainCategory {
//   id: string;
//   name: string;
//   isDone: boolean;
// }

// // interface WasteCategory {
// //   checked: boolean;
// //   subcategories: {
// //     [key: string]: Subcategory;
// //   };
// // }

// interface FormData {
//   ucName: string;
//   population: string;
//   households: string;
//   incomeGroup: string;
//   growthRate: string;
//   forecast: string;
//   generationRate: string;
//   area: string;
//   //   wasteCategories: {
//   mainCategories: MainCategory[];
//   subCategories: SubCategory[];
//   selectedSubcategories: Array<{
//     mainCategoryId: string;
//     subCategoryId: string;
//     subCategory: SubCategory;
//   }>;
//   selectedOtherSubcategories: string[];
// }

// const containerStyle = {
//   width: "calc(100% + (350px))",
//   height: "60vh",
//   top: "0",
//   left: "-180px",
//   // border: "2px solid #73AD21",
//   zIndex: 1,
//   boxSizing: "border-box",
// };

// const paragraphStyle = {
//   fontFamily: "Open Sans",
//   margin: 0,
//   fontSize: 13,
// };

// const formLabelStyle = {
//   display: "block",
//   marginBottom: "5px",
//   fontWeight: "bold",
// };

// const inputStyle = {
//   width: "100%",
//   padding: "8px",
//   margin: "5px 0 15px 0",
//   display: "inline-block",
//   border: "1px solid #ccc",
//   borderRadius: "4px",
//   boxSizing: "border-box",
// };

// const selectStyle = {
//   width: "100%",
//   padding: "8px",
//   margin: "5px 0 15px 0",
//   borderRadius: "4px",
//   border: "1px solid #ccc",
//   fontSize: "14px",
// };

// const checkboxStyle = {
//   marginRight: "10px",
// };

// const submitButtonStyle = {
//   backgroundColor: "#4CAF50",
//   color: "white",
//   padding: "10px 15px",
//   border: "none",
//   borderRadius: "4px",
//   cursor: "pointer",
//   width: "100%",
//   fontSize: "16px",
// };

// export default function WasteCategories(open: any) {

//   const navigate = useNavigate();

//   const [roundedArea, setRoundedArea] = useState<number | undefined>();
//   const [isPolygonDrawn, setIsPolygonDrawn] = useState<boolean>(false);
//   const [
//     selectedPolygon,
//     setSelectedPolygon,
//   ] = useState<google.maps.Polygon | null>(null);
//   const [formData, setFormData] = useState<FormData>({
//     ucName: "",
//     households: "",
//     incomeGroup: "",
//     population: "",
//     growthRate: "",
//     forecast: "",
//     generationRate: "",
//     area: "",
//     mainCategories: [
//       { id: "biodegradables", name: "Biodegradables", isDone: false },
//       { id: "combustibles", name: "Combustibles", isDone: false },
//       { id: "recyclables", name: "Recyclables", isDone: false },
//       { id: "residues", name: "Residues", isDone: false },
//     ],
//     subCategories: [],
//     selectedSubcategories: [],
//     selectedOtherSubcategories: [],
//   });

//   const getRemainingSubcategories = () => {
//     const allSelected = [
//       ...formData.selectedSubcategories,
//       ...formData.selectedOtherSubcategories.map((id) => ({
//         subCategoryId: id,
//       })),
//     ];
//     const selectedIds = new Set(allSelected.map((item) => item.subCategoryId));
//     return formData.subCategories.filter((sc) => !selectedIds.has(sc.id));
//   };

//   const firstThreeDone = formData.mainCategories
//     .slice(0, 3)
//     .every((mc) => mc.isDone);

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const auth = getAuth();
//     const user: User | null = auth.currentUser;

//     if (!user) {
//       alert("You must be logged in to submit data");
//       return;
//     }

//     if (!isPolygonDrawn) {
//       alert("Please draw a polygon on the map before submitting--");
//       return;
//     }

//     try {
//       const polygonPath = selectedPolygon
//         ?.getPath()
//         .getArray()
//         .map((latLng) => ({
//           lat: latLng.lat(),
//           lng: latLng.lng(),
//         }));

//       const dataToSave = {
//         ...formData,
//         area: roundedArea,
//         polygonPath,
//         createdAt: new Date(),
//         createdBy: user.uid,
//       };
//       console.log(dataToSave);

//       setRoundedArea(0);
//       setFormData({
//         ucName: "",
//         population: "",
//         households: "",
//         incomeGroup: "",
//         growthRate: "",
//         forecast: "",
//         generationRate: "",
//         area: "",
//         mainCategories: [
//           { id: "biodegradables", name: "Biodegradables", isDone: false },
//           { id: "combustibles", name: "Combustibles", isDone: false },
//           { id: "recyclables", name: "Recyclables", isDone: false },
//           { id: "residues", name: "Residues", isDone: false },
//         ],
//         subCategories: [],
//         selectedSubcategories: [],
//         selectedOtherSubcategories: [],
//       });

//       if (selectedPolygon) {
//         selectedPolygon.setMap(null);
//       }
//       setRoundedArea(undefined);
//       setIsPolygonDrawn(false);
//       setSelectedPolygon(null);

//       navigate('/waste-categories', { state: formData });
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("Failed to save data");
//     }
//   };

//   useEffect(() => {
//     if (firstThreeDone) {
//       const remaining = getRemainingSubcategories();
//       setFormData((prev) => {
//         const newIds = remaining
//           .map((sub) => sub.id)
//           .filter((id) => !prev.selectedOtherSubcategories.includes(id));

//         return {
//           ...prev,
//           selectedOtherSubcategories: [
//             ...prev.selectedOtherSubcategories,
//             ...newIds,
//           ],
//         };
//       });
//     }
//   }, [firstThreeDone]);

//   const [newSubCatName, setNewSubCatName] = useState("");
//   const [newSubCatValue, setNewSubCatValue] = useState("");

//   const handleAddSubCategory = () => {
//     if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

//     const newSubCategory = {
//       id: `s${formData.subCategories.length + 1}`,
//       name: newSubCatName.trim(),
//       value: newSubCatValue.trim(),
//     };

//     setFormData((prev) => ({
//       ...prev,
//       subCategories: [...prev.subCategories, newSubCategory],
//     }));

//     setNewSubCatName("");
//     setNewSubCatValue("");
//   };

//   return (
//     <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">

//           {/* <h3 className="font-bold text-lg pl-[24px] py-1">
//             Waste Generation Map
//           </h3> */}
//           <div className="">
//             <GeneateMap1

//             />
//           </div>

//         </div>
//   );
// }
