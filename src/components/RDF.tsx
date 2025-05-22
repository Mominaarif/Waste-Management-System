"use client";
import { useEffect, useState } from "react";
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
  totalCV: number;
  TotalComposition: number;
  TotalDensityContribution: number;
  TotalCVContribution: number;
  TotalMoistureContribution: number;
  adoptDesign: number;
  powerRequiredPerDayPrimary: number;
  ShreddedOutflowPrimary: number;
  adoptDesignSec: number;
  powerRequiredPerDaySec: number;
  ShreddedOutflowSec: number;
  adoptDesignPell: number;
  RDFOutflowPell: number;
  totalWasteGenerated: number;
  totalWasteGenerated1: number;
  totalWasteGenerated2: number;
  totalWasteGenerated3: number;
  totalPowerRequirementPelletizer: number;
  densificationRatioPelletizer: number;
  powerRequiredPerDay: number;
  moistureAdditionRequired: number;
  waterAdditionRequired: number;
  ResidueGeneratedPrimary: number;
  ResidueGeneratedSecondary: number;
  ResidueGeneratedPelletizing: number;
  ratioRDFCoal: number;
  totalAmountCoalEqualTonnePerDay: number;
  totalAmountRDFProduced: number;
  totalAmountCoalEqualGgPerYear: number;
  totaPriceRDFProduce: number;
  totalAmountCoalEqual: number;
  RDF: number;
  Coal: number;

  wasteGenerationResults: {
    id: string;
    name: string;
    wasteGenerated: number;
    wasteGenerated1: number;
    DensityContributionPerComponent: number;
    moistureContentPerComponent: number;
    CVContentPerComponent: number;
  }[];
}

type Subcategory = {
  id: string;
  name: string;
  value: string;
};

type SelectedSubcategory = {
  mainCategoryId: string;
  subCategoryId: string;
  subCategory: Subcategory;
};
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

// interface SubCategory {
//   id: string;
//   name: string;
//   value: string;
//   typicalDensity: string;
//   moistureContent: string;
//   typicalCalorificValue: string;
// }

// interface FormData {
//   subCategories: SubCategory[];
// }

const initialFields = [

  { key: "numberOfDays", label: "No. of Days", value: 3 },
  { key: "depthOfStorageArea", label: "Depth of Storage Area (m)", value: 8 },

  // {
  //   key: "totalWasteThroughputPrimaryShredder",
  //   label: "Total Waste Thoroughput to Shredder (tonnes/day)",
  //   value: 1388,
  // },
  {
    key: "operatingHoursPrimary",
    label: "Operating hours (hrs/day)",
    value: 12,
  },
  {
    key: "typicalPowerRequirementPrimary",
    label: "Typical Power Requirement (kW)",
    value: 500,
  },
  { key: "shredderEfficiency", label: "Shredder Efficiency (%)", value: 95 },
  {
    key: "sizeOfCoarseShreddedMatter",
    label: "Size of Coarse Shredded Matter (mm)",
    value: 200,
  },

  // {
  //   key: "totalWasteThroughputSecondaryShredder",
  //   label: "Total Waste Thoroughput to Shredder (tonnes/day) ",
  //   value: 1318,
  // },
  {
    key: "operatingHoursSecondary",
    label: "Operating hours (hrs/day)",
    value: 12,
  },
  {
    key: "typicalPowerRequirementSecondary",
    label: "Typical Power Requirement (kW)",
    value: 670,
  },
  // { key: 'powerRequiredPerDaySecondary', label: 'Power Required per Day (Secondary)', value: 8040 },
  { key: "shreddingEfficiency", label: "Shredding Efficiency (%)", value: 95 },
  // { key: 'shreddedOutflowSecondary', label: 'Shredded Outflow (Secondary)', value: 1253 },
  {
    key: "sizeOfFineShreddedMatter",
    label: "Size of Fine Shredded Matter (mm)",
    value: 10,
  },

  // {
  //   key: "totalWasteThroughputPelletizer",
  //   label: "Total Waste Thoroughput to Pelletizer (tonnes/day) ",
  //   value: 1253,
  // },
  // { key: 'adoptedDesignCapacityPelletizer', label: 'Adopted Design Capacity (Pelletizer)', value: 104 },
  {
    key: "operatingHoursPelletizer",
    label: "Operating hours (hrs/day)",
    value: 12,
  },
  { key: "recoveryEfficiency", label: "Recovery Efficiency (%)", value: 98 },
  { key: "densificationRatio", label: "Densification Ratio", value: 4 },

  {
    key: "typicalPowerRequirementPelletizer",
    label: "Typical Power Requirement (kW)",
    value: 0.75,
  },
  {
    key: "typicalPowerRequirementPelletizer1",
    label: "Typical Power Requirement (kW)",
    value: 500.8,
  },

  {
    key: "optimumMoistureContent",
    label: "Optimum Moisture Content (%)",
    value: 20,
  },
  {
    key: "initialMoistureContent",
    label: "Initial Moisture Content (%)",
    value: 5,
  },

  {
    key: "calorificValueCoal",
    label: "Calorific Value of Coal (MJ/Kg)",
    value: 28,
  },
  {
    key: "calorificValueRDF",
    label: "Calorific Value of RDF (MJ/Kg)",
    value: 25.97,
  },
  // {
  //   key: "totalAmountRDFProduce",
  //   label: "Total Amount of RDF Produced (tonnes/day)",
  //   value: 1227.5,
  // },
  { key: "coalUnitPrice", label: "Coal Unit Price (Rs./tonne)", value: 44240 },
  { key: "RDFUnitPrice", label: "RDF Unit Price (Rs./tonne)", value: 13530 },
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
  const [formData, setFormData] = useState<FormData>({
    subCategories: [],
  });
  const [data1, setData1] = useState([]);
  const [totalWasteInput, setTotalWasteInput] = useState(4053473.96110292); // in kg/day
  const [newSubCatName, setNewSubCatName] = useState("");
  const [newSubCatValue, setNewSubCatValue] = useState("");
  const [typicalDensity, setTypicalDensity] = useState("");
  const [moistureContent, setMoistureContent] = useState("");
  const [typicalCalorificValue, setTypicalCalorificValue] = useState("");


  const [editableSubcategories, setEditableSubcategories] = useState<any[]>([]);

  const [totalSubCatValue, setTotalSubCatValue] = useState(0);
  const [totalSubCatTypicalDensity, setTotalSubCatTypicalDensity] = useState(0);
  const [totalSubCatMoistureContent, setTotalSubCatMoistureContent] = useState(0);
  const [
    totalSubCatTypicalCalorificValue,
    setTotalSubCatTypicalCalorificValue,
  ] = useState(0);


  useEffect(() => {
    const stored = localStorage.getItem("componentWasteData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter(
        (item: any) => item.mainCategoryId === "combustibles"
      );
      setData1(filtered);
    }
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("componentWasteData");
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter(
        (item: any) => item.mainCategoryId === "combustibles"
      );
      console.log(filtered);

      // const parsed = JSON.parse(stored);
      // const combined = [
      //   ...(parsed.selectedSubcategories || []),
      //   ...(parsed.selectedOtherSubcategories || []),
      // ];
      // ✅ Filter where mainCategoryId is 'combustibles'
      // const filtered = parsed.filter(
      //   (item:any) => item.mainCategoryId === "combustibles"
      // );

      // ✅ Map and keep the necessary fields
      const withExtraFields = filtered.map((item: any) => ({
        mainCategoryId: item.mainCategoryId,
        name: item.name,
        percentage: item.percentage || "",
        waste: item.waste || "",
        typicalDensity: "",
        moistureContent: "",
        typicalCalorificValue: "",
      }));

      const total = filtered.reduce(
        (sum: any, subCat: any) => sum + (parseFloat(subCat.percentage) || 0),
        0
      );
      setTotalSubCatValue(total);
      setEditableSubcategories(withExtraFields);
    }
  }, []);

  const handleChange = (index: any, field: any, newValue: any) => {
    const updated = [...editableSubcategories];
    updated[index][field] = newValue;

    setEditableSubcategories(updated);


    const totalTypicalDensity = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.typicalDensity) || 0),
      0
    );

    const totalMoistureContent = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.moistureContent) || 0),
      0
    );

    const totalTypicalCalorificValue = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.typicalCalorificValue) || 0),
      0
    );
    setTotalSubCatTypicalDensity(totalTypicalDensity);
    setTotalSubCatMoistureContent(totalMoistureContent);
    setTotalSubCatTypicalCalorificValue(totalTypicalCalorificValue);
  };
  console.log(data1);
  console.log(editableSubcategories);

  // ✅ Run getCategories only after data1 is updated
  useEffect(() => {
    if (data1.length > 0) {
      getCategories();
    } else {
      setTotalWasteInput(4053473.96110292);
    }
  }, [data1]);

  const getCategories = () => {
    const totalSubCatValue = data1.reduce((sum, subCat: any) => {
      const val = parseFloat(subCat.waste) || 0;
      return sum + val;
    }, 0);
    setTotalWasteInput(totalSubCatValue);
  };

  const [retentionTime, setRetentionTime] = useState(3); // in days
  const [shredderEfficiencyPrimary, setShredderEfficiencyPrimary] = useState(
    95
  ); // in %
  const [shredderWastePrimary, setShredderWastePrimary] = useState(95); // in %
  const [pelletizerEfficiency, setPelletizerEfficiency] = useState(98); // in %
  const [densificationRatio, setDensificationRatio] = useState(8); // ratio
  const [optimumMoistureContent, setOptimumMoistureContent] = useState(20); // in %

  const [primaryShredder, setPrimaryShredder] = useState(95);
  const [secondaryShredder, setSecondaryShredder] = useState(95);
  const [pelletizer, setPelletizer] = useState(98);

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
    setFormFields((prevFields) =>
      prevFields.map((field) =>
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
    let totalWasteGenerated = 0
    let totalWasteGenerated1 = 0
    let totalWasteGenerated2 = 0
    let totalWasteGenerated3 = 0
    let totalCV = 0
    let wasteGenerationResults: any[] = []


    if (data1.length > 0) {
      {

        totalWasteGenerated = editableSubcategories.reduce((sum, subCat) => {
          const percentage = parseFloat(subCat.percentage); // Ensure it's a number
          return sum + totalWasteInput * (percentage / 100);
        }, 0);


        totalWasteGenerated1 = editableSubcategories.reduce(
          (sum, subCat) => {
            const percentage = parseFloat(subCat.value); // Ensure it's a number
            return sum + percentage;
          },
          0
        );

        totalWasteGenerated2 = editableSubcategories.reduce(
          (sum, subCat) => {
            const percentage = parseFloat(subCat.typicalDensity); // Ensure it's a number
            return sum + percentage;
          },
          0
        );

        totalWasteGenerated3 = editableSubcategories.reduce(
          (sum, subCat) => {
            const percentage = parseFloat(subCat.moistureContent); // Ensure it's a number
            return sum + percentage;
          },
          0
        );

        totalCV = editableSubcategories.reduce((sum, subCat) => {
          const percentage = parseFloat(subCat.typicalCalorificValue); // Ensure it's a number
          return sum + percentage;
        }, 0);

        wasteGenerationResults = editableSubcategories.map((subCat) => {
          const percentage = parseFloat(subCat.percentage);
          // const percentage = parseFloat(subCat.value);
          const DensityContribute = parseFloat(subCat.typicalDensity);
          const moisture = parseFloat(subCat.moistureContent);
          const CV = parseFloat(subCat.typicalCalorificValue);
          const generatedWaste = totalWasteInput * (percentage / 100);
          const wasteGenerated1 = (generatedWaste / totalWasteGenerated) * 100;
          const DensityContributionPerComponent =
            DensityContribute * (wasteGenerated1 / 100);
          const moistureContentPerComponent = moisture * (wasteGenerated1 / 100);
          const CVContentPerComponent = CV * (wasteGenerated1 / 100);
          console.log(DensityContribute, moisture, CV, totalWasteInput, wasteGenerated1);

          return {
            id: subCat.id,
            name: subCat.name,
            wasteGenerated: generatedWaste, // tons/day
            wasteGenerated1: wasteGenerated1, // tons/day
            DensityContributionPerComponent: DensityContributionPerComponent,
            moistureContentPerComponent: moistureContentPerComponent,
            CVContentPerComponent: CVContentPerComponent,
          };
        });
      }
    }
    else {

      totalWasteGenerated = formData.subCategories.reduce((sum, subCat) => {
        const percentage = parseFloat(subCat.value); // Ensure it's a number
        return sum + totalWasteInput * (percentage / 100);
      }, 0);


      totalWasteGenerated1 = formData.subCategories.reduce(
        (sum, subCat) => {
          const percentage = parseFloat(subCat.value); // Ensure it's a number
          return sum + percentage;
        },
        0
      );

      totalWasteGenerated2 = formData.subCategories.reduce(
        (sum, subCat) => {
          const percentage = parseFloat(subCat.typicalDensity); // Ensure it's a number
          return sum + percentage;
        },
        0
      );

      totalWasteGenerated3 = formData.subCategories.reduce(
        (sum, subCat) => {
          const percentage = parseFloat(subCat.moistureContent); // Ensure it's a number
          return sum + percentage;
        },
        0
      );

      totalCV = formData.subCategories.reduce((sum, subCat) => {
        const percentage = parseFloat(subCat.typicalCalorificValue); // Ensure it's a number
        return sum + percentage;
      }, 0);

      wasteGenerationResults = formData.subCategories.map((subCat) => {
        const percentage = parseFloat(subCat.value);
        // const percentage = parseFloat(subCat.value);
        const DensityContribute = parseFloat(subCat.typicalDensity);
        const moisture = parseFloat(subCat.moistureContent);
        const CV = parseFloat(subCat.typicalCalorificValue);
        const generatedWaste = totalWasteInput * (percentage / 100);
        const wasteGenerated1 = (generatedWaste / totalWasteGenerated) * 100;
        const DensityContributionPerComponent =
          DensityContribute * (wasteGenerated1 / 100);
        const moistureContentPerComponent = moisture * (wasteGenerated1 / 100);
        const CVContentPerComponent = CV * (wasteGenerated1 / 100);

        console.log(DensityContribute, moisture, CV, totalWasteInput, wasteGenerated1);

        return {
          id: subCat.id,
          name: subCat.name,
          wasteGenerated: generatedWaste, // tons/day
          wasteGenerated1: wasteGenerated1, // tons/day
          DensityContributionPerComponent: DensityContributionPerComponent,
          moistureContentPerComponent: moistureContentPerComponent,
          CVContentPerComponent: CVContentPerComponent,
        };
      });
    }
    console.log(editableSubcategories);
    console.log(wasteGenerationResults);
    // const volumePerDay = totalWasteInput / (density * 1000); // Convert density to kg/m³
    // const storageVolume = volumePerDay * retentionTime;
    const totalVolumeInflow =
      formFields.find((field) => field.key === "totalVolumeInflow")?.value || 0;

    const numberOfDays =
      formFields.find((field) => field.key === "numberOfDays")?.value || 0;

    const depthOfStorageArea =
      formFields.find((field) => field.key === "depthOfStorageArea")?.value ||
      0;

    ////////////
    const TotalWastePrimary =
      formFields.find(
        (field) => field.key === "totalWasteThroughputPrimaryShredder"
      )?.value || 0;

    const operatingHoursPrimary =
      formFields.find((field) => field.key === "operatingHoursPrimary")
        ?.value || 0;

    const typicalPowerRequirementPrimary =
      formFields.find((field) => field.key === "typicalPowerRequirementPrimary")
        ?.value || 0;

    const ShreddedEfficiencypri =
      formFields.find((field) => field.key === "shredderEfficiency")?.value ||
      0;

    ////////////
    const TotalWasteSecondary =
      formFields.find(
        (field) => field.key === "totalWasteThroughputSecondaryShredder"
      )?.value || 0;

    const operatingHoursSecondary =
      formFields.find((field) => field.key === "operatingHoursSecondary")
        ?.value || 0;

    const typicalPowerRequirementSecondary =
      formFields.find(
        (field) => field.key === "typicalPowerRequirementSecondary"
      )?.value || 0;

    const ShreddedEfficiencySec =
      formFields.find((field) => field.key === "shreddingEfficiency")?.value ||
      0;

    ///////////

    const TotalWastePelletizer =
      formFields.find((field) => field.key === "totalWasteThroughputPelletizer")
        ?.value || 0;

    const operatingHoursPelletizer =
      formFields.find((field) => field.key === "operatingHoursPelletizer")
        ?.value || 0;

    const recoveryEfficiencyPelletizer =
      formFields.find((field) => field.key === "recoveryEfficiency")?.value ||
      0;

    const densificationRatioPelletizer =
      formFields.find((field) => field.key === "densificationRatio")?.value ||
      0;

    const storageArea = totalVolumeInflow * numberOfDays;
    const storageVolume = storageArea / depthOfStorageArea;

    const TotalComposition = wasteGenerationResults.reduce((sum: any, subCat: any) => {
      const percentage = subCat.wasteGenerated1; // Already a number
      return sum + percentage;
    }, 0);

    const TotalDensityContribution = wasteGenerationResults.reduce(
      (sum: any, subCat: any) => {
        const percentage = subCat.DensityContributionPerComponent; // Already a number
        return sum + percentage;
      },
      0
    );

    const TotalMoistureContribution = wasteGenerationResults.reduce(
      (sum: any, subCat: any) => {
        const percentage = subCat.moistureContentPerComponent; // Already a number
        return sum + percentage;
      },
      0
    );

    const TotalCVContribution = wasteGenerationResults.reduce((sum: any, subCat: any) => {
      const percentage = subCat.CVContentPerComponent; // Already a number
      return sum + percentage;
    }, 0);

    const typicalPowerRequirementPelletizer =
      formFields.find(
        (field) => field.key === "typicalPowerRequirementPelletizer"
      )?.value || 0;

    const typicalPowerRequirementPelletizer1 =
      formFields.find(
        (field) => field.key === "typicalPowerRequirementPelletizer1"
      )?.value || 0;

    const adoptDesign = TotalWastePrimary / operatingHoursPrimary;
    const powerRequiredPerDayPrimary =
      typicalPowerRequirementPrimary * operatingHoursPrimary;
    const ShreddedOutflowPrimary =
      TotalWastePrimary * (ShreddedEfficiencypri / 100);

    const adoptDesignSec = TotalWasteSecondary / operatingHoursSecondary;
    const powerRequiredPerDaySec =
      typicalPowerRequirementSecondary * operatingHoursSecondary;
    const ShreddedOutflowSec =
      TotalWasteSecondary * (ShreddedEfficiencySec / 100);

    const adoptDesignPell = TotalWastePelletizer / operatingHoursPelletizer;
    const RDFOutflowPell =
      TotalWastePelletizer * (recoveryEfficiencyPelletizer / 100);

    const totalPowerRequirementPelletizer =
      typicalPowerRequirementPelletizer + typicalPowerRequirementPelletizer1;

    const powerRequiredPerDay =
      operatingHoursPelletizer * totalPowerRequirementPelletizer;

    const optimumMoistureContent =
      formFields.find((field) => field.key === "optimumMoistureContent")
        ?.value || 0;

    const initialMoistureContent =
      formFields.find((field) => field.key === "initialMoistureContent")
        ?.value || 0;

    const moistureAdditionRequired =
      optimumMoistureContent - initialMoistureContent;

    const waterAdditionRequired =
      ((moistureAdditionRequired / 100) * (TotalWastePelletizer * 1000)) / 1000;

    const rdfOutput =
      totalWasteInput *
      (primaryShredder / 100) *
      (pelletizer / 100);
    const equivalentCoal = (rdfOutput * calorificValue) / 28; // Assuming coal CV = 28 MJ/kg

    const ResidueGeneratedPrimary = TotalWastePrimary - ShreddedOutflowPrimary;
    const ResidueGeneratedSecondary =
      ShreddedOutflowPrimary - ShreddedOutflowSec;
    const ResidueGeneratedPelletizing = ShreddedOutflowSec - RDFOutflowPell;

    const calorificValueCoal =
      formFields.find((field) => field.key === "calorificValueCoal")?.value ||
      0;

    const calorificValueRDF =
      formFields.find((field) => field.key === "calorificValueRDF")?.value || 0;

    const totalAmountRDFProduce =
      formFields.find((field) => field.key === "totalAmountRDFProduce")
        ?.value || 0;

    const coalUnitPrice =
      formFields.find((field) => field.key === "coalUnitPrice")?.value || 0;

    const RDFUnitPrice =
      formFields.find((field) => field.key === "RDFUnitPrice")?.value || 0;

    const ratioRDFCoal = calorificValueRDF / calorificValueCoal;
    const totalAmountCoalEqualTonnePerDay =
      totalAmountRDFProduce * ratioRDFCoal;
    const totalAmountRDFProduced = (totalAmountRDFProduce * 365) / 1000; // in Gg/year
    const totalAmountCoalEqualGgPerYear =
      (totalAmountCoalEqualTonnePerDay * 365) / 1000; // in Gg/year
    const totaPriceRDFProduce = totalAmountRDFProduce * 365 * RDFUnitPrice;
    const totalAmountCoalEqual =
      totalAmountCoalEqualTonnePerDay * 365 * coalUnitPrice;
    const RDF = totaPriceRDFProduce / 1000000000;
    const Coal = totalAmountCoalEqual / 1000000000;

    setCalculatedValues({
      density,
      moistureContent,
      calorificValue,
      storageVolume: storageVolume ?? 0,
      storageArea,
      rdfOutput,
      equivalentCoal,
      wasteGenerationResults,
      densificationRatioPelletizer,

      totalWasteGenerated,
      totalWasteGenerated1,
      totalWasteGenerated2,
      totalWasteGenerated3,

      totalCV,
      TotalComposition,
      TotalDensityContribution,
      TotalMoistureContribution,
      TotalCVContribution,

      adoptDesign,
      powerRequiredPerDayPrimary,
      ShreddedOutflowPrimary,

      adoptDesignSec,
      powerRequiredPerDaySec,
      ShreddedOutflowSec,

      adoptDesignPell,
      RDFOutflowPell,
      totalPowerRequirementPelletizer,
      powerRequiredPerDay,
      moistureAdditionRequired,
      waterAdditionRequired,

      ResidueGeneratedPrimary,
      ResidueGeneratedSecondary,
      ResidueGeneratedPelletizing,

      ratioRDFCoal,
      totalAmountCoalEqualTonnePerDay,
      totalAmountRDFProduced,
      totalAmountCoalEqualGgPerYear,
      totaPriceRDFProduce,
      totalAmountCoalEqual,
      RDF,
      Coal,
    });
  };













  const handleAddAllComponents = () => {
    const formatted = editableSubcategories.map((item, index) => ({
      id: `s${formData.subCategories.length + index + 1}`,
      name: item.name,
      value: item.percentage,
      typicalDensity: item.typicalDensity.trim(),
      moistureContent: item.moistureContent.trim(),
      typicalCalorificValue: item.typicalCalorificValue.trim(),
    }));

    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, ...formatted],
    }));
  };


  // const handleAddSubCategory = () => {
  //   if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

  //   const newSubCategory = {
  //     id: `s${formData.subCategories.length + 1}`,
  //     name: newSubCatName.trim(),
  //     value: newSubCatValue.trim(),
  //     typicalDensity: typicalDensity.trim(),
  //     moistureContent: moistureContent,
  //     typicalCalorificValue: typicalCalorificValue, // Add this property with a default value
  //   };

  //   setFormData((prev) => ({
  //     ...prev,
  //     subCategories: [...prev.subCategories, newSubCategory],
  //   }));

  //   // Clear inputs
  //   setNewSubCatName("");
  //   setNewSubCatValue("");
  //   setTypicalDensity("");
  //   setTypicalCalorificValue("");
  //   setMoistureContent("");
  // };


  // const arrayOne = JSON.parse(localStorage.getItem('formData.selectedSubcategories') || '[]');

  // const [data1, setData1] = useState<any[]>([]);

  // useEffect(() => {
  //   if (Array.isArray(arrayOne)) {
  //     const filtered = arrayOne.filter((item) => item.mainCategoryId === 'biodegradables');
  //     setData1(filtered);
  //   }
  // }, []);

  const componentOptions = [
    "Paper",
    "Cardboard",
    "Light Plastic",
    "Dense Plastic",
    "Yard Waste",
    "Textile Waste",
    "Wood",
    "Leather",
    "Animal Dunk",
  ];

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
      moistureContent: "0",
      typicalCalorificValue: "0",
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
  const handleSubCategoryValueChange = ({
    name,
    field,
    newValue,
  }: {
    name: string;
    field:
    | "value"
    | "typicalDensity"
    | "moistureContent"
    | "typicalCalorificValue";
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

    const totalMoistureContent = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.moistureContent) || 0),
      0
    );

    const totalTypicalCalorificValue = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.typicalCalorificValue) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      subCategories: updated,
    }));
    setTotalSubCatValue(total);
    setTotalSubCatTypicalDensity(totalTypicalDensity);
    setTotalSubCatMoistureContent(totalMoistureContent);
    setTotalSubCatTypicalCalorificValue(totalTypicalCalorificValue);
  };

  // console.log(formData.subCategories);

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
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14 border shadow-sm py-4 font-bold">
        RDF Design
      </h1> */}
      <div className="">
        {/* {data1.map((item: any) => (
            <p key={item.name} className="">
              {item.name} --------
              {item.waste}<br />
            </p>
        ))} */}
        {/* Input Section */}
        <div className="pt-10 px-5 md:px-8">
          <div className="border p-8 rounded-md">
            <h2 className="text-lg font-semibold text-gray-900 pb-5">
              Input Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {[
                // Mapping input fields
                {
                  label: "Total Combustible Waste (kg/day)",
                  value: totalWasteInput,
                  setter: setTotalWasteInput,
                },
              ].map((input, index) => (
                <div className="" key={index}>
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {input.label}
                  </label>
                  {data1.length > 0 ? (
                    <p className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm">
                      {input.value}
                    </p>
                  ) : (
                    <input
                      type="number"
                      value={input.value}
                      onChange={(e) => input.setter(parseFloat(e.target.value))}
                      className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center pt-5">
              <label className="block text-sm font-medium text-gray-900 pb-1 w-full text-left">
                Evaluation of Energy Potential and Physical Properties of Waste
              </label>
              {/* <div className="md:grid md:grid-cols-5 flex flex-col w-full font-[600]">
                    <p className="block w-full bg-[#F2F2F2] border px-3 py-2 text-sm">
                      Component
                    </p>
                    <p className="block w-full bg-[#F2F2F2] border px-3 py-2 text-sm">
                      Composition (%)
                    </p>
                    <p className="block w-full bg-[#F2F2F2] border px-3 py-2 text-sm">
                      Typical Densities (tonnes/m³)
                    </p>
                    <p className="block w-full bg-[#F2F2F2] border px-3 py-2 text-sm">
                      Moisture Content (%)
                    </p>
                    <p className="block w-full bg-[#F2F2F2] border px-3 py-2 text-sm">
                      Typical Calorific Values (MJ/Kg)
                    </p>
                  </div> */}
              {data1.length > 0 ? (
                <>
                  <table className="w-full border border-collapse border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Component</th>
                        <th className="border p-2">Composition (%)</th>
                        {/* <th className="border p-2">tonnes/day</th> */}
                        <th className="border p-2">
                          Typical Densities (tonnes/m³)
                        </th>
                        <th className="border p-2">Moisture Content (%)</th>
                        <th className="border p-2">
                          Typical Calorific Values (MJ/Kg)
                        </th>
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
                              {subCat.percentage}
                            </p>
                          </td>

                          <td className="p-[0_!important]">
                            <input
                              type="number"
                              value={subCat.typicalDensity}
                              className="block w-full  border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              onChange={(e) =>
                                handleChange(
                                  idx,
                                  "typicalDensity",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-[0_!important]">
                            <input
                              type="number"
                              className="block w-full  border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              value={subCat.moistureContent}
                              onChange={(e) =>
                                handleChange(
                                  idx,
                                  "moistureContent",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td className="p-[0_!important]">
                            <input
                              type="number"
                              className="block w-full  border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              value={subCat.typicalCalorificValue}
                              onChange={(e) =>
                                handleChange(
                                  idx,
                                  "typicalCalorificValue",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-gray-100 font-semibold">
                        <td className="border p-2">Total</td>
                        <td className="border p-2">{totalSubCatValue}</td>
                        <td className="border p-2">
                          {totalSubCatTypicalDensity.toFixed(2)}
                        </td>
                        <td className="border p-2">
                          {totalSubCatMoistureContent}
                        </td>
                        <td className="border p-2">
                          {totalSubCatTypicalCalorificValue.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* {editableSubcategories.map((item: any, index) => (
                        <div
                          className="md:grid md:grid-cols-5 flex flex-col w-full"
                          key={item.id}
                        >
                          <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm">
                            {item.name}
                          </p>
                          <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm">
                            {item.percentage}
                          </p>
                          <input
                            type="text"
                            placeholder="%"
                            max={100}
                            min={0}
                            name="subCategoryValue"
                            value={item.typicalDensity}
                            onChange={(e) => {
                              const updated = [...editableSubcategories];
                              updated[index].typicalDensity = e.target.value;
                              setEditableSubcategories(updated);
                            }}
                            className="block h-[38px] w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                          />
                          <input
                            type="text"
                            placeholder="%"
                            max={100}
                            min={0}
                            // value={moistureContent}
                            name="subCategoryValue"
                            value={item.moistureContent}
                            onChange={(e) => {
                              const updated = [...editableSubcategories];
                              updated[index].moistureContent = e.target.value;
                              setEditableSubcategories(updated);
                            }}
                            className="block h-[38px] w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                          />
                          <input
                            type="text"
                            placeholder="%"
                            max={100}
                            min={0}
                            name="subCategoryValue"
                            value={item.typicalCalorificValue}
                            onChange={(e) => {
                              const updated = [...editableSubcategories];
                              updated[index].typicalCalorificValue =
                                e.target.value;
                              setEditableSubcategories(updated);
                            }}
                            className="block h-[38px] w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                          />
                        </div>
                      ))} */}
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
                            <th className="border p-2">Composition (%)</th>
                            {/* <th className="border p-2">tonnes/day</th> */}
                            <th className="border p-2">
                              Typical Densities (tonnes/m³)
                            </th>
                            <th className="border p-2">Moisture Content (%)</th>
                            <th className="border p-2">
                              Typical Calorific Values (MJ/Kg)
                            </th>
                            <th className="border p-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.subCategories.map((subCat, idx) => (
                            <tr key={idx}>
                              <td className="p-[0_!important] pl-[8px_!important] border">
                                {subCat.name}
                              </td>

                              <td className="p-[0_!important] border">
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

                              <td className="p-[0_!important] border">
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

                              <td className="p-[0_!important] border">
                                <input
                                  type="number"
                                  value={subCat.moistureContent}
                                  onChange={(e) =>
                                    handleSubCategoryValueChange({
                                      name: subCat.name,
                                      field: "moistureContent",
                                      newValue: e.target.value,
                                    })
                                  }
                                  className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                />
                              </td>

                              <td className="p-[0_!important] border">
                                <input
                                  type="number"
                                  value={subCat.typicalCalorificValue}
                                  onChange={(e) =>
                                    handleSubCategoryValueChange({
                                      name: subCat.name,
                                      field: "typicalCalorificValue",
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

                          {/* {formData.subCategories.map((subCat, idx) => (
                            <tr key={idx}>
                              <td className="p-[0_!important] pl-[8px_!important]">
                                {subCat.name}
                              </td>
                              <td className="p-[0_!important]">
                                <input
                                  type="number"
                                  value={subCat.value}
                                  onChange={(e) =>{
                                    handleSubCategoryValueChange({
                                      name: subCat.name,
                                      value: e.target.value,
                                     
                                    })}
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
                                      value: "",
                                      typicalDensity: e.target.value,
                                      moistureContent: "",
                                      typicalCalorificValue: "",
                                    })
                                  }
                                  className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                />
                              </td>
                              <td className="p-[0_!important]">
                                <input
                                  type="number"
                                  value={subCat.moistureContent}
                                  onChange={(e) =>
                                    handleSubCategoryValueChange({
                                      name: subCat.name,
                                      value: "",
                                      typicalDensity: "",
                                      moistureContent: e.target.value,
                                      typicalCalorificValue: "",
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
                                      value: "",
                                      typicalDensity: "",
                                      moistureContent: "",
                                      typicalCalorificValue: e.target.value,
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
                          ))} */}

                          <tr className="bg-gray-100 font-semibold">
                            <td className="border p-2">Total</td>
                            <td className="border p-2">{totalSubCatValue}</td>
                            <td className="border p-2">
                              {/* {totalSubCatTypicalDensity.toFixed(2)} */}
                            </td>
                            <td className="border p-2">
                              {/* {totalSubCatMoistureContent} */}
                            </td>
                            <td className="border p-2">
                              {/* {totalSubCatTypicalCalorificValue.toFixed(2)} */}
                            </td>
                            <th></th>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5">
              Storage Design
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {formFields.slice(0, 2).map(({ key, label, value }) => (
                <div key={key} className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleInputChange({ key, value: e.target.value })
                    }
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5">
              Process Design
            </h2>
            <h2 className="text-lg font-semibold text-gray-900 py-5 text-center">
              1. Primary Shredder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {formFields.slice(2, 6).map(({ key, label, value }) => (
                <div key={key} className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleInputChange({ key, value: e.target.value })
                    }
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5 text-center">
              2. Secondary Shredder
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {formFields.slice(6, 10).map(({ key, label, value }) => (
                <div key={key} className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleInputChange({ key, value: e.target.value })
                    }
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  />
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-gray-900 py-5 text-center">
              3. Pelletizer{" "}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {formFields.slice(10, 17).map(({ key, label, value }) => (
                <div key={key} className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleInputChange({ key, value: e.target.value })
                    }
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  />
                </div>
              ))}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 py-5 text-center">
              Coal Vs RDF
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6">
              {formFields.slice(17).map(({ key, label, value }) => (
                <div key={key} className="">
                  <label className="block text-sm font-medium text-gray-900 pb-1">
                    {label}:
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handleInputChange({ key, value: e.target.value })
                    }
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 md:text-sm"
                  />
                </div>
              ))}
            </div>

            {/* <div className="overflow-x-auto w-full flex flex-col items-start">
              <div className="mt-4 space-y-2 w-full">
                <label className="block text-sm font-medium text-gray-900 pb-1 w-full text-left">
                  Waste Flows{" "}
                </label>{" "}
                <table className="w-full border border-collapse border-gray-300 text-sm md:w-[70%_!important] ">
                  <thead>
                    <tr className="text-left text-black bg-gray-100">
                      <th
                        className="w-[35%_!important] text-left border p-2"
                        style={{ textAlign: "left" }}
                      >
                        Processes
                      </th>
                      <th
                        className="w-[35%_!important] text-left border p-2"
                        style={{ textAlign: "left" }}
                      >
                        Efficiencies (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="">
                      <th style={{ textAlign: "left" }} className="border p-2">
                        Primary Shredding
                      </th>
                      <td
                        style={{ textAlign: "left", padding: 0 }}
                        className="border p-2"
                      >
                        <input
                          type="number"
                          placeholder="%"
                          max={100}
                          min={0}
                          value={primaryShredder}
                          name="primaryShredder"
                          onChange={(e) =>
                            setPrimaryShredder(parseFloat(e.target.value) || 0)
                          }
                          className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                        />
                      </td>
                    </tr>
                    <tr className="">
                      <th style={{ textAlign: "left" }} className="border p-2">
                        Secondary Shredding
                      </th>
                      <td
                        style={{ textAlign: "left", padding: 0 }}
                        className="border p-2"
                      >
                        <input
                          type="number"
                          placeholder="%"
                          max={100}
                          min={0}
                          value={secondaryShredder}
                          name="secondaryShredder"
                          onChange={(e) =>
                            setSecondaryShredder(
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                        />
                      </td>
                    </tr>
                    <tr className="">
                      <th style={{ textAlign: "left" }} className="border p-2">
                        Pelletizing
                      </th>
                      <td
                        style={{ textAlign: "left", padding: 0 }}
                        className="border p-2"
                      >
                        <input
                          type="number"
                          placeholder="%"
                          max={100}
                          min={0}
                          value={pelletizer}
                          name="pelletizer"
                          onChange={(e) =>
                            setPelletizer(parseFloat(e.target.value) || 0)
                          }
                          className="block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div> */}

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
              <h2 className="text-lg font-semibold text-gray-900 ">
                Waste Composition, Density, Moisture Content and, Calorific
                Value Calculation
              </h2>
              {/* <h2 className="text-lg font-semibold text-gray-900 ">Waste Flows</h2> */}
              {/* <h2 className="text-lg font-semibold text-gray-900 ">Waste Flows</h2> */}
              <div className="overflow-x-auto w-full flex flex-col items-start">
                <div className="mt-4 space-y-2 w-full">
                  <table className="table text-left w-full">
                    <thead className="text-[10px]">
                      <tr className="text-left bg-gray-100">
                        <th
                          className="w-[10%_!important] border p-2"
                          style={{ textAlign: "left" }}
                        ></th>
                        <th
                          className="w-[35%_!important] border p-2 text-left"
                          style={{ textAlign: "left" }}
                        >
                          Component
                        </th>
                        <th
                          className="w-[35%_!important] border p-2 text-left"
                          style={{ textAlign: "left" }}
                        >
                          Generation Rate (Kg/day){" "}
                        </th>
                        <th
                          className="w-[35%_!important] border p-2 text-left"
                          style={{ textAlign: "left" }}
                        >
                          composition(%)
                        </th>
                        <th
                          className="w-[35%_!important] border p-2 text-left"
                          style={{ textAlign: "left" }}
                        >
                          Density Contribution per Component (tonnes/m³)
                        </th>
                        <th
                          className="w-[35%_!important] border p-2 text-left"
                          style={{ textAlign: "left" }}
                        >
                          Moisture Contribution per Component (%)
                        </th>

                        <th
                          className="w-[35%_!important] border p-2 text-left"
                          style={{ textAlign: "left" }}
                        >
                          CV in Input Waste Stream (MJ/Kg)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculatedValues.wasteGenerationResults.map((ss, id) => (
                        <tr className="" key={ss.id}>
                          <th
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {id + 1}
                          </th>
                          <td
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {ss.name}
                          </td>
                          <td
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {ss.wasteGenerated.toFixed(2)}
                          </td>
                          <td
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {ss.wasteGenerated1.toFixed(2)}
                          </td>
                          <td
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {ss.DensityContributionPerComponent.toFixed(2)}
                          </td>
                          <td
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {ss.moistureContentPerComponent.toFixed(2)}
                          </td>
                          <td
                            style={{ textAlign: "left" }}
                            className="border p-2"
                          >
                            {ss.CVContentPerComponent.toFixed(2)}
                          </td>
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
              <h2 className="text-lg font-semibold pt-4 text-gray-900 ">
                Waste Flows
              </h2>

              <div className="overflow-x-auto w-full flex flex-col items-start">
                <div className="mt-4 space-y-2 w-full">
                  <table className="table text-left w-full">
                    <thead className="text-[10px]">
                      <tr className="text-left bg-gray-100">
                        <th
                          className="w-[35%_!important] text-left border p-2"
                          style={{ textAlign: "left" }}
                        >
                          Processes
                        </th>
                        <th
                          className="w-[35%_!important] text-left border p-2"
                          style={{ textAlign: "left" }}
                        >
                          Efficiencies (%){" "}
                        </th>
                        <th
                          className="w-[35%_!important] text-left border p-2"
                          style={{ textAlign: "left" }}
                        >
                          Outflow for Production, tonnes/day{" "}
                        </th>
                        <th
                          className="w-[35%_!important] text-left border p-2"
                          style={{ textAlign: "left" }}
                        >
                          Residue Generated, tonnes/day{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="">
                        <th
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          Primary Shredding
                        </th>
                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {primaryShredder.toFixed(2)}
                        </td>

                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {calculatedValues.ShreddedOutflowPrimary.toFixed(2)}
                        </td>
                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {calculatedValues.ResidueGeneratedPrimary.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="">
                        <th
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          Secondary Shredding
                        </th>
                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {secondaryShredder.toFixed(2)}
                        </td>

                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {calculatedValues.ShreddedOutflowSec.toFixed(2)}
                        </td>
                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {calculatedValues.ResidueGeneratedSecondary.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                      <tr className="">
                        <th
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          Pelletizing
                        </th>
                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {pelletizer.toFixed(2)}
                        </td>

                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {calculatedValues.RDFOutflowPell.toFixed(2)}
                        </td>
                        <td
                          style={{ textAlign: "left" }}
                          className="border p-2"
                        >
                          {calculatedValues.ResidueGeneratedPelletizing.toFixed(
                            2
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 pt-4">
                Solid Waste Input
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Total Input to RDF Plant (Kg/day)",
                    value: calculatedValues.totalWasteGenerated,
                  },
                  {
                    label: "Total Input to RDF Plant (Tons/day)",
                    value: calculatedValues.totalWasteGenerated / 1000,
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
              <h2 className="text-lg font-semibold text-gray-900  pt-4">
                Density Calculation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Density of Combustibles (tonnes/m3)",
                    value: calculatedValues.TotalDensityContribution,
                  },
                  {
                    label: "Density of Combustibles (Kg/m3)",
                    value: calculatedValues.TotalDensityContribution * 1000,
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

              {/* <h2 className="text-lg font-semibold text-gray-900 ">Solid Waste Input</h2> */}
              <div className=" border-t grid grid-cols-1 md:grid-cols-1 gap-y-4 gap-x-6 pt-4 mt-4">
                {[
                  {
                    label: "Volume (m3/day)",
                    value:
                      (calculatedValues.TotalDensityContribution * 1000) /
                      calculatedValues.TotalDensityContribution,
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
              <h2 className="text-lg font-semibold text-gray-900 pt-4">
                Calorific Value Calculation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Calorific Value (CV) of RDF (MJ/Kg)",
                    value: calculatedValues.totalCV,
                  },
                  {
                    label: "Calorific Value (CV) of RDF (KJ/Kg)",
                    value: calculatedValues.totalCV * 1000,
                  },
                  {
                    label: "Calorific Value (CV) of RDF (kcal/Kg)",
                    value: (calculatedValues.totalCV * 1000) / 4.184,
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

              <h2 className="text-lg font-semibold text-gray-900 pt-4">
                Storage Design
              </h2>
              {/* <h2 className="text-lg font-semibold text-gray-900 pt-4">Process Design </h2> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Storage Required (m³)",
                    value: calculatedValues.storageVolume,
                  },
                  {
                    label: "Storage Area Required (m²)",
                    value: calculatedValues.storageArea,
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

              <h2 className="text-lg font-semibold text-center w-full text-gray-900 pt-4">
                Process Design{" "}
              </h2>
              <h2 className="text-base font-semibold text-gray-900 pt-4">
                1. Primary Shredder{" "}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Adopted Design Capacity (Primary) (tonnes/hr)",
                    value: calculatedValues.adoptDesign,
                  },
                  {
                    label: "Power Required per day (Primary) (kWh)",
                    value: calculatedValues.powerRequiredPerDayPrimary,
                  },
                  {
                    label: "Shredded Outflow (Primary) (tonnes/day)",
                    value: calculatedValues.ShreddedOutflowPrimary,
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

              <h2 className="text-base font-semibold text-gray-900 pt-4">
                2. Secondary Shredder{" "}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Adopted Design Capacity (Secondary) (tonnes/hr)",
                    value: calculatedValues.adoptDesignSec,
                  },
                  {
                    label: "Power Required per day (Secondary) (kWh)",
                    value: calculatedValues.powerRequiredPerDaySec,
                  },
                  {
                    label: "Shredded Outflow (Secondary) (tonnes/day)",
                    value: calculatedValues.ShreddedOutflowSec,
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

              <h2 className="text-base font-semibold text-gray-900 pt-4">
                3. Pelletizer{" "}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Adopted Design Capacity (Pelletizer) (tonnes/hr)",
                    value: calculatedValues.adoptDesignPell,
                  },
                  {
                    label: "RDF Outflow, Pellets (tonnes/day)",
                    value: calculatedValues.RDFOutflowPell,
                  },
                  {
                    label: "Initial Volume (Pellets) m3/day",
                    value:
                      calculatedValues.RDFOutflowPell /
                      calculatedValues.TotalDensityContribution,
                  },
                  {
                    label: "Final Volume, Pellets (m3/day)",
                    value:
                      calculatedValues.RDFOutflowPell /
                      calculatedValues.densificationRatioPelletizer,
                  },
                  {
                    label: "Volume Reduction (%)",
                    value:
                      (calculatedValues.RDFOutflowPell /
                        calculatedValues.TotalDensityContribution -
                        calculatedValues.RDFOutflowPell /
                        calculatedValues.densificationRatioPelletizer /
                        calculatedValues.RDFOutflowPell /
                        calculatedValues.TotalDensityContribution) *
                      100,
                  },
                  {
                    label: "Total Power Requirement (kW)",
                    value: calculatedValues.totalPowerRequirementPelletizer,
                  },
                  {
                    label: "Power Required Per Day (kWh)",
                    value: calculatedValues.powerRequiredPerDay,
                  },

                  {
                    label: "Moisture Addition Required (%)",
                    value: calculatedValues.moistureAdditionRequired,
                  },
                  {
                    label: "Water Addition Required (m3/day)",
                    value: calculatedValues.waterAdditionRequired,
                  },
                  {
                    label: "Total Residue Generated (tonnes/day)",
                    value:
                      calculatedValues.ResidueGeneratedPrimary +
                      calculatedValues.ResidueGeneratedSecondary +
                      calculatedValues.ResidueGeneratedPelletizing,
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

              {/* <h2 className="text-lg font-semibold text-gray-900 pt-4">Coal Vs RDF</h2> */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "CV of RDF : CV of Coal",
                    value: calculatedValues.ratioRDFCoal,
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

              <div className="border-t grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 pt-4 mt-4">
                {[
                  {
                    label: "Total Amount of Equivalent Coal (tonnes/day)",
                    value: calculatedValues.totalAmountCoalEqualTonnePerDay,
                  },

                  {
                    label: "Total Amount of RDF Produced (Gg/year)",
                    value: calculatedValues.totalAmountRDFProduced,
                  },

                  {
                    label: "Total Amount of Equivalent Coal (Gg/year)",
                    value: calculatedValues.totalAmountCoalEqualGgPerYear,
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
              <h2 className="text-lg font-semibold text-gray-900 pt-4">
                Cost Benefit Analysis{" "}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6 mt-4">
                {[
                  {
                    label: "Total Price of RDF Produced (Rs./year)",
                    value: calculatedValues.totaPriceRDFProduce,
                  },

                  {
                    label: "Total Price of Coal Equivalent (to RDF) (Rs./year)",
                    value: calculatedValues.totalAmountCoalEqual,
                  },

                  {
                    label: "RDF",
                    value: calculatedValues.RDF,
                  },

                  {
                    label: "Coal (Equivalent to RDF)",
                    value: calculatedValues.RDF,
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
