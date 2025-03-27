"use client";
import { Button } from "./ui/button";
import { Component } from "../elements/PieChart";
// import { App } from "./elements/BarChart";
import { ComponentBarChart } from "../elements/BarChart";
import { ComponentBarChart1 } from "../elements/BarChart1";
import ComponentPieChart1 from "../elements/PieChart1";
import { ComponentBarChart2 } from "../elements/BarChart2";
import ComponentPieChart2 from "../elements/PieChart2";
import Example from "./SidebarMobile";

function Home() {
  return (
    <div className="h-screen bg-white w-full pt-5">
      {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14 bg-white  shadow-md py-4 font-bold mb-5">
        Waste Management Dashboard
      </h1> */}
      <div className="h-[calc(96%-68px)] overflow-y-auto">
        <div className="px-5 md:px-8 ">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
            {/* <App /> */}
            <ComponentBarChart />
            <ComponentBarChart1 />
            <Component />
            <ComponentPieChart1 />
            <ComponentBarChart2 />
            <ComponentPieChart2 />
            {/* <ComponentPieChart2 /> */}
          </div>
        </div>
        <div className="bg-white w-full pt-2">
          <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
