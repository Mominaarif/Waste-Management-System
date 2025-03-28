// import React, { useState } from "react";
// import "./App.css";

// const AnaerobicDigesterCalculator = () => {
//   // State for user inputs
//   const [foodWaste, setFoodWaste] = useState(2154.8); // tonnes/day
//   const [yardTrimmings, setYardTrimmings] = useState(141.6); // tonnes/day
//   const [animalDung, setAnimalDung] = useState(615.5); // tonnes/day
//   const [retentionTime, setRetentionTime] = useState(21); // days
//   const [depth, setDepth] = useState(30); // meters
//   const [moistureContent, setMoistureContent] = useState(74); // %
//   const [totalSolids, setTotalSolids] = useState(26); // %
//   const [volatileSolids, setVolatileSolids] = useState(24); // %
//   const [ashContent, setAshContent] = useState(2); // %
//   const [cNratio, setCNratio] = useState(15); // C:N ratio

//   // Constants
//   const biogasEnergyContent = 6.5; // kWh/m³
//   const methaneEnergyContent = 10; // kWh/m³
//   const solidCaptureEfficiency = 0.85; // 85%

//   // Calculations
//   const totalBiodegradableWaste = foodWaste + yardTrimmings + animalDung; // tonnes/day
//   const waterRequirement = totalBiodegradableWaste * 1000; // kg/day (1 tonne = 1000 kg)
//   const totalSlurryInflow = totalBiodegradableWaste * 2 * 1000; // L/day (1:1 waste:water ratio)
//   const volumeOfDigester = (totalSlurryInflow / 1000) * retentionTime; // m³
//   const areaOfDigester = volumeOfDigester / depth; // m²
//   const diameterOfDigester = Math.sqrt((4 * areaOfDigester) / Math.PI); // meters

//   // Biogas and Methane Production
//   const biogasProduction = 238735; // m³/day (from document)
//   const methaneProduction = biogasProduction * 0.5; // m³/day (50% methane)

//   // Electricity Production
//   const electricityFromBiogas =
//     (biogasProduction * 365 * biogasEnergyContent) / 1000; // MWh/year
//   const electricityFromMethane =
//     (methaneProduction * 365 * methaneEnergyContent) / 1000; // MWh/year

//   // Digestate Production
//   const totalSolidsInWaste =
//     (totalBiodegradableWaste * 1000 * totalSolids) / 100; // kg/day
//   const volatileSolidsInWaste = (totalSolidsInWaste * volatileSolids) / 100; // kg/day
//   const ashInWaste = (totalSolidsInWaste * ashContent) / 100; // kg/day
//   const drySludgeProduction =
//     (totalSolidsInWaste - ashInWaste) * solidCaptureEfficiency * 365; // kg/year

//   return (
//     <div className="w-full">
//       <h1 className=" text-3xl text-center bg-[#4CAF50] text-white shadow-md py-4 font-bold">
//         Anaerobic Digester Design Calculator
//       </h1>
//       {/* <h1>Anaerobic Digester Design Calculator</h1> */}

//       {/* Input Section */}
//       <div className="p-8 pb-0 sm:pb-0 md:pb-0 sm:p-12 md:p-20 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <div className=" mb-8">
//             <h2 className="text-base/7 font-semibold text-gray-900">Inputs</h2>
//             {/* <h2>Inputs</h2> */}
//             <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Food Waste (tonnes/day):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={foodWaste}
//                     onChange={(e) => setFoodWaste(parseFloat(e.target.value))}
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Yard Trimmings (tonnes/day):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={yardTrimmings}
//                     onChange={(e) =>
//                       setYardTrimmings(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Animal Dung (tonnes/day):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={animalDung}
//                     onChange={(e) => setAnimalDung(parseFloat(e.target.value))}
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Retention Time (days):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={retentionTime}
//                     onChange={(e) =>
//                       setRetentionTime(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Depth of Digester (meters):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={depth}
//                     onChange={(e) => setDepth(parseFloat(e.target.value))}
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Moisture Content (%):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={moistureContent}
//                     onChange={(e) =>
//                       setMoistureContent(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Total Solids (%):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={totalSolids}
//                     onChange={(e) => setTotalSolids(parseFloat(e.target.value))}
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Volatile Solids (%):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={volatileSolids}
//                     onChange={(e) =>
//                       setVolatileSolids(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Ash Content (%):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={ashContent}
//                     onChange={(e) => setAshContent(parseFloat(e.target.value))}
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   C:N Ratio:
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={cNratio}
//                     onChange={(e) => setCNratio(parseFloat(e.target.value))}
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/*
//             <label>
//               Food Waste (tonnes/day):
//               <input
//                 type="number"
//                 value={foodWaste}
//                 onChange={(e) => setFoodWaste(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Yard Trimmings (tonnes/day):
//               <input
//                 type="number"
//                 value={yardTrimmings}
//                 onChange={(e) => setYardTrimmings(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Animal Dung (tonnes/day):
//               <input
//                 type="number"
//                 value={animalDung}
//                 onChange={(e) => setAnimalDung(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Retention Time (days):
//               <input
//                 type="number"
//                 value={retentionTime}
//                 onChange={(e) => setRetentionTime(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Depth of Digester (meters):
//               <input
//                 type="number"
//                 value={depth}
//                 onChange={(e) => setDepth(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Moisture Content (%):
//               <input
//                 type="number"
//                 value={moistureContent}
//                 onChange={(e) => setMoistureContent(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Total Solids (%):
//               <input
//                 type="number"
//                 value={totalSolids}
//                 onChange={(e) => setTotalSolids(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Volatile Solids (%):
//               <input
//                 type="number"
//                 value={volatileSolids}
//                 onChange={(e) => setVolatileSolids(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               Ash Content (%):
//               <input
//                 type="number"
//                 value={ashContent}
//                 onChange={(e) => setAshContent(parseFloat(e.target.value))}
//               />
//             </label>
//             <br />
//             <label>
//               C:N Ratio:
//               <input
//                 type="number"
//                 value={cNratio}
//                 onChange={(e) => setCNratio(parseFloat(e.target.value))}
//               />
//             </label> */}
//           </div>
//         </div>
//       </div>

//       {/* Output Section */}
//       {/* Output Section */}
//       <div className="p-8 sm:p-12 md:p-20 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           {/* <h2 className=" text-center text-xl">Outputs</h2> */}
//           <h2 className="text-base/7 font-semibold text-gray-900 mb-5">
//             Outputs
//           </h2>
//           <div className="output-grid">
//              <div className="output-group ">
//               <label>Total Biodegradable Waste:</label>
//               <span>{totalBiodegradableWaste.toFixed(2)}{" "}
//               tonnes/day</span>
//             </div>
//             <div className="output-group ">
//               <label>Water Requirement: </label>
//               <span>{waterRequirement.toFixed(2)} kg/day</span>
//             </div>
//             <div className="output-group ">
//               <label>Total Slurry Inflow: </label>
//               <span> {totalSlurryInflow.toFixed(2)} L/day</span>
//             </div>
//             <div className="output-group ">
//               <label>Volume of Digester:</label>
//               <span>{volumeOfDigester.toFixed(2)} m³</span>
//             </div>
//             <div className="output-group ">
//               <label>Area of Digester:</label>
//               <span> {areaOfDigester.toFixed(2)} m²</span>
//             </div>
//             <div className="output-group ">
//               <label>Diameter of Digester: </label>
//               <span>{diameterOfDigester.toFixed(2)} meters</span>
//             </div>
//             <div className="output-group ">
//               <label>Biogas Production: </label>
//               <span>{biogasProduction.toFixed(2)} m³/day</span>
//             </div>
//             <div className="output-group ">
//               <label>Methane Production: </label>
//               <span>{methaneProduction.toFixed(2)} m³/day</span>
//             </div>
//             <div className="output-group ">
//               <label>Electricity from Biogas: </label>
//               <span>{electricityFromBiogas.toFixed(2)} MWh/year</span>
//             </div>
//             <div className="output-group ">
//               <label>Electricity from Methane:</label>
//               <span>{electricityFromMethane.toFixed(2)}{" "}
//               MWh/year</span>
//             </div>
//             <div className="output-group ">
//               <label>Dry Sludge Production: </label>
//               <span> {drySludgeProduction.toFixed(2)} kg/year</span>
//             </div>
//           </div>
//           {/* <p>
//             Total Biodegradable Waste: {totalBiodegradableWaste.toFixed(2)}{" "}
//             tonnes/day
//           </p>
//           <p>Water Requirement: {waterRequirement.toFixed(2)} kg/day</p>
//           <p>Total Slurry Inflow: {totalSlurryInflow.toFixed(2)} L/day</p>
//           <p>Volume of Digester: {volumeOfDigester.toFixed(2)} m³</p>
//           <p>Area of Digester: {areaOfDigester.toFixed(2)} m²</p>
//           <p>Diameter of Digester: {diameterOfDigester.toFixed(2)} meters</p>
//           <p>Biogas Production: {biogasProduction.toFixed(2)} m³/day</p>
//           <p>Methane Production: {methaneProduction.toFixed(2)} m³/day</p>
//           <p>
//             Electricity from Biogas: {electricityFromBiogas.toFixed(2)} MWh/year
//           </p>
//           <p>
//             Electricity from Methane: {electricityFromMethane.toFixed(2)}{" "}
//             MWh/year
//           </p>
//           <p>Dry Sludge Production: {drySludgeProduction.toFixed(2)} kg/year</p> */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnaerobicDigesterCalculator;

import React, { useState } from "react";
import "../Styles/App.css";
interface Results {
  totalBiodegradableWaste: number;
  waterRequirement: number;
  totalSlurryInflow: number;
  volumeOfDigester: number;
  areaOfDigester: number;
  diameterOfDigester: number;
  biogasProduction: number;
  methaneProduction: number;
  electricityFromBiogas: number;
  electricityFromMethane: number;
  drySludgeProduction: number;
}
const AnaerobicDigesterCalculator = () => {
  // State for user inputs
  const [foodWaste, setFoodWaste] = useState(2154.8);
  const [yardTrimmings, setYardTrimmings] = useState(141.6);
  const [animalDung, setAnimalDung] = useState(615.5);
  const [retentionTime, setRetentionTime] = useState(21);
  const [depth, setDepth] = useState(30);
  const [moistureContent, setMoistureContent] = useState(74);
  const [totalSolids, setTotalSolids] = useState(26);
  const [volatileSolids, setVolatileSolids] = useState(24);
  const [ashContent, setAshContent] = useState(2);
  const [cNratio, setCNratio] = useState(15);

  const [results, setResults] = useState<Results | null>(null);

  const calculateOutputs = () => {
    // Constants
    const biogasEnergyContent = 6.5;
    const methaneEnergyContent = 10;
    const solidCaptureEfficiency = 0.85;

    // Calculations
    const totalBiodegradableWaste = foodWaste + yardTrimmings + animalDung;
    const waterRequirement = totalBiodegradableWaste * 1000;
    const totalSlurryInflow = totalBiodegradableWaste * 2 * 1000;
    const volumeOfDigester = (totalSlurryInflow / 1000) * retentionTime;
    const areaOfDigester = volumeOfDigester / depth;
    const diameterOfDigester = Math.sqrt((4 * areaOfDigester) / Math.PI);
    const biogasProduction = 238735;
    const methaneProduction = biogasProduction * 0.5;
    const electricityFromBiogas =
      (biogasProduction * 365 * biogasEnergyContent) / 1000;
    const electricityFromMethane =
      (methaneProduction * 365 * methaneEnergyContent) / 1000;
    const totalSolidsInWaste =
      (totalBiodegradableWaste * 1000 * totalSolids) / 100;
    const ashInWaste = (totalSolidsInWaste * ashContent) / 100;
    const drySludgeProduction =
      (totalSolidsInWaste - ashInWaste) * solidCaptureEfficiency * 365;

    setResults({
      totalBiodegradableWaste,
      waterRequirement,
      totalSlurryInflow,
      volumeOfDigester,
      areaOfDigester,
      diameterOfDigester,
      biogasProduction,
      methaneProduction,
      electricityFromBiogas,
      electricityFromMethane,
      drySludgeProduction,
    });
  };

  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14  border shadow-sm py-4 font-bold">
        Anaerobic Digester Design Calculator
      </h1> */}
<div className="">
      <div className="pt-10 px-5 md:px-8">
        <div className="border p-8 rounded-md">
          <h2 className="text-lg font-semibold text-gray-900 pb-5">Inputs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
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
              {
                label: "Retention Time (days)",
                value: retentionTime,
                setter: setRetentionTime,
              },
              {
                label: "Depth of Digester (meters)",
                value: depth,
                setter: setDepth,
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
              { label: "C:N Ratio", value: cNratio, setter: setCNratio },
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              {Object.entries(results).map(([key, value], index) => (
                <div key={index} className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                    :
                  </label>
                  <span className="text-gray-700">{value.toFixed(2)}</span>
                </div>
              ))}
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
