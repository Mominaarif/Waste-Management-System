import React, { useState } from "react";
import "../Styles/App.css";

const Landfill = () => {
  // Default inputs for waste quantities
  const defaultWasteInputs = {
    mswResidue: 48.65, // Residue from MSW stream (tonnes/day)
    diapers: 120.71, // Diapers (tonnes/day)
    glassResidue: 11.96, // Residue from Recyclables (Glass) (tonnes/day)
    combustibles: 160, // Residue from Combustibles (tonnes/day)
  };

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

  // State for waste inputs
  const [wasteInputs, setWasteInputs] = useState(defaultWasteInputs);

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
    const mswResidue = wasteInputs.mswResidue || defaultWasteInputs.mswResidue;
    const diapers = wasteInputs.diapers || defaultWasteInputs.diapers;
    const glassResidue =
      wasteInputs.glassResidue || defaultWasteInputs.glassResidue;
    const combustibles =
      wasteInputs.combustibles || defaultWasteInputs.combustibles;

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

    // Step 1: Calculate total waste per day and year
    const totalWastePerDay = mswResidue + diapers + glassResidue + combustibles;
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

  return (
    <div className="w-full h-screen bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14  border shadow-sm py-4 font-bold">
        Landfill Design
      </h1> */}
      <div className="h-[calc(96%-68px)] overflow-y-auto">

      {/* Input Section */}
      <div className="pt-10 px-5 md:px-8 bg-white">
        <div className="border p-8 rounded-md">
          <div className="border-b border-gray-900/10 pb-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Waste Inputs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className=" ">
                <label className="block text-sm/6 font-medium text-gray-900 my-0">
                  Residue from MSW Stream (tonnes/day):
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
                  Diapers (tonnes/day):
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
                  Residue from Combustibles (tonnes/day):
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
              </div>
            </div>
          </div>

          <div className="">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Design Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className=" ">
                <label className="block text-sm/6 font-medium text-gray-900 my-0">
                  Density of Waste (tons/m³):
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

              <div className=" ">
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
              </div>

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
            <div className=" flex justify-center">
            <button
              className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-blue-600"
              onClick={calculateLandfillDesign}
            >
              Calculate
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Output Section */}
      {(outputs.totalWastePerDay > 0 || outputs.totalWastePerYear > 0) && (
        <div className="pt-10 px-5 md:px-8 bg-white">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 ">Outputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Waste Per Day:
                </label>
                <span className="text-gray-700">{outputs.totalWastePerDay.toFixed(2)} tonnes/day</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Waste Per Year:
                </label>
                <span className="text-gray-700">{outputs.totalWastePerYear.toFixed(2)} tonnes/year</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Daily Volume Inflow:
                </label>
                <span className="text-gray-700">{outputs.dailyVolumeInflow.toFixed(2)} m³/day</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Total Landfill Volume (20 years):
                </label>
                <span className="text-gray-700">{outputs.totalLandfillVolume.toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Landfill Area:
                </label>
                <span className="text-gray-700">{outputs.landfillArea.toFixed(2)} m²</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Trench Volume:
                </label>
                <span className="text-gray-700">{outputs.trenchVolume.toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
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
              </div>
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

export default Landfill;
