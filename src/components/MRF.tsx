"use client";
import { useState, useEffect, useRef } from "react";
import "../Styles/MRF.css";

// import $ from 'jquery';
import '../Styles/TableCSS.css';

// Import jQuery and make it global
import $ from 'jquery';
import 'datatables.net';

// import 'datatables.net-dt/css/jquery.dataTables.css';

interface SubCategory {
  id: string;
  name: string;
  value: string;
  typicalDensity: string;
  recoveryEfficiency: string;
  // typicalCalorificValue: string;
}

interface FormData {
  subCategories: SubCategory[];
}

type WasteItem = {
  type: string;
  inflow: number;
  recoveryEfficiency: number;
  typicalDensities: number;
};

const MRFDesign = () => {
  const [data1, setData1] = useState([]);
  const [totalWasteInput, setTotalWasteInput] = useState(4053473.96110292); // in kg/day
  const [editableSubcategories, setEditableSubcategories] = useState<any[]>([]);
  const [totalSubCatTypicalDensity, setTotalSubCatTypicalDensity] = useState(0);
  const [totalRecoveryEfficiency, setTotalRecoveryEfficiency] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("componentWasteData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter(
        (item: any) => item.mainCategoryId === "recyclables"
      );
      setData1(filtered);
    }
  }, []);

  useEffect(() => {
    if (data1.length > 0) {
      getCategories();
    }
  }, [data1]);
  useEffect(() => {
    const stored = localStorage.getItem("componentWasteData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter(
        (item: any) => item.mainCategoryId === "recyclables"
      );
      console.log(filtered);

      const withExtraFields = filtered.map((item: any) => ({
        mainCategoryId: item.mainCategoryId,
        name: item.name,
        percentage: item.percentage || "",
        waste: item.waste || "",
        typicalDensity: "",
        recoveryEfficiency: "",
      }));

      const total = filtered.reduce(
        (sum: any, subCat: any) => sum + (parseFloat(subCat.waste) || 0),
        0
      );
      setTotalSubCatValue(total);
      setEditableSubcategories(withExtraFields);
    }
  }, []);

  const getCategories = () => {
    const totalSubCatValue = data1.reduce((sum, subCat: any) => {
      const val = parseFloat(subCat.waste) || 0;
      console.log(sum + val);
      return sum + val;
    }, 0);
    setTotalWasteInput(totalSubCatValue);
  };


  const handleChange = (index: any, field: any, newValue: any) => {
    const updated = [...editableSubcategories];
    updated[index][field] = newValue;

    setEditableSubcategories(updated);


    const totalTypicalDensity = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.typicalDensity) || 0),
      0
    );

    const totalRecoveryEfficiency = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.recoveryEfficiency) || 0),
      0
    );

    ;
    setTotalSubCatTypicalDensity(totalTypicalDensity);
    setTotalRecoveryEfficiency(totalRecoveryEfficiency);
  };
  const componentOptions = [
    "Paper",
    "Cardboard",
    "Light Plastic",
    "Dense Plastic",
    "Textile Waste",
    "Metals",
    "Glass",
    "Wood",
    "Electronic Waste",
    "Leather",
    "C & D Waste",
  ];

  const [formData, setFormData] = useState<FormData>({
    subCategories: [],
  });

  const [totalSubCatValue, setTotalSubCatValue] = useState(0);

  const handleComponentSelect = (e: any) => {
    const selectedName = e.target.value;
    if (!selectedName) return;

    const alreadyExists = formData.subCategories.some(
      (subCat) => subCat.name === selectedName
    );
    if (alreadyExists) return;

    const newComponent = {
      id: `s${formData.subCategories.length + 1}`,
      name: selectedName,
      value: "0",
      typicalDensity: "0",
      recoveryEfficiency: "0",
    };

    const updated = [...formData.subCategories, newComponent];

    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));

    e.target.value = "";
  };

  const handleSubCategoryValueChange = ({
    name,
    field,
    newValue,
  }: {
    name: string;
    field:
    | "value"
    | "typicalDensity"
    | "recoveryEfficiency";
    newValue: string;
  }) => {
    const parsedNewValue = parseFloat(newValue);

    if (isNaN(parsedNewValue)) return;

    const updated = formData.subCategories.map((subCat) =>
      subCat.name === name
        ? {
          ...subCat,
          [field]: newValue,
        }
        : subCat
    );

    const total = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
      0
    );

    const totalTypicalDensity = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.typicalDensity) || 0),
      0
    );

    const totalRecoveryEfficiency = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.recoveryEfficiency) || 0),
      0
    );



    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));
    setTotalRecoveryEfficiency(totalRecoveryEfficiency);
    setTotalSubCatValue(total);
    setTotalSubCatTypicalDensity(totalTypicalDensity);
  };

  // console.log(formData.subCategories);

  console.log(formData.subCategories);

  const handleRemoveSubCategory = (name: any) => {
    const updated = formData.subCategories.filter(
      (subCat) => subCat.name !== name
    );

    const total = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
      0
    );

    const totalTypicalDensity = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.typicalDensity) || 0),
      0
    );

    const totalRecoveryEfficiency = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.recoveryEfficiency) || 0),
      0
    );



    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));
    setTotalRecoveryEfficiency(totalRecoveryEfficiency);
    setTotalSubCatValue(total);
    setTotalSubCatTypicalDensity(totalTypicalDensity);
  };
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
    let totalInflow:any
    let totalRecovered:any
    let mrfEfficiency:any
    let overallDensity:any
    let compositionSum:any
    let totalVolume:any
    let areaRequired:any
    let dimensions:any
    let recoveryData:any






    if (data1.length > 0) {
      
      totalInflow = editableSubcategories.reduce((sum, subCat) => {
        const percentage = parseFloat(subCat.waste); // Ensure it's a number
        return sum + percentage;
      }, 0);

    console.log(totalInflow);
    totalRecovered = editableSubcategories.reduce(
      (sum, waste) => sum + (waste.waste * waste.recoveryEfficiency) / 100,
      0
    );
    mrfEfficiency = ((totalRecovered / totalInflow) * 100).toFixed(2);
    overallDensity = editableSubcategories.reduce(
      (sum, waste) => sum + (waste.percentage * waste.typicalDensity) / 100,
      0
    );

     compositionSum = editableSubcategories.reduce((sum, row) => {
      const compositionPercent = (row.waste / totalInflow) * 100;

      const DensityContribution = (row.typicalDensity * (compositionPercent / 100));
      return sum + DensityContribution;
    }, 0);
     totalVolume = (totalInflow / compositionSum) * designPeriod;
     areaRequired = totalVolume / depth;
     dimensions = Math.sqrt(areaRequired).toFixed(1);

    // Calculate per waste recovery & revenue
     recoveryData = editableSubcategories.map((waste) => {
      const recovered = (waste.waste / 100) * waste.recoveryEfficiency;
      const compositionPercent = (waste.waste / totalInflow) * 100;
      const DensityContribution = (waste.typicalDensity * (compositionPercent / 100));
      // const sum = sum + DensityContribution;

      return {
        type: waste.name,
        inflow: waste.inflow,
        recoveryEfficiency: waste.recoveryEfficiency,
        typicalDensities: waste.typicalDensities,
        recovered,
        compositionPercent,
        DensityContribution
        // revenue: recovered * waste.typicalDensities * 365,
      };
    });
  }
  else {
    totalInflow = formData.subCategories.reduce((sum, subCat) => {
      const percentage = parseFloat(subCat.value); // Ensure it's a number
      return sum + percentage;
    }, 0);

  console.log(totalInflow);
  totalRecovered = formData.subCategories.reduce(
    (sum, waste) => sum + (parseFloat(waste.value) * parseFloat(waste.recoveryEfficiency)) / 100,
    0
  );
  mrfEfficiency = ((totalRecovered / totalInflow) * 100).toFixed(2);
  overallDensity = formData.subCategories.reduce(
    (sum, waste) => sum + (totalSubCatValue * parseFloat(waste.typicalDensity)) / 100,
    0
  );

   compositionSum = formData.subCategories.reduce((sum, row) => {
    const compositionPercent = (parseFloat(row.value) / totalInflow) * 100;

    const DensityContribution = (parseFloat(row.typicalDensity) * (compositionPercent / 100));
    return sum + DensityContribution;
  }, 0);
   totalVolume = (totalInflow / compositionSum) * designPeriod;
   areaRequired = totalVolume / depth;
   dimensions = Math.sqrt(areaRequired).toFixed(1);

  // Calculate per waste recovery & revenue
   recoveryData = formData.subCategories.map((waste) => {
    const recovered = (parseFloat(waste.value) / 100) * parseFloat(waste.recoveryEfficiency);
    const compositionPercent = (parseFloat(waste.value) / totalInflow) * 100;
    const DensityContribution = (parseFloat(waste.typicalDensity) * (compositionPercent / 100));
    // const sum = sum + DensityContribution;

    return {
      type: waste.name,
      inflow: waste.value,
      recoveryEfficiency: waste.recoveryEfficiency,
      typicalDensities: waste.typicalDensity,
      recovered,
      compositionPercent,
      DensityContribution
      // revenue: recovered * waste.typicalDensities * 365,
    };
  });
  }
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
  console.log(formData.subCategories)
  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14 border shadow-sm py-4 font-bold">
        Material Recovery Facility (MRF) Design
      </h1> */}
      <div className="">
        <div className="pt-10 px-5 md:px-8 bg-white">
          <div className="border  p-8 rounded-md">
          <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Input Parameters
            </h2>
            {data1.length > 0 ? (
              <>
                <table className="w-full border border-collapse border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Component</th>
                      <th className="border p-2">Inflow (Kg/day)</th>
                      {/* <th className="border p-2">tonnes/day</th> */}
                      <th className="border p-2">
                        Typical Densities (day/m³)
                      </th>
                      <th className="border p-2">Recovery Efficiency (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableSubcategories.map((subCat, idx) => (
                      <tr key={idx}>
                        <td className="p-[0_!important] pl-[8px_!important]">
                          {subCat.name}
                        </td>

                        <td className="p-[0_!important]">
                          <p className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm">
                            {subCat.waste}
                          </p>
                        </td>


                        <td className="p-[0_!important]">
                          <input
                            type="number"
                            value={subCat.typicalDensity}
                            className="block w-full  border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                            onChange={(e) =>
                              handleChange(idx, "typicalDensity", e.target.value)
                            }
                          />
                        </td>
                        <td className="p-[0_!important]">
                          <input
                            type="number"
                            className="block w-full  border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                            value={subCat.moistureContent}
                            onChange={(e) =>
                              handleChange(idx, "recoveryEfficiency", e.target.value)
                            }
                          />
                        </td>



                      </tr>
                    ))}

                    <tr className="bg-gray-100 font-semibold">
                      <td className="border p-2">Total</td>
                      <td className="border p-2">
                        {totalSubCatValue.toFixed(2)}
                      </td>
                      <td className="border p-2">
                        {totalSubCatTypicalDensity.toFixed(2)}
                      </td>
                      <td className="border p-2">
                        {totalRecoveryEfficiency}
                      </td>

                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <>
                <div className="w-full space-y-4">
                  {/* Dropdown always visible */}
                  <select
                    onChange={handleComponentSelect}
                    className="block h-[38px] w-full border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                  >
                    <option value="">Select Component</option>
                    {componentOptions
                      .filter(
                        (option) =>
                          !formData.subCategories.some(
                            (subCat) => subCat.name === option
                          )
                      )
                      .map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>

                  {/* Table of selected components */}
                  {formData.subCategories.length > 0 && (
                    <table className="w-full border border-collapse border-gray-300 text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border p-2">Component</th>
                          <th className="border p-2">Inflow (Kg/day)</th>
                          {/* <th className="border p-2">tonnes/day</th> */}
                          <th className="border p-2">
                            Typical Densities (day/m³)
                          </th>
                          <th className="border p-2">Recovery Efficiency (%)</th>

                          <th className="border p-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.subCategories.map((subCat, idx) => (
                          <tr key={idx}>
                            <td className="p-[0_!important] pl-[8px_!important]">
                              {subCat.name}
                            </td>

                            <td className="p-[0_!important]">
                              <input
                                type="number"
                                value={subCat.value}
                                onChange={(e) =>
                                  handleSubCategoryValueChange({
                                    name: subCat.name,
                                    field: "value",
                                    newValue: e.target.value,
                                  })
                                }
                                className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              />
                            </td>

                            <td className="p-[0_!important]">
                              <input
                                type="number"
                                value={subCat.typicalDensity}
                                onChange={(e) =>
                                  handleSubCategoryValueChange({
                                    name: subCat.name,
                                    field: "typicalDensity",
                                    newValue: e.target.value,
                                  })
                                }
                                className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              />
                            </td>
                            <td className="p-[0_!important]">
                              <input
                                type="number"
                                value={subCat.recoveryEfficiency}
                                onChange={(e) =>
                                  handleSubCategoryValueChange({
                                    name: subCat.name,
                                    field: "recoveryEfficiency",
                                    newValue: e.target.value,
                                  })
                                }
                                className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              />
                            </td>




                            <td>
                              <button
                                onClick={() =>
                                  handleRemoveSubCategory(subCat.name)
                                }
                                className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}

                        <tr className="bg-gray-100 font-semibold">
                          <td className="border p-2">Total</td>
                          <td className="border p-2">
                            {totalSubCatValue.toFixed(2)}
                          </td>
                          <td className="border p-2">
                            {totalSubCatTypicalDensity.toFixed(2)}
                          </td>
                          <td className="border p-2">
                            {totalRecoveryEfficiency}
                          </td>

                          <th></th>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
            {/* {wasteData.map((waste, index) => (
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
            ))} */}
            <div className="grid grid-cols-1 md:grid-cols-3 pt-3 gap-y-4 gap-x-6">
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
                  <table ref={tableRef} style={{ width: '100%' }} className="display w-full border-collapse border border-gray-400 mt-4 text-sm">
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
