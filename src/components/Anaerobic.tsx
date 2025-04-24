import React, { useState } from "react";
import "../Styles/App.css";
interface Results {
  totalBiodegradableWaste: number;
  waterRequirement: number;
  totalSlurryInflow: number;
  totalSlurry: number;
  volumeOfDigester: number;
  areaOfDigester: number;
  diameterOfDigester: number;
  biogasProduction: number;
  methaneProduction: number;
  electricityFromBiogas: number;
  electricityFromMethane: number;
  drySludgeProduction: number;
  recoveryData: { name: string; value: number; recovered: number }[];
}
const AnaerobicDigesterCalculator = () => {
  const reactorTemperature = ["Unheated/Ambient", "Mesophilic", "Thermophilic"];
  const systemTypes = ["Dry-Anaerobic Digester", "Wet-Anaerobic Digester"];
  const shapes = ["Square", "Rectangle", "Circular", "Triangle"];
  const bioReactorTypes = [
    "Completely Mixed Anaerobic Digester (CSTR)",
    "Up-Flow Anaerobic Sludge Blanket (UASB)",
  ];

  // State for user inputs
  const [foodWaste, setFoodWaste] = useState(2154.8);
  const [yardTrimmings, setYardTrimmings] = useState(141.6);
  const [animalDung, setAnimalDung] = useState(615.5);
  const [solidCaptureEfficiency, setSolidCaptureEfficiency] = useState(85);
  const [retentionTime, setRetentionTime] = useState(21);
  const [depth, setDepth] = useState(30);
  const [moistureContent, setMoistureContent] = useState(74);
  const [totalSolids, setTotalSolids] = useState(26);
  const [volatileSolids, setVolatileSolids] = useState(24);
  const [ashContent, setAshContent] = useState(2);
  const [cNratio, setCNratio] = useState(15);
  const [CO2, setCO2] = useState(50);
  const [methane, setMethane] = useState(50);
  const [energyContentBio, setEnergyContentBio] = useState(6.5);
  const [energyContentMeth, setEnergyContentMeth] = useState(10);

  const [electricityRate, setElectricityRate] = useState(42.72);
  const [electricityConsumption, setElectricityConsumption] = useState(10000);
  const [compostSalePrice, setCompostSalePrice] = useState(16);
  const [drySludg, setDrySludg] = useState(99009126.2947967);

  const [bioReactorType, setBioReactorType] = useState(bioReactorTypes[0]);
  const [reactorTemp, setReactorTemp] = useState(reactorTemperature[1]);
  const [systemType, setSystemType] = useState(systemTypes[0]);
  const [surryRatio, setSurryRatio] = useState("01:10");
  const [shape, setShape] = useState(shapes[2]);
  const [
    dewateringSolidCaptureEfficiency,
    setDewateringSolidCaptureEfficiency,
  ] = useState(85);

  const [results, setResults] = useState<Results | null>(null);

  const TableData = [
    {
      name: "Food Waste",
      value: foodWaste,
    },
    {
      name: "Yard Trimmings",
      value: yardTrimmings,
    },
    {
      name: "Animal Dung",
      value: animalDung,
    },
  ];
  const calculateOutputs = () => {
    // Constants
    const biogasEnergyContent = 6.5;
    const methaneEnergyContent = 10;
    const solidCaptureEfficiency = 0.85;

    // Calculations
    const totalBiodegradableWaste1 = foodWaste + yardTrimmings + animalDung;
    const totalBiodegradableWaste = Math.round(
      foodWaste + yardTrimmings + animalDung
    );
    const waterRequirement = totalBiodegradableWaste1 * 1000;
    const totalSlurryInflow = totalBiodegradableWaste1 * 2 * 1000;
    const totalSlurry = totalSlurryInflow / 1000;
    const volumeOfDigester = totalSlurry * retentionTime;
    const areaOfDigester = volumeOfDigester / depth;
    const diameterOfDigester = Math.sqrt((4 * areaOfDigester) / Math.PI);
    const biogasProduction = 238735;
    const methaneProduction = biogasProduction * 0.5;
    const electricityFromBiogas =
      (biogasProduction * 365 * biogasEnergyContent) / 1000;
    const electricityFromMethane =
      (methaneProduction * 365 * methaneEnergyContent) / 1000;
    const totalSolidsInWaste =
      (totalBiodegradableWaste1 * 1000 * totalSolids) / 100;
    const ashInWaste = (totalSolidsInWaste * ashContent) / 100;
    const drySludgeProduction =
      (totalSolidsInWaste - ashInWaste) * solidCaptureEfficiency * 365;

    const recoveryData = TableData.map((waste) => {
      const recovered = (waste.value / totalBiodegradableWaste1) * 100;
      return {
        name: waste.name,
        value: waste.value,
        recovered,
      };
    });

    setResults({
      totalBiodegradableWaste,
      waterRequirement,
      totalSlurryInflow,
      totalSlurry,
      volumeOfDigester,
      areaOfDigester,
      diameterOfDigester,
      biogasProduction,
      methaneProduction,
      electricityFromBiogas,
      electricityFromMethane,
      drySludgeProduction,
      recoveryData,
    });
  };

  const resultsDisplay = [
    {
      name: "Total Biodegradable Waste Inflow (tonnes/day)",
      value: results?.totalBiodegradableWaste,
    },
    { name: "Water Requirement (L/day)", value: results?.waterRequirement },
    { name: "Water Requirement (kg/day)", value: results?.waterRequirement },
    {
      name: "Total Slurry Inflow to Reactor (L/day)",
      value: results?.totalSlurryInflow,
    },
    {
      name: "Total Slurry Inflow to Reactor (m3/day)",
      value: results?.totalSlurry,
    },
    { name: "Volume of Digester (m3)", value: results?.volumeOfDigester },
    { name: "Area (m2)", value: results?.areaOfDigester },
    { name: "Diameter (m)", value: results?.diameterOfDigester },
    { name: "Biogas Production (litres)", value: results?.biogasProduction },
    { name: "Methane Production (litres)", value: results?.methaneProduction },
    {
      name: "Electricity from Biogas (kWh)",
      value: results?.electricityFromBiogas,
    },
    {
      name: "Electricity from Methane (kWh)",
      value: results?.electricityFromMethane,
    },
    {
      name: "Dry Sludge Production (kg/year)",
      value: results?.drySludgeProduction,
    },
  ];
  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14  border shadow-sm py-4 font-bold">
        Anaerobic Digester Design Calculator
      </h1> */}
      <div className="">
        <div className="pt-10 px-5 md:px-8">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Design Considerations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className="">
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  System Type:
                </label>

                <select
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    setSystemType(e.target.value);
                    console.log(e.target.value);
                  }}
                  defaultValue={systemType}
                >
                  {systemTypes.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  Reactor Temperature:
                </label>

                <select
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    setReactorTemp(e.target.value);
                    console.log(e.target.value);
                  }}
                  defaultValue={reactorTemp}
                >
                  {reactorTemperature.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
              {[
                {
                  label:
                    "Solid Capture Efficiency of Post-Digestion Dewatering System (%)",
                  value: solidCaptureEfficiency,
                  setter: setSolidCaptureEfficiency,
                },
                {
                  label: "Moisture Content (%)",
                  value: moistureContent,
                  setter: setMoistureContent,
                },
                {
                  label: "Total Solids (%)",
                  value: totalSolids,
                  setter: setTotalSolids,
                },
                {
                  label: "Volatile Solids (%)",
                  value: volatileSolids,
                  setter: setVolatileSolids,
                },
                {
                  label: "Ash Content (%)",
                  value: ashContent,
                  setter: setAshContent,
                },
              ].map(({ label, value, setter }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5">
              Bio-Reactor Design Specifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className="">
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  Reccomendation Bioreactor Type:
                </label>

                <select
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  onChange={(e) => {
                    setBioReactorType(e.target.value);
                    console.log(e.target.value);
                  }}
                  defaultValue={bioReactorType}
                >
                  {bioReactorTypes.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {[
                {
                  label: "Solid Retention Time (days)",
                  value: retentionTime,
                  setter: setRetentionTime,
                },

                {
                  label: "Waste Stream C:N ratio",
                  value: cNratio,
                  setter: setCNratio,
                },
              ].map(({ label, value, setter }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5">
              Biogas Composition
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              {[
                {
                  label: "Carbon Dioxide (CO2) (%)",
                  value: CO2,
                  setter: setCO2,
                },
                {
                  label: "Methane (CH4) (%)",
                  value: methane,
                  setter: setMethane,
                },
                {
                  label: "Energy Content (Biogas)",
                  value: energyContentBio,
                  setter: setEnergyContentBio,
                },
                {
                  label: "Energy Content (Methane)",
                  value: energyContentMeth,
                  setter: setEnergyContentMeth,
                },
              ].map(({ label, value, setter }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5">
              Solid Waste Inflow to Digestor
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 border-b pb-5">
              {[
                {
                  label: "Food Waste (tonnes/day)",
                  value: foodWaste,
                  setter: setFoodWaste,
                },
                {
                  label: "Yard Trimmings (tonnes/day)",
                  value: yardTrimmings,
                  setter: setYardTrimmings,
                },
                {
                  label: "Animal Dung (tonnes/day)",
                  value: animalDung,
                  setter: setAnimalDung,
                },
              ].map(({ label, value, setter }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 pt-5">
              <div className="">
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  Shape:
                </label>

                <select
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  onChange={(e) => {
                    setShape(e.target.value);
                    console.log(e.target.value);
                  }}
                  defaultValue={shape}
                >
                  {shapes.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  Slurry Ratio (Waste Inflow : Water):
                </label>
                <input
                  type="time"
                  value={surryRatio}
                  onChange={(e) => {
                    setSurryRatio(e.target.value);
                    console.log(e.target.value);
                  }}
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              {[
                {
                  label: "Depth of Digester (meters)",
                  value: depth,
                  setter: setDepth,
                },
                {
                  label: "Dewatering Solid Capture Efficiency",
                  value: dewateringSolidCaptureEfficiency,
                  setter: setDewateringSolidCaptureEfficiency,
                },
                {
                  label: "Electricity Rate (Rs./kWh)",
                  value: electricityRate,
                  setter: setElectricityRate,
                },
                {
                  label: "Electricity Consumption (kWh/house/year)",
                  value: electricityConsumption,
                  setter: setElectricityConsumption,
                },
                {
                  label: "Compost Sale Price (Rs./Kg)",
                  value: compostSalePrice,
                  setter: setCompostSalePrice,
                },

                {
                  label: "Dry Sludge/Compost (kg/year)",
                  value: drySludg,
                  setter: setDrySludg,
                },
              ].map(({ label, value, setter }, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value.toFixed(2)}
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                onClick={calculateOutputs}
                className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-blue-600"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {results && (
          <div className="pt-10 px-5 md:px-8 bg-white">
            <div className="border p-8 rounded-md">
              <h2 className="text-lg font-semibold text-gray-900 ">Outputs</h2>

              <table className=" w-full border-collapse border border-gray-400 mt-4 text-sm">
                <thead>
                  <tr className="bg-white">
                    <th className="border border-gray-400 p-2">
                      Waste Type (Biodegradables)
                    </th>
                    <th className="border border-gray-400 p-2">
                      Quantities (tonnes/day)
                    </th>

                    <th className="border border-gray-400 p-2">
                      Composition (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.recoveryData?.map((waste: any, index: any) => (
                    <tr key={index} className="text-center">
                      <td className="border border-gray-400 p-2">
                        {waste.name}
                      </td>
                      <td className="border border-gray-400 p-2">
                        {waste.value}
                      </td>
                      <td className="border border-gray-400 p-2">
                        {waste.recovered.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                {resultsDisplay.map((waste, id) => (
                <div key={id} className="border p-3 rounded-md">
                    <label className="block text-sm font-medium text-gray-900">
                      {waste.name}:
                    </label>
                    <span className="text-gray-700">{waste.value ? waste.value.toFixed(2): null}</span>
                  </div>
                ))}
                {/* {Object.entries(results).map(([key, value], index) => (
                  
                ))} */}
              </div>
            </div>
          </div>
        )}
        <div className="bg-white w-full pt-2">
          <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default AnaerobicDigesterCalculator;
