import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { it } from 'node:test';
import { sum } from 'firebase/firestore';
import { factors } from '@turf/turf';

// Interfaces for expected props and structures
interface CalculatedData {
  [category: string]: {
    [subcategory: string]: number;
  };
}

interface LocationState {
  calculatedData: CalculatedData;
  totals: any;
}

interface CarbonFootprint {
  [category: string]: {
    [method: string]: number;
  };
}

interface LeastCO2Methods {
  [category: string]: {
    method: string;
    footprint: number;
  } | null;
}

const NextPage: React.FC = () => {
  const location = useLocation();
  const { calculatedData, totals } = location.state || {};

  const [selectedWasteTypes, setSelectedWasteTypes] = useState<{ [key: string]: boolean }>({});
  const [wasteCategories, setWasteCategories] = useState<{ [key: string]: string }>({});
  const [customEmissionFactors, setCustomEmissionFactors] = useState<{ [method: string]: number | null }>({});
  const [showSummary, setShowSummary] = useState(false);
  const [showLeastCo2Table, setShowLeastCo2Table] = useState(false);

  const [categoryDisposalMethods, setCategoryDisposalMethods] = useState<{
    [category: string]: string[];
  }>({
    Biodegradable: [],
    Combustible: [],
    Recyclable: [],
    Residual: [],
  });

  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint>({});
  const [leastCo2Methods, setLeastCo2Methods] = useState<LeastCO2Methods>({});

  const disposalOptions: { [category: string]: string[] } = {
    Biodegradable: [
      "Landfilling with LGR",
      "Landfilling without LGR",
      "Composting",
      "Anaerobic Digestion",
      // "MBT",
    ],
    Combustible: [
      "Landfilling with LGR",
      "Landfilling without LGR",
      "RDF",
      "Incineration",
      // "Pyrolysis",
      // "Gasification",
    ],
    Recyclable: [
      "Landfilling with LGR",
      "Landfilling without LGR",
      "Recycling",

    ],
    Residual: ["Landfilling with LGR", "Landfilling without LGR"],
  };

  const subcategories: { [method: string]: string[] } = {
    "Anaerobic Digestion": ["Dry Digestion with Digestate Curing", "Dry Digestion with Direct Land Application ", "Wet Digestion with Digestate Curing", "Wet Digestion with Direct Land Application "],
    // Composting: ["Aerated Static Pile Composting", "Windrow Composting", "In-vessel Composting"],
    "Mechanical Biological Treatment (MBT)": ["Biostabilization", "Bio-drying"],
    // "Landfilling with LGR": ["Sanitary Landfilling", "Bioreactor Landfills"],
    // RDF: ["Low-Density RDF", "High-Density RDF"],
    Incineration: ["With Energy Recovery", "Without Energy Recovery"],
    // Pyrolysis: ["Fast Pyrolysis", "Slow Pyrolysis"],
    // Gasification: ["Plasma Arc Gasification", "Fixed Bed Gasification", "Fluidized Bed Gasification"],
    // "Chemical Recycling": ["Depolymerization", "Solvolysis"],
    // "Physical Recycling": ["Shredding and Re-molding", "Mechanical Separation"],
  };

  const carbonEmissionFactors: { [method: string]: number } = {
    Composting: 0.1,
    "Anaerobic Digestion": 0.05,
    "Landfilling with LGR": 0.3,
    "Landfilling without LGR": 0.6,
    MBT: 0.15,
    RDF: 0.4,
    Incineration: 0.7,
    Pyrolysis: 0.2,
    Gasification: 0.25,
    "Physical Recycling": 0.08,
    "Chemical Recycling": 0.12,
    "Dry Digestion": 0.04,
    "Wet Digestion": 0.05,
    "Batch Digestion": 0.06,
    "Continuous Digestion": 0.03,
    "Aerated Static Pile Composting": 0.12,
    "Windrow Composting": 0.1,
    "In-vessel Composting": 0.08,
    "Biostabilization": 0.18,
    "Bio-drying": 0.2,
    "Sanitary Landfilling": 0.35,
    "Bioreactor Landfills": 0.28,
    "Low-Density RDF": 0.35,
    "High-Density RDF": 0.45,
    "Mass Burn": 0.8,
    "Fluidized Bed": 0.75,
    "Fast Pyrolysis": 0.25,
    "Slow Pyrolysis": 0.3,
    "Plasma Arc Gasification": 0.22,
    "Fixed Bed Gasification": 0.2,
    "Fluidized Bed Gasification": 0.18,
    "Depolymerization": 0.13,
    "Solvolysis": 0.15,
    "Shredding and Re-molding": 0.06,
    "Mechanical Separation": 0.05,
  };

  useEffect(() => {
    if (!calculatedData) return;
    setSelectedWasteTypes(
      Object.keys(calculatedData).reduce((acc, wasteType) => {
        acc[wasteType] = true;
        return acc;
      }, {} as { [key: string]: boolean })
    );

    setWasteCategories(
      Object.keys(calculatedData).reduce((acc, wasteType) => {
        acc[wasteType] = "Biodegradable";
        return acc;
      }, {} as { [key: string]: string })
    );
  }, [calculatedData]);

  const handleCustomEmissionFactorChange = (method: string, value: string) => {
    setCustomEmissionFactors((prev) => ({
      ...prev,
      [method]: value ? parseFloat(value) : null,
    }));
  };

  const handleDisposalMethodChange = (category: string, method: string, subMethod?: string) => {
    setCategoryDisposalMethods((prev) => {
      const updated = prev[category] || [];
      const methodKey = subMethod ? `${method} - ${subMethod}` : method;
      const isSelected = updated.includes(methodKey);
      const newMethods = isSelected
        ? updated.filter((m) => m !== methodKey)
        : [...updated, methodKey];
      return { ...prev, [category]: newMethods };
    });
  };

  // const calculateCarbonFootprint = () => {
  //   const newFootprint: CarbonFootprint = {};

  //   Object.keys(categoryDisposalMethods).forEach((category) => {
  //     const subcategoriesData = calculatedData[category.toLowerCase()] || {};
  //     const methods = categoryDisposalMethods[category] || [];

  //     newFootprint[category] = methods.reduce((byMethod, method) => {
  //       const footprint = Object.entries(subcategoriesData).reduce((sum, [subcategory, amount]) => {
  //         const factor = customEmissionFactors[method] ?? carbonEmissionFactors[method] ?? 1;
  //         const numericAmount = typeof amount === 'number' ? amount : Number(amount);
  //         return sum + numericAmount * factor;
  //       }, 0);
  //       byMethod[method] = footprint;
  //       return byMethod;
  //     }, {} as { [method: string]: number });
  //   });

  //   setCarbonFootprint(newFootprint);
  //   setShowSummary(true);
  // };

  //   const [carbonFootprint, setCarbonFootprint] = useState<Record<string, Record<string, number>>>({});
  // const [emissions, setEmissions] = useState<number>(0);

  // const emissionFactors: Record<string, number> = {
  //   animalDunk: 0.02,
  //   cardboard: 0.14,
  //   foodWaste: 0.19,
  //   paper: 0.01,
  //   textile: 0.45,
  //   yardWaste: 0.12,
  // };

  const calculateCarbonFootprint = () => {
    const newFootprint: Record<string, Record<string, number>> = {};
    let totalEmissions = 0;

    Object.keys(categoryDisposalMethods).forEach((category) => {
      const methods = categoryDisposalMethods[category] || [];
      const subcategoriesData = calculatedData[category.toLowerCase()] || {};
      console.log(methods)
      console.log(subcategoriesData)


      newFootprint[category] = methods.reduce((byMethod, method) => {
        let methodSum = 0;

        if (method === "Landfilling with LGR") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsLandfillWithoutLGR[subcategory] ?? 1;
            if (numericAmount && factor) {

              methodSum += numericAmount * factor;
            }
            // 
          }
          console.log(methodSum);
        }

        if (method === "Landfilling without LGR") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsLandfillWithLGR[subcategory] ?? 1;
            console.log(factor)
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
            // 
          }
          console.log(methodSum);
        }

        if (method === "Recycling") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsRecycling[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
            // 
          }
          console.log(methodSum);
        }

        if (method === "Composting") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsComposting[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
            // 
          }
          console.log(methodSum);
        }

        if (method === "Anaerobic Digestion - Dry Digestion with Digestate Curing") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsAnaerobicDigDryDigestateCuring[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
          }
          console.log(methodSum);
        }

        if (method === "Anaerobic Digestion - Wet Digestion with Digestate Curing") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsAnaerobicDigWetDigestateCuring[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
          }
          console.log(methodSum);
        }

        if (method === "Anaerobic Digestion - Dry Digestion with Direct Land Application ") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsAnaerobicDigDryDirectLandApplication[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
          }
          console.log(methodSum);
        }

        if (method === "Anaerobic Digestion - Wet Digestion with Direct Land Application ") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsAnaerobicDigWetDirectLandApplication[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
          }
          console.log(methodSum);
        }

        if (method === "Incineration - With Energy Recovery") {

          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsIncinerationWithRecovery[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
          }
          console.log(methodSum);
        }

        if (method === "Incineration - Without Energy Recovery") {
          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            const factor = emissionFactorsIncinerationWithoutRecovery[subcategory] ?? 1;
            if (numericAmount && factor) {
              methodSum += numericAmount * factor;
            }
          }
          console.log(methodSum);
        }

        if (method === "RDF") {
          for (const [subcategory, amount] of Object.entries(subcategoriesData)) {
            const numericAmount = typeof amount === 'number' ? amount : Number(amount);
            // const factor = emissionFactorsIncinerationWithoutRecovery[subcategory] ?? 1;
            // if (numericAmount && factor) {
            //   methodSum += numericAmount * factor;
            // }
            methodSum += numericAmount;
          }

          const primaryShreddigngEfficiency = 95;
          const secondaryShreddigngEfficiency = 95;
          const pelletizerShreddigngEfficiency = 98;
          const GHGEmissionFactor = 0.000417;
          const operatingHours = 12;
          const primaryTypicalPowerRequirement = 500;
          const secondaryTypicalPowerRequirement = 670;
          const pelletizerTypicalPowerRequirement = 500.8;
          const primaryPowerRequired = operatingHours * primaryTypicalPowerRequirement;
          const secondaryPowerRequired = operatingHours * secondaryTypicalPowerRequirement;
          const pelletizerPowerRequired = operatingHours * pelletizerTypicalPowerRequirement;
          const primaryEmission = GHGEmissionFactor * primaryPowerRequired;
          const secondaryEmission = GHGEmissionFactor * secondaryPowerRequired;
          const pelletizerEmission = GHGEmissionFactor * pelletizerPowerRequired;

          // Total Process Emissions =  Emissions of all processes
          const energyContentOfFuel = 36.397;
          const totalProcessEmissions = primaryEmission + secondaryEmission + pelletizerEmission;
          const totalProcessEmissionsPerYear = totalProcessEmissions * 365;

          const GHGEmissionFactorMJ = GHGEmissionFactor + (0.000003 * 28) + (0.0000006 * 265);
          const GHGEmissionFactorLitre = GHGEmissionFactorMJ + energyContentOfFuel;
          const mileagePerGallon = 7.2;
          const mileagePerLitre = mileagePerGallon / 2.352;
          const RDF_FacilityDistanceFromCollectionLocation = 30;
          const fuelConsumption = RDF_FacilityDistanceFromCollectionLocation / mileagePerLitre;
          // Transportation Emissions
          const GHGEmissionsKgPerDay = fuelConsumption * GHGEmissionFactorLitre;
          const GHGEmissionsTonsPerDay = GHGEmissionsKgPerDay / 1000;
          const GHGEmissionsTonsPerYear = GHGEmissionsTonsPerDay * 365;

          console.log(methodSum);
          const shredderOutflowPrimary = methodSum * (primaryShreddigngEfficiency / 100);
          const shredderOutflowSecondary = shredderOutflowPrimary * (secondaryShreddigngEfficiency / 100);
          const shredderOutflowPelletizer = shredderOutflowSecondary * (pelletizerShreddigngEfficiency / 100);
          const RDFProduction = shredderOutflowPelletizer;

          const GHGEmissionsFactorRDFCombustionKg = 1.42;
          const GHGEmissionsFactorRDFCombustionTon = 1.42300;
          const GHGEmissionsRDFCombustionKg = GHGEmissionsFactorRDFCombustionTon * RDFProduction;
          const GHGEmissionsRDFCombustionTon = GHGEmissionsRDFCombustionKg * 365;
          const TotalEmissionsOfRDFP_C= GHGEmissionsRDFCombustionTon + GHGEmissionsTonsPerYear + totalProcessEmissionsPerYear;
          const TotalEmissionsOfRDFP_CYear = TotalEmissionsOfRDFP_C * 365;
        }

        // console.log(method);Incineration - With Energy Recovery

        byMethod[method] = parseFloat(methodSum.toFixed(2));
        totalEmissions += methodSum;
        // console.log(byMethod)
        return byMethod;
      }, {} as Record<string, number>);
    });

    setCarbonFootprint(newFootprint);
    setEmissions(parseFloat(totalEmissions.toFixed(2)));
    setShowSummary(true);
  };

  const computeLeastCo2Methods = () => {
    const least: LeastCO2Methods = {};

    Object.entries(carbonFootprint).forEach(([category, methods]) => {
      const leastMethod = Object.entries(methods).reduce<LeastCO2Methods[string]>(
        (acc, [method, footprint]) =>
          !acc || footprint < acc.footprint ? { method, footprint } : acc,
        null
      );
      least[category] = leastMethod;
    });

    setLeastCo2Methods(least);
    setShowLeastCo2Table(true);
  };

  const renderTableAndChart = (category: string) => {
    const tableData = carbonFootprint[category] || {};
    const chartData = {
      labels: Object.keys(tableData),
      datasets: [
        {
          label: `${category} Carbon Footprint (tons CO₂)`,
          data: Object.values(tableData),
          // backgroundColor: [
          //   'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)',
          //   'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)',
          //   'rgba(0, 200, 83, 0.6)',
          // ],
          // borderColor: [
          //   'rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
          //   'rgba(0, 200, 83, 1)',
          // ],
          borderWidth: 1,

          backgroundColor: [
            "rgb(22, 163, 74)",
            "rgb(59, 130, 246)",
            "rgb(107, 114, 128)",
            "rgb(220, 38, 38)",
          ],
          borderRadius: 5,
          barThickness: 42,
          borderSkipped: false,
          showLabel: false,
        },
      ],
    };

    return (
      <div>
        <table className='w-full'>
          <thead>
            <tr className='bg-[#386641] text-white border p-2'>
              <th className=' border p-2'>Method</th>
              <th className=' border p-2'>Carbon Footprint (tons CO₂)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tableData).length === 0 ? (
              <tr >
                <td className=' border p-2'>-</td>
                <td className=' border p-2'>-</td>
              </tr>) : null}

            {Object.entries(tableData).map(([method, value]) => (
              <tr key={method}>
                <td className=' border p-2'>{method}</td>
                <td className=' border p-2'>{value.toFixed(2)} </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='mt-5'>
          <Bar data={chartData} />
        </div>
      </div>
    );
  };

  if (!calculatedData || !totals) {
    return <div>Data not available</div>;
  }

  const [emissions, setEmissions] = useState<number>(0);

  const emissionFactorsLandfillWithoutLGR: Record<string, number> = {
    foodWaste: 0.72,
    yardWaste: -0.19,
    cardboard: 0.44,
    lightPlastic: 0.04,
    densePlastic: 0.04,
    wood: -0.83,
    paper: 0.49,
    metals: 0.04,
    glass: 0.04,
    electronic: 0.04,
    cdWaste: 0.04,
    textile: 0.9,
    animalDunk: -0.36,
    leather: -0.075,
    diapers: 0.05,

  };

  const emissionFactorsLandfillWithLGR: Record<string, number> = {
    foodWaste: 0.76,
    yardWaste: -0.18,
    cardboard: 0.51,
    lightPlastic: 0.04,
    densePlastic: 0.04,
    wood: -0.83,
    paper: 0.46,
    metals: 0.04,
    glass: 0.04,
    electronic: 0.04,
    cdWaste: 0.04,
    textile: 0.14,
    animalDunk: -0.28,
    leather: -0.06,
    diapers: 0.05,

  };

  const emissionFactorsRecycling: Record<string, number> = {
    paper: -1.26,
    cardboard: -1.16,
    lightPlastic: -1.46,
    densePlastic: -1.56,
    metals: -2.76,
    glass: -0.46,
    wood: -0.71,
    electronics: -1.66,
    cdWaste: -0.36,
    textile: -0.91,
    diapers: 0.04,
    leather: -0.51,
  };

  const emissionFactorsComposting: Record<string, number> = {
    foodWaste: -0.16,
    yardWaste: -0.1,
    animalDunk: 0.02
  };

  const emissionFactorsAnaerobicDigDryDigestateCuring: Record<string, number> = {
    foodWaste: -0.04,
    yardWaste: -0.1,
    animalDunk: -0.02
  };

  const emissionFactorsAnaerobicDigWetDigestateCuring: Record<string, number> = {
    foodWaste: -0.06,
    yardWaste: 0,
    animalDunk: -0.36
  };

  const emissionFactorsAnaerobicDigDryDirectLandApplication: Record<string, number> = {
    foodWaste: -0.1,
    yardWaste: -0.35,
    animalDunk: -0.005
  };

  const emissionFactorsAnaerobicDigWetDirectLandApplication: Record<string, number> = {
    foodWaste: -0.14,
    yardWaste: 0,
    animalDunk: -0.335
  };

  const emissionFactorsIncinerationWithoutRecovery: Record<string, number> = {
    foodWaste: 0.09,
    yardWaste: 0.06,
    paper: 0.99,
    cardboard: 0.94,
    lightPlastic: 1.44,
    densePlastic: 1.54,
    wood: 0.39,
    electronics: 0.84,
    cdWaste: 0.09,
    textile: 0.74,
    diapers: 0.24,
    animalDunk: 0.02,
    leather: 0.54,
  };

  const emissionFactorsIncinerationWithRecovery: Record<string, number> = {
    foodWaste: 0.24,
    yardWaste: 0.14,
    paper: 1.84,
    cardboard: 1.74,
    lightPlastic: 3.04,
    densePlastic: 3.24,
    wood: 1.04,
    electronics: 1.54,
    cdWaste: 0.14,
    textile: 1.54,
    diapers: 1.34,
    animalDunk: 0.24,
    leather: 1.04,
  };

  const calculateCarbonFootprintLandfillingWithoutLRG = (category: string, method: string) => {
    const categoryKey = category.toLowerCase(); // 'biodegradable', etc.
    const data = calculatedData[categoryKey as keyof typeof calculatedData];

    if (!data) {
      console.warn('Category data not found.');
      return;
    }

    const result: Record<string, number> = {};
    let sum = 0;

    for (const [key, value] of Object.entries(data)) {
      if (emissionFactorsLandfillWithoutLGR[key] !== undefined && value !== 0) {
        result[key] = parseFloat(((Number(value) / 1000) * emissionFactorsLandfillWithoutLGR[key]).toFixed(2));
        sum += result[key];
      }
      setEmissions(sum)
      // console.log(result[key]);
      // console.log(sum);
    }

    console.log('Calculated EM data:', result);
    console.log('Category:', category);
    console.log('Method:', method);
    // console.log(calculatedData.biodegradable)

    if (category === "Biodegradable") {
      console.log(calculatedData.biodegradable)

    }
    if (category === "Combustible") {
      console.log(calculatedData.combustible)

    }
    if (category === "Recyclable") {
      console.log(calculatedData.recyclable)

    }
    if (category === "Residual")
      console.log(calculatedData.residual)

    // console.log(category)
    // console.log(method)

  }


  const calculateCarbonFootprintLandfillingWithLRG = (category: string, method: string, subMethod?: string) => {

    console.log(category)
    console.log(method)
    if (subMethod) {
      console.log(subMethod)
    }
  }
  // console.log(emissions)

  return (

    <>
      <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white">
        <div className="pt-8 px-5 md:px-8">

          <section>
            <h2 className="block text-sm/6 font-medium text-gray-900 my-0">
              Select Management Technologies Method for Each Category
            </h2>
            <table className="table-auto border-collapse border border-gray-300 w-full mt-2">
              <thead>
                <tr className="bg-[#386641] text-white border p-2 text-sm">
                  {Object.keys(disposalOptions).map((category) => (
                    <th key={category} className="border p-2">
                      {category}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({
                  length: Math.max(
                    ...Object.values(disposalOptions).map(
                      (methods) => methods.length
                    )
                  ),
                }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="">
                    {Object.keys(disposalOptions).map((category) => (
                      <td key={category} className="border ">
                        {disposalOptions[category][rowIndex] ? (
                          <div className="flex flex-col gap-1 items-start h-full px-2 my-2 text-sm">
                            {subcategories[
                              disposalOptions[category][rowIndex]
                            ] ? (
                              <div className="w-full h-full">
                                <label>
                                  {disposalOptions[category][rowIndex]}
                                </label>
                                {subcategories[
                                  disposalOptions[category][rowIndex]
                                ].map((subMethod) => {
                                  const methodKey = `${disposalOptions[category][rowIndex]} - ${subMethod}`;
                                  const isChecked =
                                    categoryDisposalMethods[category]?.includes(
                                      methodKey
                                    ) || false;
                                  return (
                                    <div
                                      key={subMethod}
                                      className="flex flex-col  gap-1 pl-5"
                                    >
                                      <div className="flex  gap-2">
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => {
                                            handleDisposalMethodChange(
                                              category,
                                              disposalOptions[category][
                                              rowIndex
                                              ],
                                              subMethod
                                            )
                                            calculateCarbonFootprintLandfillingWithLRG(
                                              category,
                                              disposalOptions[category][rowIndex], subMethod
                                            );
                                          }}
                                        />
                                        <label>{subMethod}</label>
                                      </div>
                                      {/* Show input only if the checkbox is checked */}
                                      {/* {isChecked && (
                                        <div className="ml-0 pr-5">
                                          <input
                                            type="number"
                                            // step="0.01"
                                            placeholder="Enter emission factor"
                                            className="border w-full rounded-md px-3 py-[4.53px] sm:text-sm mb-2"
                                            value={
                                              customEmissionFactors[
                                              methodKey
                                              ] || ""
                                            }
                                            onChange={(e) =>
                                              handleCustomEmissionFactorChange(
                                                methodKey,
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      )} */}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1 w-full pl-5">
                                <div className="flex gap-2">
                                  <input
                                    type="checkbox"
                                    checked={
                                      categoryDisposalMethods[category]?.includes(
                                        disposalOptions[category][rowIndex]
                                      ) || false
                                    }
                                    onChange={() => {
                                      handleDisposalMethodChange(
                                        category,
                                        disposalOptions[category][rowIndex]
                                      );
                                      calculateCarbonFootprintLandfillingWithoutLRG(
                                        category,
                                        disposalOptions[category][rowIndex]
                                      );
                                    }}
                                  />
                                  <label>
                                    {disposalOptions[category][rowIndex]}
                                  </label>
                                </div>

                                {/* Show input only if the checkbox is checked */}
                                {/* {categoryDisposalMethods[category]?.includes(
                                  disposalOptions[category][rowIndex]
                                ) && (
                                    <div style={{ marginTop: "5px" }} className=' mr-5'>
                                      <input
                                        type="number"
                                        // step="0.01"
                                        className="border w-full rounded-md px-3 py-[4.53px] sm:text-sm mb-2"
                                        placeholder="Enter emission factor"
                                        value={
                                          customEmissionFactors[
                                          disposalOptions[category][rowIndex]
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleCustomEmissionFactorChange(
                                            disposalOptions[category][rowIndex],
                                            e.target.value
                                          )
                                        }
                                      // style={{ marginLeft: "10px" }}
                                      />
                                    </div>
                                  )} */}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <button
            className="bg-[#386641] hover:bg-[#386641]/80 transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
            onClick={calculateCarbonFootprint}
          >
            Calculate Carbon Footprint
          </button>

          {showSummary && (
            <div style={{ marginTop: "40px" }}>
              <h2 className="block text-sm/6 font-medium text-gray-900 my-0">
                Carbon Footprint Summary
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(carbonFootprint).map((category) => (
                  <div key={category}>
                    <h3>{category}</h3>
                    {renderTableAndChart(category)}
                  </div>
                ))}
              </div>
              <button
                // style={{ marginTop: '20px' }}
                onClick={computeLeastCo2Methods}
                className="bg-[#386641] mb-5 hover:bg-[#386641]/80 transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
              >
                Show Least CO₂ Management Technologies
              </button>
            </div>
          )}

          {showLeastCo2Table && (
            <div>
              <h2 className="block text-sm/6 font-medium text-gray-900 my-0">
                Least CO₂ Management Technologies{" "}
              </h2>
              <table className="my-5 w-full border border-collapse border-gray-300 text-sm">
                <thead>
                  <tr className="bg-[#386641] text-white border p-2">
                    <th className="border p-2">Category</th>
                    <th className="border p-2">Method</th>
                    <th className="border p-2">Carbon Footprint (tons CO₂)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(leastCo2Methods).map((category) => (
                    <tr key={category}>
                      <td className="border p-2">{category}</td>
                      <td className="border p-2">
                        {leastCo2Methods[category]?.method || "N/A"}
                      </td>
                      <td className="border p-2">
                        {leastCo2Methods[category]?.footprint?.toFixed(2) ||
                          "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NextPage;
