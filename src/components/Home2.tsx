// "use client";
// import { Button } from "./ui/button";
// import { Component } from "../elements/PieChart";
// // import { App } from "./elements/BarChart";
// import { ComponentBarChart } from "../elements/BarChart";
// import { ComponentBarChart1 } from "../elements/BarChart1";
// import ComponentPieChart1 from "../elements/PieChart1";
// import { ComponentBarChart2 } from "../elements/BarChart2";
// import ComponentPieChart2 from "../elements/PieChart2";
// import Example from "./SidebarMobile";



// function Home2() {
//   return (
//     <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white w-full pt-5">
//       {/* <h1 className="text-lg md:text-3xl pl-5 md:pl-14 bg-white  shadow-md py-4 font-bold mb-5">
//         Waste Management Dashboard
//       </h1> */}
//       <div className="">
//         <div className="px-5 md:px-8 ">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
//             {/* <App /> */}
//             <ComponentBarChart />
//             <ComponentBarChart1 />
//             <Component />
//             <ComponentPieChart1 />
//             <ComponentBarChart2 />
//             <ComponentPieChart2 />
//             {/* <ComponentPieChart2 /> */}
//           </div>
//         </div>
//         <div className="bg-white w-full pt-2">
//           <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home2;










import { ChartLine, Layers, Mountain, Network, Truck, Target, AlertTriangle } from 'lucide-react';
import HomeService from "@/elements/HomeSlider";
import 'animate.css';
import FadeIn from '@/elements/FadeIn';

export default function Home2(open: any) {
  const steps = [
    {
      title: "Select Your Area",
      description: "📍 Choose your city, region, or locality using an interactive map interface.",
      image: "/images/map.png",
    },
    {
      title: "Add Your Data",
      description: "📂 Upload your own datasets or choose from preloaded defaults.",
      image: "/images/laptop.png",
    },
    {
      title: "Categorize Waste",
      description: "♻️ Classify waste into types: Biodegradables, Combustibles, Recyclables.",
      image: "/images/waste-bins.png",
    },
    {
      title: "Sustainability Analysis",
      description: `📊 Conduct a comprehensive sustainability evaluation for your waste management system.
`,
      image: "/images/plants.jpg",
    },
    {
      title: "Get Proposed Scenario",
      description: "🌿 Generate optimized waste management pathways tailored to your inputs.",
      image: "/images/leaves.png",
    },



  ];

  const aim = [
    { title: "Waste not collected properly, very low door to door collection", btn:"🗑️"  },
    { title: "No segregation at source", btn: "♻️" },
    { title: "Fragmented strategies", btn: "🏛️" },
    { title: "Open dumping & overflowing landfills", btn: "🏞️" },
    { title: "No simulation tools/analytics", btn: "📊" }
  ];
  console.log(open)
  return (
    <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white">
      <FadeIn animation="animate__backInLeft" delayClass="animate__delay-0s">
        <div className="md:flex md:flex-row-reverse hidden bg-white w-full h-[550px] ">
          <div className="h-full w-1/2">
            <img src="/images/hero.png" alt="" className="h-full w-full object-cover object-center" />
          </div>
          <div className="w-1/2 h-full justify-around flex items-center flex-col font-['Poppins']">
            <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-0s">
              <div className=" h-full justify-around w-full flex items-center flex-col font-['Poppins']">
                <div className=" gap-5 flex flex-col  h-full justify-center pl-16 w-full">
                  <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-1s">

                    <h1 className="text-2xl font-bold md:text-[52px] w-5/6 "><u className='text-[#526c55]'>Sustainable</u> Waste Solutions for Clean Cities</h1>
                  </FadeIn>
                  {/* <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s">
                    <h1 className="text-2xl font-bold  md:text-4xl pl-16 flex ">
                      <span className="">to </span>
                      <span className="text-[#526c55] w-full flex pl-2">Manage Waste</span>
                    </h1>
                  </FadeIn> */}
                  <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s">
                    <p className=" text-xl md:text-2xl w-full text-left font-light">An integrated tool to simulate and analyze waste management strategies in Pakistan</p>
                  </FadeIn>
                  <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s">
                    <div className=" flex w-full justify-start items-center text-base">
                      <p className="bg-white text-[#526c55] w-fit p-2 px-6 border-3 border-[#526c55] rounded-md text-center cursor-pointer font-semibold">Get Started</p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <div className="md:hidden flex bg-[url('/images/hero.png')] bg-white w-full h-[450px] bg-cover bg-no-repeat bg-center relative">
          <div className="absolute h-full bg-white/60 w-full h-full flex items-center justify-center w-full flex items-center flex-col font-['Poppins']">
            <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-0s">
              <div className=" h-full justify-around w-full flex items-center flex-col font-['Poppins']">
                <div className=" gap-5 flex flex-col  h-full justify-center  px-5 w-full">
                  <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-1s">
{/* Sustainable Waste Management Solutions for Cleaner Cities */}
                    <h1 className="text-3xl font-bold md:text-6xl w-full md:text-left text-center"><u className='text-[#526c55]'>Sustainable</u> Waste Solutions for Clean Cities</h1>
                  </FadeIn>
                  {/* <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s">
                    <h1 className="text-3xl font-bold md:text-left text-center md:text-6x md:w-fit w-full justify-center items-center flex ">
                      <span className="">to </span>
                      <span className="text-[#526c55] md:text-left text-center flex pl-2">Manage Waste</span>
                    </h1>
                  </FadeIn> */}
                  <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s">
                    <p className=" text-xl md:text-2xl w-full md:text-left text-center font-light">An integrated tool to simulate and analyze waste management strategies in Pakistan</p>
                  </FadeIn>
                  <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s">
                    <div className=" flex w-full justify-center items-center text-base">
                      <p className="bg-transparent text-[#526c55] w-fit p-2 px-6 border-3 border-[#526c55] rounded-md text-center cursor-pointer font-semibold">Get Started</p>
                    </div>
                  </FadeIn>
                </div>
              </div>
            </FadeIn></div>
        </div>
      </FadeIn>

      {/* <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-2s"> */}
      <div className="bg-[#386641] ">
        <h1 className="pl-8 pt-12 text-3xl text-[white_!important] font-light">Our Aim</h1>
        <div className={`px-5 md:h-[350px] h-[300px] ${open ? "md:w-[90vw_!important] w-full" : "md:w-[90vw_!important] w-full"}`}>
          <HomeService />
        </div>
      </div>
      {/* </FadeIn> */}

      {/* <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-0s"> */}
      <div className=" md:h-[550px] h-[430px] bg-[#A7C957]/50 w-full md:py-8 py-4">
        <div className="flex rounded-md shadow-lg md:m-12 m-5 mt-0 md:mt-0 h-full">
          <img src="https://img.freepik.com/premium-photo/isometric-3d-views-recycling-facilities-overview-sustainable-waste-management-solutions-ai_721440-16861.jpg?w=1380" alt="" className="md:flex hidden h-full w-1/2 object-cover object-center rounded-tl-md rounded-bl-md" />

          <div className="md:w-1/2 w-full h-full">
            <div className="flex flex-col justify-center h-full bg-white md:rounded-r-md rounded-md ">
              <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-0s">
                <h1 className="pl-5 py-5 md:pt-8 pt-4 md:text-4xl text-2xl font-light">Waste Management Problems</h1>
              </FadeIn>
              <ul className="px-5 text-base leading-6 md:pt-5 pt-1">
                {aim.map((i, id) => (
                  <FadeIn animation="animate__fadeInUp" delayClass={`animate__delay-${id}s`}>
                    <div className=" flex gap-5">
                      <div className="w-fit h-fit flex justify-center items-center">
                        {i.btn}
                      </div>
                      <li key={id} className="h-[58px] md:text-lg text-base">{i.title}</li>
                    </div>
                  </FadeIn>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
      {/* </FadeIn> */}

      {/* <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-1s"> */}
      <div className="bg-white">
        <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-0s">
          <h2 className=" text-3xl md:text-5xl w-full text-center font-light mb-6 pt-16">Sustainable Waste Management Workflow</h2>
          <div className="pb-12 flex justify-center md:text-xl text-base text-center">
            <h1 className="mt-4 md:w-1/2 w-4/5 md:px-0 px-5">Empowering cities with actionable insights to minimize landfill waste and
              transition to circular waste systems.</h1>
          </div>
        </FadeIn>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-14 justify-center items-center px-[48px] h-full w-full pb-12">
          {steps.map((item, index) => (
            <FadeIn animation="animate__fadeInUp" delayClass={`animate__delay-${index > 2 ? index - 2 : index}s`}>
              <div className='relative' key={index}>


                <div className='absolute top-[-20px] left-[-20px]  w-20 h-20 bg-[#386641] text-white font-bold rounded-full flex justify-center items-center'>Step {index + 1}</div>
                <li className=" bg-[#A7C957] md:h-[350px] h-fit md:p-8 p-5 gap-5 flex flex-col items-center">
                  <img src={item.image} alt="" className="w-36 h-[100px] object-cover object-center rounded-md" />
                  <h1 className='md:text- text-xl text-[#004b23]  font-[600] text-center w-full'>{item.title}</h1>
                  <h1 className='md:text-[17px] text-sm font-light text-center text-[#004b23]'>{item.description}</h1>
                  {/* <div className=' absolute top-[-20px] right-[-20px] w-14 h-14 bg-[#1a7431] rounded-full flex justify-center items-center'>{item.btn}</div> */}
                </li>

              </div>
            </FadeIn>
          ))}

          <FadeIn animation="animate__fadeInUp" delayClass="animate__delay-3s">
            <div className="relative flex justify-center items-center w-full">
              <button className="border-[#386641] border-2 text-[#386641] font-semibold px-6 py-3 bg-white rounded-md flex items-center gap-2">
                Generate My Sustainable Waste Plan
              </button>
            </div>
          </FadeIn>
        </ul>

      </div>
      {/* </FadeIn> */}
      {/* <div className='hidden'>
        <div className=" bg-[url('/homeic.png')] bg-white w-full h-[450px] bg-cover bg-no-repeat bg-center relative">
          <div className="absolute top-[180px]  w-full flex items-center flex-col font-['Poppins']">
            <h1 className=" text-3xl font-bold text-white md:text-4xl w-full text-center">A Smarter Way to Manage Waste</h1>
            <p className="text-xl md:text-2xl text-white w-1/2 text-center font-light">An integrated tool to simulate and analyze waste management strategies in Pakistan</p>
            <p className="bg-white text-purple-600 w-fit p-2 px-6 border-2 border-white rounded-md text-center mt-5 cursor-pointer font-semibold">Get Started</p>
          </div>
        </div>
        <div className=" h-[450px] bg-[#E5E6FF] w-full pt-8 pb-8">
          <div className="rounded-md shadow-lg m-8 mt-0 h-full">
            <div className="flex h-full">
              <div className="w-1/2  h-full bg-white rounded-l-md">
                <h1 className="pl-8 pt-5 text-2xl font-semibold">Waste Management Problems</h1>
                <ul className="list-disc pl-12 text-lg leading-4 pt-6 w-[80%]">
                  <li className="h-[58px]">Waste not collected properly in many areas</li>
                  <li className="h-[58px]">No segregation at source (everything dumped together)</li>
                  <li className="h-[58px]">Open dumping, overfilled landfills</li>
                  <li className="h-[58px]">No use of simulation tools or analytics</li>
                  <li className="h-[58px]">Fragmented national and city-level strategies</li>
                </ul>
              </div>

              <div className="w-1/2  h-full bg-[#D7CBFF] rounded-r-md">
                <h1 className="pl-8 pt-5 text-2xl font-semibold">Our Aim</h1>
                <ul className="list-disc pl-12 text-lg leading-6 pt-5 w-[80%]">
                  <li className="h-[58px]">Provide a one-stop, computer-aided tool for managing waste</li>
                  <li className="h-[58px]">Cover all waste types: solid, liquid, domestic, commercial, medical</li>
                  <li className="h-[58px]">Promote circular economy: Refuse, Reuse, Recycle, Waste-to-Energy</li>
                  <li className="h-[58px]">Integrate technical, social, and policy elements into one model</li>
                  <li className="h-[58px]">Help policymakers simulate and choose better waste strategies</li>
                </ul>
              </div>
            </div>

          </div>
        </div>
        <div className="bg-white px-8 ">
          <div className="px-5 md:px-8 py-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">How to get started</h2>



            <div className="flex gap-16 justify-between">
              <div className="flex flex-col gap-9 gap-y-20 w-full items-end">
                {steps.slice(0, 3).map((step, index) => (
                  <div key={index} className="relative bg-white p-4 rounded-xl border-purple-600 border-2 flex gap-4 items-center w-[90%]">
                    <div className="w-[250px]">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-base text-gray-600">{step.description}</p>
                    </div>
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-[260px] h-[210px] object-cover rounded-md"
                    />
                    {index === 0 && (
                      <div className="absolute right-[-97px] top-18.5 w-24 h-24 border-purple-600 border-l-4 border-t-4 bg-transparent rounded-tl-full rotate-90"></div>
                    )}
                    {index === 1 && (
                      <div className="absolute right-[-97px] top-17 w-24 h-24 border-purple-600 border-l-4 border-t-4 bg-transparent rounded-tl-full rotate-90"></div>
                    )}

                  </div>
                ))}

              </div>
              <div className="flex flex-col gap-9 gap-y-18 w-full items-start">
                <div className="mt-4  text-purple-800  w-full flex justify-center text-lg text-center">
                  <strong className="w-[450px]">Empowering cities with actionable insights to minimize landfill waste and
                    transition to circular waste systems.</strong>
                </div>
                {steps.slice(3).map((step, index) => (
                  <div key={index} className="relative bg-white p-4 rounded-xl border-purple-600 border-2 flex gap-4 items-center  w-[90%]">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-[260px] h-[210px] object-cover rounded-md"
                    />
                    <div className="w-[250px]">
                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-base text-gray-600">{step.description}</p>
                    </div>
                    {index === 0 && (
                      <div className="absolute left-[-97px] top-14 w-24 h-24 border-purple-600 border-l-4 border-t-4 bg-transparent rounded-tl-full"></div>
                    )}
                    {index === 1 && (
                      <div className="absolute left-[-97px] top-16 w-24 h-24 border-purple-600 border-l-4 border-t-4 bg-transparent rounded-tl-full"></div>
                    )}

                  </div>
                ))}
                <div className="relative flex justify-center items-center w-full">
                  <div className={`absolute left-[-65px]  ${open ? 'w-[46%]' : 'w-[46%]'} h-1 bg-purple-600`}></div>
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent border-l-purple-600"></div>

                  <button className="border-purple-600 border text-purple-600 font-semibold px-6 py-3 bg-white rounded-md flex items-center gap-2">
                    Make Your Model
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div> */}
    </div>
  )
}
