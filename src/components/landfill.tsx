import React, { useEffect, useState } from "react";
import "../Styles/App.css";
import Landfill1 from "./landfill1";

interface SubCategory {
  id: string;
  name: string;
  value: string;
  // typicalDensity: string;
  // moistureContent: string;
  // typicalCalorificValue: string;
}

interface FormData {
  subCategories: SubCategory[];
}
const Landfill = () => {
  // Default inputs for design parameters
  const defaultDesignParams = {
    density: 0.9, // Density of waste in landfill (tons/m³)
    designPeriod: 20, // Design period (years)
    landfillDepth: 2.5, // Depth of landfill (m)
    incrementalFactor: 1.2, // Incremental factor for area
    trenchLifespan: 30, // Lifespan of trench (days)
    trenchWidth: 15, // Trench width (m)
    trenchDepth: 2.5, // Trench depth (m)
    cellWidth: 6, // Cell width (m)
    cellDepth: 1.5, // Cell depth (m)
    dailyCoverThickness: 0.15, // Daily cover thickness (m)
    finalCoverThickness: 0.65, // Final cover thickness (m)
    excavationPerformance: 20, // Excavation performance (m³/hr)
    workHoursPerDay: 8, // Work hours per day (hrs/day)
  };

  const defaultWasteInputs = {
    mswResidue: 48.65, // Residue from MSW stream (tonnes/day)
    diapers: 120.71, // Diapers (tonnes/day)
    glassResidue: 11.96, // Residue from Recyclables (Glass) (tonnes/day)
    combustibles: 160, // Residue from Combustibles (tonnes/day)
  };

  const [data1, setData1] = useState([]);
  const [totalWasteInput, setTotalWasteInput] = useState(4053473.96110292); // in kg/day

  useEffect(() => {
    const stored = localStorage.getItem("componentWasteDataOthers");
    if (stored) {
      const parsed = JSON.parse(stored);
      setData1(parsed);
    }
  }, []);

  useEffect(() => {
    if (data1.length > 0) {
      getCategories();
    }
  }, [data1]);

  const getCategories = () => {
    const totalSubCatValue = data1.reduce((sum, subCat: any) => {
      const val = parseFloat(subCat.waste) || 0;
      return sum + val;
    }, 0);
    setTotalWasteInput(totalSubCatValue);
  };

  // useEffect(() => {
  //   if (data1.length > 0) {
  //     getCategories();
  //   }
  // }, [data1]);

  // const getCategories = () => {
  //   const totalSubCatValue = data1.reduce((sum, subCat: any) => {
  //     const val = parseFloat(subCat.waste) || 0;
  //     return sum + val;
  //   }, 0);
  //   setTotalWasteInput(totalSubCatValue);
  // };

  // State for waste inputs
  // const [wasteInputs, setWasteInputs] = useState(defaultWasteInputs);

  // State for design parameters
  const [designParams, setDesignParams] = useState(defaultDesignParams);

  // State for outputs
  const [outputs, setOutputs] = useState({
    totalWastePerDay: 0,
    totalWastePerYear: 0,
    dailyVolumeInflow: 0,
    totalLandfillVolume: 0,
    landfillArea: 0,
    trenchVolume: 0,
    trenchDimensions: { width: 0, depth: 0, length: 0 },
    excavationTime: 0,
    cellDimensions: { width: 0, depth: 0, length: 0 },
    dailyCoverMaterial: 0,
    totalDailyCoverMaterial: 0,
    finalCoverMaterial: 0,
    totalCoverMaterial: 0,
  });

  // Function to calculate outputs
  const calculateLandfillDesign = () => {
    // Use default values if user leaves input fields blank
    // const mswResidue = wasteInputs.mswResidue || defaultWasteInputs.mswResidue;
    // const diapers = wasteInputs.diapers || defaultWasteInputs.diapers;
    // const glassResidue =
    //   wasteInputs.glassResidue || defaultWasteInputs.glassResidue;
    // const combustibles =
    //   wasteInputs.combustibles || defaultWasteInputs.combustibles;

    const density = designParams.density || defaultDesignParams.density;
    const designPeriod =
      designParams.designPeriod || defaultDesignParams.designPeriod;
    const landfillDepth =
      designParams.landfillDepth || defaultDesignParams.landfillDepth;
    const incrementalFactor =
      designParams.incrementalFactor || defaultDesignParams.incrementalFactor;
    const trenchLifespan =
      designParams.trenchLifespan || defaultDesignParams.trenchLifespan;
    const trenchWidth =
      designParams.trenchWidth || defaultDesignParams.trenchWidth;
    const trenchDepth =
      designParams.trenchDepth || defaultDesignParams.trenchDepth;
    const cellWidth = designParams.cellWidth || defaultDesignParams.cellWidth;
    const cellDepth = designParams.cellDepth || defaultDesignParams.cellDepth;
    const dailyCoverThickness =
      designParams.dailyCoverThickness ||
      defaultDesignParams.dailyCoverThickness;
    const finalCoverThickness =
      designParams.finalCoverThickness ||
      defaultDesignParams.finalCoverThickness;
    const excavationPerformance =
      designParams.excavationPerformance ||
      defaultDesignParams.excavationPerformance;
    const workHoursPerDay =
      designParams.workHoursPerDay || defaultDesignParams.workHoursPerDay;

    let totalWastePerDay = 0;
    // Step 1: Calculate total waste per day and year
    if (data1.length > 0) {
      totalWastePerDay = data1.reduce((sum, subCat: any) => {
        const val = parseFloat(subCat.waste) || 0;
        return sum + val;
      }, 0);
    } else {
      totalWastePerDay = totalSubCatValue;
    }

    const totalWastePerYear = totalWastePerDay * 365;
    // Step 2: Calculate daily volume inflow of waste
    const dailyVolumeInflow = totalWastePerDay / density;

    // Step 3: Calculate total landfill volume for design period
    const totalLandfillVolume = dailyVolumeInflow * 365 * designPeriod;

    // Step 4: Calculate landfill area
    const landfillArea =
      (totalLandfillVolume / landfillDepth) * incrementalFactor;

    // Step 5: Trench calculations
    const trenchVolume = (trenchLifespan * dailyVolumeInflow) / density;
    const trenchLength = trenchVolume / (trenchWidth * trenchDepth);
    const excavationTime =
      trenchVolume / (excavationPerformance * workHoursPerDay);

    // Step 6: Cell calculations
    const cellLength = dailyVolumeInflow / (cellWidth * cellDepth);
    const totalCellDepth = cellDepth + dailyCoverThickness;

    // Step 7: Cover material calculations
    const dailyCoverMaterial = cellWidth * cellLength * dailyCoverThickness;
    const totalDailyCoverMaterial = dailyCoverMaterial * 365 * designPeriod;
    const finalCoverMaterial = landfillArea * finalCoverThickness;
    const totalCoverMaterial = totalDailyCoverMaterial + finalCoverMaterial;

    // Update outputs state
    setOutputs({
      totalWastePerDay,
      totalWastePerYear,
      dailyVolumeInflow,
      totalLandfillVolume,
      landfillArea,
      trenchVolume,
      trenchDimensions: {
        width: trenchWidth,
        depth: trenchDepth,
        length: trenchLength,
      },
      excavationTime,
      cellDimensions: {
        width: cellWidth,
        depth: totalCellDepth,
        length: cellLength,
      },
      dailyCoverMaterial,
      totalDailyCoverMaterial,
      finalCoverMaterial,
      totalCoverMaterial,
    });
  };

  const componentOptions = [
    "Paper",
    "Cardboard",
    "Food Waste",
    "Yard Waste",
    "Animal Dunk",
    "Light Plastic",
    "Dense Plastic",
    "Textile Waste",
    "Metals",
    "Glass",
    "Wood",
    "Diapers",
    "Electronic Waste",
    "Leather",
    "C & D Waste",
    "Mixed Combustibles",
  ];

  const [formData, setFormData] = useState<FormData>({
    subCategories: [],
  });

  const [totalSubCatValue, setTotalSubCatValue] = useState(0);

  // Select component and add to subCategories if not already added
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
      value: "",
    };

    const updated = [...formData.subCategories, newComponent];
    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));

    // Reset dropdown
    e.target.value = "";
  };

  // Handle value input change
  const handleSubCategoryValueChange = ({ name, value }: any) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    const updated = formData.subCategories.map((subCat) =>
      subCat.name === name ? { ...subCat, value } : subCat
    );

    const total = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));
    setTotalSubCatValue(total);
  };
  console.log(formData.subCategories);

  const handleRemoveSubCategory = (name: any) => {
    const updated = formData.subCategories.filter(
      (subCat) => subCat.name !== name
    );

    const total = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));

    setTotalSubCatValue(total);
  };

  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14  border shadow-sm py-4 font-bold">
        Landfill Design
      </h1> */}
      <div className="">
        <div className="tabs pt-6 tabs-border ">
          <input
            type="radio"
            name="my_tabs_2"
            className="tab ml-5"
            aria-label="LF without LGR (D.P. Based)"
            defaultChecked
          />
          <div className="tab-content px-5 md:px-8">
            {/* Input Section */}
            <div className="pt-8 bg-white">
              <div className="border p-8 rounded-md">
                <div className="border-b border-gray-900/10 pb-8 mb-8">
                  <h2 className="text-base/7 font-semibold  py-4 text-gray-900">
                    Quantity to be Landfilled
                  </h2>

                  {data1.length > 0 ? (
                    <div
                      className={`grid grid-cols-1 ${data1.length > 2
                        ? "md:grid-cols-3"
                        : data1.length > 0
                          ? "md:grid-cols-2"
                          : "md:grid-cols-3"
                        } gap-y-4 gap-x-6`}
                    >
                      <>
                        {data1.map((item: any, index: number) => (
                          <div key={index} className=" ">
                            <label className="block text-sm/6 font-medium text-gray-900 my-0">
                              Residue from MSW Stream ({item.name})
                              (tonnes/day):
                            </label>
                            <div className="mt-2">
                              <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                                {item.waste}
                              </p>
                            </div>
                          </div>
                        ))}
                      </>
                    </div>
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
                                <th className="border p-2">tonnes/day</th>
                                <th className="border p-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.subCategories.map((subCat, idx) => (
                                <tr key={idx}>
                                  <td className="p-[0_!important] border pl-[8px_!important]">
                                    {subCat.name}
                                  </td>
                                  <td className="p-[0_!important] border">
                                    <input
                                      type="number"
                                      value={subCat.value}
                                      onChange={(e) =>
                                        handleSubCategoryValueChange({
                                          name: subCat.name,
                                          value: e.target.value,
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

                              {/* Total row */}
                              <tr className="bg-gray-100 font-semibold">
                                <td className="border p-2">Total</td>
                                <td className="border p-2">
                                  {totalSubCatValue.toFixed(8)}
                                </td>
                                <th></th>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                      {/* <div className=" ">
                          <label className="block text-sm/6 font-medium text-gray-900 my-0">
                            Residue from MSW Stream (C & D Waste ) (tonnes/day):
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              value={wasteInputs.mswResidue}
                              onChange={(e) =>
                                setWasteInputs({
                                  ...wasteInputs,
                                  mswResidue: parseFloat(e.target.value),
                                })
                              }
                              placeholder="Enter value (default: 48.65)"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>

                        <div className=" ">
                          <label className="block text-sm/6 font-medium text-gray-900">
                            Residue from MSW Stream (Diapers) (tonnes/day):
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              value={wasteInputs.diapers}
                              onChange={(e) =>
                                setWasteInputs({
                                  ...wasteInputs,
                                  diapers: parseFloat(e.target.value),
                                })
                              }
                              placeholder="Enter value (default: 120.71)"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>

                        <div className=" ">
                          <label className="block text-sm/6 font-medium text-gray-900">
                            Residue from Recyclables (Glass) (tonnes/day):
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              value={wasteInputs.glassResidue}
                              onChange={(e) =>
                                setWasteInputs({
                                  ...wasteInputs,
                                  glassResidue: parseFloat(e.target.value),
                                })
                              }
                              placeholder="Enter value (default: 11.96)"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div>

                        <div className=" ">
                          <label className="block text-sm/6 font-medium text-gray-900">
                            Residue from Combustibles (Mixed Combustibles)
                            (tonnes/day):
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              value={wasteInputs.combustibles}
                              onChange={(e) =>
                                setWasteInputs({
                                  ...wasteInputs,
                                  combustibles: parseFloat(e.target.value),
                                })
                              }
                              placeholder="Enter value (default: 160)"
                              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                          </div>
                        </div> */}
                    </>
                  )}
                </div>

                <div className="">
                  <h2 className="text-base/7 font-semibold  pb-2 text-gray-900">
                    Design Considerations
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Density to be achieved in landfill ( tons/m³):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.density}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              density: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 0.9)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Design Period (years):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.designPeriod}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              designPeriod: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 20)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-base/7 font-semibold py-4 text-gray-900">
                    Landfill Area Requirement
                  </h2>
                  <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Incremental Factor:
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.incrementalFactor}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              incrementalFactor: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 1.2)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-base/7 font-semibold  py-4 text-gray-900">
                    Trench Design
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                    {/* <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Landfill Depth (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.landfillDepth}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              landfillDepth: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 2.5)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div> */}

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Trench Lifespan (days):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.trenchLifespan}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              trenchLifespan: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 30)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Trench Width (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.trenchWidth}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              trenchWidth: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 15)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Trench Depth (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.trenchDepth}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              trenchDepth: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 2.5)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-base/7 font-semibold  py-4 text-gray-900">
                    Cell Design
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Cell Width (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.cellWidth}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              cellWidth: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 6)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Cell Depth (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.cellDepth}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              cellDepth: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 1.5)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-base/7 font-semibold  py-4 text-gray-900">
                    Time Required to Excavate a Trench
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pb-5">
                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Excavation Performance (m³/hr):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.excavationPerformance}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              excavationPerformance: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 20)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Work Hours Per Day (hrs/day):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.workHoursPerDay}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              workHoursPerDay: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 8)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  {/* <h2 className="text-base/7 font-semibold  py-4 text-gray-900">
                    Cell Design
                  </h2> */}
                  <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Daily Cover Thickness (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.dailyCoverThickness}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              dailyCoverThickness: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 0.15)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>

                    <div className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        Final Cover Thickness (m):
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          value={designParams.finalCoverThickness}
                          onChange={(e) =>
                            setDesignParams({
                              ...designParams,
                              finalCoverThickness: parseFloat(e.target.value),
                            })
                          }
                          placeholder="Enter value (default: 0.65)"
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      </div>
                    </div>
                  </div>
                  <div className=" flex justify-center">
                    <button
                      className=" bg-[#386641] cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-[#386641]/90"
                      onClick={calculateLandfillDesign}
                    >
                      Calculate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            {(outputs.totalWastePerDay > 0 ||
              outputs.totalWastePerYear > 0) && (
                <div className="pt-10 bg-white">
                  <div className="border p-8 rounded-md">
                    <h2 className="text-lg font-semibold pb-3 text-gray-900 ">
                      Outputs
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Quantity (tonnes/day):
                        </label>
                        <span className="text-gray-700">
                          {outputs.totalWastePerDay.toFixed(2)} tonnes/day
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Quantity (tonnes/year):
                        </label>
                        <span className="text-gray-700">
                          {outputs.totalWastePerYear.toFixed(2)} tonnes/year
                        </span>
                      </div>
                    </div>
                    <h2 className="text-lg py-4 font-semibold text-gray-900 ">
                      Landfill Volume
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Daily Volume Inflow:
                        </label>
                        <span className="text-gray-700">
                          {outputs.dailyVolumeInflow.toFixed(2)} m³/day
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Volume of Landfill required in 1 year:
                        </label>
                        <span className="text-gray-700">
                          {(
                            outputs.totalWastePerYear / designParams.density
                          ).toFixed(2)}{" "}
                          m³/year
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Volume of Landfill required in {designParams.designPeriod} years:
                        </label>
                        <span className="text-gray-700">
                          {outputs.totalLandfillVolume.toFixed(2)} m³
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Volume of Landfill required in {designParams.designPeriod} years:
                        </label>
                        <span className="text-gray-700">
                          {(outputs.totalLandfillVolume / 1000000).toFixed(2)} hm³
                        </span>
                      </div>
                    </div>
                    <h2 className="text-lg py-4 font-semibold text-gray-900 ">
                      Landfill Area Requirement
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total LF Design Volume:
                        </label>
                        <span className="text-gray-700">
                          {outputs.totalLandfillVolume.toFixed(2)} m³
                        </span>
                      </div>
                      {/* <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Area Required for LF:
                </label>
                <span className="text-gray-700">{(outputs.totalLandfillVolume/designParams.landfillDepth).toFixed(2)} m²</span>
              </div> */}
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Area Required for LF:
                        </label>
                        <span className="text-gray-700">
                          {(
                            outputs.totalLandfillVolume /
                            designParams.landfillDepth
                          ).toFixed(2)}{" "}
                          m²
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total LF Area Required, At:
                        </label>
                        <span className="text-gray-700">
                          {outputs.landfillArea.toFixed(2)} m²
                        </span>
                      </div>

                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total LF Area Required, At:
                        </label>
                        <span className="text-gray-700">
                          {(outputs.landfillArea / 10000).toFixed(2)} hectares
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg py-4 font-semibold text-gray-900 ">
                      Trench Design
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Trench Volume:
                        </label>
                        <span className="text-gray-700">
                          {(
                            (outputs.totalWastePerDay *
                              defaultDesignParams.trenchLifespan) /
                            designParams.density
                          ).toFixed(2)}{" "}
                          m³
                        </span>
                      </div>

                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Trench Length:
                        </label>
                        <span className="text-gray-700">
                          {(
                            (outputs.totalWastePerDay *
                              designParams.trenchLifespan) /
                            designParams.density /
                            (designParams.trenchDepth * designParams.trenchWidth)
                          ).toFixed(2)}{" "}
                          m
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Time Required to Excavate a Trench:
                        </label>
                        <span className="text-gray-700">
                          {(
                            (outputs.totalWastePerDay *
                              designParams.trenchLifespan) /
                            designParams.density /
                            (designParams.excavationPerformance *
                              designParams.workHoursPerDay)
                          ).toFixed(2)}{" "}
                          days
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg py-4 font-semibold text-gray-900 ">
                      Cell Design
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Cell Length:
                        </label>
                        <span className="text-gray-700">
                          {outputs.cellDimensions.length.toFixed(2)} m
                        </span>
                      </div>
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Depth of Cell:
                        </label>
                        <span className="text-gray-700">
                          {outputs.cellDimensions.depth.toFixed(2)} m
                        </span>
                      </div>
                    </div>

                    <h2 className="text-lg py-4 font-semibold text-gray-900 ">
                      Cover Material
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Area of 1 Cell:
                        </label>
                        <span className="text-gray-700">
                          {(
                            outputs.cellDimensions.length *
                            outputs.cellDimensions.depth
                          ).toFixed(2)}{" "}
                          m²
                        </span>
                      </div>

                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Daily Cover Material required for each cell:
                        </label>
                        <span className="text-gray-700">
                          {(
                            outputs.cellDimensions.length *
                            outputs.cellDimensions.depth *
                            designParams.dailyCoverThickness
                          ).toFixed(2)}{" "}
                          m³/day
                        </span>
                      </div>

                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Daily Cover Material required for{" "}
                          {designParams.designPeriod}-years design period:
                        </label>
                        <span className="text-gray-700">
                          {(
                            outputs.cellDimensions.length *
                            outputs.cellDimensions.depth *
                            designParams.dailyCoverThickness *
                            365 *
                            designParams.designPeriod
                          ).toFixed(2)}{" "}
                          m³
                        </span>
                      </div>

                      {/* <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Daily Cover Material required for 20-years design
                          period:
                        </label>
                        <span className="text-gray-700">
                          {(
                            designParams.finalCoverThickness *
                            (outputs.totalLandfillVolume /
                              designParams.landfillDepth)
                          ).toFixed(2)}{" "}
                          m³
                        </span>
                      </div> */}

                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Cover Material required in Landfill Life:
                        </label>
                        <span className="text-gray-700">
                          {(
                            designParams.finalCoverThickness *
                            (outputs.totalLandfillVolume /
                              designParams.landfillDepth) +
                            outputs.cellDimensions.length *
                            outputs.cellDimensions.depth *
                            designParams.dailyCoverThickness *
                            365 *
                            designParams.designPeriod
                          ).toFixed(2)}{" "}
                          m³
                        </span>
                      </div>

                      <div className=" border p-3 rounded-md">
                        <label className="block text-sm font-medium text-gray-900">
                          Total Cover Material required in Landfill Life:
                        </label>
                        <span className="text-gray-700">
                          {(
                            (designParams.finalCoverThickness *
                              (outputs.totalLandfillVolume /
                                designParams.landfillDepth) +
                              outputs.cellDimensions.length *
                              outputs.cellDimensions.depth *
                              designParams.dailyCoverThickness *
                              365 *
                              designParams.designPeriod) /
                            1000
                          ).toFixed(2)}{" "}
                          km³
                        </span>
                      </div>

                      {/* designParams.excavationPerformance * designParams.workHoursPerDay */}

                      {/* <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Trench Dimensions:
                </label>
                <span className="text-gray-700">
                  {outputs.trenchDimensions.width}m (W) x{" "}
                  {outputs.trenchDimensions.depth}m (D) x{" "}
                  {outputs.trenchDimensions.length.toFixed(2)}m (L)
                </span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Excavation Time:
                </label>
                <span className="text-gray-700">{outputs.excavationTime.toFixed(2)} days</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Cell Dimensions:
                </label>
                <span className="text-gray-700">
                  {outputs.cellDimensions.width}m (W) x{" "}
                  {outputs.cellDimensions.depth.toFixed(2)}m (D) x{" "}
                  {outputs.cellDimensions.length.toFixed(2)}m (L)
                </span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Daily Cover Material:
                </label>
                <span className="text-gray-700">{outputs.dailyCoverMaterial.toFixed(2)} m³/day</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Daily Cover Material (20 years):
                </label>
                <span className="text-gray-700">{outputs.totalDailyCoverMaterial.toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Final Cover Material:
                </label>
                <span className="text-gray-700">{outputs.finalCoverMaterial.toFixed(2)} m³</span>
              </div>
              <div className="border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Cover Material (20 years):
                </label>
                <span className="text-gray-700">{outputs.totalCoverMaterial.toFixed(2)} m³</span>
              </div> */}
                    </div>
                    <table
                      // ref={tableRef2}
                      className="w-full border text-sm my-3"
                    // {/* style={{ width: '100%' }} */}
                    >
                      <thead className="bg-gray-100">
                        <tr className="">
                          <th colSpan={2} className="border   p-2">Trench Dimensions</th>


                        </tr>
                      </thead>
                      <tbody>

                        <tr className="text-center">
                          <td className="border  w-[70%] p-2">Trench Length (m)</td>
                          <td className="border   p-2">
                            {outputs.cellDimensions.length.toFixed(2)}
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td className="border w-[70%]  p-2">Trench Width (m)</td>
                          <td className="border   p-2">
                            {designParams.trenchWidth.toFixed(2)}
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td className="border w-[70%]  p-2">Trench Depth (m)</td>
                          <td className="border   p-2">
                            {designParams.trenchDepth.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      // ref={tableRef2}
                      className="w-full border text-sm my-3"
                    // {/* style={{ width: '100%' }} */}
                    >
                      <thead className="bg-gray-100">
                        <tr className="">
                          <th colSpan={2} className="border   p-2">Cell Dimensions</th>


                        </tr>
                      </thead>
                      <tbody>

                        <tr className="text-center">
                          <td className="border  w-[70%] p-2">Cell Length (m)</td>
                          <td className="border   p-2">
                            {(
                              (outputs.totalWastePerDay *
                                designParams.trenchLifespan) /
                              designParams.density /
                              (designParams.trenchDepth * designParams.trenchWidth)
                            ).toFixed(2)}{" "}
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td className="border w-[70%]  p-2">Cell Width (m)</td>
                          <td className="border   p-2">
                            {designParams.cellWidth}
                          </td>
                        </tr>

                        <tr className="text-center">
                          <td className="border w-[70%]  p-2">Cell Depth (m)</td>
                          <td className="border   p-2">
                            {outputs.cellDimensions.depth.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flex justify-center ">
                      <div className="relative w-[700px] h-full">
                        <img src="/images/landfillUpdate.png" alt="" />
                        <p className="absolute md:top-[63%] top-[63%] md:left-[55%] left-[55%] md:text-[10px] text-[8px] font-[600]" style={{ transform: "rotate(325deg)" }}>
                          L =  {(
                            (outputs.totalWastePerDay *
                              designParams.trenchLifespan) /
                            designParams.density /
                            (designParams.trenchDepth * designParams.trenchWidth)
                          ).toFixed(2)} m
                        </p>
                        <p style={{ transform: "rotate(318deg)" }} className="absolute md:top-[45%] top-[45%] md:left-[15.5%] left-[15.5%] md:text-[10px] text-[8px] font-[600]">
                          W = {designParams.cellWidth.toFixed(2)} m
                        </p>
                        <p className="absolute md:top-[47.5%] top-[47.5%] md:left-[6%] left-[6%] md:text-[10px] text-[8px] font-[600]">
                          D = {outputs.cellDimensions.depth.toFixed(2)} m
                        </p>
                        <p className="absolute md:top-[33.9%] top-[33.9%] md:left-[8%] left-[8%] md:text-[10px] text-[8px] font-[600]">
                          Daily Cover = {designParams.dailyCoverThickness.toFixed(2)} m                     </p>
                        <p style={{ transform: "rotate(14deg)" }} className="absolute md:top-[40%] top-[40%] md:left-[54.5%] left-[54.5%] md:text-[10px] text-[8px] font-[600]">
                          L = {outputs.cellDimensions.length.toFixed(2)} m
                        </p>
                        <p style={{ transform: "rotate(330deg)" }} className="absolute md:top-[36%] top-[36%] md:left-[31.5%] left-[31.5%] md:text-[10px] text-[8px] font-[600]">
                          W = {designParams.trenchWidth.toFixed(2)} m
                        </p>
                        <p className="absolute md:top-[14%] top-[14%] md:left-[37%] left-[3374%] md:text-[10px] text-[8px] font-[600]">
                          D = {designParams.trenchDepth.toFixed(2)} m
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            className="tab"
            aria-label="LF without LGR (Area Based)"
          />
          <div className="tab-content px-5 md:px-8">
            <Landfill1 />
          </div>
        </div>

        <div className="bg-white w-full pt-2">
          <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
        </div>
      </div>
    </div>
  );
};

export default Landfill;
