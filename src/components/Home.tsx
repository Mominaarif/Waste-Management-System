import React, { useState, useEffect } from "react";
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

const Home = (open:any) => {
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
        data: [0, 0, 0, 0], // Initially set to zero
        backgroundColor: [
          // '#020617',
          // '#475569',
          // '#64748b',
          // '#cbd5e1',
          'rgb(2, 6, 23)',
          'rgb(71, 85, 105)',
          'rgb(100, 116, 139)',
          'rgb(203, 213, 225)',
      ],
        borderRadius: 5,
        barThickness: 38,
        borderSkipped: false,

      },
    ],
  });

  const countries = ["Pakistan", "India", "USA", "Germany", "Canada"];
  const provinces: { [key: string]: string[] } = {
    Pakistan: ["Punjab", "KPK", "Balochistan", "Sindh"],
  };

  const cities = {
    Punjab: ["Lahore", "Rawalpindi", "Multan", "Faisalabad"],
    KPK: ["Peshawar", "Mardan", "Abbottabad", "Swat"],
    Balochistan: ["Quetta", "Gwadar", "Khuzdar", "Zhob"],
    Sindh: ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
  };

  // Simulate fetching waste data and carbon emission factors dynamically
  const generateRandomWasteData = () => {
    return wasteData.labels.map(() => Math.floor(Math.random() * 200) + 50); // Random waste tonnage
  };

  const carbonEmissionFactors: { [key: string]: number } = {
    "Residential Waste": 100, // kg CO2 per ton
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

  // const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedProvince(e.target.value);
  // };

  // const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedCountry(e.target.value);
  // };

  // const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedCity(e.target.value);
  // };

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

  // Calculate total carbon emissions based on waste tonnage and emission factors
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

  // Carbon footprint chart data (Pie chart)
  const pieData = {
    labels: wasteData.labels,
    datasets: [
      {
        label: "Carbon Footprint (kg CO2)",
        data: carbonFootprint,
        backgroundColor: [
         '#020617',
          '#1e293b',
          '#475569',
          '#64748b',
        ],
      },
    ],
  };

  // Generate a forecast for each type of waste (simulated here)
  const generateWasteForecast = (initialAmount: any, growthRate: any) => {
    const forecast = [];
    let currentAmount = initialAmount;
    for (let year = 0; year < forecastDuration; year++) {
      forecast.push(currentAmount);
      currentAmount += currentAmount * growthRate; // Apply the growth rate
    }
    return forecast;
  };

  // Forecast data for each waste type
  const forecastData = {
    Residential: generateWasteForecast(wasteData.datasets[0].data[0], 0.1), // 5% growth
    Commercial: generateWasteForecast(wasteData.datasets[0].data[1], 0.4), // 4% growth
    Industrial: generateWasteForecast(wasteData.datasets[0].data[2], 0.3), // 3% growth
    Hazardous: generateWasteForecast(wasteData.datasets[0].data[3], 0.2), // 2% growth
  };

  // Update line chart labels dynamically based on forecast duration
  const forecastYears = Array.from(
    { length: forecastDuration },
    (_, i) => `Year ${2024 + i}`
  );

  // Line chart data with separate datasets for each waste type
  const lineData = {
    labels: forecastYears, // Dynamic labels based on forecastDuration
    datasets: [
      {
        label: "Residential Waste",
        data: forecastData.Residential,
        borderColor: "rgba(2, 6, 23, 1)",
        backgroundColor: "rgba(2, 6, 23, 0.9)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Commercial Waste",
        data: forecastData.Commercial,
        borderColor: "rgba(71, 85, 105, 1)",
        backgroundColor: "rgba(71, 85, 105, 0.9)",
        borderWidth: 2,
        fill: false,
      },
      {
        label: "Industrial Waste",
        data: forecastData.Industrial,
        borderColor: "rgba(100, 116, 139, 1)",
        borderWidth: 2,
        backgroundColor: "rgba(100, 116, 139, 0.9)",
        fill: false,
      },
      {
        label: "Hazardous Waste",
        data: forecastData.Hazardous,
        borderColor: "rgba(203, 213, 225, 1)",
        backgroundColor: "rgba(203, 213, 225, 0.9)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <div className="px-5 md:px-8 h-[calc(100vh-85px)] overflow-y-auto bg-white w-full pt-5">
      <section className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 w-full pt-5">
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
      </section>
      <span className=" w-full h-[0.9px] mt-9 mb-5 flex bg-[#e5e7eb]"></span>
      <section className="flex flex-wrap justify-between gap-5 w-full pt-5">
        <div className={`${open ? "w-full md:w-[45%]" :"w-full md:w-[49%]" }  border rounded-md p-5`}>
          <h2 className="block text-sm font-medium text-gray-900 pb-1">
            Waste Categorization
          </h2>
          <Bar data={wasteData} />
        </div>

        <div
          className={` ${open ? "w-full md:w-[45%]" :"w-full md:w-[49%]" } border rounded-md p-5 `}
        >
          <h2 className="block text-sm font-medium text-gray-900 pb-1">
            Waste Forecast by Type
          </h2>
          <Line data={lineData} />
        </div>

        <div className={`${open ? "w-full md:w-[45%]" :"w-full md:w-[49%]" } flex  flex-col justify-center  border rounded-md p-5`}>
          <h2 className="block text-left text-sm font-medium text-gray-900 pb-1">
            Carbon Footprint
          </h2>

          <div className="pie-chart w-full flex justify-center ">
            <div className={`pie-chart ${open ? "w-full" :"w-[60%]" }`}>
              <Pie data={pieData} />
              <h2 className="block text-sm text-left font-medium text-gray-900 pt-5">
                Total Carbon Emissions:{" "}
                <span className="font-normal">
                  {totalCarbonEmissions.toFixed(2)} kg CO2
                </span>
              </h2>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
