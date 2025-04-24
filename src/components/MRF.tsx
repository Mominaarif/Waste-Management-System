"use client";
import { useState, useEffect, useRef } from "react";
import "../Styles/MRF.css";

// import $ from 'jquery';
import '../Styles/TableCSS.css';

// Import jQuery and make it global
import $ from 'jquery';
import 'datatables.net';

// import 'datatables.net-dt/css/jquery.dataTables.css';



type WasteItem = {
  type: string;
  inflow: number;
  recoveryEfficiency: number;
  typicalDensities: number;
};

const MRFDesign = () => {
  const [wasteData, setWasteData] = useState<WasteItem[]>([
    {
      type: "Glass Waste",
      inflow: 1000,
      recoveryEfficiency: 90,
      typicalDensities: 579.71,
    },
    {
      type: "Metals",
      inflow: 1000,
      recoveryEfficiency: 50,
      typicalDensities: 183.8,
    },
    {
      type: "E-Waste",
      inflow: 1000,
      recoveryEfficiency: 50,
      typicalDensities: 100.49,
    },
  ]);
  const [designPeriod, setDesignPeriod] = useState(3);
  const [depth, setDepth] = useState(8);
  const [shape, setShape] = useState("Square");
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

    const compositionSum = wasteData.reduce((sum, row) => {
      const compositionPercent = (row.inflow / totalInflow) * 100;

      const DensityContribution  = (row.typicalDensities * (compositionPercent / 100));
      return sum + DensityContribution;
    }, 0);
    const totalVolume = (totalInflow / compositionSum) * designPeriod;
    const areaRequired = totalVolume / depth;
    const dimensions = Math.sqrt(areaRequired).toFixed(1);

    // Calculate per waste recovery & revenue
    const recoveryData = wasteData.map((waste) => {
      const recovered = (waste.inflow / 100 ) * waste.recoveryEfficiency;
      const compositionPercent = (waste.inflow / totalInflow) * 100;
      const DensityContribution  = (waste.typicalDensities * (compositionPercent / 100));
      // const sum = sum + DensityContribution;

      return {
        type: waste.type,
        inflow: waste.inflow,
        recoveryEfficiency: waste.recoveryEfficiency,
        typicalDensities: waste.typicalDensities,
        recovered,
        compositionPercent,
        DensityContribution
        // revenue: recovered * waste.typicalDensities * 365,
      };
    });

    // const revenueData = wasteData.map((waste) => ({
    //   type: waste.type,
    //   recovered: (waste.inflow * waste.recoveryEfficiency) / 100,
    //   // revenue:
    //   //   ((waste.inflow * waste.recoveryEfficiency) / 100) * waste.typicalDensities * 365,
    // }));

    // const totalRevenue = recoveryData.reduce(
    //   (sum, waste) => sum + waste.revenue,
    //   0
    // );
    const totalInflowVolume = totalInflow / overallDensity;
    const totalRecoveredPerYear = totalRecovered * 365;
    const MRFLength = Math.round(Math.sqrt(areaRequired));

    setCalculatedData({
      totalInflow,
      totalRecovered,
      mrfEfficiency,
      overallDensity,
      totalVolume,
      areaRequired,
      dimensions,
      compositionSum,
      // totalRevenue,
      totalRecoveredPerYear,
      totalInflowVolume, // Add this as a separate field
      recoveryData, // Keep the structured recovery data
      // revenueData,
      MRFLength,
    });
  };

  const shapes = ["Square", "Rectangle", "Circle", "Triangle"];


  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const table = $(tableRef.current!).DataTable();

    return () => {
      table.destroy(); // Cleanup on unmount
    };
  }, []);
  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14 border shadow-sm py-4 font-bold">
        Material Recovery Facility (MRF) Design
      </h1> */}
      <div className="">
        <div className="pt-10 px-5 md:px-8 bg-white">
          <div className="border  p-8 rounded-md">
            {wasteData.map((waste, index) => (
              <div key={index} className="pb-8 mb-8 border-b">
                <h2 className="text-lg font-semibold text-gray-900 pb-5">
                  {waste.type}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 ">
                  <div className="">
                    <label className="block text-sm font-medium text-gray-900 pb-1">
                      Inflow (Kg/day):
                    </label>
                    <input
                      type="number"
                      value={waste.inflow ?? ""}
                      className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
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
                      className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                      value={waste.recoveryEfficiency ?? ""}
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
                      Typical Densities (Kg/m³):
                    </label>
                    <input
                      type="number"
                      className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                      value={waste.typicalDensities ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "typicalDensities",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div className="">
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  Design Period (days):
                </label>
                <input
                  type="number"
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  value={designPeriod ?? ""}
                  onChange={(e) =>
                    setDesignPeriod(parseFloat(e.target.value) || 0)
                  }
                />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-900 pb-1">
                  Depth (m):
                </label>
                <input
                  type="number"
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  value={depth ?? ""}
                  onChange={(e) => setDepth(parseFloat(e.target.value) || 0)}
                />
              </div>
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
                  {/* <option value="" disabled>
                          Select Shape
                        </option> */}
                  {shapes.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-5 rounded-md shadow-md hover:bg-blue-600"
                onClick={calculateMRF}
              >
                Calculate
              </button>
            </div>
          </div>
        </div>
       

        {calculatedData && (
          <div className="pt-10 px-5 md:px-8 bg-white">
            <div className="border p-8 rounded-md">
              <h2 className="text-lg font-semibold text-gray-900 pb-3">
                Outputs
              </h2>
              {calculatedData?.recoveryData && (
          <div>
            {/* <h2 className="text-xl font-bold mt-6">Recovery Table</h2> */}
            <table ref={tableRef}  style={{ width: '100%' }} className="display w-full border-collapse border border-gray-400 mt-4 text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="border border-gray-400 p-2">Waste Type</th>
                  {/* <th className="border border-gray-400 p-2">Inflow (Kg/day)</th> */}
                  <th className="border border-gray-400 p-2">
                    Recovered (Kg/day)
                  </th>
                  <th className="border border-gray-400 p-2">
                    Recovered(Kg/year)
                  </th>
                  <th className="border border-gray-400 p-2">
                    Composition (%)
                  </th>
                  <th className="border border-gray-400 p-2">
                    Density Contribution in Stream (Kg/m³)
                  </th>
                  {/* <th className="border border-gray-400 p-2">
                    Density of Recyclables Kg/m3
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {calculatedData.recoveryData?.map((waste: any, index: any) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-400 p-2">{waste.type}</td>
                    <td className="border border-gray-400 p-2">
                      {waste.recovered.toFixed(2)}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {(waste.recovered.toFixed(2) * 365).toFixed(2)}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {waste.compositionPercent.toFixed(8)}
                    </td>
                    <td className="border border-gray-400 p-2">
                      {waste.DensityContribution.toFixed(8)}
                    </td>
                    {/* <td className="border border-gray-400 p-2">
                      {waste.recoveryEfficiency}
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
             
          
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                  Density of Recyclables:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.compositionSum.toFixed(2)} Kg/m³
                  </span>
                </div>

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
                    Total Waste Outflow / Recovered:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.totalRecovered.toFixed(2)} Kg/day
                  </span>
                </div>

                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Total Recovered Waste (Kg/year):
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.totalRecoveredPerYear.toFixed(2)} Kg/year
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

                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Total Inflow Volume of Waste:
                  </label>
                  <span className="text-gray-700">
                    {(calculatedData.totalInflow.toFixed(2) / calculatedData.compositionSum.toFixed(2)).toFixed(2)} m³/day
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

                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Length:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.MRFLength} m
                  </span>
                </div>
                <div className="border p-3 rounded-md">
                  <label className="block text-sm font-medium text-gray-900">
                    Area Required:
                  </label>
                  <span className="text-gray-700">
                    {calculatedData.areaRequired.toFixed(2)} m²
                  </span>
                </div>
              </div>
              <div className=" mt-5">
                {/* <h2 className="block text-sm font-medium text-gray-900 py-6">
                {" "}
                Density and Volume Calculations
              </h2> */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
                  {/* <div className="border p-3 rounded-md">
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
                </div> */}
                </div>
              </div>

              <div className=" mt-5">
                {/* <h2 className="block text-sm font-medium text-gray-900 py-6">
                {" "}
                Density and Volume Calculations
              </h2> */}

              
                <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4 gap-x-6">
                

                  <div className="border p-3 rounded-md">
                    <label className="block text-sm font-medium text-gray-900">
                      Dimensions of MRF:
                    </label>
                    <span className="text-gray-700">
                      {calculatedData.dimensions}m × {calculatedData.dimensions}
                      m
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
              {/* <div className="border p-3 rounded-md mt-5">
              <label className="block text-sm font-medium text-gray-900">
                Total Revenue:
              </label>
              <span className="text-gray-700">
                {calculatedData.totalRevenue.toFixed(2)} Rs./year
              </span>
            </div> */}
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
