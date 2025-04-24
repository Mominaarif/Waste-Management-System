"use client";
import { useState } from "react";
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
  const [shredderEfficiencyPrimary,  setShredderEfficiencyPrimary] = useState(95); // in %
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
    });
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
                  setter:  setShredderEfficiencyPrimary,
                },
                {
                  label: "Primarily Shredded Waste (Kg/day)",
                  value: shredderWastePrimary,
                  setter:  setShredderWastePrimary,
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
