// import React, { useState } from "react";
// import "./MRF.css"; // Optional: For styling

// type WasteItem = {
//   type: string;
//   inflow: number;
//   recoveryEfficiency: number;
//   price: number;
// };

// const MRFDesign = () => {
//   // State for user inputs
//   const [wasteData, setWasteData] = useState<WasteItem[]>([
//     {
//       type: "Glass Waste",
//       inflow: 119554.2061,
//       recoveryEfficiency: 90,
//       price: 17,
//     },
//     {
//       type: "Metals",
//       inflow: 56292.08004,
//       recoveryEfficiency: 100,
//       price: 190,
//     },
//     {
//       type: "E-Waste",
//       inflow: 23343.27004,
//       recoveryEfficiency: 100,
//       price: 800,
//     },
//   ]);

//   const [designPeriod, setDesignPeriod] = useState(3); // days
//   const [depth, setDepth] = useState(8); // meters

//   // Handle input changes
//   // const handleInputChange = (index, field, value) => {
//   //   const newWasteData = [...wasteData];
//   //   newWasteData[index][field] = parseFloat(value) || 0;
//   //   setWasteData(newWasteData);
//   // };

//   const handleInputChange = (
//     index: number,
//     field: keyof WasteItem,
//     value: string
//   ) => {
//     const newWasteData = [...wasteData];

//     // Ensure that we only update numeric fields properly
//     if (field !== "type") {
//       newWasteData[index] = {
//         ...newWasteData[index],
//         [field]: parseFloat(value) || 0, // Convert input to a number
//       };
//     } else {
//       newWasteData[index] = {
//         ...newWasteData[index],
//         [field]: value, // Directly set string values
//       };
//     }

//     setWasteData(newWasteData);
//   };

//   // Calculations
//   const totalInflow = wasteData.reduce((sum, waste) => sum + waste.inflow, 0);
//   const totalRecovered = wasteData.reduce(
//     (sum, waste) => sum + (waste.inflow * waste.recoveryEfficiency) / 100,
//     0
//   );
//   const mrfEfficiency = ((totalRecovered / totalInflow) * 100).toFixed(2);

//   const densityData = [
//     { type: "Glass Waste", composition: 60.02031853, density: 579.71 },
//     { type: "Metals", composition: 28.260558, density: 183.8 },
//     { type: "E-Waste", composition: 11.71912348, density: 100.49 },
//   ];

//   const overallDensity = densityData.reduce(
//     (sum, waste) => sum + (waste.composition * waste.density) / 100,
//     0
//   );

//   const totalVolume = (totalInflow / overallDensity) * designPeriod;
//   const areaRequired = totalVolume / depth;
//   const dimensions = Math.sqrt(areaRequired).toFixed(1);

//   // Revenue calculations
//   const revenueData = wasteData.map((waste) => ({
//     type: waste.type,
//     recovered: (waste.inflow * waste.recoveryEfficiency) / 100,
//     revenue:
//       ((waste.inflow * waste.recoveryEfficiency) / 100) * waste.price * 365,
//   }));

//   const totalRevenue = revenueData.reduce(
//     (sum, waste) => sum + waste.revenue,
//     0
//   );

//   return (
//     <div className="w-full pb-10">
//       <h1 className=" text-3xl text-center bg-[#4CAF50] text-white shadow-md py-4 font-bold">
//         Material Recovery Facility (MRF) Design
//       </h1>
//       {/* <h1>Material Recovery Facility (MRF) Design</h1> */}

//       {/* User Inputs */}
//       <div className="p-8 pb-0 sm:pb-0 md:pb-0 sm:p-12 md:p-20 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <h1 className=" text-center font-bold text-xl mb-0">Input Data</h1>
//           {/* <div className="border-b border-gray-900/10 pb-8 mb-8"> */}
//           {wasteData.map((waste, index) => (
//             <div className="border-b border-gray-900/10 pb-8 mb-8">
//               <h2 className="text-base/7 font-semibold text-gray-900">
//                 {waste.type}
//               </h2>
//               <div
//                 key={index}
//                 className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6"
//               >
//                 <div className="sm:col-span-3">
//                   <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                     Inflow (Kg/day):
//                   </label>
//                   <div className="mt-2">
//                     <input
//                       type="number"
//                       value={waste.inflow}
//                       onChange={(e) =>
//                         handleInputChange(index, "inflow", e.target.value)
//                       }
//                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                     />
//                   </div>
//                 </div>
//                 <div className="sm:col-span-3">
//                   <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                     Recovery Efficiency (%):
//                   </label>
//                   <div className="mt-2">
//                     <input
//                       type="number"
//                       value={waste.recoveryEfficiency}
//                       onChange={(e) =>
//                         handleInputChange(
//                           index,
//                           "recoveryEfficiency",
//                           e.target.value
//                         )
//                       }
//                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                     />
//                   </div>
//                 </div>
//                 <div className="sm:col-span-3">
//                   <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                     Price (Rs./Kg):
//                   </label>
//                   <div className="mt-2">
//                     <input
//                       type="number"
//                       value={waste.price}
//                       onChange={(e) =>
//                         handleInputChange(index, "price", e.target.value)
//                       }
//                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {/* </div> */}
//           <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
//             <div className="sm:col-span-3">
//               <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                 Design Period (days):
//               </label>
//               <div className="mt-2">
//                 <input
//                   type="number"
//                   value={designPeriod}
//                   onChange={(e) =>
//                     setDesignPeriod(parseFloat(e.target.value) || 0)
//                   }
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>
//             <div className="sm:col-span-3">
//               <label className="block text-sm/6 font-medium text-gray-900 my-0">
//                 Depth (m):
//               </label>
//               <div className="mt-2">
//                 <input
//                   type="number"
//                   value={depth}
//                   onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <button>Calculate</button>
//       </div>

//       {/* Waste Inflow and Recovery Efficiency */}
//       <div className="p-8 pb-0 sm:pb-0 md:pb-0 sm:p-12 md:p-20 md:pt-10 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <h2 className="block text-base font-medium text-gray-900 my-0 mb-5">
//             Waste Inflow and Recovery Efficiency
//           </h2>
//           <table className="text-sm/6">
//             <thead>
//               <tr>
//                 <th>Waste Type</th>
//                 <th>Inflow (Kg/day)</th>
//                 <th>Recovery Efficiency (%)</th>
//                 <th>Recovered (Kg/day)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {wasteData.map((waste, index) => (
//                 <tr key={index}>
//                   <td>{waste.type}</td>
//                   <td>{waste.inflow.toFixed(2)}</td>
//                   <td>{waste.recoveryEfficiency}</td>
//                   <td>
//                     {((waste.inflow * waste.recoveryEfficiency) / 100).toFixed(
//                       2
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <h1 className="block text-sm/6 font-medium text-gray-900 my-0 mb-2">
//             Total Waste Inflow: {totalInflow.toFixed(2)} Kg/day
//           </h1>
//           <h1 className="block text-sm/6 font-medium text-gray-900 my-0 mb-2">
//             Total Recovered Waste: {totalRecovered.toFixed(2)} Kg/day
//           </h1>
//           <h1 className="block text-sm/6 font-medium text-gray-900 my-0 mb-2">
//             Efficiency of MRF: {mrfEfficiency}%
//           </h1>
//         </div>
//       </div>

//       {/* Density and Volume Calculations */}
//       <div className="p-8 sm:pb-0 md:pb-0 sm:p-12 md:p-20 md:pt-10 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <h2 className=" block text-base font-medium text-gray-900 my-0 mb-5">
//             Density and Volume Calculations
//           </h2>
//           <div className="output-grid">
//             <div className="output-group ">
//               <label>Overall Density of Recyclables:</label>
//               <span>{overallDensity.toFixed(2)} Kg/m³</span>
//             </div>

//             <div className="output-group">
//               <label> Total Inflow Volume of Waste:</label>
//               <span> {(totalInflow / overallDensity).toFixed(2)} m³/day</span>
//             </div>

//             <div className="output-group">
//               <label>Volume of MRF: </label>
//               <span>{totalVolume.toFixed(2)} m³</span>
//             </div>
//           </div>
//         </div>
//       </div>

//  {/* Area and Dimensions */}
//       <div className="p-8 sm:pb-0 md:pb-0 sm:p-12 md:p-20 md:pt-10 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <h2 className=" block text-base font-medium text-gray-900 my-0 mb-5">
//             Area and Dimensions
//           </h2>
//           <div className="output-grid">
//             <div className="output-group ">
//               <label>Area Required:</label>
//               <span> {areaRequired.toFixed(2)} m²</span>
//             </div>

//             <div className="output-group">
//               <label>  Dimensions of MRF: </label>
//               <span>{dimensions}m × {dimensions}m</span>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* Revenue Generation */}
//       <div className="p-8 pb-0 sm:pb-0 md:pb-0 sm:p-12 md:p-20 md:pt-10 pt-16">
//         <div className="space-y-12 bg-white rounded-2xl p-[30px]">
//           <h2 className="block text-base font-medium text-gray-900 my-0 mb-5">
//             Revenue Generation from Recyclables
//           </h2>
//           <table className="text-sm/6">
//             <thead>
//               <tr>
//                 <th>Waste Type</th>
//                 <th>Recovered (Kg/year)</th>
//                 <th>Revenue (Rs./year)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {revenueData.map((waste, index) => (
//                 <tr key={index}>
//                   <td>{waste.type}</td>
//                   <td>{(waste.recovered * 365).toFixed(2)}</td>
//                   <td>{waste.revenue.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <h1 className="block text-sm/6 font-medium text-gray-900 my-0 mb-2">
//             Total Revenue Generated: {totalRevenue.toFixed(2)} Rs./year
//           </h1>
//         </div>
//       </div>

//       {/* <section>
//         <h2>Input Data</h2>
//         {wasteData.map((waste, index) => (
//           <div key={index} className="input-group">
//             <h3>{waste.type}</h3>
//             <label>
//               Inflow (Kg/day):
//               <input
//                 type="number"
//                 value={waste.inflow}
//                 onChange={(e) =>
//                   handleInputChange(index, "inflow", e.target.value)
//                 }
//               />
//             </label>
//             <label>
//               Recovery Efficiency (%):
//               <input
//                 type="number"
//                 value={waste.recoveryEfficiency}
//                 onChange={(e) =>
//                   handleInputChange(index, "recoveryEfficiency", e.target.value)
//                 }
//               />
//             </label>
//             <label>
//               Price (Rs./Kg):
//               <input
//                 type="number"
//                 value={waste.price}
//                 onChange={(e) =>
//                   handleInputChange(index, "price", e.target.value)
//                 }
//               />
//             </label>
//           </div>
//         ))}
//         <label>
//           Design Period (days):
//           <input
//             type="number"
//             value={designPeriod}
//             onChange={(e) => setDesignPeriod(parseFloat(e.target.value) || 0)}
//           />
//         </label>
//         <label>
//           Depth (m):
//           <input
//             type="number"
//             value={depth}
//             onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
//           />
//         </label>
//       </section> */}

//       {/* Waste Inflow and Recovery Efficiency */}
//       {/* <section>
//         <h2>Waste Inflow and Recovery Efficiency</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Waste Type</th>
//               <th>Inflow (Kg/day)</th>
//               <th>Recovery Efficiency (%)</th>
//               <th>Recovered (Kg/day)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {wasteData.map((waste, index) => (
//               <tr key={index}>
//                 <td>{waste.type}</td>
//                 <td>{waste.inflow.toFixed(2)}</td>
//                 <td>{waste.recoveryEfficiency}</td>
//                 <td>
//                   {((waste.inflow * waste.recoveryEfficiency) / 100).toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <p>Total Waste Inflow: {totalInflow.toFixed(2)} Kg/day</p>
//         <p>Total Recovered Waste: {totalRecovered.toFixed(2)} Kg/day</p>
//         <p>Efficiency of MRF: {mrfEfficiency}%</p>
//       </section> */}

//       {/* Density and Volume Calculations */}
//       {/* <section>
//         <h2>Density and Volume Calculations</h2>
//         <p>Overall Density of Recyclables: {overallDensity.toFixed(2)} Kg/m³</p>
//         <p>
//           Total Inflow Volume of Waste:{" "}
//           {(totalInflow / overallDensity).toFixed(2)} m³/day
//         </p>
//         <p>Volume of MRF: {totalVolume.toFixed(2)} m³</p>
//       </section> */}

//       {/* Area and Dimensions */}
//       {/* <section>
//         <h2>Area and Dimensions</h2>
//         <p>Area Required: {areaRequired.toFixed(2)} m²</p>
//         <p>
//           Dimensions of MRF: {dimensions}m × {dimensions}m
//         </p>
//       </section> */}

//       {/* Revenue Generation */}
//       {/* <section>
//         <h2>Revenue Generation from Recyclables</h2>
//         <table>
//           <thead>
//             <tr>
//               <th>Waste Type</th>
//               <th>Recovered (Kg/year)</th>
//               <th>Revenue (Rs./year)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {revenueData.map((waste, index) => (
//               <tr key={index}>
//                 <td>{waste.type}</td>
//                 <td>{(waste.recovered * 365).toFixed(2)}</td>
//                 <td>{waste.revenue.toFixed(2)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <p>Total Revenue Generated: {totalRevenue.toFixed(2)} Rs./year</p>
//       </section> */}
//     </div>
//   );
// };

// export default MRFDesign;

import React, { useState } from "react";
import "./MRF.css";

type WasteItem = {
  type: string;
  inflow: number;
  recoveryEfficiency: number;
  price: number;
};

const MRFDesign = () => {
  const [wasteData, setWasteData] = useState<WasteItem[]>([
    {
      type: "Glass Waste",
      inflow: 119554.2061,
      recoveryEfficiency: 90,
      price: 17,
    },
    {
      type: "Metals",
      inflow: 56292.08004,
      recoveryEfficiency: 100,
      price: 190,
    },
    {
      type: "E-Waste",
      inflow: 23343.27004,
      recoveryEfficiency: 100,
      price: 800,
    },
  ]);
  const [designPeriod, setDesignPeriod] = useState(3);
  const [depth, setDepth] = useState(8);
  const [calculatedData, setCalculatedData] = useState<any>(null);

  const handleInputChange = (
    index: number,
    field: keyof WasteItem,
    value: string
  ) => {
    const newWasteData = [...wasteData];
    newWasteData[index] = {
      ...newWasteData[index],
      [field]: field !== "type" ? parseFloat(value) || 0 : value,
    };
    setWasteData(newWasteData);
  };

  // const calculateMRF = () => {
  //   const totalInflow = wasteData.reduce((sum, waste) => sum + waste.inflow, 0);
  //   const totalRecovered = wasteData.reduce((sum, waste) => sum + (waste.inflow * waste.recoveryEfficiency) / 100, 0);
  //   const mrfEfficiency = ((totalRecovered / totalInflow) * 100).toFixed(2);

  //  const recoveryData = wasteData.map((waste) => ({
  //     type: waste.type,
  //     inflow: waste.inflow,
  //     recoveryEfficiency: waste.recoveryEfficiency,
  //     recovered: (waste.inflow * waste.recoveryEfficiency) / 100,
  //   }));
  //   const densityData = [
  //     { type: "Glass Waste", composition: 60.02031853, density: 579.71 },
  //     { type: "Metals", composition: 28.260558, density: 183.8 },
  //     { type: "E-Waste", composition: 11.71912348, density: 100.49 },
  //   ];
  //   const overallDensity = densityData.reduce((sum, waste) => sum + (waste.composition * waste.density) / 100, 0);
  //   const totalVolume = (totalInflow / overallDensity) * designPeriod;
  //   const areaRequired = totalVolume / depth;
  //   const dimensions = Math.sqrt(areaRequired).toFixed(1);

  //   const revenueData = wasteData.map((waste) => ({
  //     type: waste.type,
  //     recovered: (waste.inflow * waste.recoveryEfficiency) / 100,
  //     revenue: ((waste.inflow * waste.recoveryEfficiency) / 100) * waste.price * 365,
  //   }));
  //   const totalRevenue = revenueData.reduce((sum, waste) => sum + waste.revenue, 0);

  //   const totalInflowVolume = totalInflow / overallDensity;

  //   setCalculatedData({
  //     totalInflow,
  //     totalRecovered,
  //     mrfEfficiency,
  //     overallDensity,
  //     totalVolume,
  //     areaRequired,
  //     dimensions,
  //     revenueData,
  //     totalRevenue,
  //     totalInflowVolume,
  //     recoveryData
  //   });
  // };
  // console.log(calculatedData.recoveryData)
  const calculateMRF = () => {
    const totalInflow = wasteData.reduce((sum, waste) => sum + waste.inflow, 0);
    const totalRecovered = wasteData.reduce(
      (sum, waste) => sum + (waste.inflow * waste.recoveryEfficiency) / 100,
      0
    );
    const mrfEfficiency = ((totalRecovered / totalInflow) * 100).toFixed(2);

    const densityData = [
      { type: "Glass Waste", composition: 60.02031853, density: 579.71 },
      { type: "Metals", composition: 28.260558, density: 183.8 },
      { type: "E-Waste", composition: 11.71912348, density: 100.49 },
    ];
    const overallDensity = densityData.reduce(
      (sum, waste) => sum + (waste.composition * waste.density) / 100,
      0
    );
    const totalVolume = (totalInflow / overallDensity) * designPeriod;
    const areaRequired = totalVolume / depth;
    const dimensions = Math.sqrt(areaRequired).toFixed(1);

    // Calculate per waste recovery & revenue
    const recoveryData = wasteData.map((waste) => {
      const recovered = (waste.inflow * waste.recoveryEfficiency) / 100;
      return {
        type: waste.type,
        inflow: waste.inflow,
        recoveryEfficiency: waste.recoveryEfficiency,
        recovered,
        revenue: recovered * waste.price * 365,
      };
    });

    const revenueData = wasteData.map((waste) => ({
      type: waste.type,
      recovered: (waste.inflow * waste.recoveryEfficiency) / 100,
      revenue:
        ((waste.inflow * waste.recoveryEfficiency) / 100) * waste.price * 365,
    }));

    const totalRevenue = recoveryData.reduce(
      (sum, waste) => sum + waste.revenue,
      0
    );
    const totalInflowVolume = totalInflow / overallDensity;

    setCalculatedData({
      totalInflow,
      totalRecovered,
      mrfEfficiency,
      overallDensity,
      totalVolume,
      areaRequired,
      dimensions,
      totalRevenue,
      totalInflowVolume, // Add this as a separate field
      recoveryData, // Keep the structured recovery data
      revenueData,
    });
  };

  return (
    <div className="w-screen h-screen bg-white">
      <h1 className="text-3xl text-center border shadow-sm py-4 font-bold">
        Material Recovery Facility (MRF) Design
      </h1>
      <div className="h-[calc(96%-68px)] overflow-y-auto">

      <div className="pt-10 px-16 bg-white">
        <div className="border  p-8 rounded-md">
          {wasteData.map((waste, index) => (
            <div key={index} className="pb-8 mb-8 border-b">
              <h2 className="text-lg font-semibold text-gray-900 pb-5">
                {waste.type}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 ">
                <div className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    Inflow (Kg/day):
                  </label>
                  <input
                    type="number"
                    value={waste.inflow}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    onChange={(e) =>
                      handleInputChange(index, "inflow", e.target.value)
                    }
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    Recovery Efficiency (%):
                  </label>
                  <input
                    type="number"
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={waste.recoveryEfficiency}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "recoveryEfficiency",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    Price (Rs./Kg):
                  </label>
                  <input
                    type="number"
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={waste.price}
                    onChange={(e) =>
                      handleInputChange(index, "price", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="">
              <label className="block text-sm font-medium text-gray-900 pb-1">
                Inflow (Kg/day):
              </label>
              <input
                type="number"
                className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={designPeriod}
                onChange={(e) =>
                  setDesignPeriod(parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-900 pb-1">
                Inflow (Kg/day):
              </label>
              <input
                type="number"
                className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={depth}
                onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="flex justify-center">
          <button
            className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-5 rounded-md shadow-md hover:bg-blue-600"
            onClick={calculateMRF}
          >
            Calculate
          </button>
        </div></div>
      </div>
      {/* {calculatedData?.recoveryData && (
  <div>
    <h2 className="text-xl font-bold mt-6">Recovery Table</h2>
    <table className="w-full border-collapse border border-gray-400 mt-4">
      <thead>
        <tr className="bg-gray-200">
          <th className="border border-gray-400 p-2">Waste Type</th>
          <th className="border border-gray-400 p-2">Inflow (Kg/day)</th>
          <th className="border border-gray-400 p-2">Recovery Efficiency (%)</th>
          <th className="border border-gray-400 p-2">Recovered (Kg/day)</th>
        </tr>
      </thead>
      <tbody>
        {calculatedData.recoveryData?.map((waste:any, index:any) => (
          <tr key={index} className="text-center">
            <td className="border border-gray-400 p-2">{waste.type}</td>
            <td className="border border-gray-400 p-2">{waste.inflow.toFixed(2)}</td>
            <td className="border border-gray-400 p-2">{waste.recoveryEfficiency}</td>
            <td className="border border-gray-400 p-2">{waste.recovered.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)} */}

      {calculatedData && (
        <div className="pt-10 px-16 bg-white">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 pb-3">
              Outputs
            </h2>

            {/* <div>
              <h2 className="block text-sm font-medium text-gray-900">
                Waste Inflow and Recovery Efficiency
              </h2>
              <table className="w-full border-collapse border border-gray-400 mt-4">
                <thead>
                  <tr className="bg-gray-200 text-sm ">
                    <th className="border border-gray-400 p-2">Waste Type</th>
                    <th className="border border-gray-400 p-2">
                      Inflow (Kg/day)
                    </th>
                    <th className="border border-gray-400 p-2">
                      Recovery Efficiency (%)
                    </th>
                    <th className="border border-gray-400 p-2">
                      Recovered (Kg/day)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedData.recoveryData?.map(
                    (waste: any, index: any) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-400 p-2 text-sm ">
                          {waste.type}
                        </td>
                        <td className="border border-gray-400 p-2 text-sm ">
                          {waste.inflow.toFixed(2)}
                        </td>
                        <td className="border border-gray-400 p-2 text-sm ">
                          {waste.recoveryEfficiency}
                        </td>
                        <td className="border border-gray-400 p-2 text-sm ">
                          {waste.recovered.toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className="border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Waste Inflow:
                </label>
                <span className="text-gray-700">
                  {calculatedData.totalInflow.toFixed(2)} Kg/day
                </span>
              </div>

              <div className="border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Recovered Waste:
                </label>
                <span className="text-gray-700">
                  {calculatedData.totalRecovered.toFixed(2)} Kg/day
                </span>
              </div>

              <div className="border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Efficiency of MRF:
                </label>
                <span className="text-gray-700">
                  {calculatedData.mrfEfficiency}%
                </span>
              </div>
            </div>
            <div className=" mt-5">
              {/* <h2 className="block text-sm font-medium text-gray-900 py-6">
                {" "}
                Density and Volume Calculations
              </h2> */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Overall Density of Recyclables:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.overallDensity.toFixed(2)} Kg/m³
                  </span>
                </div>

                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Total Inflow Volume of Waste:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.totalInflowVolume.toFixed(2)} m³
                  </span>
                </div>

                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Volume of MRF:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.totalVolume.toFixed(2)} m³
                  </span>
                </div>
              </div>
            </div>

            <div className=" mt-5">
              {/* <h2 className="block text-sm font-medium text-gray-900 py-6">
                {" "}
                Density and Volume Calculations
              </h2> */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Area Required:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.areaRequired.toFixed(2)} m²
                  </span>
                </div>

                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Dimensions of MRF:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.dimensions}m × {calculatedData.dimensions}m
                  </span>
                </div>
              </div>
            </div>

            {/* <div className="">
              <h2 className="block text-sm font-medium text-gray-900 py-6">
                Revenue Generation from Recyclables
              </h2>
              <table className="text-sm">
                <thead>
                  <tr>
                    <th>Waste Type</th>
                    <th>Recovered (Kg/year)</th>
                    <th>Revenue (Rs./year)</th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedData?.revenueData.map((waste: any, index: any) => (
                    <tr key={index}>
                      <td>{waste.type}</td>
                      <td>{(waste.recovered * 365).toFixed(2)}</td>
                      <td>{waste.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
            <div className="border p-3 rounded-md mt-5">
              <label className="block text-sm font-medium text-gray-900">
                Total Revenue:
              </label>
              <span className="text-gray-700">
                {calculatedData.totalRevenue.toFixed(2)} Rs./year
              </span>
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

export default MRFDesign;
