// import { DraftingCompass, Frame, Framer, House, SquareChartGantt } from "lucide-react";
// import React from "react";
// // import logo from"./logo.svg"
// function Sidebar() {
//   return (
//     <div className="w-[300px] h-screen border-r bg-white ">
//       <h1 className="pb-5 pt-8 flex items-center justify-center gap-2">
//           <img src="./logo.svg" alt="" className="w-8.5" /><span className="text-3xl tracking-[.25em] font-light">HIWMA</span> </h1>

//       <ul className="px-4 text-[15px]">
//         <a href="/" className=" w-full">
//           {" "}
//           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><House className="w-[18px]" /></span><span className="">Dashboard</span> </li>
//         </a>
//         <a href="/landfill-design" className=" w-full">
//           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><DraftingCompass className="w-[18px]" /></span><span className="">Landfill Design</span></li>
//         </a>
//         <a href="/MRF-design" className=" w-full">
//           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Framer className="w-[18px]" /></span><span className="">MRF Design</span></li>
//         </a>
//         <a href="/RDF-design" className=" w-full">
//           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><SquareChartGantt className="w-[18px]" /></span><span className="">RDF Design</span></li>
//         </a>
//         <a href="/anaerobic-design" className=" w-full">
//           <li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Frame className="w-[18px]" /></span><span className="">Anaerobic Design</span></li>
//         </a>
//         {/* <li className=""></li> */}
//       </ul>

// <div className="">
// <h2 className="text-xs text-gray-700 pl-7 pt-12">About Us</h2>
//       <ul className="px-4 text-[15px]">
//       <a href="#" className=" w-full"><li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Frame className="w-[18px]" /></span><span className="">About</span></li></a>
//       <a href="#" className=" w-full"><li className="py-1.5 px-2 rounded w-full hover:bg-[#f9fafc] my-1 flex items-center"><span className="pr-1.5"><Frame className="w-[18px]" /></span><span className="">Contact</span></li></a>
//       </ul>
//       </div>

//     </div>
//   );
// }

// export default Sidebar;

import { useEffect, useState } from "react";
import { auth } from "../firebase";

import { onAuthStateChanged } from "firebase/auth";
import {
  Home,
  Frame,
  DraftingCompass,
  SquareChartGantt,
  Codepen,
  Crop,
  Framer,
  LogIn,
  LayoutDashboard,
  LandPlot,
  FileStack,
  ChevronDown,
  Plus,
  MapIcon,
  List,
  ChartNoAxesCombined,
} from "lucide-react";

type UserData = {
  email?: string;
  displayName?: string;
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isServicesOpen1, setIsServicesOpen1] = useState(false);
  const [user, setUser] = useState<UserData>({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);



  return (
    <div className="flex">
      <div
        className={`bg-[#004b23] text-white h-screen transition-all flex flex-col justify-between duration-300 ${open ? "w-[300px] p-5" : "w-16 p-2"
          } relative`}
      >
        <div>
          <div className="flex items-center pb-5 pt-1 justify-between">
            {!open && (
              <button
                onMouseEnter={() => setOpen(true)}
                onClick={() => (location.href = "/")}
                className="w-full flex justify-center pt-1.5"
              >
                <img src="./H2.png" alt="" className="w-8" />
              </button>
            )}
            {open && (
              <a href="/" className="">
                <h1 className="flex items-center gap-2 pl-4">
                  <img src="./H2.png" alt="" className="w-8" />

                  <span className="text-3xl text-white tracking-[.25em] font-light">
                    HIWMA
                  </span>
                </h1>
              </a>
            )}
            <button
              onClick={() => setOpen(!open)}
              className={`absolute right-4 top-8 flex items-center cursor-pointer ${!open ? "opacity-0" : " opacity-100"
                }`}
            >
              <LogIn size={24} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
          <div className=" h-[calc(100vh-85px)] overflow-y-auto pb-5">
            <ul className={`pt-6 ${open ? "p-2" : "p-3"}`}>
              <a href="/" className="text-sm">
                <li
                  className={`${open
                    ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full"
                    : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                >
                  <Home className="w-[18px]" />
                  {open && <span className="ml-3">Home</span>}
                </li>
              </a>
              <a href="/home" className="text-sm">
                <li
                  className={`${open
                    ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                    : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                >
                  <LayoutDashboard className="w-[18px]" />
                  {open && <span className="ml-3">Dashboard</span>}
                </li>
              </a>
              <li className="">
                <div
                  className={` ${open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                  onClick={() => {setIsServicesOpen1(!isServicesOpen1);
                    setIsServicesOpen(false)
                  }}
                >
                  <LandPlot className="w-[18px]" />
                  {open && (
                    <div className="flex justify-between w-full">
                      <span className="ml-3 text-sm">Landfills</span>
                      <ChevronDown className={`"w-[18px]" ${isServicesOpen1 ? "rotate-180 transition duration-300" : "transition duration-300"}`} />
                    </div>
                  )}
                </div>
                {!open && isServicesOpen1 && (
                  <div className=" absolute bg-[#004b23] left-18 w-[200px] rounded-md top-40 z-10">
                    <ul className="mt-2 text-sm">
                      <a href="/landfills" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <ChartNoAxesCombined className="w-[18px]" />
                          {!open && (
                            <span className="ml-3">Display Landfills</span>
                          )}
                        </li>
                      </a>
                      <a href="add-landfills" className="text-sm">
                        <li
                          className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                        >
                          <DraftingCompass className="w-[18px]" />
                          {!open && (
                            <span className="ml-3">Add Landfills</span>
                          )}
                        </li>
                      </a>

                    </ul>
                  </div>
                )}
                {open && isServicesOpen1 && (
                  <ul className="ml-6 mt-2 text-sm">
                    <a href="/landfills" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <ChartNoAxesCombined className="w-[18px]" />
                        {open && (
                          <span className="ml-3">Display Landfills</span>
                        )}
                      </li>
                    </a>
                    <a href="add-landfills" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <DraftingCompass className="w-[18px]" />
                        {open && (
                          <span className="ml-3">Add Landfills</span>
                        )}
                      </li>
                    </a>

                  </ul>
                )}
              </li>
              {/* <a href="/landfills" className="text-sm">
                <li
                  className={`${open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                >
                  <LandPlot className="w-[18px]" />
                  {open && <span className="ml-3">Landfills</span>}
                </li>
              </a> */}

              {/* <a href="/add-data" className="text-sm">
                <li
                  className={`${open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                >
                  <Plus className="w-[18px]" />
                  {open && <span className="ml-3">Add Data</span>}
                </li>
              </a> */}
              <a href="/map" className="text-sm">
                <li
                  className={`${open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                >
                  <MapIcon className="w-[18px]" />
                  {open && <span className="ml-3">Waste Generation Map</span>}
                </li>
              </a>
              <a href="/waste-categories" className="text-sm">
                <li
                  className={`${open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                >
                  <List className="w-[18px]" />
                  {open && <span className="ml-3">Waste Categories</span>}
                </li>
              </a>
              {/* <a href="/anaerobic-design" className="text-sm">
                <li
                  className={`${
                    open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <Frame className="w-[18px]" />
                  {open && <span className="ml-3">Anaerobic Design</span>}
                </li>
              </a> */}
              {/* Expandable Services */}
              <li>
                <div
                  className={`${open
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                  onClick={() => {setIsServicesOpen(!isServicesOpen);
                    setIsServicesOpen1(false)
                  }}
                >
                  <FileStack className="w-[18px]" />
                  {open && (
                    <div className="flex justify-between w-full">
                      <span className="ml-3 text-sm">Designs</span>
                      <ChevronDown className={`"w-[18px]" ${isServicesOpen ? "rotate-180 transition duration-300" : "transition duration-300"}`} />
                    </div>
                  )}
                </div>
                 {!open && isServicesOpen && (
                  <div className=" absolute bg-[#004b23] left-18 w-[200px]  rounded-md top-68 z-10">
                     <ul className="mt-2 text-sm">
                    <a href="/economy-analysis" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <ChartNoAxesCombined className="w-[18px]" />
                        {!open && (
                          <span className="ml-3">Economic Analysis </span>
                        )}
                      </li>
                    </a>
                    <a href="/landfill-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <DraftingCompass className="w-[18px]" />
                        {!open && (
                          <span className="ml-3">Landfill Design</span>
                        )}
                      </li>
                    </a>
                    <a href="/MRF-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <Framer className="w-[18px]" />
                        {!open && <span className="ml-3">MRF Design</span>}
                      </li>
                    </a>
                    <a href="/RDF-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <SquareChartGantt className="w-[18px]" />
                        {!open && <span className="ml-3">RDF Design</span>}
                      </li>
                    </a>
                    <a href="/anaerobic-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <Frame className="w-[18px]" />
                        {!open && <span className="ml-3">Anaerobic Design</span>}
                      </li>
                    </a>
                  </ul>
                  </div>
                )}
                {open && isServicesOpen && (
                  <ul className="ml-6 mt-2 text-sm">
                    <a href="/economy-analysis" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <ChartNoAxesCombined className="w-[18px]" />
                        {open && (
                          <span className="ml-3">Economic Analysis </span>
                        )}
                      </li>
                    </a>
                    <a href="/landfill-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <DraftingCompass className="w-[18px]" />
                        {open && (
                          <span className="ml-3">Landfill Design</span>
                        )}
                      </li>
                    </a>
                    <a href="/MRF-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <Framer className="w-[18px]" />
                        {open && <span className="ml-3">MRF Design</span>}
                      </li>
                    </a>
                    <a href="/RDF-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <SquareChartGantt className="w-[18px]" />
                        {open && <span className="ml-3">RDF Design</span>}
                      </li>
                    </a>
                    <a href="/anaerobic-design" className="text-sm">
                      <li
                        className={`flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full my-0.5`}
                      >
                        <Frame className="w-[18px]" />
                        {open && <span className="ml-3">Anaerobic Design</span>}
                      </li>
                    </a>
                  </ul>
                )}
              </li>

            </ul>
            {/* <div className="">
              {open && (
                <h2 className="text-xs text-white pl-5 pt-3">About Us</h2>
              )}
              {!open && (
                <span className="h-[0.5px] w-full bg-gray-200 flex"></span>
              )}
              <ul className="px-4 text-[15px] pt-3">
                <a href="#" className="text-sm">
                  <li
                    className={`${open
                        ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                        : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                      }`}
                  >
                    <Codepen className="w-[18px]" />
                    {open && <span className="ml-3">About</span>}
                  </li>
                </a>
                <a href="#" className="text-sm">
                  <li
                    className={`${open
                        ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                        : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                      }`}
                  >
                    <Crop className="w-[18px]" />
                    {open && <span className="ml-3">Contact</span>}
                  </li>
                </a>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;