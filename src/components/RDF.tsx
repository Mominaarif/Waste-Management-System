"use client";
import { useState } from "react";
import "../Styles/App.css";
import { set } from "firebase/database";

interface Results {
  density: number;
  moistureContent: number;
  calorificValue: number;
  storageVolume: number;
  storageArea: number;
  rdfOutput: number;
  equivalentCoal: number;
  wasteGenerationResults: {
    id: string;
    name: string;
    wasteGenerated: number;
    wasteGenerated1: number;
  }[];
}

interface SubCategory {
  id: string;
  name: string;
  value: string;
  typicalDensity: string;
  moistureContent: string;
  typicalCalorificValue: string;
}


interface FormData {
  subCategories: SubCategory[];
}

const initialFields = [
  { key: 'totalVolumeInflow', label: 'Total Volume Inflow', value: 3626 },
  { key: 'numberOfDays', label: 'No. of Days', value: 0 },
  { key: 'storageRequired', label: 'Storage Required', value: 10789.1 },
  { key: 'depthOfStorageArea', label: 'Depth of Storage Area', value: 8 },
  { key: 'areaRequiredForStorage', label: 'Area Required for Storage', value: 1359.9 },

  { key: 'totalWasteThroughputPrimaryShredder', label: 'Total Waste Throughput (Primary Shredder)', value: 1388 },
  { key: 'adoptedDesignCapacityPrimary', label: 'Adopted Design Capacity (Primary)', value: 116 },
  { key: 'operatingHoursPrimary', label: 'Operating Hours (Primary)', value: 12 },
  { key: 'typicalPowerRequirementPrimary', label: 'Typical Power Requirement (Primary)', value: 500 },
  { key: 'powerRequiredPerDayPrimary', label: 'Power Required per Day (Primary)', value: 6000 },
  { key: 'shredderEfficiency', label: 'Shredder Efficiency (%)', value: 85 },
  { key: 'shreddedOutflow', label: 'Shredded Outflow', value: 1180 },
  { key: 'sizeOfCoarseShreddedMatter', label: 'Size of Coarse Shredded Matter', value: 200 },

  { key: 'totalWasteThroughputSecondaryShredder', label: 'Total Waste Throughput (Secondary Shredder)', value: 1318 },
  { key: 'adoptedDesignCapacitySecondary', label: 'Adopted Design Capacity (Secondary)', value: 110 },
  { key: 'operatingHoursSecondary', label: 'Operating Hours (Secondary)', value: 12 },
  { key: 'typicalPowerRequirementSecondary', label: 'Typical Power Requirement (Secondary)', value: 670 },
  { key: 'powerRequiredPerDaySecondary', label: 'Power Required per Day (Secondary)', value: 8040 },
  { key: 'shreddingEfficiency', label: 'Shredding Efficiency (%)', value: 95 },
  { key: 'shreddedOutflowSecondary', label: 'Shredded Outflow (Secondary)', value: 1253 },
  { key: 'sizeOfFineShreddedMatter', label: 'Size of Fine Shredded Matter', value: 10 },

  { key: 'totalWasteThroughputPelletizer', label: 'Total Waste Throughput (Pelletizer)', value: 1253 },
  { key: 'adoptedDesignCapacityPelletizer', label: 'Adopted Design Capacity (Pelletizer)', value: 104 },
  { key: 'operatingHoursPelletizer', label: 'Operating Hours (Pelletizer)', value: 12 },
  { key: 'recoveryEfficiency', label: 'Recovery Efficiency (%)', value: 98 },
  { key: 'rdfOutflow', label: 'RDF Outflow', value: 1227.5 },
  { key: 'densificationRatio', label: 'Densification Ratio', value: 4 },
  { key: 'initialVolumePellets', label: 'Initial Volume of Pellets', value: 3207.3 },
  { key: 'finalVolumePellets', label: 'Final Volume of Pellets', value: 800.9 },
  { key: 'volumeReduction', label: 'Volume Reduction (%)', value: 75 },
  { key: 'typicalPowerRequirementPelletizer', label: 'Typical Power Requirement (Pelletizer)', value: 0.75 },
  { key: 'totalPowerRequirementPelletizer', label: 'Total Power Requirement (Pelletizer)', value: 500.8 },
  { key: 'powerRequiredPerDayPelletizer', label: 'Power Required per Day (Pelletizer)', value: 6008 },

  { key: 'optimumMoistureContent', label: 'Optimum Moisture Content (%)', value: 20 },
  { key: 'initialMoistureContent', label: 'Initial Moisture Content (%)', value: 5 },
  { key: 'moistureAdditionRequired', label: 'Moisture Addition Required (%)', value: 15 },
  { key: 'waterAdditionRequired', label: 'Water Addition Required', value: 188.05 },

  { key: 'totalResidueGenerated', label: 'Total Residue Generated', value: 160 },
];

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
  const [shredderEfficiencyPrimary, setShredderEfficiencyPrimary] = useState(95); // in %
  const [shredderWastePrimary, setShredderWastePrimary] = useState(95); // in %
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

  const [formFields, setFormFields] = useState(initialFields);

  const handleInputChange = ({ key, value }: any) => {
    setFormFields(prevFields =>
      prevFields.map(field =>
        field.key === key ? { ...field, value: parseFloat(value) } : field
      )
    );
  };

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


    const totalWasteGenerated = formData.subCategories.reduce((sum, subCat) => {
      const percentage = parseFloat(subCat.value); // Ensure it's a number
      return sum + totalWasteInput * (percentage / 100);
    }, 0);

    const wasteGenerationResults = formData.subCategories.map((subCat) => {
      const percentage = parseFloat(subCat.value); // Ensure it's a number
      const generatedWaste = totalWasteInput * (percentage / 100);
      const wasteGenerated1 = (generatedWaste / totalWasteGenerated) * 100; // Convert to percentage

      return {
        id: subCat.id,
        name: subCat.name,
        wasteGenerated: generatedWaste, // tons/day
        wasteGenerated1: wasteGenerated1, // tons/day
      };
    });

    const volumePerDay = totalWasteInput / (density * 1000); // Convert density to kg/m³
    const storageVolume = volumePerDay * retentionTime;
    const storageArea = storageVolume / 8; // Assumed depth = 8 meters

    const rdfOutput =
      totalWasteInput *
      (shredderEfficiencyPrimary / 100) *
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
      wasteGenerationResults
    });
  };


  const [formData, setFormData] = useState<FormData>({
    subCategories: [],
  });

  const [newSubCatName, setNewSubCatName] = useState("");
  const [newSubCatValue, setNewSubCatValue] = useState("");
  const [typicalDensity, setTypicalDensity] = useState("");
  const [moistureContent, setMoistureContent] = useState("");
  const [typicalCalorificValue, setTypicalCalorificValue] = useState("");

  const handleAddSubCategory = () => {
    if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

    const newSubCategory = {
      id: `s${formData.subCategories.length + 1}`,
      name: newSubCatName.trim(),
      value: newSubCatValue.trim(),
      typicalDensity: typicalDensity.trim(),
      moistureContent: moistureContent,
      typicalCalorificValue: typicalCalorificValue, // Add this property with a default value
    };

    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, newSubCategory],
    }));

    // Clear inputs
    setNewSubCatName("");
    setNewSubCatValue("");
    setTypicalDensity("");
    setTypicalCalorificValue("");
    setMoistureContent("");
  };


  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14 border shadow-sm py-4 font-bold">
        RDF Design
      </h1> */}
      <div className="">
        {/* Input Section */}
        <div className="pt-10 px-5 md:px-8">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Input Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6">
              {[
                // Mapping input fields
                {
                  label: "Total Combustible Waste (kg/day)",
                  value: totalWasteInput,
                  setter: setTotalWasteInput,
                },
                {
                  label: "Shredder Efficiency (Primary) (%)",
                  value: shredderEfficiencyPrimary,
                  setter: setShredderEfficiencyPrimary,
                },
                {
                  label: "Primarily Shredded Waste (Kg/day)",
                  value: shredderWastePrimary,
                  setter: setShredderWastePrimary,
                },
                {
                  label: "Retention Time (days)",
                  value: retentionTime,
                  setter: setRetentionTime,
                },

                {
                  label: "Pelletalization Efficiency (%)",
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
              {formFields.map(({ key, label, value }) => (
                <div key={key} className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">{label}:</label>
                  <input
                    type="number"
                    value={value}
                    onChange={e => handleInputChange({ key, value: e.target.value })}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center pt-5">
              <label className="block text-sm font-medium text-gray-900 pb-1 w-full text-left">
                Waste Composition:
              </label>
              <div className="w-full pt-2">
                <div className="grid grid-cols-6 w-full font-[600]">
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Component
                  </p>
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Composition  (%)
                  </p>
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Typical Densities (tonnes/m3)
                  </p>
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Moisture Content (%)
                  </p>
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Typical Calorific Values (MJ/Kg)
                  </p>
                  <p></p>
                </div>
                {formData.subCategories.map((ss: any) => (
                  <div className="grid grid-cols-6 w-full" key={ss.id}>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.name}
                    </p>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.value}
                    </p>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.typicalDensity}

                    </p>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.moistureContent}
                    </p>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.typicalCalorificValue}
                    </p>
                    <p></p>
                  </div>
                ))}
                <div className="grid grid-cols-6 w-full">
                  <input
                    type="text"
                    placeholder="Component Name"
                    value={newSubCatName}
                    name="subCategoryName"
                    onChange={(e) => setNewSubCatName(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    max={100}
                    min={0}
                    value={newSubCatValue}
                    name="subCategoryValue"
                    onChange={(e) => setNewSubCatValue(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    max={100}
                    min={0}
                    value={typicalDensity}
                    name="subCategoryValue"
                    onChange={(e) => setTypicalDensity(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    max={100}
                    min={0}
                    value={moistureContent}
                    name="subCategoryValue"
                    onChange={(e) => setMoistureContent(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    max={100}
                    min={0}
                    value={typicalCalorificValue}
                    name="subCategoryValue"
                    onChange={(e) => setTypicalCalorificValue(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />


                  <div>
                    <p
                      onClick={handleAddSubCategory}
                      className="btn btn-primary bg-violet-700 border-0 text-sm/6 font-medium ml-2 text-white"
                    >
                      Add Component
                    </p>
                  </div>
                </div>
              </div>

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
          <div className="pt-10 px-5 md:px-8 bg-white">
            <div className="border p-8 rounded-md">
              <h2 className="text-lg font-semibold text-gray-900 ">Outputs</h2>
              <div className="overflow-x-auto w-full flex flex-col items-start">
                <div className="mt-4 space-y-2">
                  <table className="table text-left w-[70vw_!important] ">
                    <thead>
                      <tr className="text-left">
                        <th
                          className="w-[10%_!important]"
                          style={{ textAlign: "left" }}
                        ></th>
                        <th
                          className="w-[35%_!important] text-left"
                          style={{ textAlign: "left" }}
                        >
                          Component
                        </th>
                        <th
                          className="w-[35%_!important] text-left"
                          style={{ textAlign: "left" }}
                        >
                          Percentage(%)
                        </th>
                        <th
                          className="w-[35%_!important] text-left"
                          style={{ textAlign: "left" }}
                        >
                          composition(%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedValues.wasteGenerationResults.map((ss, id) => (
                        <tr className="" key={ss.id}>
                          <th style={{ textAlign: "left" }}>{id + 1}</th>
                          <td style={{ textAlign: "left" }}>{ss.name}</td>
                          <td style={{ textAlign: "left" }}>{ss.wasteGenerated.toFixed(2)} %</td>
                          <td style={{ textAlign: "left" }}>{ss.wasteGenerated1.toFixed(2)} %</td>
                          {/* <td
                            className="p-[0_!important]"
                            style={{ textAlign: "left" }}
                          >
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="kg/day"
                              value={ss.wasteGenerated}
                              onChange={(e) =>
                                setNewSubCatValue(e.target.value)
                              }
                              className="block w-full h-[38px_!important] text-gray-900 text-sm pl-2"
                            />
                            {ss.wasteGenerated1.toFixed(2)} %
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
