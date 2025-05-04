import React, { useEffect, useState } from "react";
import "../Styles/App.css";

const Landfill1 = () => {
  const defaultWasteInputs = {
    mswResidue: 48.65, 
    diapers: 120.71, 
    glassResidue: 11.96, 
    combustibles: 160, 
  };

  const defaultDesignParams = {
    density: 0.9, 
    totalAlloctedArea: 1000000,
    landfillDepth: 2.5, 
    incrementalFactor: 0.2, 
    trenchLifespan: 30, 
    trenchWidth: 15, 
    trenchDepth: 2.5, 
    cellWidth: 6, 
    cellDepth: 1.5, 
    dailyCoverThickness: 0.15, 
    finalCoverThickness: 0.65, 
    excavationPerformance: 20, 
    workHoursPerDay: 8, 
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

  const [wasteInputs, setWasteInputs] = useState(defaultWasteInputs);

  const [designParams, setDesignParams] = useState(defaultDesignParams);

  const [outputs, setOutputs] = useState({
    totalWastePerDay: 0,
    actualLandfillArea: 0,
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

  const calculateLandfillDesign = () => {
    const mswResidue = wasteInputs.mswResidue || defaultWasteInputs.mswResidue;
    const diapers = wasteInputs.diapers || defaultWasteInputs.diapers;
    const glassResidue =
      wasteInputs.glassResidue || defaultWasteInputs.glassResidue;
    const combustibles =
      wasteInputs.combustibles || defaultWasteInputs.combustibles;

    const density = designParams.density || defaultDesignParams.density;
    const totalAlloctedArea =
      designParams.totalAlloctedArea || defaultDesignParams.totalAlloctedArea;
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

      const totalWastePerDay = data1.reduce((sum, subCat: any) => {
        const val = parseFloat(subCat.waste) || 0;
        return sum + val;
      }, 0);    const totalWastePerYear = totalWastePerDay * 365;

    const dailyVolumeInflow = totalWastePerDay / density;

    // const totalLandfillVolume = dailyVolumeInflow * 365 * totalAlloctedArea;

    const landfillArea = incrementalFactor;

    const trenchVolume = (trenchLifespan * dailyVolumeInflow) / density;
    const trenchLength = trenchVolume / (trenchWidth * trenchDepth);
    const excavationTime =
      trenchVolume / (excavationPerformance * workHoursPerDay);

    const cellLength = dailyVolumeInflow / (cellWidth * cellDepth);
    const totalCellDepth = cellDepth + dailyCoverThickness;

    const dailyCoverMaterial = cellWidth * cellLength * dailyCoverThickness;
    const totalDailyCoverMaterial = dailyCoverMaterial * 365 * totalAlloctedArea;
    const finalCoverMaterial = landfillArea * finalCoverThickness;
    const totalCoverMaterial = totalDailyCoverMaterial + finalCoverMaterial;



    ////////////////////////////////////////////
    const actualLandfillArea = designParams.totalAlloctedArea - (designParams.incrementalFactor * designParams.totalAlloctedArea);

    const totalLandfillVolume = (actualLandfillArea * designParams.landfillDepth ) / dailyVolumeInflow;


    setOutputs({
      totalWastePerDay,

      actualLandfillArea,

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
   <>
   <div className="pt-8 bg-white">
        <div className="border p-8 rounded-md">
          <div className="border-b border-gray-900/10 pb-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Waste Inputs
            </h2>
            <div className={`grid grid-cols-1 ${data1.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-y-4 gap-x-6`}>
            {data1.map((item: any, index: number) => (
                      <div key={index} className=" ">
                        <label className="block text-sm/6 font-medium text-gray-900 my-0">
                          Residue from MSW Stream ({item.name}) (tonnes/day):
                        </label>
                        <div className="mt-2">
                          <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                            {item.waste}
                          </p>
                        </div>
                      </div>
                    ))}
            </div>
          </div>

          <div className="">
            <h2 className="text-base/7 font-semibold text-gray-900">
              Design Parameters
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
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
                Total Allocated Area, At (m²):
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    value={designParams.totalAlloctedArea}
                    onChange={(e) =>
                      setDesignParams({
                        ...designParams,
                        totalAlloctedArea: parseFloat(e.target.value),
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

      {(outputs.totalWastePerDay > 0 || outputs.totalWastePerYear > 0) && (
        <div className="pt-10 bg-white">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 ">Outputs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Quantity (tonnes/day):
                </label>
                <span className="text-gray-700">{outputs.totalWastePerDay.toFixed(2)} tonnes/day</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Quantity (tonnes/year):
                </label>
                <span className="text-gray-700">{outputs.totalWastePerYear.toFixed(2)} tonnes/year</span>
              </div>

              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Actual Landfilling Area:
                </label>
                <span className="text-gray-700">{outputs.actualLandfillArea.toFixed(2)} m²</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Daily Volume Inflow:
                </label>
                <span className="text-gray-700">{outputs.dailyVolumeInflow.toFixed(2)} m³/day</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
               Life Span of Landfill:
                </label>
                <span className="text-gray-700">{outputs.totalLandfillVolume.toFixed(2)} days</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
               Life Span of Landfill:
                </label>
                <span className="text-gray-700">{(outputs.totalLandfillVolume / 365).toFixed(2)} years</span>
              </div>
        <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total LF Design Volume:
                </label>
                <span className="text-gray-700">{(outputs.actualLandfillArea * designParams.landfillDepth).toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                  Trench Volume:
                </label>
                <span className="text-gray-700">{((outputs.totalWastePerDay * defaultDesignParams.trenchLifespan) / designParams.density).toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Trench Length:
                </label>
                <span className="text-gray-700">{( ((outputs.totalWastePerDay * designParams.trenchLifespan) / designParams.density) / (designParams.trenchDepth * designParams.trenchWidth) ).toFixed(2)} m</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Time Required to Excavate a Trench:
                </label>
                <span className="text-gray-700">{( ((outputs.totalWastePerDay * designParams.trenchLifespan) / designParams.density) / (designParams.excavationPerformance * designParams.workHoursPerDay) ).toFixed(2)} days</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Cell Length:
                </label>
                <span className="text-gray-700">{outputs.cellDimensions.length.toFixed(2)} m</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Depth of Cell:
                </label>
                <span className="text-gray-700">{outputs.cellDimensions.depth.toFixed(2)} m</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Area of 1 Cell:
                </label>
                <span className="text-gray-700">{(outputs.cellDimensions.length * outputs.cellDimensions.depth).toFixed(2)} m²</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Daily Cover Material required for each cell:
                </label>
                <span className="text-gray-700">{((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness).toFixed(2)} m³/day</span>
              </div>
 <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Daily Cover Material required for n-years design period:
                </label>
                <span className="text-gray-700">{(((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness) * 365 * (outputs.totalLandfillVolume / 365)).toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Material required for Final Cover:
                </label>
                <span className="text-gray-700">{((designParams.finalCoverThickness) * (outputs.actualLandfillArea)).toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Cover Material required in Landfill Life:
                </label>
                <span className="text-gray-700">{((((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness) * 365 * (outputs.totalLandfillVolume / 365)) + ((designParams.finalCoverThickness) * (outputs.actualLandfillArea))).toFixed(2)} m³</span>
              </div>
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Cover Material required in Landfill Life:
                </label>
                <span className="text-gray-700">{(((((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness) * 365 * (outputs.totalLandfillVolume / 365)) + ((designParams.finalCoverThickness) * (outputs.actualLandfillArea)))/1000).toFixed(2)} km³</span>
              </div>

              
              {/*
             
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total LF Design Volume:
                </label>
                <span className="text-gray-700">{outputs.totalLandfillVolume.toFixed(2)} m³</span>
              </div>
               <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Area Required for LF:
                </label>
                <span className="text-gray-700">{(outputs.totalLandfillVolume/designParams.landfillDepth).toFixed(2)} m²</span>
              </div> 
              
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total LF Area Required, At:
                </label>
                <span className="text-gray-700">{((outputs.totalLandfillVolume/designParams.landfillDepth) * designParams.incrementalFactor).toFixed(2)} m²</span>
              </div>
             

              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total LF Area Required, At:
                </label>
                <span className="text-gray-700">{outputs.landfillArea.toFixed(2)} m²</span>
              </div>

              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total LF Area Required, At:
                </label>
                <span className="text-gray-700">{(outputs.landfillArea / 10000).toFixed(2)} hectares</span>
              </div>
              

              
              
             
              

              

              
              
              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Daily Cover Material required for 20-years design period:
                </label>
                <span className="text-gray-700">{(((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness) * 365 * designParams.totalAlloctedArea).toFixed(2)} m³/day</span>
              </div>

              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Daily Cover Material required for 20-years design period:
                </label>
                <span className="text-gray-700">{(designParams.finalCoverThickness * (outputs.totalLandfillVolume/designParams.landfillDepth)).toFixed(2)} m³</span>
              </div>

              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Cover Material required in Landfill Life:
                </label>
                <span className="text-gray-700">{((designParams.finalCoverThickness * (outputs.totalLandfillVolume/designParams.landfillDepth)) + (((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness) * 365 * designParams.totalAlloctedArea)).toFixed(2)} m³</span>
              </div>

              <div className=" border p-3 rounded-md">
                <label className="block text-sm font-medium text-gray-900">
                Total Cover Material required in Landfill Life:
                </label>
                <span className="text-gray-700">{(((designParams.finalCoverThickness * (outputs.totalLandfillVolume/designParams.landfillDepth)) + (((outputs.cellDimensions.length * outputs.cellDimensions.depth) * designParams.dailyCoverThickness) * 365 * designParams.totalAlloctedArea))/1000).toFixed(2)} km³</span>
              </div>
              */}


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
          </div>
        </div>
      )}
   </>
  );
};

export default Landfill1;
