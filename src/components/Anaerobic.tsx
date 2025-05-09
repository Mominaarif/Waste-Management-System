import React, { useEffect, useState } from "react";
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
  TotalNonBiodegradableSolids: number;
  RemainingVolatileSolids: number;
  DigesterSolids: number;
  DrySludge: number;
  LiquidEffluent: number;
  DigesterSolidsGgPerYear: number;
  DrySludgeGgPerYear: number;
  LiquidEffluentGgPerYear: number;

  recoveryData: { name: string; value: number; recovered: number }[];
}

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
const AnaerobicDigesterCalculator = () => {
  const [data1, setData1] = useState([]);
  const [totalWasteInput, setTotalWasteInput] = useState(4053473.96110292); // in kg/day

  useEffect(() => {
    const stored = localStorage.getItem("componentWasteData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter(
        (item: any) => item.mainCategoryId === "biodegradables"
      );
      setData1(filtered);
    }
  }, []);

  // ✅ Run getCategories only after data1 is updated
  useEffect(() => {
    if (data1.length > 0) {
      getCategories();
    }
  }, [data1]);

  const getCategories = () => {
    const totalSubCatValue = data1.reduce((sum, subCat: any) => {
      const val = parseFloat(subCat.waste) || 0;
      console.log(sum + val);
      return sum + val;
    }, 0);
    setTotalWasteInput(totalSubCatValue);
  };

  const reactorTemperature = ["Unheated/Ambient", "Mesophilic", "Thermophilic"];
  const systemTypes = ["Dry-Anaerobic Digester", "Wet-Anaerobic Digester"];
  const shapes = ["Square", "Rectangle", "Circular", "Triangle"];
  const bioReactorTypes = [
    "Completely Mixed Anaerobic Digester (CSTR)",
    "Up-Flow Anaerobic Sludge Blanket (UASB)",
  ];

  // State for user inputs 5823862.42
  const [foodWaste, setFoodWaste] = useState(2154.827353);
  const [yardTrimmings, setYardTrimmings] = useState(141.6);
  const [animalDung, setAnimalDung] = useState(615.503855655573);
  const [solidCaptureEfficiency, setSolidCaptureEfficiency] = useState(85);
  const [retentionTime, setRetentionTime] = useState(21);
  const [depth, setDepth] = useState(30);
  const [moistureContent, setMoistureContent] = useState(74);
  const [totalSolids, setTotalSolids] = useState(26);
  const [volatileSolids, setVolatileSolids] = useState(24);
  const [ashContent, setAshContent] = useState(2);
  const [cNratio, setCNratio] = useState(15);
  const [CO2, setCO2] = useState(40);
  const [methane, setMethane] = useState(60);
  const [biogasDensity, setBiogasDensity] = useState(1.18);
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
  const componentOptions = [
    "Paper",
    "Cardboard",
    "Food Waste",
    "Yard Waste",
    "Animal Dunk",
   
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
      value: "0",
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
  const TableData = formData.subCategories.map((waste) => ({
    name: waste.name,
        value: waste.value,
  }))
  //  [
  //   {
  //     name: "Food Waste",
  //     value: foodWaste,
  //   },
  //   {
  //     name: "Yard Trimmings",
  //     value: yardTrimmings,
  //   },
  //   {
  //     name: "Animal Dung",
  //     value: animalDung,
  //   },
  // ];
  const calculateOutputs = () => {
    // Constants
    const biogasEnergyContent = 6.5;
    const methaneEnergyContent = 10;
    const solidCaptureEfficiency = 0.85;
    const typicalBiogasYield = 0.67;

    // Calculations
    let totalBiodegradableWaste: any;
    let totalBiodegradableWaste1: any;
    if (data1.length > 0) {
      totalBiodegradableWaste1 = totalWasteInput;
    } else {
      totalBiodegradableWaste1 = totalSubCatValue;
    }
    if (data1.length > 0) {
      totalBiodegradableWaste = totalWasteInput;
    } else {
      totalBiodegradableWaste = totalSubCatValue;
    }
    const waterRequirement = totalBiodegradableWaste1 * 1000;
    const totalSlurryInflow = totalBiodegradableWaste1 * 2 * 1000;
    const totalSlurry = totalSlurryInflow / 1000;
    const volumeOfDigester = totalSlurry * retentionTime;
    const areaOfDigester = volumeOfDigester / depth;
    const diameterOfDigester = Math.sqrt((4 * areaOfDigester) / Math.PI);
    // const biogasProduction = 238735;

    const totalSolidsInWaste =
      (totalBiodegradableWaste1 * 1000 * totalSolids) / 100;
    const ashInWaste = (totalSolidsInWaste * ashContent) / 100;
    const drySludgeProduction =
      (totalSolidsInWaste - ashInWaste) * solidCaptureEfficiency * 365;

    const dilutedFeedstockInflow =
      totalBiodegradableWaste *
      (volatileSolids / 100) *
      1000 *
      (1000 / (totalBiodegradableWaste * 1000));
    const substrateConcentration =
      totalBiodegradableWaste *
      (volatileSolids / 100) *
      1000 *
      (1000 / (totalBiodegradableWaste * 1000));

    const organicLoadingRate =
      (totalSlurry * substrateConcentration) / volumeOfDigester;

    const biogasProduction =
      typicalBiogasYield * organicLoadingRate * volumeOfDigester;
    // console.log(
    //   "typicalBiogasYield:  " + typicalBiogasYield,
    //   "organicLoadingRate: " + organicLoadingRate,
    //   "volumeOfDigester: " + volumeOfDigester,
    //   "volatileSolids: " + totalBiodegradableWaste * (volatileSolids / 100),
    //   "totalBiodegradableWaste: " + totalBiodegradableWaste,
    //   "dilutedFeedstockInflow" + dilutedFeedstockInflow
    // );

    const methaneProduction = biogasProduction * (methane / 100);
    const carbondioxide = biogasProduction * (CO2 / 100);

    const electricityFromBiogas = biogasProduction * energyContentBio;

    // const electricityFromMethane =
    // (methaneProduction * 365 * methaneEnergyContent) / 1000;
    const electricityFromMethane = carbondioxide * energyContentMeth;

    const TotalNonBiodegradableSolids =
      (ashContent / 100) * (totalBiodegradableWaste * 1000) * 365;

    const RemainingVolatileSolids =
      ((volatileSolids / 100) * (totalBiodegradableWaste * 1000) -
        biogasProduction * biogasDensity) *
      365;

    // const RemainingVolatileSolids =
    // (((24/100)*(2912.0*1000))-((468241.6945 * biogasDensity))) * 365;
    // =(((24/100)*(C31*1000))-((Sheet1!C15)*(AD!C20)))*365

    const DigesterSolids =
      TotalNonBiodegradableSolids +
      RemainingVolatileSolids +
      (moistureContent / 100) * (totalBiodegradableWaste * 1000) * 365;

    const DrySludge = DigesterSolids * 0.85;

    const LiquidEffluent = DigesterSolids - DrySludge;

    const DigesterSolidsGgPerYear = DigesterSolids / 1000000;

    const DrySludgeGgPerYear = DrySludge / 1000000;

    const LiquidEffluentGgPerYear =
      DigesterSolidsGgPerYear - DrySludgeGgPerYear;

    let recoveryData: any;
    if (data1.length > 0) {
      recoveryData = data1.map((waste: any) => {
        const recovered = (waste?.waste / totalBiodegradableWaste1) * 100;
        return {
          name: waste?.name,
          value: waste?.waste,
          recovered,
        };
      });
    } else {
      recoveryData = TableData.map((waste:any) => {
        const recovered = (waste.value / totalBiodegradableWaste1) * 100;
        return {
          name: waste.name,
          value: waste.value,
          recovered,
        };
      });
    }

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

      TotalNonBiodegradableSolids,
      RemainingVolatileSolids,
      DigesterSolids,
      DrySludge,
      LiquidEffluent,
      DigesterSolidsGgPerYear,
      DrySludgeGgPerYear,
      LiquidEffluentGgPerYear,
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
      name: "Total Slurry Inflow to Reactor (m³/day)",
      value: results?.totalSlurry,
    },
    { name: "Volume of Digester (m³)", value: results?.volumeOfDigester },
    { name: "Area (m³)", value: results?.areaOfDigester },
    { name: "Diameter (m)", value: results?.diameterOfDigester },

    {
      name: "Total Biogas Production (m³/day)",
      value: results?.biogasProduction,
    },
    {
      name: "Total Methane Production (m³/day)",
      value: results?.methaneProduction,
    },

    {
      name: "Total Biogas Production (m³/year)",
      value: results?.biogasProduction ? results?.biogasProduction * 365 : 0,
    },
    {
      name: "Total Methane Production (m³/year)",
      value: results?.methaneProduction ? results?.methaneProduction * 365 : 0,
    },

    {
      name: "Total Biogas Production (hm³/year)",
      value: results?.biogasProduction
        ? (results?.biogasProduction * 365) / 1000000
        : 0,
    },
    {
      name: "Total Methane Production (hm³/year)",
      value: results?.methaneProduction
        ? (results?.methaneProduction * 365) / 1000000
        : 0,
    },

    {
      name: "Electricity from Biogas (kWh/day)",
      value: results?.electricityFromBiogas,
    },
    {
      name: "Electricity from Methane (kWh/day)",
      value: results?.electricityFromMethane,
    },

    {
      name: "Electricity from Biogas (MWh/year)",
      value: results?.electricityFromBiogas
        ? (results?.electricityFromBiogas * 365) / 1000
        : 0,
    },
    {
      name: "Electricity from Methane (MWh/year)",
      value: results?.electricityFromMethane
        ? (results?.electricityFromMethane * 365) / 1000
        : 0,
    },

    {
      name: "Electricity from Biogas (GWh/year)",
      value: results?.electricityFromBiogas
        ? (results?.electricityFromBiogas * 365) / 1000000
        : 0,
    },
    {
      name: "Electricity from Methane (GWh/year)",
      value: results?.electricityFromMethane
        ? (results?.electricityFromMethane * 365) / 1000000
        : 0,
    },

    {
      name: "Total Non- Biodegradable Solids (kg/year",
      value: results?.TotalNonBiodegradableSolids,
    },
    {
      name: "Remaining Volatile Solids (kg/year)",
      value: results?.RemainingVolatileSolids,
    },

    {
      name: "Digester Solids (kg/year)",
      value: results?.DigesterSolids,
    },
    {
      name: "Dry Sludge (kg/year)",
      value: results?.DrySludge,
    },
    {
      name: "Liquid Effluent (kg/year)",
      value: results?.LiquidEffluent,
    },

    {
      name: "Digester Solids (Gg/year)",
      value: results?.DigesterSolidsGgPerYear,
    },
    {
      name: "Dry Sludge (Gg/year)",
      value: results?.DrySludgeGgPerYear,
    },
    {
      name: "Liquid Effluent (Gg/year)",
      value: results?.LiquidEffluentGgPerYear,
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
            {data1.length > 0 ? (
              <div
                className={`grid grid-cols-1 ${
                  data1.length > 2
                    ? "md:grid-cols-3"
                    : data1.length > 0
                    ? "md:grid-cols-2"
                    : "md:grid-cols-3"
                } gap-y-4 gap-x-6 border-b pb-4`}
              >
                <>
                  {data1.map((item: any, index: number) => (
                    <div key={index} className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        {item.name} (tonnes/day):
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
                                 value: e.target.value,
                               })
                             }
                             className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                           />
                         </td>
                         <td><button
 onClick={() => handleRemoveSubCategory(subCat.name)}
 className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
>
  ✕
</button></td>
                       </tr>
                     ))}

                     {/* Total row */}
                     <tr className="bg-gray-100 font-semibold">
                       <td className="border p-2">Total</td>
                       <td className="border p-2">
                         {totalSubCatValue.toFixed(4)}
                       </td>
                       <th></th>
                     </tr>
                   </tbody>
                 </table>

                  )}
                </div>
              </>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 pt-4">
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
                    value={value.toFixed(2)}
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
                    value={value.toFixed(2)}
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
                  label: "Biogas Density (kg/m³)",
                  value: biogasDensity,
                  setter: setBiogasDensity,
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
                    value={value.toFixed(2)}
                    onChange={(e) => setter(parseFloat(e.target.value))}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5">
              Solid Waste Inflow to Digestor
            </h2>
            {/* <div
              className={`grid grid-cols-1 ${
                data1.length > 2
                  ? "md:grid-cols-3"
                  : data1.length > 0
                  ? "md:grid-cols-2"
                  : "md:grid-cols-3"
              } gap-y-4 gap-x-6`}
            >
              {data1.length > 0 ? (
                <>
                  {data1.map((item: any, index: number) => (
                    <div key={index} className=" ">
                      <label className="block text-sm/6 font-medium text-gray-900 my-0">
                        {item.name} (tonnes/day):
                      </label>
                      <div className="mt-2">
                        <p className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6">
                          {item.waste}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
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
                        value={value.toFixed(2)}
                        onChange={(e) => setter(parseFloat(e.target.value))}
                        className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  ))}
                </>
              )}
            </div> */}

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
                  type="text"
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
                    <span className="text-gray-700">
                      {waste.value ? waste.value.toFixed(2) : null}
                    </span>
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
