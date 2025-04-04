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
} from "lucide-react";

type UserData = {
  email?: string;
  displayName?: string;
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
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
        className={`bg-gray-800 text-white h-screen transition-all flex flex-col justify-between duration-300 ${
          isOpen ? "w-[300px] p-5" : "w-16 p-2"
        } relative`}
      >
        <div>
          <div className="flex items-center pb-5 pt-1 justify-between">
            {!isOpen && (
              <button
                onMouseEnter={() => setIsOpen(true)}
                onClick={() => (location.href = "/")}
                className="w-full flex justify-center pt-1.5"
              >
                <img src="./H2.png" alt="" className="w-8" />
              </button>
            )}
            {isOpen && (
              <a href="/" className="">
                <h1 className="flex items-center gap-2 pl-4">
                  <img src="./H2.png" alt="" className="w-8" />

                  <span className="text-3xl tracking-[.25em] font-light">
                    HIWMA
                  </span>
                </h1>
              </a>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`absolute right-4 top-8 flex items-center cursor-pointer ${
                !isOpen ? "opacity-0" : " opacity-100"
              }`}
            >
              <LogIn size={24} style={{ transform: "rotate(180deg)" }} />
            </button>
          </div>
          <div className=" h-[calc(100vh-85px)] overflow-y-auto pb-5">
            <ul className={`pt-6 ${isOpen ? "p-2" : "p-3"}`}>
              <a href="/" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1 px-2 rounded w-full"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <Home className="w-[18px]" />
                  {isOpen && <span className="ml-3">Home</span>}
                </li>
              </a>
              <a href="/home" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <LayoutDashboard className="w-[18px]" />
                  {isOpen && <span className="ml-3">Dashboard</span>}
                </li>
              </a>
              <a href="/landfill-design" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <DraftingCompass className="w-[18px]" />
                  {isOpen && <span className="ml-3">Landfill Design</span>}
                </li>
              </a>
              <a href="/landfills" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <LandPlot className="w-[18px]" />
                  {isOpen && <span className="ml-3">Landfills</span>}
                </li>
              </a>
             
              <a href="/MRF-design" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <Framer className="w-[18px]" />
                  {isOpen && <span className="ml-3">MRF Design</span>}
                </li>
              </a>
              <a href="/RDF-design" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <SquareChartGantt className="w-[18px]" />
                  {isOpen && <span className="ml-3">RDF Design</span>}
                </li>
              </a>
              <a href="/anaerobic-design" className="text-sm">
                <li
                  className={`${
                    isOpen
                      ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                      : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                  }`}
                >
                  <Frame className="w-[18px]" />
                  {isOpen && <span className="ml-3">Anaerobic Desgin</span>}
                </li>
              </a>
              {/* Expandable Services */}
              {/* <li>
            <div
              className={`${isOpen ? "text-sm flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1" : "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15"}`}
            >
              <Wrench  className="w-[18px]"  />
              {isOpen && <span className="ml-3">Services</span>}
            </div>
            {isOpen && isServicesOpen && (
              <ul className="ml-6 mt-2">
                <li className="cursor-pointer hover:text-gray-300">
                  Web Development
                </li>
                <li className="cursor-pointer hover:text-gray-300">
                  SEO Optimization
                </li>
                <li className="cursor-pointer hover:text-gray-300">
                  Marketing
                </li>
              </ul>
            )}
          </li> */}
            </ul>
            <div className="">
              {isOpen && (
                <h2 className="text-xs text-white pl-5 pt-3">About Us</h2>
              )}
              {!isOpen && (
                <span className="h-[0.5px] w-full bg-gray-200 flex"></span>
              )}
              <ul className="px-4 text-[15px] pt-3">
                <a href="#" className="text-sm">
                  <li
                    className={`${
                      isOpen
                        ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                        : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                  >
                    <Codepen className="w-[18px]" />
                    {isOpen && <span className="ml-3">About</span>}
                  </li>
                </a>
                <a href="#" className="text-sm">
                  <li
                    className={`${
                      isOpen
                        ? "flex items-center mb-3 cursor-pointer hover:bg-gray-400/15 py-1.5 px-2 rounded w-full my-1"
                        : "flex items-center mb-3 cursor-pointer hover:text-gray-400"
                    }`}
                  >
                    <Crop className="w-[18px]" />
                    {isOpen && <span className="ml-3">Contact</span>}
                  </li>
                </a>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
