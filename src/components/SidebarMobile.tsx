// // import { DraftingCompass, Frame, Framer, House, SquareChartGantt } from "lucide-react";
// // import React from "react";
// // // import logo from"./logo.svg"
// // function Sidebar() {
// //   return (
// //     <div className="w-[300px] h-screen border-r bg-white ">
// //       <h1 className="pb-5 pt-8 flex items-center justify-center gap-2">
// //           <img src="./logo.svg" alt="" className="w-8.5" /><span className="text-3xl tracking-[.25em] font-light">HIWMA</span> </h1>

// //       <ul className="px-4 text-[15px]">
// //         <a href="/" className=" w-full">
// //           {" "}
// //           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><House className="w-[18px]" /></span><span className="">Dashboard</span> </li>
// //         </a>
// //         <a href="/landfill-design" className=" w-full">
// //           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><DraftingCompass className="w-[18px]" /></span><span className="">Landfill Design</span></li>
// //         </a>
// //         <a href="/MRF-design" className=" w-full">
// //           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Framer className="w-[18px]" /></span><span className="">MRF Design</span></li>
// //         </a>
// //         <a href="/RDF-design" className=" w-full">
// //           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><SquareChartGantt className="w-[18px]" /></span><span className="">RDF Design</span></li>
// //         </a>
// //         <a href="/anaerobic-design" className=" w-full">
// //           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Frame className="w-[18px]" /></span><span className="">Anaerobic Design</span></li>
// //         </a>
// //         {/* <li className=""></li> */}
// //       </ul>

// // <div className="">
// // <h2 className="text-xs text-gray-700 pl-7 pt-12">About Us</h2>
// //       <ul className="px-4 text-[15px]">
// //       <a href="#" className=" w-full"><li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Frame className="w-[18px]" /></span><span className="">About</span></li></a>
// //       <a href="#" className=" w-full"><li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Frame className="w-[18px]" /></span><span className="">Contact</span></li></a>
// //       </ul>
// //       </div>

// //     </div>
// //   );
// // }

// // export default Sidebar;

// import React, { useState } from "react";
// import {
//   Home,
//   Info,
//   Phone,
//   Wrench,
//   Menu,
//   Frame,
//   DraftingCompass,
//   SquareChartGantt,
//   Codepen,
//   Crop,
//   Framer,
//   LogIn,
// } from "lucide-react";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isServicesOpen, setIsServicesOpen] = useState(false);

//   return (
//     <div className="flex">
//       {/* Sidebar */}

//       <div
//         className={`bg-gray-800 text-white h-screen transition-all flex flex-col justify-between duration-300 ${
//           isOpen ? "w-[300px] p-5" : "w-16 p-2"
//         } relative`}
//       >
//         <div>
//           <div className="flex items-center pb-5 pt-8 justify-between">
//             {!isOpen && (
//               // <a href="/" className="flex justify-center w-full cursor-pointer" >
//               <button
//                 onMouseEnter={() => setIsOpen(true)}
//                 onClick={ () => location.href='/'}
//                 className="w-full flex justify-center"
//               >
//                 <img src="./H2.png" alt="" className="w-8" />
//               </button>
//               // </a>
//             )}
//             {isOpen && (
//               <a href="/" className="">
//               <h1 className="flex items-center gap-2 pl-4">
//                 <img src="./H2.png" alt="" className="w-8" />

//                 <span className="text-3xl tracking-[.25em] font-light">
//                   HIWMA
//                 </span>
//               </h1>
//               </a>
//             )}
//             {/* Fix button visibility */}
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className={`absolute right-4 top-14 flex items-center cursor-pointer ${
//                 !isOpen ? "opacity-0" : " opacity-100"
//               }`}
//             >
//               <LogIn size={24} style = {{transform: 'rotate(180deg)' }} />
//             </button>
//           </div>

//           <ul className={` ${isOpen ? "p-2" : "p-3"}`}>
//             <a href="/" className="text-sm">
//               <li
//                 className={`${
//                   isOpen
//                     ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                     : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                 }`}
//               >
//                 <Home className="w-[18px]" />
//                 {isOpen && <span className="ml-3">Home</span>}
//               </li>
//             </a>
//             <a href="/landfill-design" className="text-sm">
//               <li
//                 className={`${
//                   isOpen
//                     ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                     : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                 }`}
//               >
//                 <DraftingCompass className="w-[18px]" />
//                 {isOpen && <span className="ml-3">Landfill Design</span>}
//               </li>
//             </a>
//             <a href="/MRF-design" className="text-sm">
//               <li
//                 className={`${
//                   isOpen
//                     ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                     : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                 }`}
//               >
//                 <Framer className="w-[18px]" />
//                 {isOpen && <span className="ml-3">MRF Design</span>}
//               </li>
//             </a>
//             <a href="/RDF-design" className="text-sm">
//               <li
//                 className={`${
//                   isOpen
//                     ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                     : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                 }`}
//               >
//                 <SquareChartGantt className="w-[18px]" />
//                 {isOpen && <span className="ml-3">RDF Design</span>}
//               </li>
//             </a>
//             <a href="/anaerobic-design" className="text-sm">
//               <li
//                 className={`${
//                   isOpen
//                     ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                     : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                 }`}
//               >
//                 <Frame className="w-[18px]" />
//                 {isOpen && <span className="ml-3">Anaerobic Desgin</span>}
//               </li>
//             </a>
//             {/* Expandable Services */}
//             {/* <li>
//             <div
//               className={`${isOpen ? "text-sm flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1" : "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15"}`}
//             >
//               <Wrench  className="w-[18px]"  />
//               {isOpen && <span className="ml-3">Services</span>}
//             </div>
//             {isOpen && isServicesOpen && (
//               <ul className="ml-6 mt-2">
//                 <li className="cursor-pointer hover:text-gray-300">
//                   Web Development
//                 </li>
//                 <li className="cursor-pointer hover:text-gray-300">
//                   SEO Optimization
//                 </li>
//                 <li className="cursor-pointer hover:text-gray-300">
//                   Marketing
//                 </li>
//               </ul>
//             )}
//           </li> */}
//           </ul>
//           <div className="">
//             {isOpen && (
//               <h2 className="text-xs text-white pl-5 pt-5">About Us</h2>
//             )}
//             {!isOpen && (
//               <span className="h-[0.5px] w-full bg-gray-200 flex"></span>
//             )}
//             <ul className="px-4 text-[15px] pt-3">
//               <a href="#" className="text-sm">
//                 <li
//                   className={`${
//                     isOpen
//                       ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                       : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                   }`}
//                 >
//                   <Codepen className="w-[18px]" />
//                   {isOpen && <span className="ml-3">About</span>}
//                 </li>
//               </a>
//               <a href="#" className="text-sm">
//                 <li
//                   className={`${
//                     isOpen
//                       ? "flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
//                       : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                   }`}
//                 >
//                   <Crop className="w-[18px]" />
//                   {isOpen && <span className="ml-3">Contact</span>}
//                 </li>
//               </a>
//             </ul>
//           </div>
//         </div>
//         <div className="">
//           <div className="">
//             {!isOpen && (
//               <span className="h-[0.5px] w-full bg-gray-200 flex"></span>
//             )}
//             <ul className={`${isOpen? "px-4 text-[15px] pt-3" : "px-0 text-[15px]  flex justify-center pt-3" }`}>
//               <a href="#" className="text-sm">
//                 <li
//                   className={`${
//                     isOpen
//                       ? "flex items-center  cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1 gap-3"
//                       : "flex items-center mb-4 cursor-pointer hover:text-gray-400"
//                   }`}
//                 >
//                  <span className="">
//                  <img
//                     alt=""
//                     src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
//                     className="size-8 rounded-full"
//                   />
//                  </span>
//                   {isOpen && <span className="ml-3">MR. Abcddk</span>}
//                 </li>
//               </a>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

"use client";

import { Fragment, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  ChartNoAxesCombined,
  ChevronDown,
  Codepen,
  Crop,
  DraftingCompass,
  FileStack,
  Frame,
  Framer,
  Home,
  LandPlot,
  LayoutDashboard,
  MapIcon,
  Menu,
  Plus,
  Search,
  ShoppingBag,
  SquareChartGantt,
  X,
} from "lucide-react";


export default function Example({ open, setOpen }: any) {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesOpen1, setIsServicesOpen1] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile menu */}
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-40 md:hidden w-full"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="bg-gray-800 text-white relative flex w-full max-w-xs transform flex-col overflow-y-auto pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-[2.3rem] right-[30px] -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <X  className="size-6" />
              </button>
            </div>
            <div>
              <div className="flex items-center pb-5 pt-1 justify-between">

                <a href="/" className="">
                  <h1 className="flex items-center gap-2 pl-4">
                    <img src="./H2.png" alt="" className="w-8" />

                    <span className="text-3xl tracking-[.25em] font-light">
                      HIWMA
                    </span>
                  </h1>
                </a>
              </div>

              <ul className="pt-6 p-2">
                <a href="/" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <Home className="w-[18px]" />
                    <span className="ml-3">Home</span>
                  </li>
                </a>
                <a href="/home" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <LayoutDashboard className="w-[18px]" />
                    <span className="ml-3">Dashboard</span>
                  </li>
                </a>
                 <li onClick={() => setIsServicesOpen1(!isServicesOpen1)} className="text-sm flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                  <LandPlot className="w-[18px]" />
                  <p className="flex justify-between w-full">
                  <span className="ml-3">Landfills</span>
                      <ChevronDown className={`"w-[18px]" ${isServicesOpen1 ? "rotate-180 transition duration-300" : "transition duration-300"}`} />

                  </p>
                </li>
                 <li>
                  {isServicesOpen1 && (
                    <ul className="ml-6 mt-2 text-sm">
                      <a href="/landfills" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <ChartNoAxesCombined className="w-[18px]" />

                          <span className="ml-3">Display Landfills</span>

                        </li>
                      </a>
                      {/* Economic Analysis */}
                      <a href="/add-landfills" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <DraftingCompass className="w-[18px]" />

                          <span className="ml-3">Add Landfills</span>

                        </li>
                      </a>
                      {/* <a href="/MRF-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <Framer className="w-[18px]" />
                          <span className="ml-3">MRF Design</span>
                        </li>
                      </a>
                      <a href="/RDF-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <SquareChartGantt className="w-[18px]" />
                          <span className="ml-3">RDF Design</span>
                        </li>
                      </a>
                      <a href="/anaerobic-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <Frame className="w-[18px]" />
                          <span className="ml-3">Anaerobic Design</span>
                        </li>
                      </a> */}
                    </ul>
                  )}
                </li>
                {/* <a href="/landfills" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <LandPlot className="w-[18px]" />
                    <span className="ml-3">Landfills</span>
                  </li>
                </a> */}
                {/* <a href="/add-data" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <Plus className="w-[18px]" />
                    <span className="ml-3">Add Data</span>
                  </li>
                </a> */}
                <a href="/map" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <MapIcon className="w-[18px]" />
                    <span className="ml-3">Waste Generation Map</span>
                  </li>
                </a>
                <li onClick={() => setIsServicesOpen(!isServicesOpen)} className="text-sm flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                  <FileStack className="w-[18px]" />
                  <p className="flex justify-between w-full">
                  <span className="ml-3">Designs</span>
                      <ChevronDown className={`"w-[18px]" ${isServicesOpen ? "rotate-180 transition duration-300" : "transition duration-300"}`} />

                  </p>
                </li>
                <li>
                  {isServicesOpen && (
                    <ul className="ml-6 mt-2 text-sm">
                      <a href="/economy-analysis" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <ChartNoAxesCombined className="w-[18px]" />

                          <span className="ml-3">Economic Analysis</span>

                        </li>
                      </a>
                      {/* Economic Analysis */}
                      <a href="/landfill-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <DraftingCompass className="w-[18px]" />

                          <span className="ml-3">Landfill Design</span>

                        </li>
                      </a>
                      <a href="/MRF-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <Framer className="w-[18px]" />
                          <span className="ml-3">MRF Design</span>
                        </li>
                      </a>
                      <a href="/RDF-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <SquareChartGantt className="w-[18px]" />
                          <span className="ml-3">RDF Design</span>
                        </li>
                      </a>
                      <a href="/anaerobic-design" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <Frame className="w-[18px]" />
                          <span className="ml-3">Anaerobic Design</span>
                        </li>
                      </a>
                    </ul>
                  )}
                </li>
                {/* <a href="/landfill-design" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <DraftingCompass className="w-[18px]" />
                    <span className="ml-3">Landfill Design</span>
                  </li>
                </a> */}
               
                {/* <a href="/MRF-design" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <Framer className="w-[18px]" />
                    <span className="ml-3">MRF Design</span>
                  </li>
                </a>
                <a href="/RDF-design" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <SquareChartGantt className="w-[18px]" />
                    <span className="ml-3">RDF Design</span>
                  </li>
                </a>
                <a href="/anaerobic-design" className="text-sm">
                  <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                    <Frame className="w-[18px]" />
                    <span className="ml-3">Anaerobic Desgin</span>
                  </li>
                </a> */}
              </ul>
              {/* <div className="">
                <h2 className="text-xs text-white pl-5 pt-5">About Us</h2>

                <ul className="px-4 text-[15px] pt-3">
                  <a href="#" className="text-sm">
                    <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                      <Codepen className="w-[18px]" />
                      <span className="ml-3">About</span>
                    </li>
                  </a>
                  <a href="#" className="text-sm">
                    <li className="flex items-center mb-4 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1">
                      <Crop className="w-[18px]" />
                      <span className="ml-3">Contact</span>{" "}
                    </li>
                  </a>
                </ul>
              </div> */}
            </div>

          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
