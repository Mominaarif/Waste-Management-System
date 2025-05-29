import React, { useState, useEffect, useRef } from "react";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../Styles/map.css";
import { X } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home = (open: any) => {
  const [selectedCountry, setSelectedCountry] = useState("Pakistan");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [forecastDuration, setForecastDuration] = useState(5);
  const [wasteData, setWasteData] = useState({
    labels: [
      "Residential Waste",
      "Commercial Waste",
      "Industrial Waste",
      "Hazardous Waste",
    ],
    datasets: [
      {
        label: "Waste by Type (Tons)",
        data: [0, 0, 0, 0],
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

  const countries = ["Pakistan"];
  const provinces: { [key: string]: string[] } = {
    Pakistan: ["Punjab", "KPK", "Balochistan", "Sindh"],
    // India: ["Punjab", "KPK", "Balochistan", "Sindh"],
    // USA: ["Punjab", "KPK", "Balochistan", "Sindh"],
    // Germany: ["Punjab", "KPK", "Balochistan", "Sindh"],
    // Canada: ["Punjab", "KPK", "Balochistan", "Sindh"],
  };

  const cities = {
    Punjab: ["Lahore", "Rawalpindi", "Multan", "Faisalabad"],
    KPK: ["Peshawar", "Mardan", "Abbottabad", "Swat"],
    Balochistan: ["Quetta", "Gwadar", "Khuzdar", "Zhob"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
  };

  const residentialWaste = [
    "Biochar Production",
    "Home Composting",
    "Recycling",
  ];
  const commercialWaste = [
    "Anaerobic Digestion",
    "Advanced Sorting",
    "Composting",
  ];
  const industrialWaste = ["Zero-Waste Processes", "Pyrolysis", "Waste-to-Energy (WtE)"];
  const hazardousWaste = [
    "Plasma Arc Gasification",
    "Carbon Capture and Storage (CCS)",
    "Chemical Neutralization",
  ];

  const generateRandomWasteData = () => {
    return wasteData.labels.map(() => Math.floor(Math.random() * 200) + 50);
  };

  const carbonEmissionFactors: { [key: string]: number } = {
    "Residential Waste": 100,
    "Commercial Waste": 150,
    "Industrial Waste": 200,
    "Hazardous Waste": 300,
  };

  const handleCountryChange = (e: any) => {
    setSelectedCountry(e.target.value);
    setSelectedProvince("");
    setSelectedCity("");
  };

  const handleProvinceChange = (e: any) => {
    setSelectedProvince(e.target.value);
    setSelectedCity("");
  };

  useEffect(() => {
    setSelectedProvince("Punjab");
    setSelectedCity("Lahore");

    const newWasteData = generateRandomWasteData();
    setWasteData({
      ...wasteData,
      datasets: [
        {
          ...wasteData.datasets[0],
          data: newWasteData,
        },
      ],
    });
  }, []);

  const handleCityChange = (e: any) => {
    setSelectedCity(e.target.value);
    const newWasteData = generateRandomWasteData();
    setWasteData({
      ...wasteData,
      datasets: [
        {
          ...wasteData.datasets[0],
          data: newWasteData,
        },
      ],
    });
  };

  const handleForecastDurationChange = (e: any) =>
    setForecastDuration(e.target.value);

  const calculateCarbonFootprint = () => {
    return wasteData.labels.map((label, index) => {
      const wasteAmount = wasteData.datasets[0].data[index];
      const emissionFactor = carbonEmissionFactors[label];
      return wasteAmount * emissionFactor;
    });
  };

  const carbonFootprint = calculateCarbonFootprint();
  const totalCarbonEmissions = carbonFootprint.reduce(
    (acc, value) => acc + value,
    0
  );

  const pieData = {
    labels: wasteData.labels,
    datasets: [
      {
        label: "Carbon Footprint (kg CO2)",
        data: carbonFootprint,
        backgroundColor: [
          "rgb(22, 163, 74)",
          "rgb(59, 130, 246)",
          "rgb(107, 114, 128)",
          "rgb(220, 38, 38)",
        ],
      },
    ],
  };

  const generateWasteForecast = (initialAmount: any, growthRate: any) => {
    const forecast = [];
    let currentAmount = initialAmount;
    for (let year = 0; year < forecastDuration; year++) {
      forecast.push(currentAmount);
      currentAmount += currentAmount * growthRate;
    }
    return forecast;
  };

  const forecastData = {
    Residential: generateWasteForecast(wasteData.datasets[0].data[0], 0.1),
    Commercial: generateWasteForecast(wasteData.datasets[0].data[1], 0.4),
    Industrial: generateWasteForecast(wasteData.datasets[0].data[2], 0.3),
    Hazardous: generateWasteForecast(wasteData.datasets[0].data[3], 0.2),
  };

  const forecastYears = Array.from(
    { length: forecastDuration },
    (_, i) => `Year ${2024 + i}`
  );

  const lineData = {
    labels: forecastYears,
    datasets: [
      {
        label: "Residential Waste",
        data: forecastData.Residential,
        borderColor: "rgba(22, 163, 74, 1)",
        backgroundColor: "rgba(22, 163, 74, 0.9)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Commercial Waste",
        data: forecastData.Commercial,
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.9)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Industrial Waste",
        data: forecastData.Industrial,
        borderColor: "rgba(107, 114, 128, 1)",
        borderWidth: 2,
        backgroundColor: "rgba(107, 114, 128, 0.9)",
        fill: false,
      },
      {
        label: "Hazardous Waste",
        data: forecastData.Hazardous,
        borderColor: "rgba(220, 38, 38, 1)",
        backgroundColor: "rgba(220, 38, 38, 0.9)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  let [isOpenForecast, setIsOpenForecast] = useState(false);
  let [isOpenCarbonFootprint, setIsOpenCarbonFootprint] = useState(false);

  function openForecast() {
    setIsOpenForecast(true);
  }

  function closeForecast() {
    setIsOpenForecast(false);
  }

  function openCarbonFootprint() {
    setIsOpenCarbonFootprint(true);
  }

  function closeCarbonFootprint() {
    setIsOpenCarbonFootprint(false);
  }

  const barRef = useRef<any>(null);

  useEffect(() => {
    if (barRef.current) {
      barRef.current.resize();
    }
  }, [open]);
  
  return (
    <div className="px-5 md:px-8 h-[calc(100vh-85px)] overflow-y-auto bg-white w-full pt-5">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-4 w-full pt-5">
        <label className="w-full">
          <span className="block text-sm font-medium text-gray-900 pb-1">
            Country:
          </span>
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          >
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        {selectedCountry && (
          <label>
            <span className="block text-sm font-medium text-gray-900 pb-1">
              Province:
            </span>
            <select
              value={selectedProvince}
              onChange={handleProvinceChange}
              className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            >
              <option value="">Select Province</option>
              {/* {provinces[selectedCountry]?.map((province:any) => ( */}
              {Object.keys(provinces).includes(selectedCountry) &&
                provinces[selectedCountry].map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
            </select>
          </label>
        )}

        {selectedProvince && (
          <label>
            <span className="block text-sm font-medium text-gray-900 pb-1">
              City:
            </span>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            >
              <option value="">Select City</option>
              {/* {cities[selectedProvince]?.map((city:any) => ( */}
              {Object.keys(cities).includes(selectedProvince) &&
                cities[selectedProvince as keyof typeof cities].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
            </select>
          </label>
        )}

        {/* <label>
          <span className="block text-sm font-medium text-gray-900 pb-1">
            Forecast Duration (Years):
          </span>
          <input
            type="number"
            value={forecastDuration}
            className='className="block w-full border rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            onChange={handleForecastDurationChange}
            min="1"
            max="20"
          />
        </label> */}
      </section>

      <span className=" w-full h-[0.9px] mt-5 mb-3 flex bg-[#e5e7eb]"></span>

      <section className="flex flex-col-reverse md:flex-row justify-between gap-6 w-full pt-5">
        <div
          className={`${
            open ? "w-full  md:w-[65%]" : "w-full md:w-[70%]"
          }  border-r pr-7`}
        >
          <CardTitle className="py-3 text-left">Waste Categorization</CardTitle>
          <div className="pl-4 h-[50vh]">
            <Bar
              ref={barRef}
              className="h-[100%_!important] min-w-[70vw] md:min-w-[70vh]"
              data={wasteData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className={`${open ? "w-full md:w-[35%]" : "w-full md:w-[30%]"} `}>
          <Card className="rounded-sm h-full">
            <CardHeader>
              <CardTitle className=" text-center">
                Other Waste Management Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-2 h-full">
              <Button
                onClick={openForecast}
                className="transition duration-300 ease-in-out bg-[#386641]  cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-[#386641]/90 "
              >
                Forecast
              </Button>
              <Button
                onClick={openCarbonFootprint}
                className="transition duration-300 ease-in-out bg-[#386641]  cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-[#386641]/90 "
              >
                Carbon Footprint
              </Button>
            </CardContent>
          </Card>
          <div>
            <Dialog
              open={isOpenForecast}
              as="div"
              className="relative z-10 focus:outline-none"
              onClose={closeForecast}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <DialogPanel
                    transition
                    className="relative w-[500px] rounded-sm p-4 pb-6 border bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                  >
                    <div className=" absolute top-0 right-0 p-2">
                      <Button
                        className=" cursor-pointer"
                        onClick={closeForecast}
                      >
                        <X />
                      </Button>
                    </div>
                    <DialogTitle as="h3" className="text-base font-bold pb-2 ">
                      Forecast
                    </DialogTitle>
                    <label>
                      <span className="block text-sm font-medium text-gray-900 pb-1">
                        Forecast Duration (Years):
                      </span>
                      <input
                        type="number"
                        value={forecastDuration}
                        className='className="block w-full border rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        onChange={handleForecastDurationChange}
                        min="1"
                        max="20"
                      />
                    </label>
                    <div className={` ${open ? "w-full " : "w-full "} mt-5`}>
                      <h2 className="block text-sm font-medium text-gray-900 pb-1">
                        Waste Forecast by Type
                      </h2>
                      <Line data={lineData} />
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
            <Dialog
              open={isOpenCarbonFootprint}
              as="div"
              className="relative z-10 focus:outline-none"
              onClose={closeCarbonFootprint}
            >
              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex items-center justify-center">
                  <DialogPanel
                    transition
                    className="relative w-screen h-screen  bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                  >
                    <div className=" absolute top-0 right-0 p-2">
                      <Button
                        className=" cursor-pointer"
                        onClick={closeCarbonFootprint}
                      >
                        <X />
                      </Button>
                    </div>
                    <DialogTitle
                      as="h3"
                      className="text-xl font-bold py-6  w-full text-center"
                    >
                      Carbon Footprint
                    </DialogTitle>
                    <div className="flex ">
                      <div
                        className={`h-full flex items-center justify-center w-full  p-8`}
                      >
                        <div className="pie-chart w-[450px_!important] flex justify-center ">
                          <div
                            className={`pie-chart w-[450px_!important]  `}
                          >
                            <Pie data={pieData} />
                            <h2 className="block text-sm text-center font-medium text-gray-900 pt-5">
                              Total Carbon Emissions:{" "}
                              <span className="font-normal">
                                {totalCarbonEmissions.toFixed(2)} kg CO2
                              </span>
                            </h2>
                          </div>
                        </div>
                      </div>
                      {/* <div className="w-[50%] px-8">
                      <DialogTitle
                      as="h3"
                      className="text-base font-bold  w-full text-center"
                    >
                     Technologies & Strategies
                    </DialogTitle>
                        <section className="flex flex-col items-center justify-center h-full gap-y-4 gap-x-4 w-full pt-5">
                          <label className="w-full">
                            <span className="block text-sm font-medium text-gray-900 pb-1">
                            Residential Waste:
                            </span>
                            <select
                              // value={selectedCountry}
                              // onChange={handleCountryChange}
                              className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            >
                              {residentialWaste.map((resWaste) => (
                                <option key={resWaste} value={resWaste}>
                                  {resWaste}
                                </option>
                              ))}
                            </select>
                          </label>

                        
                          <label className="w-full">
                            <span className="block text-sm font-medium text-gray-900 pb-1">
                            Commercial Waste:
                            </span>
                            <select
                              // value={selectedCountry}
                              // onChange={handleCountryChange}
                              className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            >
                              {commercialWaste.map((comWaste) => (
                                <option key={comWaste} value={comWaste}>
                                  {comWaste}
                                </option>
                              ))}
                            </select>
                          </label>

                     

                          <label className="w-full">
                            <span className="block text-sm font-medium text-gray-900 pb-1">
                            Industrial Waste:
                            </span>
                            <select
                              // value={selectedCountry}
                              // onChange={handleCountryChange}
                              className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            >
                              {industrialWaste.map((indWaste) => (
                                <option key={indWaste} value={indWaste}>
                                  {indWaste}
                                </option>
                              ))}
                            </select>
                          </label>


                          <label className="w-full">
                            <span className="block text-sm font-medium text-gray-900 pb-1">
                            Hazardous Waste:
                            </span>
                            <select
                              // value={selectedCountry}
                              // onChange={handleCountryChange}
                              className='className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                            >
                              {hazardousWaste.map((hazWaste) => (
                                <option key={hazWaste} value={hazWaste}>
                                  {hazWaste}
                                </option>
                              ))}
                            </select>
                          </label>

                        </section>
                      </div> */}
                    </div>
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
