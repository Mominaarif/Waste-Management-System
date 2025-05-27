// import { useState, useEffect, useRef } from 'react';
// import $ from 'jquery';

// import 'datatables.net-dt/css/dataTables.dataTables.css';
// import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

// import 'datatables.net-dt/css/dataTables.dataTables.min.css';
// import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';


// import 'datatables.net';
// import 'datatables.net-responsive-dt';

// import { useLocation, useNavigate } from 'react-router-dom';
// import { Bar } from 'react-chartjs-2';
// import { X } from 'lucide-react';
// import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
// import { Button } from './ui/button';

// type WasteType =
//   | 'foodWaste' | 'yardWaste' | 'animalDunk' | 'paper' | 'cardboard' | 'textile'
//   | 'lightPlastic' | 'densePlastic' | 'wood' | 'leather' | 'diapers'
//   | 'metals' | 'glass' | 'electronic' | 'cdWaste';

// type WasteCategory = 'biodegradable' | 'combustible' | 'recyclable';

// interface WasteData {
//   [key: string]: number;
// }

// interface SelectedWasteTypes {
//   biodegradable: Record<WasteType, number>;
//   combustible: Record<WasteType, number>;
//   recyclable: Record<WasteType, number>;
// }

// interface EnabledWasteTypes {
//   biodegradable: Record<WasteType, boolean>;
//   combustible: Record<WasteType, boolean>;
//   recyclable: Record<WasteType, boolean>;
// }

// interface CalculatedData {
//   biodegradable: WasteData;
//   combustible: WasteData;
//   recyclable: WasteData;
//   residual: WasteData;
// }

// interface DisposalMethods {
//   [key: string]: string;
// }

// interface LocationState {
//   wasteCategories: Record<string, WasteData>;
//   presentPopulation: any;
//   forecastYear: any;
//   name: any;
// }

// const CarbonFootprint = (open: any) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   // const wasteData = (location.state as LocationState).wasteCategories;
//   // const { wasteCategories,presentPopulation, forecastYear, name } = location.state || {};


//   const [combinedWasteData, setCombinedWasteData] = useState<WasteData>({});
//   const [disposalMethods, setDisposalMethods] = useState<DisposalMethods>({});
//   const initialWasteTypeState: Record<WasteType, number> = {
//     foodWaste: 0,
//     yardWaste: 0,
//     animalDunk: 0,
//     paper: 0,
//     cardboard: 0,
//     textile: 0,
//     lightPlastic: 0,
//     densePlastic: 0,
//     wood: 0,
//     leather: 0,
//     diapers: 0,
//     metals: 0,
//     glass: 0,
//     electronic: 0,
//     cdWaste: 0,
//   };

//   const [selectedWasteTypes, setSelectedWasteTypes] = useState<SelectedWasteTypes>({
//     biodegradable: { ...initialWasteTypeState },
//     combustible: { ...initialWasteTypeState },
//     recyclable: { ...initialWasteTypeState },
//   });
//   const initialEnabledWasteTypeState: Record<WasteType, boolean> = {
//     foodWaste: false,
//     yardWaste: false,
//     animalDunk: false,
//     paper: false,
//     cardboard: false,
//     textile: false,
//     lightPlastic: false,
//     densePlastic: false,
//     wood: false,
//     leather: false,
//     diapers: false,
//     metals: false,
//     glass: false,
//     electronic: false,
//     cdWaste: false,
//   };

//   const [enabledWasteTypes, setEnabledWasteTypes] = useState<EnabledWasteTypes>({
//     biodegradable: { ...initialEnabledWasteTypeState },
//     combustible: { ...initialEnabledWasteTypeState },
//     recyclable: { ...initialEnabledWasteTypeState }
//   });
//   const [calculatedData, setCalculatedData] = useState<CalculatedData>({
//     biodegradable: {},
//     combustible: {},
//     recyclable: {},
//     residual: {},
//   });
//   const [error, setError] = useState<string | null>(null);
//   const [showChart, setShowChart] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const biodegradableWaste: WasteType[] = ['foodWaste', 'yardWaste', 'animalDunk', 'paper', 'cardboard', 'textile'];
//   const combustibleWaste: WasteType[] = ['paper', 'cardboard', 'lightPlastic', 'densePlastic', 'textile', 'foodWaste', 'yardWaste', 'wood', 'leather', 'diapers'];
//   const recyclableWaste: WasteType[] = ['paper', 'leather', 'cardboard', 'lightPlastic', 'densePlastic', 'metals', 'glass', 'electronic', 'textile', 'cdWaste', 'diapers'];

//   useEffect(() => {
//     const combinedData: WasteData = {};

//     Object.values(wasteData).forEach((categoryData) => {
//       Object.entries(categoryData).forEach(([wasteType, amount]) => {
//         combinedData[wasteType] = (combinedData[wasteType] || 0) + (amount as number);
//       });
//     });

//     setCombinedWasteData(combinedData);
//     setDisposalMethods(
//       Object.keys(combinedData).reduce((methods, wasteType) => {
//         methods[wasteType] = 'Landfill';
//         return methods;
//       }, {} as DisposalMethods)
//     );
//   }, [wasteData]);

//   const chartData = {
//     labels: ['Biodegradable', 'Combustible', 'Recyclable', 'Residual'],
//     datasets: [
//       {
//         label: 'Waste (Kg)',
//         data: [
//           Object.values(calculatedData.biodegradable).reduce((sum, value) => sum + value, 0),
//           Object.values(calculatedData.combustible).reduce((sum, value) => sum + value, 0),
//           Object.values(calculatedData.recyclable).reduce((sum, value) => sum + value, 0),
//           Object.values(calculatedData.residual).reduce((sum, value) => sum + value, 0),
//         ],
//         // backgroundColor: ['#76c893', '#ff7f50', '#6495ed', '#d5d5d5'],
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//     },
//     backgroundColor: [
//       "rgb(22, 163, 74)",
//       "rgb(59, 130, 246)",
//       "rgb(107, 114, 128)",
//       "rgb(220, 38, 38)",
//     ],
//     borderRadius: 5,
//     barThickness: 42,
//     borderSkipped: false,
//     showLabel: false,
//   };

//   const handlePercentageChange = (category: WasteCategory, wasteType: WasteType, percentage: number) => {
//     if (percentage < 0 || percentage > 100) {
//       setError('Percentage must be between 0 and 100');
//       return;
//     }

//     const totalPercentage = Object.values(selectedWasteTypes).reduce((total, categoryData) => {
//       return total + ((categoryData as Record<WasteType, number>)[wasteType] || 0);
//     }, 0);

//     if (totalPercentage >= 100) {
//       setError('Total percentage for this waste type exceeds 100%. Please adjust the values.');
//     } else {
//       setError(null);
//       setSelectedWasteTypes((prevState) => ({
//         ...prevState,
//         [category]: {
//           ...prevState[category],
//           [wasteType]: percentage,
//         },
//       }));
//     }
//   };

//   const handleCheckboxChange = (category: WasteCategory, wasteType: WasteType) => {
//     setEnabledWasteTypes((prev) => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [wasteType]: !prev[category][wasteType],
//       },
//     }));
//   };

//   const handleDisposalChange = (wasteType: string, method: string) => {
//     setDisposalMethods((prevMethods) => ({
//       ...prevMethods,
//       [wasteType]: method,
//     }));
//   };

//   const calculateWasteValues = () => {
//     const updatedCalculatedData: CalculatedData = {
//       biodegradable: {},
//       combustible: {},
//       recyclable: {},
//       residual: {},
//     };

//     const calculateCategoryWaste = (category: WasteCategory, categoryWasteList: WasteType[]) => {
//       categoryWasteList.forEach((wasteType) => {
//         const totalWaste = combinedWasteData[wasteType] || 0;
//         const percentage = enabledWasteTypes[category][wasteType]
//           ? selectedWasteTypes[category][wasteType] || 0
//           : 0;
//         const calculatedValue = (totalWaste * percentage) / 100;

//         updatedCalculatedData[category][wasteType] = calculatedValue;
//       });
//     };

//     calculateCategoryWaste('biodegradable', biodegradableWaste);
//     calculateCategoryWaste('combustible', combustibleWaste);
//     calculateCategoryWaste('recyclable', recyclableWaste);

//     // Calculate residual waste correctly
//     Object.keys(combinedWasteData).forEach((wasteType) => {
//       const totalWaste = combinedWasteData[wasteType] || 0;
//       const totalCalculated =
//         (updatedCalculatedData.biodegradable[wasteType] || 0) +
//         (updatedCalculatedData.combustible[wasteType] || 0) +
//         (updatedCalculatedData.recyclable[wasteType] || 0);
//       updatedCalculatedData.residual[wasteType] = totalWaste - totalCalculated;
//     });
//     console.log(updatedCalculatedData)
//     setCalculatedData(updatedCalculatedData);
//   };

//   const handleNext = () => {
//     const totals = {
//       biodegradableTotal: Object.values(calculatedData.biodegradable).reduce((sum, value) => sum + value, 0),
//       combustibleTotal: Object.values(calculatedData.combustible).reduce((sum, value) => sum + value, 0),
//       recyclableTotal: Object.values(calculatedData.recyclable).reduce((sum, value) => sum + value, 0),
//       residualTotal: Object.values(calculatedData.residual).reduce((sum, value) => sum + value, 0),
//     };

//     navigate('/cf-calculations', {
//       state: { calculatedData, totals },
//     });
//   };



//   const tableRef = useRef<HTMLTableElement>(null);
//   const tableRef1 = useRef<HTMLTableElement>(null);

//   useEffect(() => {
//     // ✅ Use jQuery to initialize
//     const table1 = $(tableRef.current!).DataTable({
//       responsive: true,
//     });


//     return () => {
//       table1.destroy();
//     };
//   }, []);

//   useEffect(() => {
//     if (showModal) {
//       const timeout = setTimeout(() => {
//         if (tableRef1.current) {
//           const $table = $(tableRef1.current);
//           if (!$.fn.DataTable.isDataTable(tableRef1.current)) {
//             $table.DataTable({
//               responsive: true,
//             });
//           }
//         }
//       }, 100); // Delay to allow DOM render

//       return () => {
//         clearTimeout(timeout);
//         if (tableRef1.current && $.fn.DataTable.isDataTable(tableRef1.current)) {
//           $(tableRef1.current).DataTable().destroy();
//         }
//       };
//     }
//   }, [showModal, calculatedData]); // Add calculatedData to re-render properly
//   // let n = name.toLowerCase();

//   return (
//     <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white">
//       <div className="pt-8 px-5 md:px-8">
//         {/* <div className="text-xl">
//           <h2><strong>Current Population:</strong> <span>{presentPopulation}</span></h2>
//           <h2><strong>Forecast Year:</strong> <span>{forecastYear}</span></h2>
//           <h2><strong>City Name: </strong><span className=' capitalize'>{name}</span></h2>
//         </div> */}
//       </div>
//       {/* <h1>Carbon Footprint Calculator</h1> */}
//       <section>
//         <h2>Select Waste Categories</h2>
//         <div className="pt-5 px-5 md:px-8">
//           <table
//             ref={tableRef}
//             className=" display nowrap"
//             style={{ width: '100%' }}
//           >
//             <thead>
//               <tr className='bg-[#386641_!important] text-white'>
//                 <th>Biodegradables</th>
//                 <th>Combustibles</th>
//                 <th>Recyclables</th>
//               </tr>
//             </thead>
//             {/* build one <tr> per waste-type index */}
//             <tbody>
//               {Array.from({
//                 length: Math.max(
//                   biodegradableWaste.length,
//                   combustibleWaste.length,
//                   recyclableWaste.length
//                 ),
//               }).map((_, i) => {
//                 const bio = biodegradableWaste[i];
//                 const comb = combustibleWaste[i];
//                 const recy = recyclableWaste[i];

//                 return (
//                   <tr key={i}>
//                     {/* ─────── Biodegradables cell ─────── */}
//                     <td>
//                       {bio && (
//                         <div className='flex md:flex-row flex-col items-center gap-0.5 pr-2'>
//                           <label className='md:w-1/2 w-full flex items-center gap-0.5'>
//                             <input
//                               type="checkbox"
//                               checked={enabledWasteTypes.biodegradable[bio] || false}
//                               onChange={() => handleCheckboxChange('biodegradable', bio)}
//                             />
//                             <i className="fas fa-leaf" />
//                             {bio} ({combinedWasteData[bio] || 0} kg)
//                           </label>
//                           <input
//                             type="number"
//                             value={selectedWasteTypes.biodegradable[bio] || 0}
//                             onChange={e =>
//                               handlePercentageChange(
//                                 'biodegradable',
//                                 bio,
//                                 parseFloat(e.target.value)
//                               )
//                             }
//                             className='border md:w-1/2 w-full rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 sm:text-sm'
//                             min={0}
//                             max={100}
//                             step={10}
//                             disabled={!enabledWasteTypes.biodegradable[bio]}
//                           />
//                         </div>
//                       )}
//                     </td>

//                     {/* ─────── Combustibles cell ─────── */}
//                     <td>
//                       {comb && (
//                         <div className='flex md:flex-row flex-col items-center gap-0.5 pr-2'>
//                           <label className='md:w-1/2 w-full flex items-center gap-0.5'>
//                             <input
//                               type="checkbox"
//                               checked={enabledWasteTypes.combustible[comb] || false}
//                               onChange={() => handleCheckboxChange('combustible', comb)}
//                             />
//                             <i className="fas fa-fire" />
//                             {comb} ({combinedWasteData[comb] || 0} kg)
//                           </label>
//                           <input
//                             type="number"
//                             value={selectedWasteTypes.combustible[comb] || 0}
//                             onChange={e =>
//                               handlePercentageChange(
//                                 'combustible',
//                                 comb,
//                                 parseFloat(e.target.value)
//                               )
//                             }
//                             className='border md:w-1/2 w-full rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 sm:text-sm'
//                             min={0}
//                             max={100}
//                             step={10}
//                             disabled={!enabledWasteTypes.combustible[comb]}
//                           />
//                         </div>
//                       )}
//                     </td>

//                     {/* ─────── Recyclables cell ─────── */}
//                     <td>
//                       {recy && (
//                         <div className='flex md:flex-row flex-col items-center gap-0.5 pr-2'>
//                           <label className='flex items-center gap-0.5 md:w-1/2 w-full'>
//                             <input
//                               type="checkbox"
//                               checked={enabledWasteTypes.recyclable[recy] || false}
//                               onChange={() => handleCheckboxChange('recyclable', recy)}
//                             />
//                             <i className="fas fa-recycle" />
//                             {recy} ({combinedWasteData[recy] || 0} kg)
//                           </label>
//                           <input
//                             type="number"
//                             value={selectedWasteTypes.recyclable[recy] || 0}
//                             onChange={e =>
//                               handlePercentageChange(
//                                 'recyclable',
//                                 recy,
//                                 parseFloat(e.target.value)
//                               )
//                             }
//                             className='border md:w-1/2 w-full rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 sm:text-sm'
//                             min={0}
//                             max={100}
//                             step={10}
//                             disabled={!enabledWasteTypes.recyclable[recy]}
//                           />
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>

//           </table>
//         </div>
//         <div className='md:px-8 px-5 flex justify-start gap-5 pb-8 items-center'>
//           <Button
//             onClick={() => {
//               calculateWasteValues();
//               setShowModal(!showModal)
//             }}
//             className="bg-[#386641_!important] duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
//           >
//             Calculated Waste Values
//           </Button>

//           <Button
//             onClick={() => {
//               calculateWasteValues();
//               setShowChart(!showChart)
//             }}
//             className="bg-[#386641_!important] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
//           >
//             Bar Chart
//           </Button>
//         </div>

//         <Dialog
//           open={showModal}
//           as="div"
//           className="relative z-10 focus:outline-none"
//           onClose={() => setShowModal(false)}
//         >
//           <div className="fixed inset-0 z-10 h-screen min-h-screen min-w-screen w-screen overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center bg-white">
//               <DialogPanel
//                 transition
//                 className="relative px-8 h-full min-h-screen w-full bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
//               >
//                 <div className=" absolute top-0 right-0 p-2">
//                   <Button
//                     className="cursor-pointer"
//                     onClick={() => setShowModal(false)}
//                   >
//                     <X />
//                   </Button>
//                 </div>
//                 <DialogTitle as="h3" className="text-xl font-bold py-2 ">
//                   Waste Forecast
//                 </DialogTitle>
//                 <div className={` ${open ? "w-full " : "w-full "} bg-white overflow-y-auto`}>
//                   <h2 className="block text-sm font-medium text-gray-900 pb-1">
//                     Waste Forecast by Type
//                   </h2>
//                   <table
//                     ref={tableRef1}
//                     className=" display nowrap"
//                     style={{ width: '100%' }}>
//                     <thead>
//                       <tr className='bg-[#386641_!important] text-white'>
//                         <th colSpan={2}  >Biodegradable</th>
//                         <th colSpan={2}  >Combustible</th>
//                         <th colSpan={2}  >Recyclable</th>
//                         <th colSpan={2}  >Residues</th>
//                       </tr>
//                       <tr className='bg-[#386641_!important] text-white'>
//                         <th  >Waste Type</th>
//                         <th  >Amount (Kg)</th>
//                         <th  >Waste Type</th>
//                         <th  >Amount (Kg)</th>
//                         <th  >Waste Type</th>
//                         <th  >Amount (Kg)</th>
//                         <th  >Waste Type</th>
//                         <th  >Amount (Kg)</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {Array.from({
//                         length: Math.max(
//                           Object.keys(calculatedData.biodegradable || {}).length,
//                           Object.keys(calculatedData.combustible || {}).length,
//                           Object.keys(calculatedData.recyclable || {}).length,
//                           Object.keys(calculatedData.residual || {}).length
//                         ),
//                       }).map((_, index) => {
//                         const bioKeys = Object.keys(calculatedData.biodegradable || {});
//                         const comKeys = Object.keys(calculatedData.combustible || {});
//                         const recKeys = Object.keys(calculatedData.recyclable || {});
//                         const resKeys = Object.keys(calculatedData.residual || {});

//                         return (
//                           <tr key={index}>
//                             <td>{bioKeys[index] || ""}</td>
//                             <td>{calculatedData.biodegradable?.[bioKeys[index]]?.toFixed(2) || ""}</td>

//                             <td>{comKeys[index] || ""}</td>
//                             <td>{calculatedData.combustible?.[comKeys[index]]?.toFixed(2) || ""}</td>

//                             <td>{recKeys[index] || ""}</td>
//                             <td>{calculatedData.recyclable?.[recKeys[index]]?.toFixed(2) || ""}</td>

//                             <td>{resKeys[index] || ""}</td>
//                             <td>{calculatedData.residual?.[resKeys[index]]?.toFixed(2) || ""}</td>
//                           </tr>
//                         );
//                       })}

//                       <tr>
//                         <td><strong>Total</strong></td>
//                         <td><strong>{Object.values(calculatedData.biodegradable || {}).reduce((sum, val) => sum + val, 0).toFixed(2)}</strong></td>

//                         <td><strong>Total</strong></td>
//                         <td><strong>{Object.values(calculatedData.combustible || {}).reduce((sum, val) => sum + val, 0).toFixed(2)}</strong></td>

//                         <td><strong>Total</strong></td>
//                         <td><strong>{Object.values(calculatedData.recyclable || {}).reduce((sum, val) => sum + val, 0).toFixed(2)}</strong></td>

//                         <td><strong>Total</strong></td>
//                         <td><strong>{Object.values(calculatedData.residual || {}).reduce((sum, val) => sum + val, 0).toFixed(2)}</strong></td>
//                       </tr>
//                     </tbody>
//                   </table>

//                 </div>
//               </DialogPanel>
//             </div>
//           </div>
//         </Dialog>

//         <Dialog
//           open={showChart}
//           as="div"
//           className="relative z-10 focus:outline-none"
//           onClose={() => setShowChart(false)}
//         >
//           <div className="fixed inset-0 z-10  w-screen overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <DialogPanel
//                 transition
//                 className="relative w-[600px] h-full rounded-sm p-4 pb-6 border bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
//               >
//                 <div className=" absolute top-0 right-0 p-2">
//                   <Button
//                     className=" cursor-pointer"
//                     onClick={() => setShowChart(false)}
//                   >
//                     <X />
//                   </Button>
//                 </div>
//                 <DialogTitle as="h3" className="text-base font-bold pb-2 ">
//                   Waste Distribution
//                 </DialogTitle>
//                 <div className={` ${open ? "w-full " : "w-full "} mt-5`}>

//                   <Bar data={chartData} options={chartOptions} />
//                 </div>
//               </DialogPanel>
//             </div>
//           </div>
//         </Dialog>
//       </section>

//       {error && <div style={{ color: 'red' }}>{error}</div>}

//       <section>
//         {/* Modal for Calculated Waste Values */}
//         {showModal && (
//           <div className="modal">
//             <div className="modal-content">
//               <span className="close-btn" onClick={() => setShowModal(false)}>&times;</span>
//               <table style={{ width: '100%' }}>
//                 <thead>
//                   <tr>
//                     <th>Biodegradable</th>
//                     <th>Combustible</th>
//                     <th>Recyclable</th>
//                     <th>Residues</th>
//                   </tr>
//                   <tr>
//                     <th>Waste Type</th>
//                     <th>Amount (Kg)</th>
//                     <th>Waste Type</th>
//                     <th>Amount (Kg)</th>
//                     <th>Waste Type</th>
//                     <th>Amount (Kg)</th>
//                     <th>Waste Type</th>
//                     <th>Amount (Kg)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {Array.from({
//                     length: Math.max(
//                       Object.keys(calculatedData.biodegradable).length,
//                       Object.keys(calculatedData.combustible).length,
//                       Object.keys(calculatedData.recyclable).length,
//                       Object.keys(calculatedData.residual).length
//                     )
//                   }).map((_, index) => (
//                     <tr key={index}>
//                       <td>{Object.keys(calculatedData.biodegradable)[index] || ""}</td>
//                       <td>{calculatedData.biodegradable[Object.keys(calculatedData.biodegradable)[index]]?.toFixed(2) || ""}</td>
//                       <td>{Object.keys(calculatedData.combustible)[index] || ""}</td>
//                       <td>{calculatedData.combustible[Object.keys(calculatedData.combustible)[index]]?.toFixed(2) || ""}</td>
//                       <td>{Object.keys(calculatedData.recyclable)[index] || ""}</td>
//                       <td>{calculatedData.recyclable[Object.keys(calculatedData.recyclable)[index]]?.toFixed(2) || ""}</td>
//                       <td>{Object.keys(calculatedData.residual)[index] || ""}</td>
//                       <td>{calculatedData.residual[Object.keys(calculatedData.residual)[index]]?.toFixed(2) || ""}</td>
//                     </tr>
//                   ))}
//                   <tr>
//                     <td><strong>Total</strong></td>
//                     <td><strong>{Object.values(calculatedData.biodegradable).reduce((sum, value) => sum + value, 0).toFixed(2)}</strong></td>
//                     <td><strong>Total</strong></td>
//                     <td><strong>{Object.values(calculatedData.combustible).reduce((sum, value) => sum + value, 0).toFixed(2)}</strong></td>
//                     <td><strong>Total</strong></td>
//                     <td><strong>{Object.values(calculatedData.recyclable).reduce((sum, value) => sum + value, 0).toFixed(2)}</strong></td>
//                     <td><strong>Total</strong></td>
//                     <td><strong>{Object.values(calculatedData.residual).reduce((sum, value) => sum + value, 0).toFixed(2)}</strong></td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </section>

//       {/* Bar Chart in Modal (Floating Window) */}
//       {showChart && (
//         <div className="chart-modal">
//           <div className="modal-content">
//             <span className="close-btn" onClick={() => setShowChart(false)}>&times;</span>
//             <h2>Waste Distribution</h2>
//             <Bar data={chartData} options={chartOptions} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CarbonFootprint;




// // import $ from 'jquery';

// // import 'datatables.net-dt/css/dataTables.dataTables.css';
// // import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
// // import 'datatables.net-dt/css/dataTables.dataTables.min.css';
// // import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';

// // import 'datatables.net';
// // import 'datatables.net-responsive-dt';

// // import { useLocation, useNavigate } from 'react-router-dom';
// // import { Bar } from 'react-chartjs-2';
// // import { X } from 'lucide-react';
// // import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
// // import { Button } from './ui/button';

// // type WasteType =
// //   | 'foodWaste'
// //   | 'yardWaste'
// //   | 'animalDunk'
// //   | 'paper'
// //   | 'cardboard'
// //   | 'textile'
// //   | 'lightPlastic'
// //   | 'densePlastic'
// //   | 'wood'
// //   | 'leather'
// //   | 'diapers'
// //   | 'metals'
// //   | 'glass'
// //   | 'electronic'
// //   | 'cdWaste';

// // type WasteCategory = 'biodegradable' | 'combustible' | 'recyclable';

// // interface WasteData {
// //   [key: string]: number;
// // }

// // interface SelectedWasteTypes {
// //   biodegradable: Record<WasteType, number>;
// //   combustible: Record<WasteType, number>;
// //   recyclable: Record<WasteType, number>;
// // }

// // interface EnabledWasteTypes {
// //   biodegradable: Record<WasteType, boolean>;
// //   combustible: Record<WasteType, boolean>;
// //   recyclable: Record<WasteType, boolean>;
// // }

// // interface CalculatedData {
// //   biodegradable: WasteData;
// //   combustible: WasteData;
// //   recyclable: WasteData;
// //   residual: WasteData;
// // }

// // interface DisposalMethods {
// //   [key: string]: string;
// // }

// // interface LocationState {
// //   wasteCategories?: Record<string, WasteData>;
// //   presentPopulation?: number;
// //   forecastYear?: number;
// //   name?: string;
// // }

// // const CarbonFootprint = ({ open }: { open: boolean }) => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const state = location.state as LocationState | undefined;
// //   const wasteData = state?.wasteCategories || {};
// //   const { presentPopulation = 0, forecastYear = 0, name = 'Unknown' } = state || {};

// //   const [combinedWasteData, setCombinedWasteData] = useState<WasteData>({});
// //   const [disposalMethods, setDisposalMethods] = useState<DisposalMethods>({});
// //   const initialWasteTypeState: Record<WasteType, number> = {
// //     foodWaste: 0,
// //     yardWaste: 0,
// //     animalDunk: 0,
// //     paper: 0,
// //     cardboard: 0,
// //     textile: 0,
// //     lightPlastic: 0,
// //     densePlastic: 0,
// //     wood: 0,
// //     leather: 0,
// //     diapers: 0,
// //     metals: 0,
// //     glass: 0,
// //     electronic: 0,
// //     cdWaste: 0,
// //   };

// //   const [selectedWasteTypes, setSelectedWasteTypes] = useState<SelectedWasteTypes>({
// //     biodegradable: { ...initialWasteTypeState },
// //     combustible: { ...initialWasteTypeState },
// //     recyclable: { ...initialWasteTypeState },
// //   });
// //   const initialEnabledWasteTypeState: Record<WasteType, boolean> = {
// //     foodWaste: false,
// //     yardWaste: false,
// //     animalDunk: false,
// //     paper: false,
// //     cardboard: false,
// //     textile: false,
// //     lightPlastic: false,
// //     densePlastic: false,
// //     wood: false,
// //     leather: false,
// //     diapers: false,
// //     metals: false,
// //     glass: false,
// //     electronic: false,
// //     cdWaste: false,
// //   };

// //   const [enabledWasteTypes, setEnabledWasteTypes] = useState<EnabledWasteTypes>({
// //     biodegradable: { ...initialEnabledWasteTypeState },
// //     combustible: { ...initialEnabledWasteTypeState },
// //     recyclable: { ...initialEnabledWasteTypeState },
// //   });
// //   const [calculatedData, setCalculatedData] = useState<CalculatedData>({
// //     biodegradable: {},
// //     combustible: {},
// //     recyclable: {},
// //     residual: {},
// //   });
// //   const [error, setError] = useState<string | null>(null);
// //   const [showChart, setShowChart] = useState(false);
// //   const [showModal, setShowModal] = useState(false);

// //   const biodegradableWaste: WasteType[] = ['foodWaste', 'yardWaste', 'animalDunk', 'paper', 'cardboard', 'textile'];
// //   const combustibleWaste: WasteType[] = ['paper', 'cardboard', 'lightPlastic', 'densePlastic', 'textile', 'foodWaste', 'yardWaste', 'wood', 'leather', 'diapers'];
// //   const recyclableWaste: WasteType[] = ['paper', 'leather', 'cardboard', 'lightPlastic', 'densePlastic', 'metals', 'glass', 'electronic', 'textile', 'cdWaste', 'diapers'];

// //   useEffect(() => {
// //     const combinedData: WasteData = {};

// //     // Safely handle undefined or null wasteData
// //     if (!wasteData || typeof wasteData !== 'object') {
// //       console.warn('No waste data provided, using empty object.');
// //       setCombinedWasteData({});
// //       return;
// //     }

// //     Object.values(wasteData).forEach((categoryData) => {
// //       if (categoryData && typeof categoryData === 'object') {
// //         Object.entries(categoryData).forEach(([wasteType, amount]) => {
// //           combinedData[wasteType] = (combinedData[wasteType] || 0) + (Number(amount) || 0);
// //         });
// //       }
// //     });

// //     setCombinedWasteData(combinedData);
// //     setDisposalMethods(
// //       Object.keys(combinedData).reduce((methods, wasteType) => {
// //         methods[wasteType] = 'Landfill';
// //         return methods;
// //       }, {} as DisposalMethods)
// //     );
// //   }, [wasteData]);

// //   const chartData = {
// //     labels: ['Biodegradable', 'Combustible', 'Recyclable', 'Residual'],
// //     datasets: [
// //       {
// //         label: 'Waste (Kg)',
// //         data: [
// //           Object.values(calculatedData.biodegradable).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //           Object.values(calculatedData.combustible).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //           Object.values(calculatedData.recyclable).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //           Object.values(calculatedData.residual).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //         ],
// //         backgroundColor: [
// //           "rgb(22, 163, 74)",
// //           "rgb(59, 130, 246)",
// //           "rgb(107, 114, 128)",
// //           "rgb(220, 38, 38)",
// //         ],
// //       },
// //     ],
// //   };

// //   const chartOptions = {
// //     responsive: true,
// //     plugins: {
// //       legend: {
// //         position: 'top' as const,
// //       },
// //     },
// //     backgroundColor: [
// //       "rgb(22, 163, 74)",
// //       "rgb(59, 130, 246)",
// //       "rgb(107, 114, 128)",
// //       "rgb(220, 38, 38)",
// //     ],
// //     borderRadius: 5,
// //     barThickness: 42,
// //     borderSkipped: false,
// //     showLabel: false,
// //   };

// //   const handlePercentageChange = (category: WasteCategory, wasteType: WasteType, percentage: number) => {
// //     if (percentage < 0 || percentage > 100) {
// //       setError('Percentage must be between 0 and 100');
// //       return;
// //     }

// //     const totalPercentage = Object.values(selectedWasteTypes).reduce((total, categoryData) => {
// //       return total + ((categoryData as Record<WasteType, number>)[wasteType] || 0);
// //     }, 0);

// //     if (totalPercentage + percentage > 100 && percentage !== 0) {
// //       setError('Total percentage for this waste type exceeds 100%. Please adjust the values.');
// //     } else {
// //       setError(null);
// //       setSelectedWasteTypes((prevState) => ({
// //         ...prevState,
// //         [category]: {
// //           ...prevState[category],
// //           [wasteType]: percentage,
// //         },
// //       }));
// //     }
// //   };

// //   const handleCheckboxChange = (category: WasteCategory, wasteType: WasteType) => {
// //     setEnabledWasteTypes((prev) => ({
// //       ...prev,
// //       [category]: {
// //         ...prev[category],
// //         [wasteType]: !prev[category][wasteType],
// //       },
// //     }));
// //   };

// //   const handleDisposalChange = (wasteType: string, method: string) => {
// //     setDisposalMethods((prevMethods) => ({
// //       ...prevMethods,
// //       [wasteType]: method,
// //     }));
// //   };

// //   const calculateWasteValues = () => {
// //     const updatedCalculatedData: CalculatedData = {
// //       biodegradable: {},
// //       combustible: {},
// //       recyclable: {},
// //       residual: {},
// //     };

// //     const calculateCategoryWaste = (category: WasteCategory, categoryWasteList: WasteType[]) => {
// //       categoryWasteList.forEach((wasteType) => {
// //         const totalWaste = combinedWasteData[wasteType] || 0;
// //         const percentage = enabledWasteTypes[category][wasteType]
// //           ? selectedWasteTypes[category][wasteType] || 0
// //           : 0;
// //         const calculatedValue = (totalWaste * percentage) / 100;

// //         updatedCalculatedData[category][wasteType] = calculatedValue;
// //       });
// //     };

// //     calculateCategoryWaste('biodegradable', biodegradableWaste);
// //     calculateCategoryWaste('combustible', combustibleWaste);
// //     calculateCategoryWaste('recyclable', recyclableWaste);

// //     // Calculate residual waste
// //     Object.keys(combinedWasteData).forEach((wasteType) => {
// //       const totalWaste = combinedWasteData[wasteType] || 0;
// //       const totalCalculated =
// //         (updatedCalculatedData.biodegradable[wasteType] || 0) +
// //         (updatedCalculatedData.combustible[wasteType] || 0) +
// //         (updatedCalculatedData.recyclable[wasteType] || 0);
// //       updatedCalculatedData.residual[wasteType] = Math.max(0, totalWaste - totalCalculated); // Ensure non-negative
// //     });

// //     setCalculatedData(updatedCalculatedData);
// //   };

// //   const handleNext = () => {
// //     const totals = {
// //       biodegradableTotal: Object.values(calculatedData.biodegradable).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //       combustibleTotal: Object.values(calculatedData.combustible).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //       recyclableTotal: Object.values(calculatedData.recyclable).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //       residualTotal: Object.values(calculatedData.residual).reduce((sum, value) => sum + (Number(value) || 0), 0),
// //     };

// //     navigate('/cf-calculations', {
// //       state: { calculatedData, totals },
// //     });
// //   };

// //   const tableRef = useRef<HTMLTableElement>(null);
// //   const tableRef1 = useRef<HTMLTableElement>(null);

// //   useEffect(() => {
// //     const table1 = $(tableRef.current!).DataTable({
// //       responsive: true,
// //     });

// //     return () => {
// //       table1.destroy();
// //     };
// //   }, []);

// //   useEffect(() => {
// //     if (showModal) {
// //       const timeout = setTimeout(() => {
// //         if (tableRef1.current) {
// //           const $table = $(tableRef1.current);
// //           if (!$.fn.DataTable.isDataTable(tableRef1.current)) {
// //             $table.DataTable({
// //               responsive: true,
// //             });
// //           }
// //         }
// //       }, 100);

// //       return () => {
// //         clearTimeout(timeout);
// //         if (tableRef1.current && $.fn.DataTable.isDataTable(tableRef1.current)) {
// //           $(tableRef1.current).DataTable().destroy();
// //         }
// //       };
// //     }
// //   }, [showModal, calculatedData]);

// //   return (
// //     <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white">
// //       <div className="pt-8 px-5 md:px-8">
// //         <div className="text-xl">
// //           <h2><strong>Current Population:</strong> <span>{presentPopulation}</span></h2>
// //           <h2><strong>Forecast Year:</strong> <span>{forecastYear}</span></h2>
// //           <h2><strong>City Name:</strong> <span className="capitalize">{name}</span></h2>
// //         </div>
// //       </div>
// //       <section>
// //         <h2 className='text-base font-bold pl-8'>Select Waste Categories</h2>
// //         <div className="pt-5 px-5 md:px-8">
// //           <table
// //             ref={tableRef}
// //             className="display nowrap"
// //             style={{ width: '100%' }}
// //           >
// //             <thead>
// //               <tr className="bg-[#386641] text-white">
// //                 <th>Biodegradables</th>
// //                 <th>Combustibles</th>
// //                 <th>Recyclables</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {Array.from({
// //                 length: Math.max(
// //                   biodegradableWaste.length,
// //                   combustibleWaste.length,
// //                   recyclableWaste.length
// //                 ),
// //               }).map((_, i) => {
// //                 const bio = biodegradableWaste[i];
// //                 const comb = combustibleWaste[i];
// //                 const recy = recyclableWaste[i];

// //                 return (
// //                   <tr key={i}>
// //                     <td>
// //                       {bio && (
// //                         <div className="flex md:flex-row flex-col items-center gap-0.5 pr-2">
// //                           <label className="md:w-1/2 w-full flex items-center gap-0.5">
// //                             <input
// //                               type="checkbox"
// //                               checked={enabledWasteTypes.biodegradable[bio] || false}
// //                               onChange={() => handleCheckboxChange('biodegradable', bio)}
// //                             />
// //                             <i className="fas fa-leaf" />
// //                             {bio} ({combinedWasteData[bio] || 0} kg)
// //                           </label>
// //                           <input
// //                             type="number"
// //                             value={selectedWasteTypes.biodegradable[bio] || 0}
// //                             onChange={(e) =>
// //                               handlePercentageChange(
// //                                 'biodegradable',
// //                                 bio,
// //                                 parseFloat(e.target.value)
// //                               )
// //                             }
// //                             className="border md:w-1/2 w-full rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 sm:text-sm"
// //                             min={0}
// //                             max={100}
// //                             step={10}
// //                             disabled={!enabledWasteTypes.biodegradable[bio]}
// //                           />
// //                         </div>
// //                       )}
// //                     </td>
// //                     <td>
// //                       {comb && (
// //                         <div className="flex md:flex-row flex-col items-center gap-0.5 pr-2">
// //                           <label className="md:w-1/2 w-full flex items-center gap-0.5">
// //                             <input
// //                               type="checkbox"
// //                               checked={enabledWasteTypes.combustible[comb] || false}
// //                               onChange={() => handleCheckboxChange('combustible', comb)}
// //                             />
// //                             <i className="fas fa-fire" />
// //                             {comb} ({combinedWasteData[comb] || 0} kg)
// //                           </label>
// //                           <input
// //                             type="number"
// //                             value={selectedWasteTypes.combustible[comb] || 0}
// //                             onChange={(e) =>
// //                               handlePercentageChange(
// //                                 'combustible',
// //                                 comb,
// //                                 parseFloat(e.target.value)
// //                               )
// //                             }
// //                             className="border md:w-1/2 w-full rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 sm:text-sm"
// //                             min={0}
// //                             max={100}
// //                             step={10}
// //                             disabled={!enabledWasteTypes.combustible[comb]}
// //                           />
// //                         </div>
// //                       )}
// //                     </td>
// //                     <td>
// //                       {recy && (
// //                         <div className="flex md:flex-row flex-col items-center gap-0.5 pr-2">
// //                           <label className="flex items-center gap-0.5 md:w-1/2 w-full">
// //                             <input
// //                               type="checkbox"
// //                               checked={enabledWasteTypes.recyclable[recy] || false}
// //                               onChange={() => handleCheckboxChange('recyclable', recy)}
// //                             />
// //                             <i className="fas fa-recycle" />
// //                             {recy} ({combinedWasteData[recy] || 0} kg)
// //                           </label>
// //                           <input
// //                             type="number"
// //                             value={selectedWasteTypes.recyclable[recy] || 0}
// //                             onChange={(e) =>
// //                               handlePercentageChange(
// //                                 'recyclable',
// //                                 recy,
// //                                 parseFloat(e.target.value)
// //                               )
// //                             }
// //                             className="border md:w-1/2 w-full rounded-md border-gray-300 px-3 py-[4.53px] text-gray-900 sm:text-sm"
// //                             min={0}
// //                             max={100}
// //                             step={10}
// //                             disabled={!enabledWasteTypes.recyclable[recy]}
// //                           />
// //                         </div>
// //                       )}
// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>
// //           </table>
// //         </div>
// //         <div className="md:px-8 px-5 flex justify-start gap-5 pb-8 items-center">
// //           <Button
// //             onClick={() => {
// //               calculateWasteValues();
// //               setShowModal(true);
// //             }}
// //             className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
// //           >
// //             Calculated Waste Values
// //           </Button>
// //           <Button
// //             onClick={() => {
// //               calculateWasteValues();
// //               setShowChart(true);
// //             }}
// //             className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
// //           >
// //             Bar Chart
// //           </Button>
// //         </div>

// //         <Dialog
// //           open={showModal}
// //           as="div"
// //           className="relative z-10 focus:outline-none"
// //           onClose={() => setShowModal(false)}
// //         >
// //           <div className="fixed inset-0 z-10 h-screen min-h-screen min-w-screen w-screen overflow-y-auto">
// //             <div className="flex min-h-full items-center justify-center bg-white">
// //               <DialogPanel
// //                 transition
// //                 className="relative px-8 h-full min-h-screen w-full bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
// //               >
// //                 <div className="absolute top-0 right-0 p-2">
// //                   <Button
// //                     className="cursor-pointer"
// //                     onClick={() => setShowModal(false)}
// //                   >
// //                     <X />
// //                   </Button>
// //                 </div>
// //                 <DialogTitle as="h3" className="text-xl font-bold py-2">
// //                   Waste Forecast
// //                 </DialogTitle>
// //                 <div className={`${open ? 'w-full' : 'w-full'} bg-white overflow-y-auto`}>
// //                   <h2 className="block text-sm font-medium text-gray-900 pb-1">
// //                     Waste Forecast by Type
// //                   </h2>
// //                   <table
// //                     ref={tableRef1}
// //                     className="display nowrap"
// //                     style={{ width: '100%' }}
// //                   >
// //                     <thead>
// //                       <tr className="bg-[#386641] text-white">
// //                         <th colSpan={2}>Biodegradable</th>
// //                         <th colSpan={2}>Combustible</th>
// //                         <th colSpan={2}>Recyclable</th>
// //                         <th colSpan={2}>Residues</th>
// //                       </tr>
// //                       <tr className="bg-[#386641] text-white">
// //                         <th>Waste Type</th>
// //                         <th>Amount (Kg)</th>
// //                         <th>Waste Type</th>
// //                         <th>Amount (Kg)</th>
// //                         <th>Waste Type</th>
// //                         <th>Amount (Kg)</th>
// //                         <th>Waste Type</th>
// //                         <th>Amount (Kg)</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {Array.from({
// //                         length: Math.max(
// //                           Object.keys(calculatedData.biodegradable || {}).length,
// //                           Object.keys(calculatedData.combustible || {}).length,
// //                           Object.keys(calculatedData.recyclable || {}).length,
// //                           Object.keys(calculatedData.residual || {}).length
// //                         ),
// //                       }).map((_, index) => {
// //                         const bioKeys = Object.keys(calculatedData.biodegradable || {});
// //                         const comKeys = Object.keys(calculatedData.combustible || {});
// //                         const recKeys = Object.keys(calculatedData.recyclable || {});
// //                         const resKeys = Object.keys(calculatedData.residual || {});

// //                         return (
// //                           <tr key={index}>
// //                             <td>{bioKeys[index] || ''}</td>
// //                             <td>{(calculatedData.biodegradable?.[bioKeys[index]] || 0).toFixed(2)}</td>
// //                             <td>{comKeys[index] || ''}</td>
// //                             <td>{(calculatedData.combustible?.[comKeys[index]] || 0).toFixed(2)}</td>
// //                             <td>{recKeys[index] || ''}</td>
// //                             <td>{(calculatedData.recyclable?.[recKeys[index]] || 0).toFixed(2)}</td>
// //                             <td>{resKeys[index] || ''}</td>
// //                             <td>{(calculatedData.residual?.[resKeys[index]] || 0).toFixed(2)}</td>
// //                           </tr>
// //                         );
// //                       })}
// //                       <tr>
// //                         <td><strong>Total</strong></td>
// //                         <td><strong>{Object.values(calculatedData.biodegradable || {}).reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(2)}</strong></td>
// //                         <td><strong>Total</strong></td>
// //                         <td><strong>{Object.values(calculatedData.combustible || {}).reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(2)}</strong></td>
// //                         <td><strong>Total</strong></td>
// //                         <td><strong>{Object.values(calculatedData.recyclable || {}).reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(2)}</strong></td>
// //                         <td><strong>Total</strong></td>
// //                         <td><strong>{Object.values(calculatedData.residual || {}).reduce((sum, val) => sum + (Number(val) || 0), 0).toFixed(2)}</strong></td>
// //                       </tr>
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </DialogPanel>
// //             </div>
// //           </div>
// //         </Dialog>

// //         <Dialog
// //           open={showChart}
// //           as="div"
// //           className="relative z-10 focus:outline-none"
// //           onClose={() => setShowChart(false)}
// //         >
// //           <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
// //             <div className="flex min-h-full items-center justify-center p-4">
// //               <DialogPanel
// //                 transition
// //                 className="relative w-[600px] h-full rounded-sm p-4 pb-6 border bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
// //               >
// //                 <div className="absolute top-0 right-0 p-2">
// //                   <Button
// //                     className="cursor-pointer"
// //                     onClick={() => setShowChart(false)}
// //                   >
// //                     <X />
// //                   </Button>
// //                 </div>
// //                 <DialogTitle as="h3" className="text-base font-bold pb-2">
// //                   Waste Distribution
// //                 </DialogTitle>
// //                 <div className={`${open ? 'w-full' : 'w-full'} mt-5`}>
// //                   <Bar data={chartData} options={chartOptions} />
// //                 </div>
// //               </DialogPanel>
// //             </div>
// //           </div>
// //         </Dialog>
// //       </section>

// //       {error && <div style={{ color: 'red' }}>{error}</div>}

// //       <section>
// //         <div className="md:px-8 px-5 flex justify-end gap-5 pb-8">
// //           <Button
// //             onClick={handleNext}
// //             className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
// //           >
// //             Next
// //           </Button>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // };

// // export default CarbonFootprint;










import { useState, useEffect, useRef } from "react";
import $ from "jquery";

import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";

import "datatables.net";
import "datatables.net-responsive-dt";

import { useLocation, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { X } from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Button } from "./ui/button";

type WasteType =
  | "foodWaste"
  | "yardWaste"
  | "animalDunk"
  | "paper"
  | "cardboard"
  | "textile"
  | "lightPlastic"
  | "densePlastic"
  | "wood"
  | "leather"
  | "diapers"
  | "metals"
  | "glass"
  | "electronic"
  | "cdWaste";

type WasteCategory = "biodegradable" | "combustible" | "recyclable";

interface WasteData {
  [key: string]: number;
}

interface SelectedWasteTypes {
  biodegradable: Record<WasteType, number>;
  combustible: Record<WasteType, number>;
  recyclable: Record<WasteType, number>;
}

interface EnabledWasteTypes {
  biodegradable: Record<WasteType, boolean>;
  combustible: Record<WasteType, boolean>;
  recyclable: Record<WasteType, boolean>;
}

interface CalculatedData {
  biodegradable: WasteData;
  combustible: WasteData;
  recyclable: WasteData;
  residual: WasteData;
}

interface DisposalMethods {
  [key: string]: string;
}

interface LocationState {
  wasteCategories?: Record<string, WasteData>;
  presentPopulation?: number;
  forecastYear?: number;
  name?: string;
}

const CarbonFootprint = ({ open }: { open: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;
  const wasteData = state?.wasteCategories || {};
  const { presentPopulation = 0, forecastYear = 0, name = "Unknown" } = state || {};

  const [combinedWasteData, setCombinedWasteData] = useState<WasteData>({});
  const [disposalMethods, setDisposalMethods] = useState<DisposalMethods>({});
  const initialWasteTypeState: Record<WasteType, number> = {
    foodWaste: 0,
    yardWaste: 0,
    animalDunk: 0,
    paper: 0,
    cardboard: 0,
    textile: 0,
    lightPlastic: 0,
    densePlastic: 0,
    wood: 0,
    leather: 0,
    diapers: 0,
    metals: 0,
    glass: 0,
    electronic: 0,
    cdWaste: 0,
  };

  const [selectedWasteTypes, setSelectedWasteTypes] = useState<SelectedWasteTypes>({
    biodegradable: { ...initialWasteTypeState },
    combustible: { ...initialWasteTypeState },
    recyclable: { ...initialWasteTypeState },
  });
  const initialEnabledWasteTypeState: Record<WasteType, boolean> = {
    foodWaste: false,
    yardWaste: false,
    animalDunk: false,
    paper: false,
    cardboard: false,
    textile: false,
    lightPlastic: false,
    densePlastic: false,
    wood: false,
    leather: false,
    diapers: false,
    metals: false,
    glass: false,
    electronic: false,
    cdWaste: false,
  };

  const [enabledWasteTypes, setEnabledWasteTypes] = useState<EnabledWasteTypes>({
    biodegradable: { ...initialEnabledWasteTypeState },
    combustible: { ...initialEnabledWasteTypeState },
    recyclable: { ...initialEnabledWasteTypeState },
  });
  const [calculatedData, setCalculatedData] = useState<CalculatedData>({
    biodegradable: {},
    combustible: {},
    recyclable: {},
    residual: {},
  });
  const [error, setError] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const biodegradableWaste: WasteType[] = [
    "foodWaste",
    "yardWaste",
    "animalDunk",
    "paper",
    "cardboard",
    "textile",
  ];
  const combustibleWaste: WasteType[] = [
    "paper",
    "cardboard",
    "lightPlastic",
    "densePlastic",
    "textile",
    "foodWaste",
    "yardWaste",
    "wood",
    "leather",
    "diapers",
  ];
  const recyclableWaste: WasteType[] = [
    "paper",
    "leather",
    "cardboard",
    "lightPlastic",
    "densePlastic",
    "metals",
    "glass",
    "electronic",
    "textile",
    "cdWaste",
    "diapers",
  ];

  useEffect(() => {
    const combinedData: WasteData = {};

    // Safely handle undefined or null wasteData
    if (!wasteData || typeof wasteData !== "object") {
      console.warn("No waste data provided, using empty object.");
      setCombinedWasteData({});
      return;
    }

    Object.values(wasteData).forEach((categoryData) => {
      if (categoryData && typeof categoryData === "object") {
        Object.entries(categoryData).forEach(([wasteType, amount]) => {
          combinedData[wasteType] = (combinedData[wasteType] || 0) + (Number(amount) || 0);
        });
      }
    });

    setCombinedWasteData(combinedData);
    setDisposalMethods(
      Object.keys(combinedData).reduce((methods, wasteType) => {
        methods[wasteType] = "Landfill";
        return methods;
      }, {} as DisposalMethods)
    );
  }, [wasteData]);

  const chartData = {
    labels: ["Biodegradable", "Combustible", "Recyclable", "Residual"],
    datasets: [
      {
        label: "Waste (Kg)",
        data: [
          Object.values(calculatedData.biodegradable).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
          ),
          Object.values(calculatedData.combustible).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
          ),
          Object.values(calculatedData.recyclable).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
          ),
          Object.values(calculatedData.residual).reduce(
            (sum, value) => sum + (Number(value) || 0),
            0
          ),
        ],
        backgroundColor: [
          "rgb(22, 163, 74)",
          "rgb(59, 130, 246)",
          "rgb(107, 114, 128)",
          "rgb(220, 38, 38)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
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
  };

  const handlePercentageChange = (
    category: WasteCategory,
    wasteType: WasteType,
    percent: any
  ) => {
    const percentage = parseFloat(percent);

    if (isNaN(percentage)) {
      setError("Please enter a valid number");
      return;
    }

    if (percentage < 0 || percentage > 100) {
      setError("Percentage must be between 0 and 100");
      return;
    }

    // Update the state first
    const updatedState = {
      ...selectedWasteTypes,
      [category]: {
        ...selectedWasteTypes[category],
        [wasteType]: percentage,
      },
    };

    // Calculate total percentage for this wasteType across all categories
    const totalPercentage = Object.values(updatedState).reduce((total, categoryData) => {
      return total + (categoryData[wasteType] || 0);
    }, 0);

    if (totalPercentage > 100) {
      setError(`Total ${wasteType} allocation exceeds 100% (Current: ${totalPercentage.toFixed(1)}%)`);
    } else {
      setError(null);
    }

    // Always update the state even if there's an error
    setSelectedWasteTypes(updatedState);
  };

  const handleCheckboxChange = (category: WasteCategory, wasteType: WasteType) => {
    setEnabledWasteTypes((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [wasteType]: !prev[category][wasteType],
      },
    }));
  };

  const handleDisposalChange = (wasteType: string, method: string) => {
    setDisposalMethods((prevMethods) => ({
      ...prevMethods,
      [wasteType]: method,
    }));
  };

  const calculateWasteValues = () => {
    const updatedCalculatedData: CalculatedData = {
      biodegradable: {},
      combustible: {},
      recyclable: {},
      residual: {},
    };

    const calculateCategoryWaste = (
      category: WasteCategory,
      categoryWasteList: WasteType[]
    ) => {
      categoryWasteList.forEach((wasteType) => {
        const totalWaste = combinedWasteData[wasteType] || 0;
        const percentage = enabledWasteTypes[category][wasteType]
          ? selectedWasteTypes[category][wasteType] || 0
          : 0;
        const calculatedValue = (totalWaste * percentage) / 100;

        updatedCalculatedData[category][wasteType] = calculatedValue;
      });
    };

    calculateCategoryWaste("biodegradable", biodegradableWaste);
    calculateCategoryWaste("combustible", combustibleWaste);
    calculateCategoryWaste("recyclable", recyclableWaste);

    // Calculate residual waste
    Object.keys(combinedWasteData).forEach((wasteType) => {
      const totalWaste = combinedWasteData[wasteType] || 0;
      const totalCalculated =
        (updatedCalculatedData.biodegradable[wasteType] || 0) +
        (updatedCalculatedData.combustible[wasteType] || 0) +
        (updatedCalculatedData.recyclable[wasteType] || 0);
      updatedCalculatedData.residual[wasteType] = Math.max(
        0,
        totalWaste - totalCalculated
      ); // Ensure non-negative
    });

    setCalculatedData(updatedCalculatedData);
  };

  const handleNext = () => {
    const totals = {
      biodegradableTotal: Object.values(calculatedData.biodegradable).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      ),
      combustibleTotal: Object.values(calculatedData.combustible).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      ),
      recyclableTotal: Object.values(calculatedData.recyclable).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      ),
      residualTotal: Object.values(calculatedData.residual).reduce(
        (sum, value) => sum + (Number(value) || 0),
        0
      ),
    };

    navigate("/cf-calculations", {
      state: { calculatedData, totals },
    });
  };

  const tableRef = useRef<HTMLTableElement>(null);
  const tableRef1 = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const table1 = $(tableRef.current!).DataTable({
      responsive: true,
    });

    return () => {
      table1.destroy();
    };
  }, []);

  useEffect(() => {
    if (showModal) {
      const timeout = setTimeout(() => {
        if (tableRef1.current) {
          const $table = $(tableRef1.current);
          if (!$.fn.DataTable.isDataTable(tableRef1.current)) {
            $table.DataTable({
              responsive: true,
            });
          }
        }
      }, 100);

      return () => {
        clearTimeout(timeout);
        if (tableRef1.current && $.fn.DataTable.isDataTable(tableRef1.current)) {
          $(tableRef1.current).DataTable().destroy();
        }
      };
    }
  }, [showModal, calculatedData]);

  return (
    <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white">
      <div className="pt-8 px-5 md:px-8">
        <div className="text-xl">
          <h2>
            <strong>Current Population:</strong> <span>{presentPopulation}</span>
          </h2>
          <h2>
            <strong>Select Waste Categories</strong>
          </h2>
          {/* <h2>
            <strong>City Name:</strong> <span className="capitalize">{name}</span>
          </h2> */}
        </div>
      </div>
      <section>
        {/* <h2 className="text-base font-bold pl-8">Select Waste Categories</h2> */}
        <div className="pt-5 px-5 md:px-8">
          <table  className="w-full border border-collapse border-gray-300 text-sm" >
            <thead>
              <tr className="bg-[#386641] text-white border p-2">
                <th className="border p-2">Biodegradables</th>
                <th className="border p-2">Combustibles</th>
                <th className="border p-2">Recyclables</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({
                length: Math.max(
                  biodegradableWaste.length,
                  combustibleWaste.length,
                  recyclableWaste.length
                ),
              }).map((_, i) => {
                const bio = biodegradableWaste[i];
                const comb = combustibleWaste[i];
                const recy = recyclableWaste[i];

                return (
                  <tr key={i}>
                    <td className="border p-2">
                      {bio && (
                        <div className="flex md:flex-row flex-col items-center gap-0.5 pr-2 relative">
                          <label className="md:w-1/2 w-full flex items-center gap-0.5">
                            <input
                              type="checkbox"
                              checked={enabledWasteTypes.biodegradable[bio] || false}
                              onChange={() => handleCheckboxChange("biodegradable", bio)}
                            />
                            <i className="fas fa-leaf" />
                            {bio} ({combinedWasteData[bio] || 0} kg)
                          </label>
                          <div className="relative md:w-1/2 w-full">
                            <input
                              type="number"
                              value={selectedWasteTypes.biodegradable[bio] || 0}
                              onChange={(e) =>
                                handlePercentageChange("biodegradable", bio, e.target.value)
                              }
                              className={`border w-full rounded-md px-3 py-[4.53px] text-gray-900 sm:text-sm  `}
                              min={0}
                              max={100}
                              disabled={!enabledWasteTypes.biodegradable[bio]}
                            />
                            
                          </div>
                        </div>
                      )}
                    </td>

                     <td  className="border p-2">
                      {comb && (
                        <div className="flex md:flex-row flex-col items-center gap-0.5 pr-2 relative">
                          <label className="md:w-1/2 w-full flex items-center gap-0.5">
                            <input
                              type="checkbox"
                              checked={enabledWasteTypes.combustible[comb] || false}
                              onChange={() => handleCheckboxChange("combustible", comb)}
                            />
                            <i className="fas fa-leaf" />
                            {comb} ({combinedWasteData[comb] || 0} kg)
                          </label>
                          <div className="relative md:w-1/2 w-full">
                            <input
                              type="number"
                              value={selectedWasteTypes.combustible[comb] || 0}
                              onChange={(e) =>
                                handlePercentageChange("combustible", comb, e.target.value)
                              }
                              className={`border w-full rounded-md px-3 py-[4.53px] text-gray-900 sm:text-sm  `}
                              min={0}
                              max={100}
                              disabled={!enabledWasteTypes.combustible[comb]}
                            />
                            {/* {error && (
                              <div className="w-fit mt-1 p-2 bg-red-100 text-red-800 text-sm rounded-md shadow-lg">
                                {error}
                              </div>
                            )} */}
                          </div>
                        </div>
                      )}
                    </td>
                    <td  className="border p-2">
                     {recy && (
                        <div className="flex md:flex-row flex-col items-center gap-0.5 pr-2 relative">
                          <label className="md:w-1/2 w-full flex items-center gap-0.5">
                            <input
                              type="checkbox"
                              checked={enabledWasteTypes.recyclable[recy] || false}
                              onChange={() => handleCheckboxChange("recyclable", recy)}
                            />
                            <i className="fas fa-leaf" />
                            {recy} ({combinedWasteData[recy] || 0} kg)
                          </label>
                          <div className="relative md:w-1/2 w-full">
                            <input
                              type="number"
                              value={selectedWasteTypes.recyclable[recy] || 0}
                              onChange={(e) =>
                                handlePercentageChange("recyclable", recy, e.target.value)
                              }
                              className={`border w-full rounded-md px-3 py-[4.53px] text-gray-900 sm:text-sm  `}
                              min={0}
                              max={100}
                              disabled={!enabledWasteTypes.recyclable[recy]}
                            />
                            
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })} 
              

            </tbody>
          </table>
           {error && <div className="w-full mt-1 p-2 bg-red-100 text-red-800 text-sm rounded-md shadow-lg capitalize">{error}</div>}
        </div>
        <div className="md:px-8 px-5 flex justify-between gap-5 pb-8 items-center">
          <div className="flex justify-between gap-5 pb-8 items-center">
          <Button
            onClick={() => {
              calculateWasteValues();
              setShowModal(true);
            }}
            className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
          >
            Calculated Waste Values
          </Button>
          <Button
            onClick={() => {
              calculateWasteValues();
              setShowChart(true);
            }}
            className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
          >
            Bar Chart
          </Button>
        </div>
         <div className="flex justify-end gap-5 pb-8">
          <Button
            onClick={handleNext}
            className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
          >
            Next
          </Button>
        </div>
        </div>

        <Dialog
          open={showModal}
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => setShowModal(false)}
        >
          <div className="fixed inset-0 z-10 h-screen min-h-screen min-w-screen w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center bg-white">
              <DialogPanel
                transition
                className="relative px-8 h-full min-h-screen w-full bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              >
                <div className="absolute top-0 right-0 p-2">
                  <Button
                    className="cursor-pointer"
                    onClick={() => setShowModal(false)}
                  >
                    <X />
                  </Button>
                </div>
                <DialogTitle as="h3" className="text-xl font-bold py-2">
                  Waste Forecast
                </DialogTitle>
                <div className={`${open ? "w-full" : "w-full"} h-[80vh] bg-white overflow-y-auto`}>
                  <h2 className="block text-sm font-medium text-gray-900 pb-1">
                    Waste Forecast by Type
                  </h2>
                  <table
                    // ref={tableRef1}
                    className="w-full border border-collapse border-gray-300 text-sm"
                    // style={{ width: "100%" }}
                  >
                    <thead>
                      <tr className="bg-[#386641] text-white">
                        <th className="border p-2" colSpan={2}>Biodegradable</th>
                        <th className="border p-2" colSpan={2}>Combustible</th>
                        <th className="border p-2" colSpan={2}>Recyclable</th>
                        <th className="border p-2" colSpan={2}>Residues</th>
                      </tr>
                      <tr className="bg-[#386641] text-white">
                        <th className="border p-2">Waste Type</th>
                        <th className="border p-2">Amount (Kg)</th>
                        <th className="border p-2">Waste Type</th>
                        <th className="border p-2">Amount (Kg)</th>
                        <th className="border p-2">Waste Type</th>
                        <th className="border p-2">Amount (Kg)</th>
                        <th className="border p-2">Waste Type</th>
                        <th className="border p-2">Amount (Kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({
                        length: Math.max(
                          Object.keys(calculatedData.biodegradable || {}).length,
                          Object.keys(calculatedData.combustible || {}).length,
                          Object.keys(calculatedData.recyclable || {}).length,
                          Object.keys(calculatedData.residual || {}).length
                        ),
                      }).map((_, index) => {
                        const bioKeys = Object.keys(calculatedData.biodegradable || {});
                        const comKeys = Object.keys(calculatedData.combustible || {});
                        const recKeys = Object.keys(calculatedData.recyclable || {});
                        const resKeys = Object.keys(calculatedData.residual || {});

                        return (
                          <tr key={index}>
                            <td className="border p-2">{bioKeys[index] || ""}</td>
                            <td className="border p-2">{(calculatedData.biodegradable?.[bioKeys[index]] ? calculatedData.biodegradable?.[bioKeys[index]].toFixed(2) : calculatedData.biodegradable?.[bioKeys[index]] === 0 ? calculatedData.biodegradable?.[bioKeys[index]].toFixed(2) : "")}</td>
                            <td className="border p-2">{comKeys[index] || ""}</td>
                            <td className="border p-2">{(calculatedData.combustible?.[comKeys[index]] ? calculatedData.combustible?.[comKeys[index]].toFixed(2) :  calculatedData.combustible?.[comKeys[index]] === 0 ? calculatedData.combustible?.[comKeys[index]].toFixed(2) : "")}</td>
                            <td className="border p-2">{recKeys[index] || ""}</td>
                            <td className="border p-2">{(calculatedData.recyclable?.[recKeys[index]] ? calculatedData.recyclable?.[recKeys[index]].toFixed(2) : calculatedData.recyclable?.[recKeys[index]] === 0 ? calculatedData.recyclable?.[recKeys[index]].toFixed(2) : "")}</td>
                            <td className="border p-2">{resKeys[index] || ""}</td>
                            <td className="border p-2">{(calculatedData.residual?.[resKeys[index]] ? calculatedData.residual?.[resKeys[index]].toFixed(2) : calculatedData.residual?.[resKeys[index]] === 0 ?  calculatedData.residual?.[resKeys[index]].toFixed(2) : "")}</td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td className="border p-2"><strong>Total</strong></td>
                        <td>
                          <strong>
                            {Object.values(calculatedData.biodegradable || {}).reduce(
                              (sum, val) => sum + (Number(val) || 0),
                              0
                            ).toFixed(2)}
                          </strong>
                        </td>
                        <td className="border p-2"><strong>Total</strong></td>
                        <td className="border p-2">
                          <strong>
                            {Object.values(calculatedData.combustible || {}).reduce(
                              (sum, val) => sum + (Number(val) || 0),
                              0
                            ).toFixed(2)}
                          </strong>
                        </td>
                        <td className="border p-2"><strong>Total</strong></td>
                        <td>
                          <strong>
                            {Object.values(calculatedData.recyclable || {}).reduce(
                              (sum, val) => sum + (Number(val) || 0),
                              0
                            ).toFixed(2)}
                          </strong>
                        </td>
                        <td className="border p-2"><strong>Total</strong></td>
                        <td className="border p-2">
                          <strong>
                            {Object.values(calculatedData.residual || {}).reduce(
                              (sum, val) => sum + (Number(val) || 0),
                              0
                            ).toFixed(2)}
                          </strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>

        <Dialog
          open={showChart}
          as="div"
          className="relative z-10 focus:outline-none"
          onClose={() => setShowChart(false)}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="relative w-[600px] h-full rounded-sm p-4 pb-6 border bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
              >
                <div className="absolute top-0 right-0 p-2">
                  <Button
                    className="cursor-pointer"
                    onClick={() => setShowChart(false)}
                  >
                    <X />
                  </Button>
                </div>
                <DialogTitle as="h3" className="text-base font-bold pb-2">
                  Waste Distribution
                </DialogTitle>
                <div className={`${open ? "w-full" : "w-full"} mt-5`}>
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </section>

     

      {/* <section>
        <div className="md:px-8 px-5 flex justify-end gap-5 pb-8">
          <Button
            onClick={handleNext}
            className="bg-[#386641] transition duration-300 ease-in-out cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md"
          >
            Next
          </Button>
        </div>
      </section> */}
    </div>
  );
};

export default CarbonFootprint;