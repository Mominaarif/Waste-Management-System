// import React, { useState } from "react";
// import "./App.css";

// function RDF() {
//   // State for input values
//   const [wasteComposition, setWasteComposition] = useState({
//     lightPlastics: 31.43,
//     densePlastics: 16.05,
//     paper: 8.8,
//     cardboard: 21.51,
//     textile: 11.56,
//     wood: 10.65,
//   });

//   const [totalWasteInput, setTotalWasteInput] = useState(1387860); // in kg/day
//   const [retentionTime, setRetentionTime] = useState(3); // in days
//   const [shredderEfficiency, setShredderEfficiency] = useState(95); // in %
//   const [pelletizerEfficiency, setPelletizerEfficiency] = useState(98); // in %
//   const [densificationRatio, setDensificationRatio] = useState(8); // ratio
//   const [optimumMoistureContent, setOptimumMoistureContent] = useState(20); // in %

//   const materialProperties = {
//     lightPlastics: { density: 0.52, moisture: 2, cv: 35 },
//     densePlastics: { density: 0.23, moisture: 2, cv: 41 },
//     paper: { density: 0.52, moisture: 6, cv: 13.5 },
//     cardboard: { density: 0.3, moisture: 5, cv: 13.5 },
//     textile: { density: 0.43, moisture: 10, cv: 20.2 },
//     wood: { density: 0.21, moisture: 12, cv: 18.4 },
//   } as const;

//   // Calculations
//   // const calculateDensity = () => {
//   //   return Object.keys(wasteComposition).reduce((total, material) => {
//   //     return (
//   //       total +
//   //       materialProperties[material].density *
//   //         (wasteComposition[material] / 100)
//   //     );
//   //   }, 0);
//   // };

//   const calculateDensity = () => {
//     return Object.keys(wasteComposition).reduce((total, material) => {
//       return (
//         total +
//         (materialProperties[material as keyof typeof materialProperties].density *
//           (wasteComposition[material as keyof typeof wasteComposition] / 100))
//       );
//     }, 0);
//   };

//   // const calculateMoistureContent = () => {
//   //   return Object.keys(wasteComposition).reduce((total, material) => {
//   //     return (
//   //       total +
//   //       materialProperties[material].moisture *
//   //         (wasteComposition[material] / 100)
//   //     );
//   //   }, 0);
//   // };

//   const calculateMoistureContent = () => {
//     return Object.keys(wasteComposition).reduce((total, material) => {
//       return (
//         total +
//         (materialProperties[material as keyof typeof materialProperties].moisture *
//           (wasteComposition[material as keyof typeof wasteComposition] / 100))
//       );
//     }, 0);
//   };

//   // const calculateCalorificValue = () => {
//   //   return Object.keys(wasteComposition).reduce((total, material) => {
//   //     return (
//   //       total +
//   //       materialProperties[material].cv * (wasteComposition[material] / 100)
//   //     );
//   //   }, 0);
//   // };

//   const calculateCalorificValue = () => {
//     return Object.keys(wasteComposition).reduce((total, material) => {
//       return (
//         total +
//         (materialProperties[material as keyof typeof materialProperties].cv * (wasteComposition[material as keyof typeof wasteComposition] / 100))
//       );
//     }, 0);
//   };

//   const calculateStorageVolume = () => {
//     const density = calculateDensity();
//     const volumePerDay = totalWasteInput / (density * 1000); // Convert density to kg/m³
//     return volumePerDay * retentionTime;
//   };

//   const calculateStorageArea = () => {
//     const storageVolume = calculateStorageVolume();
//     const depth = 8; // Assumed depth in meters
//     return storageVolume / depth;
//   };

//   const calculateRDFOutput = () => {
//     const shreddedOutput = totalWasteInput * (shredderEfficiency / 100);
//     return shreddedOutput * (pelletizerEfficiency / 100);
//   };

//   const calculateEquivalentCoal = () => {
//     const cvRDF = calculateCalorificValue();
//     const cvCoal = 28; // Calorific value of coal in MJ/kg
//     return (calculateRDFOutput() * cvRDF) / cvCoal;
//   };

//   return (
//     <div className="w-full">
//       <h1 className=" text-3xl text-center bg-[#4CAF50] text-white shadow-md py-4 font-bold">
//         RDF Design
//       </h1>

//       {/* Input Section */}
//       <div className="p-8 pb-0 sm:pb-0 md:pb-0 sm:p-12 md:p-20 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <div className=" mb-8">
//             <h2 className="text-base/7 font-semibold text-gray-900">
//               Input Parameters
//             </h2>
//             <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Total Waste Input (kg/day):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={totalWasteInput}
//                     onChange={(e) =>
//                       setTotalWasteInput(parseFloat(e.target.value))
//                     }
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
//                   Shredder Efficiency (%):{" "}
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={shredderEfficiency}
//                     onChange={(e) =>
//                       setShredderEfficiency(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Pelletizer Efficiency (%):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={pelletizerEfficiency}
//                     onChange={(e) =>
//                       setPelletizerEfficiency(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Densification Ratio:
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={densificationRatio}
//                     onChange={(e) =>
//                       setDensificationRatio(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>

//               <div className="sm:col-span-3">
//                 <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                   Optimum Moisture Content (%):
//                 </label>
//                 <div className="mt-2">
//                   <input
//                     type="number"
//                     value={optimumMoistureContent}
//                     onChange={(e) =>
//                       setOptimumMoistureContent(parseFloat(e.target.value))
//                     }
//                     className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <button >Click</button>
//       </div>
//       {/* <div className="input-section">
//         <h2>Input Parameters</h2>
//         <div className="input-group">
//           <label>Total Waste Input (kg/day):</label>
//           <input
//             type="number"
//             value={totalWasteInput}
//             onChange={(e) => setTotalWasteInput(parseFloat(e.target.value))}
//           />
//         </div>
//         <div className="input-group">
//           <label>Retention Time (days):</label>
//           <input
//             type="number"
//             value={retentionTime}
//             onChange={(e) => setRetentionTime(parseFloat(e.target.value))}
//           />
//         </div>
//         <div className="input-group">
//           <label>Shredder Efficiency (%):</label>
//           <input
//             type="number"
//             value={shredderEfficiency}
//             onChange={(e) => setShredderEfficiency(parseFloat(e.target.value))}
//           />
//         </div>
//         <div className="input-group">
//           <label>Pelletizer Efficiency (%):</label>
//           <input
//             type="number"
//             value={pelletizerEfficiency}
//             onChange={(e) =>
//               setPelletizerEfficiency(parseFloat(e.target.value))
//             }
//           />
//         </div>
//         <div className="input-group">
//           <label>Densification Ratio:</label>
//           <input
//             type="number"
//             value={densificationRatio}
//             onChange={(e) => setDensificationRatio(parseFloat(e.target.value))}
//           />
//         </div>
//         <div className="input-group">
//           <label>Optimum Moisture Content (%):</label>
//           <input
//             type="number"
//             value={optimumMoistureContent}
//             onChange={(e) =>
//               setOptimumMoistureContent(parseFloat(e.target.value))
//             }
//           />
//         </div>
//       </div> */}

//       {/* Output Section */}
//       <div className="p-8 sm:p-12 md:p-20 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <h2 className="text-base/7 font-semibold text-gray-900 mb-5">
//             Output Results
//           </h2>
//           <div className="output-grid">
//             <div className="output-group">
//               <label>Overall Density (tonnes/m³):</label>
//               <span>{calculateDensity().toFixed(2)}</span>
//             </div>
//             <div className="output-group">
//               <label>Overall Moisture Content (%):</label>
//               <span>{calculateMoistureContent().toFixed(2)}</span>
//             </div>
//             <div className="output-group">
//               <label>Overall Calorific Value (MJ/kg):</label>
//               <span>{calculateCalorificValue().toFixed(2)}</span>
//             </div>
//             <div className="output-group">
//               <label>Storage Volume Required (m³):</label>
//               <span>{calculateStorageVolume().toFixed(2)}</span>
//             </div>
//             <div className="output-group">
//               <label>Storage Area Required (m²):</label>
//               <span>{calculateStorageArea().toFixed(2)}</span>
//             </div>
//             <div className="output-group">
//               <label>RDF Output (kg/day):</label>
//               <span>{calculateRDFOutput().toFixed(2)}</span>
//             </div>
//             <div className="output-group">
//               <label>Equivalent Coal (kg/day):</label>
//               <span>{calculateEquivalentCoal().toFixed(2)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RDF;

import React, { useState } from "react";
import "../Styles/App.css";

interface Results {
  density: number;
  moistureContent: number;
  calorificValue: number;
  storageVolume: number;
  storageArea: number;
  rdfOutput: number;
  equivalentCoal: number;
}

function RDF() {
  // State for input values
  const [wasteComposition, setWasteComposition] = useState({
    lightPlastics: 31.43,
    densePlastics: 16.05,
    paper: 8.8,
    cardboard: 21.51,
    textile: 11.56,
    wood: 10.65,
  });

  const [totalWasteInput, setTotalWasteInput] = useState(1387860); // in kg/day
  const [retentionTime, setRetentionTime] = useState(3); // in days
  const [shredderEfficiency, setShredderEfficiency] = useState(95); // in %
  const [pelletizerEfficiency, setPelletizerEfficiency] = useState(98); // in %
  const [densificationRatio, setDensificationRatio] = useState(8); // ratio
  const [optimumMoistureContent, setOptimumMoistureContent] = useState(20); // in %

  const [calculatedValues, setCalculatedValues] = useState<Results | null>(
    null
  );

  const materialProperties = {
    lightPlastics: { density: 0.52, moisture: 2, cv: 35 },
    densePlastics: { density: 0.23, moisture: 2, cv: 41 },
    paper: { density: 0.52, moisture: 6, cv: 13.5 },
    cardboard: { density: 0.3, moisture: 5, cv: 13.5 },
    textile: { density: 0.43, moisture: 10, cv: 20.2 },
    wood: { density: 0.21, moisture: 12, cv: 18.4 },
  } as const;

  // Function to perform all calculations on button click
  const handleCalculate = () => {
    const density = Object.keys(wasteComposition).reduce((total, material) => {
      return (
        total +
        materialProperties[material as keyof typeof materialProperties]
          .density *
          (wasteComposition[material as keyof typeof wasteComposition] / 100)
      );
    }, 0);

    const moistureContent = Object.keys(wasteComposition).reduce(
      (total, material) => {
        return (
          total +
          materialProperties[material as keyof typeof materialProperties]
            .moisture *
            (wasteComposition[material as keyof typeof wasteComposition] / 100)
        );
      },
      0
    );

    const calorificValue = Object.keys(wasteComposition).reduce(
      (total, material) => {
        return (
          total +
          materialProperties[material as keyof typeof materialProperties].cv *
            (wasteComposition[material as keyof typeof wasteComposition] / 100)
        );
      },
      0
    );

    const volumePerDay = totalWasteInput / (density * 1000); // Convert density to kg/m³
    const storageVolume = volumePerDay * retentionTime;
    const storageArea = storageVolume / 8; // Assumed depth = 8 meters

    const rdfOutput =
      totalWasteInput *
      (shredderEfficiency / 100) *
      (pelletizerEfficiency / 100);
    const equivalentCoal = (rdfOutput * calorificValue) / 28; // Assuming coal CV = 28 MJ/kg

    setCalculatedValues({
      density,
      moistureContent,
      calorificValue,
      storageVolume,
      storageArea,
      rdfOutput,
      equivalentCoal,
    });
  };

  return (
    <div className="w-screen h-screen bg-white">
      <h1 className="text-lg md:text-3xl pl-5 md:pl-14 border shadow-sm py-4 font-bold">
        RDF Design
      </h1>
      <div className="h-[calc(96%-68px)] overflow-y-auto">
        {/* Input Section */}
        <div className="pt-10 px-5 md:px-16">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Input Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              {[
                // Mapping input fields
                {
                  label: "Total Waste Input (kg/day)",
                  value: totalWasteInput,
                  setter: setTotalWasteInput,
                },
                {
                  label: "Retention Time (days)",
                  value: retentionTime,
                  setter: setRetentionTime,
                },
                {
                  label: "Shredder Efficiency (%)",
                  value: shredderEfficiency,
                  setter: setShredderEfficiency,
                },
                {
                  label: "Pelletizer Efficiency (%)",
                  value: pelletizerEfficiency,
                  setter: setPelletizerEfficiency,
                },
                {
                  label: "Densification Ratio",
                  value: densificationRatio,
                  setter: setDensificationRatio,
                },
                {
                  label: "Optimum Moisture Content (%)",
                  value: optimumMoistureContent,
                  setter: setOptimumMoistureContent,
                },
              ].map((input, index) => (
                <div className="" key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {input.label}
                  </label>
                  <input
                    type="number"
                    value={input.value}
                    onChange={(e) =>
                      input.setter(parseFloat(e.target.value) || 0)
                    }
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-blue-600"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        {calculatedValues && (
          <div className="pt-10 px-5 md:px-16 bg-white">
            <div className="border p-8 rounded-md">
              <h2 className="text-lg font-semibold text-gray-900 ">Outputs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                {[
                  // Mapping output fields
                  {
                    label: "Overall Density (tonnes/m³)",
                    value: calculatedValues.density,
                  },
                  {
                    label: "Overall Moisture Content (%)",
                    value: calculatedValues.moistureContent,
                  },
                  {
                    label: "Overall Calorific Value (MJ/kg)",
                    value: calculatedValues.calorificValue,
                  },
                  {
                    label: "Storage Volume Required (m³)",
                    value: calculatedValues.storageVolume,
                  },
                  {
                    label: "Storage Area Required (m²)",
                    value: calculatedValues.storageArea,
                  },
                  {
                    label: "RDF Output (kg/day)",
                    value: calculatedValues.rdfOutput,
                  },
                  {
                    label: "Equivalent Coal (kg/day)",
                    value: calculatedValues.equivalentCoal,
                  },
                ].map((output, index) => (
                  <div className="border p-3 rounded-md" key={index}>
                    <label className="block text-sm font-medium text-gray-900">
                      {output.label}:
                    </label>
                    <span className="text-gray-700">
                      {output.value.toFixed(2)}
                    </span>
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
}

export default RDF;
