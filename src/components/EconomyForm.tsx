// import { useState } from "react";
// interface Capex {
//   id: string;
//   name: string;
//   value: string;
// }

// interface FormData {
//   capex: Capex[];
// }

// export default function EconomyForm({ open }: any) {
//   const componentOptions = [
//     "Land Acquisition",
//     "Machinery and Equipment",
//     "Construction & installation",
//     "Engineering & design fees",
//     "Permits, licenses, and legal fees",
//     "Can add as many as user wants",
//   ];

//   const opexOptions = [
//     "Salaries and labor",
//     "Energy and utility costs",
//     "Maintenance and spare parts",
//     "Insurance, taxes, and admin costs",
//     "Can add as many as user wants",
//   ];

//   const revenueOptions = [
//     "Biogas to electricity",
//     "Digestate as soil fertilizer",
//     "Carbon Credits",
//     "Can add as many as user wants",
//   ];

//   const [formData, setFormData] = useState<FormData>({
//     capex: [],
//   });

//   const [formDataOpex, setFormDataOpex] = useState({
//     opex: [],
//     revenue: [],
//   });

//   const [totalSubCatValue, setTotalSubCatValue] = useState(0);
//   const [discount, setDiscount] = useState(10);

//   const handleComponentSelect = (e: any) => {
//     const selectedName = e.target.value;
//     if (!selectedName) return;

//     const alreadyExists = formData.capex.some(
//       (subCat) => subCat.name === selectedName
//     );
//     if (alreadyExists) return;

//     const newComponent = {
//       id: `s${formData.capex.length + 1}`,
//       name: selectedName,
//       value: "0",
//     };

//     const updated = [...formData.capex, newComponent];
//     setFormData((prev) => ({
//       ...prev,
//       capex: updated,
//     }));

//     // Reset dropdown
//     e.target.value = "";
//   };

//   const handleCapexValueChange = ({ name, value }: any) => {
//     const parsedValue = parseFloat(value);
//     if (isNaN(parsedValue)) return;

//     const updated = formData.capex.map((subCat) =>
//       subCat.name === name ? { ...subCat, value } : subCat
//     );

//     const total = updated.reduce(
//       (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
//       0
//     );

//     setFormData((prev) => ({
//       ...prev,
//       capex: updated,
//     }));
//     setTotalSubCatValue(total);
//   };

//   const handleRemoveCapex = (name: any) => {
//     const updated = formData.capex.filter((subCat) => subCat.name !== name);

//     const total = updated.reduce(
//       (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
//       0
//     );

//     setFormData((prev) => ({
//       ...prev,
//       capex: updated,
//     }));

//     setTotalSubCatValue(total);
//   };

//   const [columns, setColumns] = useState(0);

//   const handleComponentSelectOpex = (e: any) => {
//     const selected = e.target.value;
//     if (selected) {
//       setFormDataOpex((prev: any) => ({
//         ...prev,
//         opex: [
//           ...prev.opex,
//           {
//             name: selected,
//             values: Array(columns + 1).fill(""), // create values array based on dynamic columns
//           },
//         ],
//       }));
//     }
//   };

//   const handleColumnCountChange = (e: any) => {
//     const val = parseInt(e.target.value);
//     if (!isNaN(val)) {
//       setColumns(val); // +1 as per your requirement
//     }
//   };

//   const handleOpexValueChange = (
//     componentName: any,
//     colIndex: any,
//     value: any
//   ) => {
//     setFormDataOpex((prev: any) => ({
//       ...prev,
//       opex: prev.opex.map((item: any) =>
//         item.name === componentName
//           ? {
//               ...item,
//               values: item.values.map((val: any, idx: any) =>
//                 idx === colIndex ? value : val
//               ),
//             }
//           : item
//       ),
//     }));
//   };

//   const handleRemoveOpex = (name: any) => {
//     setFormDataOpex((prev) => ({
//       ...prev,
//       opex: prev.opex.filter((item: any) => item.name !== name),
//     }));
//   };

//   const handleComponentSelectRevenue = (e: any) => {
//     const selected = e.target.value;
//     if (selected) {
//       setFormDataOpex((prev: any) => ({
//         ...prev,
//         revenue: [
//           ...prev.revenue,
//           {
//             name: selected,
//             values: Array(columns + 1).fill(""), // create values array based on dynamic columns
//           },
//         ],
//       }));
//     }
//   };

//   const handleRevenueValueChange = (
//     componentName: any,
//     colIndex: any,
//     value: any
//   ) => {
//     setFormDataOpex((prev: any) => ({
//       ...prev,
//       revenue: prev.revenue.map((item: any) =>
//         item.name === componentName
//           ? {
//               ...item,
//               values: item.values.map((val: any, idx: any) =>
//                 idx === colIndex ? value : val
//               ),
//             }
//           : item
//       ),
//     }));
//   };

//   const handleRemoveRevenue = (name: any) => {
//     setFormDataOpex((prev) => ({
//       ...prev,
//       revenue: prev.revenue.filter((item: any) => item.name !== name),
//     }));
//   };

//   const [npv, setNpv] = useState(0);
//   const [bcr, setBcr] = useState(0);
//   const [cumulativeCashFlows, setCumulativeCashFlows] = useState<number[]>([]);
//   const [discountedRevenuesPerYear, setDiscountedRevenuesPerYear] = useState<
//     number[]
//   >([]);
//   const [discountedCostsPerYear, setDiscountedCostsPerYear] = useState<
//     number[]
//   >([]);
//   const [cashFlows, setCashFlows] = useState<number[]>([]);
//   const [simplifiedPaybackPeriod, setSimplifiedPaybackPeriod] = useState<
//     number | string | undefined
//   >();
//   const [cumulativePaybackPeriod, setCumulativePaybackPeriod] = useState<
//     number | string | undefined | null
//   >(null);

//   const calculateNPV = () => {
//     const initialInvestment = totalSubCatValue;
//     const cashFlows = [];
//     const cumulativeCashFlows = [];
//     const discountedRevenuesPerYear = [0]; // Year 0 has no revenue
//     const discountedCostsPerYear = [initialInvestment]; // Year 0 has initial investment (CAPEX)
//     let cumulative = -initialInvestment;
//     let discountedRevenues = 0; // Sum of R_t / (1 + r)^t
//     let discountedCosts = initialInvestment; // Start with initial investment (CAPEX) at t=0

//     for (let year = 0; year < columns; year++) {
//       const yearlyRevenue = formDataOpex.revenue.reduce(
//         (sum, item: any) => sum + parseFloat(item.values[year]) || 0,
//         0
//       );
//       const yearlyOpex = formDataOpex.opex.reduce(
//         (sum, item: any) => sum + parseFloat(item.values[year]) || 0,
//         0
//       );
//       const netCashFlow = yearlyRevenue - yearlyOpex;

//       cashFlows.push(netCashFlow);
//       cumulative += netCashFlow;
//       cumulativeCashFlows.push(cumulative);

//       // Calculate discounted values for BCR
//       const discountFactor = Math.pow(1 + discount / 100, year + 1);
//       const discountedRevenue = yearlyRevenue / discountFactor;
//       const discountedOpex = yearlyOpex / discountFactor;

//       discountedRevenuesPerYear.push(discountedRevenue);
//       discountedCostsPerYear.push(discountedOpex);

//       discountedRevenues += discountedRevenue;
//       discountedCosts += discountedOpex;
//     }

//     // NPV calculation
//     let npv = -initialInvestment;
//     for (let year = 0; year < cashFlows.length; year++) {
//       npv += cashFlows[year] / Math.pow(1 + discount / 100, year + 1);
//     }

//     // BCR calculation
//     const bcr =
//       discountedCosts === 0 ? 0 : discountedRevenues / discountedCosts;

//     // Cumulative Payback Period calculation
//     let cumulativePaybackPeriod = null;

//     let paybackPeriod = null;
//     for (let i = 0; i < cumulativeCashFlows.length; i++) {
//       if (cumulativeCashFlows[i] >= 0) {
//         const previousCumulative =
//           i === 0 ? -initialInvestment : cumulativeCashFlows[i - 1];
//         const cashFlowAtI = cashFlows[i];
//         const fractionalYear = Math.abs(previousCumulative) / cashFlowAtI;
//         paybackPeriod = i + fractionalYear;
//         break;
//       }
//     }

//     // Simplified Payback Period calculation (based on average annual net cash flow)
//     const totalNetCashFlow = cashFlows.reduce((sum, flow) => sum + flow, 0);
//     const averageAnnualNetCashFlow = totalNetCashFlow / cashFlows.length || 0; // Avoid division by zero
//     const simplifiedPaybackPeriod =
//       averageAnnualNetCashFlow !== 0
//         ? initialInvestment / averageAnnualNetCashFlow
//         : "Never";

//     return {
//       npv,
//       cumulativeCashFlows,
//       cashFlows,
//       bcr,
//       discountedRevenuesPerYear,
//       discountedCostsPerYear,
//       cumulativePaybackPeriod,
//       simplifiedPaybackPeriod,
//       paybackPeriod,
//     };
//   };
//   return (
//     <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
//       <div className="">
//         <div className="pt-8 bg-white">
//           <div className="mx-8 border p-8 rounded-md">
//             <div className="border-b border-gray-900/10 pb-8 mb-4">
//               <h2 className="text-base/7 font-semibold text-gray-900">
//                 Capital Cost (CAPEX)
//               </h2>
//               <div className="pt-5">
//                 <div className="w-full space-y-4">
//                   {/* Dropdown always visible */}
//                   <select
//                     onChange={handleComponentSelect}
//                     className="block h-[38px] w-full border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
//                   >
//                     <option value="">Select Component</option>
//                     {componentOptions
//                       .filter(
//                         (option) =>
//                           !formData.capex.some(
//                             (subCat) => subCat.name === option
//                           )
//                       )
//                       .map((option) => (
//                         <option key={option} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                   </select>

//                   {formData.capex.length > 0 && (
//                     <table className="w-full border border-collapse border-gray-300 text-sm">
//                       <thead>
//                         <tr className="bg-gray-100">
//                           <th className="border p-2">Component</th>
//                           <th className="border p-2">Rs.</th>
//                           <th className="border p-2"></th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {formData.capex.map((subCat, idx) => (
//                           <tr key={idx}>
//                             <td className="p-[0_!important] pl-[8px_!important]">
//                               {subCat.name}
//                             </td>
//                             <td className="p-[0_!important]">
//                               <input
//                                 type="number"
//                                 value={subCat.value}
//                                 onChange={(e) =>
//                                   handleCapexValueChange({
//                                     name: subCat.name,
//                                     value: e.target.value,
//                                   })
//                                 }
//                                 className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
//                               />
//                             </td>
//                             <td>
//                               <button
//                                 onClick={() => handleRemoveCapex(subCat.name)}
//                                 className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
//                               >
//                                 ✕
//                               </button>
//                             </td>
//                           </tr>
//                         ))}

//                         <tr className="bg-gray-100 font-semibold">
//                           <td className="border p-2">Total CAPEX</td>
//                           <td className="border p-2">{totalSubCatValue}</td>
//                           <th></th>
//                         </tr>
//                       </tbody>
//                     </table>
//                   )}
//                 </div>
//               </div>
//               <div className=" grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
//                 <div className="">
//                   <label className="block text-sm/6 font-medium text-gray-900 mt-5 mb-2">
//                     Expected Life of Project:
//                   </label>
//                   <div className="mt-2">
//                     <input
//                       type="number"
//                       min="0"
//                       onChange={handleColumnCountChange}
//                       placeholder="Enter value"
//                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                     />
//                   </div>
//                 </div>
//                 <div className="">
//                   <label className="block text-sm/6 font-medium text-gray-900 mt-5 mb-2">
//                     Discount:
//                   </label>
//                   <div className="mt-2">
//                     <input
//                       type="number"
//                       value={discount}
//                       min="0"
//                       onChange={(e: any) => setDiscount(e.target.value)}
//                       placeholder="Enter value"
//                       className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="">
//               <h2 className="text-base/7 font-semibold text-gray-900">
//                 Operational Cost (OPEX)
//               </h2>

//               <div className="border-b border-gray-900/10 pb-8 mb-4">
//                 <select
//                   onChange={handleComponentSelectOpex}
//                   className="block h-[38px] w-full mt-2 border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
//                 >
//                   <option value="">Select Component</option>
//                   {opexOptions
//                     .filter(
//                       (option) =>
//                         !formDataOpex.opex.some(
//                           (subCat: any) => subCat.name === option
//                         )
//                     )
//                     .map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                 </select>

//                 {formDataOpex.opex.length > 0 && (
//                   <table className="w-full border border-collapse border-gray-300 text-sm mt-5">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border p-2" rowSpan={2}>
//                           Component
//                         </th>
//                         {Array.from({ length: columns }, (_, i) => (
//                           <th key={i} className="border p-2">
//                             Year {i + 1}
//                           </th>
//                         ))}

//                         <th className="border p-2"></th>
//                       </tr>
//                       <tr>
//                         {Array.from({ length: columns }, (_, i) => (
//                           <th key={i} className="border p-2">
//                             Rs.
//                           </th>
//                         ))}
//                         <th className="border p-2"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formDataOpex.opex.map((subCat: any, rowIdx: any) => (
//                         <tr key={rowIdx}>
//                           <td className="p-[0_!important]">{subCat.name}</td>
//                           {Array.from({ length: columns }, (_, colIdx) => (
//                             <td key={colIdx} className="p-[0_!important]">
//                               <input
//                                 type="number"
//                                 value={subCat.values[colIdx] || ""}
//                                 onChange={(e: any) =>
//                                   handleOpexValueChange(
//                                     subCat.name,
//                                     colIdx,
//                                     e.target.value
//                                   )
//                                 }
//                                 className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
//                               />
//                             </td>
//                           ))}
//                           <td className="p-[0_!important]">
//                             <button
//                               onClick={() => handleRemoveOpex(subCat.name)}
//                               className="text-red-500 hover:text-red-700 text-xs"
//                             >
//                               ✕
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                       {/* Row: Total per Column */}
//                       <tr className="bg-gray-50 font-semibold">
//                         <td className="border p-2">Total OPEX</td>
//                         {Array.from({ length: columns }, (_, colIdx) => {
//                           const colTotal = formDataOpex.opex.reduce(
//                             (sum: any, subCat: any) => {
//                               const val =
//                                 parseFloat(subCat.values?.[colIdx]) || 0;
//                               return sum + val;
//                             },
//                             0
//                           );
//                           return (
//                             <td key={colIdx} className="border p-2">
//                               {colTotal}
//                             </td>
//                           );
//                         })}
//                         <td className="border p-2"></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 )}
//               </div>

//               <h2 className="text-base/7 font-semibold text-gray-900">
//                 Revenue
//               </h2>

//               <div className="">
//                 <select
//                   onChange={handleComponentSelectRevenue}
//                   className="block h-[38px] w-full mt-2 border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
//                 >
//                   <option value="">Select Component</option>
//                   {revenueOptions
//                     .filter(
//                       (option) =>
//                         !formDataOpex.opex.some(
//                           (subCat: any) => subCat.name === option
//                         )
//                     )
//                     .map((option) => (
//                       <option key={option} value={option}>
//                         {option}
//                       </option>
//                     ))}
//                 </select>

//                 {formDataOpex.revenue.length > 0 && (
//                   <table className="w-full border border-collapse border-gray-300 text-sm mt-5">
//                     <thead>
//                       <tr className="bg-gray-100">
//                         <th className="border p-2" rowSpan={2}>
//                           Component
//                         </th>
//                         {Array.from({ length: columns }, (_, i) => (
//                           <th key={i} className="border p-2">
//                             Year {i + 1}
//                           </th>
//                         ))}
//                         <th className="border p-2"></th>
//                       </tr>
//                       <tr className="bg-gray-100">
//                         {Array.from({ length: columns }, (_, i) => (
//                           <th key={i} className="border p-2">
//                             Rs.
//                           </th>
//                         ))}
//                         <th className="border p-2"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formDataOpex.revenue.map((subCat: any, rowIdx: any) => (
//                         <tr key={rowIdx}>
//                           <td className="p-[0_!important]">{subCat.name}</td>
//                           {Array.from({ length: columns }, (_, colIdx) => (
//                             <td key={colIdx} className="p-[0_!important]">
//                               <input
//                                 type="number"
//                                 value={subCat.values[colIdx] || ""}
//                                 onChange={(e: any) =>
//                                   handleRevenueValueChange(
//                                     subCat.name,
//                                     colIdx,
//                                     e.target.value
//                                   )
//                                 }
//                                 className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
//                               />
//                             </td>
//                           ))}
//                           <td className="p-[0_!important]">
//                             <button
//                               onClick={() => handleRemoveRevenue(subCat.name)}
//                               className="text-red-500 hover:text-red-700 text-xs"
//                             >
//                               ✕
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                       {/* Row: Total per Column */}
//                       <tr className="bg-gray-50 font-semibold">
//                         <td className="border p-2">Total OPEX</td>
//                         {Array.from({ length: columns }, (_, colIdx) => {
//                           const colTotal = formDataOpex.revenue.reduce(
//                             (sum: any, subCat: any) => {
//                               const val =
//                                 parseFloat(subCat.values?.[colIdx]) || 0;
//                               return sum + val;
//                             },
//                             0
//                           );
//                           return (
//                             <td key={colIdx} className="border p-2">
//                               {colTotal}
//                             </td>
//                           );
//                         })}
//                         <td className="border p-2"></td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 )}
//               </div>
//               <div className=" flex justify-center">
//                 <button
//                   className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-blue-600"
//                   onClick={() => {
//                     const {
//                       npv,
//                       cumulativeCashFlows,
//                       cashFlows,
//                       bcr,
//                       discountedRevenuesPerYear,
//                       discountedCostsPerYear,
//                       simplifiedPaybackPeriod,
//                       cumulativePaybackPeriod,
//                       paybackPeriod,
//                     } = calculateNPV();
//                     setNpv(npv);
//                     setDiscountedRevenuesPerYear(discountedCostsPerYear);
//                     setDiscountedCostsPerYear(discountedRevenuesPerYear);
//                     setCashFlows(cashFlows);
//                     setBcr(bcr);

//                     setCumulativePaybackPeriod(paybackPeriod);
//                     // setCumulativePaybackPeriod(cumulativePaybackPeriod);
//                     // setSimplifiedPaybackPeriod(simplifiedPaybackPeriod);

//                     setCumulativeCashFlows(cumulativeCashFlows);
//                   }}
//                 >
//                   Calculate
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* // JSX to display the results */}
//         {(npv !== null ||
//           cumulativeCashFlows !== null ||
//           cashFlows !== null ||
//           bcr !== null ||
//           discountedRevenuesPerYear !== null ||
//           discountedCostsPerYear !== null ||
//           simplifiedPaybackPeriod !== null ||
//           cumulativePaybackPeriod !== null) && (
//             //   paybackPeriod !== null
//             <div className="border p-8 mx-8 mt-8 rounded-md">
//               <p className="text-lg font-semibold text-gray-900 pb-5">
//                 Analysis
//               </p>

//               <label className="block text-sm font-medium text-gray-900">
//                 Net Present Value (NPV) Breakdown
//               </label>
//               <table className="w-full border-collapse border mt-4 text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border p-2">Component</th>
//                     {Array.from({ length: columns + 1 }, (_, i) => (
//                       <th key={i} className="border p-2">
//                         {i === 0 ? "Year 0" : `Year ${i}`}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* CAPEX Row */}
//                   {/* <tr>
//                   <td className="border p-2">CAPEX</td>
//                   <td className="border p-2 text-right">{-totalSubCatValue}</td>
//                   {Array.from({ length: columns }, (_, i) => (
//                     <td key={i} className="border p-2 text-right">
//                       -
//                     </td>
//                   ))}
//                 </tr> */}
//                   {/* OPEX Row */}
//                   {/* <tr>
//                   <td className="border p-2">OPEX</td>
//                   <td className="border p-2 text-right">-</td>
//                   {Array.from({ length: columns }, (_, i) => (
//                     <td key={i} className="border p-2 text-right">
//                       {formDataOpex.opex.reduce(
//                         (sum, item: any) =>
//                           sum + (parseFloat(item.values[i]) || 0),
//                         0
//                       )}
//                     </td>
//                   ))}
//                 </tr> */}
//                   {/* Revenue Row */}
//                   {/* <tr>
//                   <td className="border p-2">Revenue</td>
//                   <td className="border p-2 text-right">-</td>
//                   {Array.from({ length: columns }, (_, i) => (
//                     <td key={i} className="border p-2 text-right">
//                       {formDataOpex.revenue.reduce(
//                         (sum, item: any) =>
//                           sum + (parseFloat(item.values[i]) || 0),
//                         0
//                       )}
//                     </td>
//                   ))}
//                 </tr> */}
//                   {/* Net Cash Flow Row */}
//                   <tr className="font-medium ">
//                     <td className="border p-2">Net Cash Flow</td>
//                     <td className="border p-2 text-right">
//                       {-totalSubCatValue}
//                     </td>
//                     {Array.from({ length: columns }, (_, i) => (
//                       <td key={i} className="border p-2 text-right">
//                         {formDataOpex.revenue.reduce(
//                           (sum, item: any) =>
//                             sum + (parseFloat(item.values[i]) || 0),
//                           0
//                         ) -
//                           formDataOpex.opex.reduce(
//                             (sum, item: any) =>
//                               sum + (parseFloat(item.values[i]) || 0),
//                             0
//                           )}
//                       </td>
//                     ))}
//                   </tr>
//                   <tr>
//                     <td className="border p-2">Cumulative Cash Flow</td>
//                     <td className="border p-2 text-right">
//                       {-totalSubCatValue}
//                     </td>
//                     {cumulativeCashFlows.map((value, i) => (
//                       <td key={i} className="border p-2 text-right">
//                         {value.toFixed(2)}
//                       </td>
//                     ))}
//                   </tr>
//                 </tbody>
//               </table>
//               <div className="border p-3 rounded-md">
//                 <label className="block text-sm font-medium text-gray-900">
//                   Net Present Value (NPV):
//                 </label>
//                 <span className="text-gray-700">
//                   {npv.toFixed(8)}{" "}
//                 </span>
//               </div>

//               {/* BCR Table */}
//               <label className="block text-sm font-medium text-gray-900 pt-5">
//                 Benefit-Cost Ratio (BCR) Breakdown
//               </label>

//               <table className="w-full border-collapse border mt-4 text-sm">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border p-2">Component</th>
//                     {Array.from({ length: columns + 2 }, (_, i) => (
//                       <th key={i} className="border p-2">
//                        {i === 0
//       ? "Year 0"
//       : i === columns + 1
//       ? "Sum"
//       : `Year ${i}`}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {/* Net Cash Flow Row */}
//                   {/* <tr className="font-medium">
//                   <td className="border p-2">Net Cash Flow</td>
//                   <td className="border p-2 text-right">{-totalSubCatValue}</td>
//                   {Array.from({ length: columns }, (_, i) => (
//                     <td key={i} className="border p-2 text-right">
//                       {formDataOpex.revenue.reduce(
//                         (sum, item: any) =>
//                           sum + (parseFloat(item.values[i]) || 0),
//                         0
//                       ) -
//                         formDataOpex.opex.reduce(
//                           (sum, item: any) =>
//                             sum + (parseFloat(item.values[i]) || 0),
//                           0
//                         )}
//                     </td>
//                   ))}
//                 </tr> */}
//                   {/* Discounted Revenues Row */}
//                   <tr>
//                     <td className="border p-2">Discounted Revenues</td>
//                     {discountedRevenuesPerYear.map((value, i) => (
//                       <td key={i} className="border p-2 text-right">
//                         {value.toFixed(8)}
//                       </td>
//                     ))}
//                     <td>
//                       {discountedRevenuesPerYear.reduce(
//                         (sum, i: any) => sum + (parseFloat(i) || 0),
//                         0
//                       )}
//                     </td>
//                   </tr>
//                   {/* Discounted Costs Row */}
//                   <tr>
//                     <td className="border p-2">Discounted Costs</td>
//                     {discountedCostsPerYear.map((value, i) => (
//                       <td key={i} className="border p-2 text-right">
//                         {value.toFixed(8)}
//                       </td>
//                     ))}
//                     <td>
//                       {discountedCostsPerYear.reduce(
//                         (sum, i: any) => sum + (parseFloat(i) || 0),
//                         0
//                       )}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div className="border p-3 rounded-md">
//                 <label className="block text-sm font-medium text-gray-900">
//                   Benefit-Cost Ratio (BCR):
//                 </label>
//                 <span className="text-gray-700">{bcr.toFixed(8)} </span>{" "}
//               </div>

//               {/* Payback Periods */}
//               <div className="border p-3 rounded-md">
//                 <label className="block text-sm font-medium text-gray-900">
//                   Payback Period (PBP):
//                 </label>
//                 <span className="text-gray-700 ">
//                   {typeof cumulativePaybackPeriod === "number"
//                     ? `${cumulativePaybackPeriod.toFixed(2)} years`
//                     : "Not recovered within period"}
//                 </span>
//               </div></div>

//             </div>
//           )}
//         <div className="bg-white w-full pt-2">
//           <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import $ from 'jquery';

// DataTables core and responsive
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

import 'datatables.net';
import 'datatables.net-responsive-dt';
// import type DataTables from 'datatables.net-dt/types/dataTables';
interface Capex {
  id: string;
  name: string;
  value: string;
}

interface FormData {
  capex: Capex[];
}

export default function EconomyForm({ open }: any) {
  const componentOptions = [
    "Land Acquisition",
    "Machinery and Equipment",
    "Construction & installation",
    "Engineering & design fees",
    "Permits, licenses, and legal fees",
    "Can add as many as user wants",
  ];

  const opexOptions = [
    "Salaries and labor",
    "Energy and utility costs",
    "Maintenance and spare parts",
    "Insurance, taxes, and admin costs",
    "Can add as many as user wants",
  ];

  const revenueOptions = [
    "Biogas to electricity",
    "Digestate as soil fertilizer",
    "Carbon Credits",
    "tariff/fee for waste management",
    "recycling revenue",
    "landfill revenue",
    "AD revenue",
    "Composting revenue",
    "RDF revenue",
    "Can add as many as user wants",
  ];

  const [formData, setFormData] = useState({
    capex: [],
  });

  const [formDataOpex, setFormDataOpex] = useState({
    opex: [],
    revenue: [],
  });

  const [totalSubCatValue, setTotalSubCatValue] = useState(0);
  const [discount, setDiscount] = useState(10);

  // State for custom input
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputValue, setCustomInputValue] = useState("");
  const [currentInputType, setCurrentInputType] = useState(""); // 'capex', 'opex', 'revenue'

  const handleAddCustomComponent = () => {
    if (!customInputValue.trim()) return;

    if (currentInputType === 'capex') {
      const newComponent = {
        id: `s${formData.capex.length + 1}`,
        name: customInputValue,
        value: "",
      };
      const updated = [...formData.capex, newComponent];
      setFormData((prev:any) => ({
        ...prev,
        capex: updated,
      }));
    }
    else if (currentInputType === 'opex') {
      setFormDataOpex((prev: any) => ({
        ...prev,
        opex: [
          ...prev.opex,
          {
            name: customInputValue,
            values: Array(columns + 1).fill(""),
          },
        ],
      }));
    }
    else if (currentInputType === 'revenue') {
      setFormDataOpex((prev: any) => ({
        ...prev,
        revenue: [
          ...prev.revenue,
          {
            name: customInputValue,
            values: Array(columns + 1).fill(""),
          },
        ],
      }));
    }

    setCustomInputValue("");
    setShowCustomInput(false);
  };

  const handleComponentSelect = (e: any) => {
    const selectedName = e.target.value;
    if (!selectedName) return;

    if (selectedName === "Can add as many as user wants") {
      setCurrentInputType('capex');
      setShowCustomInput(true);
      e.target.value = "";
      return;
    }

    const alreadyExists = formData.capex.some(
      (subCat:any) => subCat.name === selectedName
    );
    if (alreadyExists) return;

    const newComponent = {
      id: `s${formData.capex.length + 1}`,
      name: selectedName,
      value: "",
    };

    const updated = [...formData.capex, newComponent];
    setFormData((prev:any) => ({
      ...prev,
      capex: updated,
    }));

    // Reset dropdown
    e.target.value = "";
  };

  const handleCapexValueChange = ({ name, value }: any) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    const updated = formData.capex.map((subCat:any) =>
      subCat.name === name ? { ...subCat, value } : subCat
    );

    const total = updated.reduce(
      (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
      0
    );

    setFormData((prev:any) => ({
      ...prev,
      capex: updated,
    }));
    setTotalSubCatValue(total);
  };

  const handleRemoveCapex = (name: any) => {
    const updated = formData.capex.filter((subCat:any) => subCat.name !== name);

    const total = updated.reduce(
      (sum, subCat:any) => sum + (parseFloat(subCat.value) || 0),
      0
    );

    setFormData((prev) => ({
      ...prev,
      capex: updated,
    }));

    setTotalSubCatValue(total);
  };

  const [columns, setColumns] = useState(0);

  const handleComponentSelectOpex = (e: any) => {
    const selected = e.target.value;
    if (!selected) return;

    if (selected === "Can add as many as user wants") {
      setCurrentInputType('opex');
      setShowCustomInput(true);
      e.target.value = "";
      return;
    }

    setFormDataOpex((prev: any) => ({
      ...prev,
      opex: [
        ...prev.opex,
        {
          name: selected,
          values: Array(columns + 1).fill(""), // create values array based on dynamic columns
        },
      ],
    }));
  };

  const handleColumnCountChange = (e: any) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      setColumns(val); // +1 as per your requirement
    }
  };

  const handleOpexValueChange = (
    componentName: any,
    colIndex: any,
    value: any
  ) => {
    setFormDataOpex((prev: any) => ({
      ...prev,
      opex: prev.opex.map((item: any) =>
        item.name === componentName
          ? {
            ...item,
            values: item.values.map((val: any, idx: any) =>
              idx === colIndex ? value : val
            ),
          }
          : item
      ),
    }));
  };

  const handleRemoveOpex = (name: any) => {
    setFormDataOpex((prev) => ({
      ...prev,
      opex: prev.opex.filter((item: any) => item.name !== name),
    }));
  };

  const handleComponentSelectRevenue = (e: any) => {
    const selected = e.target.value;
    if (!selected) return;

    if (selected === "Can add as many as user wants") {
      setCurrentInputType('revenue');
      setShowCustomInput(true);
      e.target.value = "";
      return;
    }

    setFormDataOpex((prev: any) => ({
      ...prev,
      revenue: [
        ...prev.revenue,
        {
          name: selected,
          values: Array(columns + 1).fill(""), // create values array based on dynamic columns
        },
      ],
    }));
  };

  const handleRevenueValueChange = (
    componentName: any,
    colIndex: any,
    value: any
  ) => {
    setFormDataOpex((prev: any) => ({
      ...prev,
      revenue: prev.revenue.map((item: any) =>
        item.name === componentName
          ? {
            ...item,
            values: item.values.map((val: any, idx: any) =>
              idx === colIndex ? value : val
            ),
          }
          : item
      ),
    }));
  };

  const handleRemoveRevenue = (name: any) => {
    setFormDataOpex((prev) => ({
      ...prev,
      revenue: prev.revenue.filter((item: any) => item.name !== name),
    }));
  };

  const [NPVmessage, setNPVMessage] = useState("");
  const [BCRmessage, setBCRMessage] = useState("");

  const [isShow, setIsShow] = useState(false);
  const [npv, setNpv] = useState(0);
  const [bcr, setBcr] = useState(0);
  const [cumulativeCashFlows, setCumulativeCashFlows] = useState<number[]>([]);
  const [discountedRevenuesPerYear, setDiscountedRevenuesPerYear] = useState<
    number[]
  >([]);
  const [discountedCostsPerYear, setDiscountedCostsPerYear] = useState<
    number[]
  >([]);
  const [cashFlows, setCashFlows] = useState<number[]>([]);
  const [simplifiedPaybackPeriod, setSimplifiedPaybackPeriod] = useState<
    number | string | undefined
  >();
  const [cumulativePaybackPeriod, setCumulativePaybackPeriod] = useState<
    number | string | undefined | null
  >(null);

  const calculateNPV = () => {
    setIsShow(true);
    const initialInvestment = totalSubCatValue;
    const cashFlows = [];
    const cumulativeCashFlows = [];
    const discountedRevenuesPerYear = [0]; // Year 0 has no revenue
    const discountedCostsPerYear = [initialInvestment]; // Year 0 has initial investment (CAPEX)
    let cumulative = -initialInvestment;
    let discountedRevenues = 0; // Sum of R_t / (1 + r)^t
    let discountedCosts = initialInvestment; // Start with initial investment (CAPEX) at t=0

    for (let year = 0; year < columns; year++) {
      const yearlyRevenue = formDataOpex.revenue.reduce(
        (sum, item: any) => sum + parseFloat(item.values[year]) || 0,
        0
      );
      const yearlyOpex = formDataOpex.opex.reduce(
        (sum, item: any) => sum + parseFloat(item.values[year]) || 0,
        0
      );
      const netCashFlow = yearlyRevenue - yearlyOpex;

      cashFlows.push(netCashFlow);
      cumulative += netCashFlow;
      cumulativeCashFlows.push(cumulative);

      // Calculate discounted values for BCR
      const discountFactor = Math.pow(1 + discount / 100, year + 1);
      const discountedRevenue = yearlyRevenue / discountFactor;
      const discountedOpex = yearlyOpex / discountFactor;

      discountedRevenuesPerYear.push(discountedRevenue);
      discountedCostsPerYear.push(discountedOpex);

      discountedRevenues += discountedRevenue;
      discountedCosts += discountedOpex;
    }

    // NPV calculation
    let npv = -initialInvestment;
    for (let year = 0; year < cashFlows.length; year++) {
      npv += cashFlows[year] / Math.pow(1 + discount / 100, year + 1);
    }

    // BCR calculation
    const bcr =
      discountedCosts === 0 ? 0 : discountedRevenues / discountedCosts;

    // Cumulative Payback Period calculation
    let cumulativePaybackPeriod = null;

    let paybackPeriod = null;
    for (let i = 0; i < cumulativeCashFlows.length; i++) {
      if (cumulativeCashFlows[i] >= 0) {
        const previousCumulative =
          i === 0 ? -initialInvestment : cumulativeCashFlows[i - 1];
        const cashFlowAtI = cashFlows[i];
        const fractionalYear = Math.abs(previousCumulative) / cashFlowAtI;
        paybackPeriod = i + fractionalYear;
        break;
      }
    }

    // Simplified Payback Period calculation (based on average annual net cash flow)
    const totalNetCashFlow = cashFlows.reduce((sum, flow) => sum + flow, 0);
    const averageAnnualNetCashFlow = totalNetCashFlow / cashFlows.length || 0; // Avoid division by zero
    const simplifiedPaybackPeriod =
      averageAnnualNetCashFlow !== 0
        ? initialInvestment / averageAnnualNetCashFlow
        : "Never";


    if (npv < 0) {
      setNPVMessage("Not Economically viable");
    }
    else if (npv > 0) {
      setNPVMessage("Economically viable");
    }
    else {
      setNPVMessage("Break-even")
    }


    if (bcr < 0) {
      setBCRMessage("Not Economically viable");
    }

    else if (bcr > 0) {
      setBCRMessage("Economically viable");
    }
    else {
      setBCRMessage("Break-even");
    }

    return {
      npv,
      cumulativeCashFlows,
      cashFlows,
      bcr,
      discountedRevenuesPerYear,
      discountedCostsPerYear,
      cumulativePaybackPeriod,
      simplifiedPaybackPeriod,
      paybackPeriod,
    };
  };
  const tableRef = useRef<HTMLTableElement>(null);

  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup any existing DataTable before reinitializing
    if (dataTableRef.current) {
      dataTableRef.current.destroy();
      dataTableRef.current = null;
    }

    // Reinitialize after DOM has updated
    const timeout = setTimeout(() => {
      if (tableRef.current && tableRef.current.querySelectorAll('tbody tr').length > 0) {
        dataTableRef.current = $(tableRef.current).DataTable({
          responsive: true,
        });
      }
    }, 0); // wait for React to paint

    return () => {
      clearTimeout(timeout);
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      }
    };
  }, [formData.capex]);
  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
      <div className="">
        <div className="pt-8 bg-white">
          <div className="mx-8 border p-8 rounded-md">
            {/* Custom Input Modal */}
            {showCustomInput && (
              <div className="fixed inset-0 bg-transparent flex items-center justify-center z-10">
                <div className="bg-white p-6 rounded-md shadow-md w-96">
                  <h3 className="text-lg font-medium mb-4">Add Custom Component</h3>
                  <input
                    type="text"
                    value={customInputValue}
                    onChange={(e) => setCustomInputValue(e.target.value)}
                    placeholder="Enter component name"
                    className="block w-full border rounded-md px-3 py-2 mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomInputValue("");
                      }}
                      className="px-4 py-2 border rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCustomComponent}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="border-b border-gray-900/10 pb-8 mb-4">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Capital Cost (CAPEX)
              </h2>
              <div className="pt-5">
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
                          !formData.capex.some(
                            (subCat:any) => subCat.name === option
                          )
                      )
                      .map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>

                  {formData.capex.length > 0 && <table
                    // ref={tableRef}
                    className="w-full border border-collapse border-gray-300 text-sm mt-5"
                  >
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">Component</th>
                        <th className="border p-2">Rs.</th>
                        <th className="border p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {formData.capex.length === 0 ? (
                        <tr>
                          <td colSpan={1} className="text-center">No CAPEX data available.</td>
                        </tr>
                      ) : ( */}
                      <>
                        {formData.capex.map((subCat:any, idx) => (
                          <tr key={idx}>
                            <td className="p-[0_!important] pl-[8px_!important] border">{subCat.name}</td>
                            <td className="p-[0_!important] border">
                              <input
                                type="number"
                                value={subCat.value || ""}
                                onChange={(e) =>
                                  handleCapexValueChange({
                                    name: subCat.name,
                                    value: e.target.value,
                                  })
                                }
                                className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              />
                            </td>
                            <td className="border">
                              <button
                                onClick={() => handleRemoveCapex(subCat.name)}
                                className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-100 font-semibold">
                          <td className="border p-2">Total CAPEX</td>
                          <td className="border p-2">{totalSubCatValue}</td>
                          <td></td>
                        </tr>
                      </>
                      {/* )} */}
                    </tbody>
                  </table>}

                </div>
              </div>
              <div className=" grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <div className="">
                  <label className="block text-sm/6 font-medium text-gray-900 mt-5 mb-2">
                    Expected Life of Project:
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      min="0"
                      onChange={handleColumnCountChange}
                      placeholder="Enter value"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
                <div className="">
                  <label className="block text-sm/6 font-medium text-gray-900 mt-5 mb-2">
                    Discount:
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      value={discount}
                      min="0"
                      onChange={(e: any) => setDiscount(e.target.value)}
                      placeholder="Enter value"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              <h2 className="text-base/7 font-semibold text-gray-900">
                Operational Cost (OPEX)
              </h2>

              <div className="border-b border-gray-900/10 pb-8 mb-4">
                <select
                  onChange={handleComponentSelectOpex}
                  className="block h-[38px] w-full mt-2 border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                >
                  <option value="">Select Component</option>
                  {opexOptions
                    .filter(
                      (option) =>
                        !formDataOpex.opex.some(
                          (subCat: any) => subCat.name === option
                        )
                    )
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>

                {formDataOpex.opex.length > 0 && (
                  <table className="w-full border border-collapse border-gray-300 text-sm mt-5">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2" rowSpan={2}>
                          Component
                        </th>
                        {Array.from({ length: columns }, (_, i) => (
                          <th key={i} className="border p-2">
                            Year {i + 1}
                          </th>
                        ))}

                        <th className="border p-2"></th>
                      </tr>
                      <tr>
                        {Array.from({ length: columns }, (_, i) => (
                          <th key={i} className="border p-2">
                            Rs.
                          </th>
                        ))}
                        <th className="border p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formDataOpex.opex.map((subCat: any, rowIdx: any) => (
                        <tr key={rowIdx}>
                          <td className="p-[0_!important]  pl-[8px_!important]  border">{subCat.name}</td>
                          {Array.from({ length: columns }, (_, colIdx) => (
                            <td key={colIdx} className="p-[0_!important] border">
                              <input
                                type="number"
                                value={subCat.values[colIdx] || ""}
                                onChange={(e: any) =>
                                  handleOpexValueChange(
                                    subCat.name,
                                    colIdx,
                                    e.target.value
                                  )
                                }
                                className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              />
                            </td>
                          ))}
                          <td className="p-[0_!important] border">
                            <button
                              onClick={() => handleRemoveOpex(subCat.name)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Row: Total per Column */}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="border p-2">Total OPEX</td>
                        {Array.from({ length: columns }, (_, colIdx) => {
                          const colTotal = formDataOpex.opex.reduce(
                            (sum: any, subCat: any) => {
                              const val =
                                parseFloat(subCat.values?.[colIdx]) || 0;
                              return sum + val;
                            },
                            0
                          );
                          return (
                            <td key={colIdx} className="border p-2">
                              {colTotal}
                            </td>
                          );
                        })}
                        <td className="border p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>

              <h2 className="text-base/7 font-semibold text-gray-900">
                Revenue
              </h2>

              <div className="">
                <select
                  onChange={handleComponentSelectRevenue}
                  className="block h-[38px] w-full mt-2 border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                >
                  <option value="">Select Component</option>
                  {revenueOptions
                    .filter(
                      (option) =>
                        !formDataOpex.revenue.some(
                          (subCat: any) => subCat.name === option
                        )
                    )
                    .map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                </select>

                {formDataOpex.revenue.length > 0 && (
                  <table className="w-full border border-collapse border-gray-300 text-sm mt-5">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2" rowSpan={2}>
                          Component
                        </th>
                        {Array.from({ length: columns }, (_, i) => (
                          <th key={i} className="border p-2">
                            Year {i + 1}
                          </th>
                        ))}
                        <th className="border p-2"></th>
                      </tr>
                      <tr className="bg-gray-100">
                        {Array.from({ length: columns }, (_, i) => (
                          <th key={i} className="border p-2">
                            Rs.
                          </th>
                        ))}
                        <th className="border p-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formDataOpex.revenue.map((subCat: any, rowIdx: any) => (
                        <tr key={rowIdx}>
                          <td className="p-[0_!important] border  pl-[8px_!important] ">{subCat.name}</td>
                          {Array.from({ length: columns }, (_, colIdx) => (
                            <td key={colIdx} className="p-[0_!important] border">
                              <input
                                type="number"
                                value={subCat.values[colIdx] || ""}
                                onChange={(e: any) =>
                                  handleRevenueValueChange(
                                    subCat.name,
                                    colIdx,
                                    e.target.value
                                  )
                                }
                                className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                              />
                            </td>
                          ))}
                          <td className="p-[0_!important] border">
                            <button
                              onClick={() => handleRemoveRevenue(subCat.name)}
                              className="text-red-500 hover:text-red-700 text-xs"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                      {/* Row: Total per Column */}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="border p-2">Total Revenue</td>
                        {Array.from({ length: columns }, (_, colIdx) => {
                          const colTotal = formDataOpex.revenue.reduce(
                            (sum: any, subCat: any) => {
                              const val =
                                parseFloat(subCat.values?.[colIdx]) || 0;
                              return sum + val;
                            },
                            0
                          );
                          return (
                            <td key={colIdx} className="border p-2">
                              {colTotal}
                            </td>
                          );
                        })}
                        <td className="border p-2"></td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
              <div className=" flex justify-center">
                <button
                  className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-blue-600"
                  onClick={() => {
                    const {
                      npv,
                      cumulativeCashFlows,
                      cashFlows,
                      bcr,
                      discountedRevenuesPerYear,
                      discountedCostsPerYear,
                      simplifiedPaybackPeriod,
                      cumulativePaybackPeriod,
                      paybackPeriod,
                    } = calculateNPV();
                    setNpv(npv);
                    setDiscountedRevenuesPerYear(discountedCostsPerYear);
                    setDiscountedCostsPerYear(discountedRevenuesPerYear);
                    setCashFlows(cashFlows);
                    setBcr(bcr);

                    setCumulativePaybackPeriod(paybackPeriod);
                    setCumulativeCashFlows(cumulativeCashFlows);
                  }}
                >
                  Calculate
                </button>
              </div>
            </div>
          </div>
        </div>
        {isShow && (<>
          {/* JSX to display the results */}
          {(npv !== null ||
            cumulativeCashFlows !== null ||
            cashFlows !== null ||
            bcr !== null ||
            discountedRevenuesPerYear !== null ||
            discountedCostsPerYear !== null ||
            simplifiedPaybackPeriod !== null ||
            cumulativePaybackPeriod !== null) && (
              <div className="border p-8 mx-8 mt-8 rounded-md">
                <p className="text-lg font-semibold text-gray-900 pb-5">
                  Analysis
                </p>

                <label className="block text-sm font-medium text-gray-900">
                  Net Present Value (NPV) Breakdown
                </label>
                <table className="w-full border-collapse border mt-4 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Component</th>
                      {Array.from({ length: columns + 1 }, (_, i) => (
                        <th key={i} className="border p-2">
                          {i === 0 ? "Year 0" : `Year ${i}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-medium ">
                      <td className="border p-2">Net Cash Flow</td>
                      <td className="border p-2 text-right">
                        {-totalSubCatValue}
                      </td>
                      {Array.from({ length: columns }, (_, i) => (
                        <td key={i} className="border p-2 text-right">
                          {formDataOpex.revenue.reduce(
                            (sum, item: any) =>
                              sum + (parseFloat(item.values[i]) || 0),
                            0
                          ) -
                            formDataOpex.opex.reduce(
                              (sum, item: any) =>
                                sum + (parseFloat(item.values[i]) || 0),
                              0
                            )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="border p-2">Cumulative Cash Flow</td>
                      <td className="border p-2 text-right">
                        {-totalSubCatValue}
                      </td>
                      {cumulativeCashFlows.map((value, i) => (
                        <td key={i} className="border p-2 text-right">
                          {value.toFixed(2)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="border p-3 rounded-md mt-4">
                  <label className="block text-sm font-medium text-gray-900">
                    Net Present Value (NPV):
                  </label>
                  <span className="text-gray-700">
                    {npv.toFixed(8)}{" "}
                  </span>
                </div>
                <div className="pt-2 text-sm">
                  {npv < 0 ? <span className="text-red-700">{NPVmessage}</span> : npv > 0 ? <span className="text-green-700">{NPVmessage}</span> : <span className="text-yellow-700">{NPVmessage}</span>}
                </div>
                {/* BCR Table */}
                <label className="block text-sm font-medium text-gray-900 pt-5">
                  Benefit-Cost Ratio (BCR) Breakdown
                </label>

                <table className="w-full border-collapse border mt-4 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Component</th>
                      {Array.from({ length: columns + 2 }, (_, i) => (
                        <th key={i} className="border p-2">
                          {i === 0
                            ? "Year 0"
                            : i === columns + 1
                              ? "Sum"
                              : `Year ${i}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Discounted Revenues</td>
                      {discountedRevenuesPerYear.map((value, i) => (
                        <td key={i} className="border p-2 text-right">
                          {value.toFixed(8)}
                        </td>
                      ))}
                      <td>
                        {discountedRevenuesPerYear.reduce(
                          (sum, i: any) => sum + (parseFloat(i) || 0),
                          0
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Discounted Costs</td>
                      {discountedCostsPerYear.map((value, i) => (
                        <td key={i} className="border p-2 text-right">
                          {value.toFixed(8)}
                        </td>
                      ))}
                      <td className="border">
                        {discountedCostsPerYear.reduce(
                          (sum, i: any) => sum + (parseFloat(i) || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                  <div>
                    <div className="border p-3 rounded-md">
                      <label className="block text-sm font-medium text-gray-900">
                        Benefit-Cost Ratio (BCR):
                      </label>
                      <span className="text-gray-700">{bcr.toFixed(8)} </span>{" "}
                    </div>
                    <div className="pt-2  text-sm">
                      {bcr < 0 ? <span className="text-red-700">{BCRmessage}</span> : bcr > 0 ? <span className="text-green-700">{BCRmessage}</span> : <span className="text-yellow-700">{BCRmessage}</span>}
                    </div>
                  </div>
                  <div>
                    <div className="border p-3 rounded-md">
                      <label className="block text-sm font-medium text-gray-900">
                        Payback Period (PBP):
                      </label>
                      <span className="text-gray-700 ">
                        {typeof cumulativePaybackPeriod === "number"
                          ? `${cumulativePaybackPeriod.toFixed(2)} years`
                          : "Not recovered within period"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>)}
        <div className="bg-white w-full pt-2">
          <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
        </div>
      </div>
    </div>
  );
}