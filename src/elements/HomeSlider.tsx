// import React from "react";
// import Slider from "react-slick";

// function HomeService() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     // autoplay: true,
//     speed: 10,
//     autoplaySpeed: 100,
//     cssEase: "linear"
//   };

//   const items = ["Waste not collected properly in many areas", "No segregation at source (everything dumped together)", "Open dumping, overfilled landfills", "No use of simulation tools or analytics", "Fragmented national and city-level strategies"]; // You can replace this with dynamic content

//   return (
//     <div className="slider-container h-30">
//       <Slider {...settings}>
//         {items.map((item, index) => (
//           <div key={index} className="w-6 h-4 bg-gray-200 rounded-md p-4">
//             <h3>{item}</h3>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }

// export default HomeService;


// import { Swiper, SwiperSlide } from 'swiper/react';

// // Import Swiper styles
// import 'swiper/css';

import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { ChartLine, Layers, Mountain, Network, Truck } from 'lucide-react';

export default function HomeService() {
    const items = [
        {
            heading: "Unified Platform",
            title: "Provide a one-stop, computer-aided platform to manage and optimize waste systems efficiently.",
        },
        {
            heading: "Full Coverage",
            title: "Support all waste types: solid, liquid, domestic, commercial, and medical waste streams.",
        },
        {
            heading: "Circular Economy",
            title: "Promote sustainability through Refuse, Reuse, Recycle, and Waste-to-Energy approaches.",
        },
        {
            heading: "Integrated Approach",
            title: "Combine technical, social, and policy elements into a single waste management model.",
        },
        {
            heading: "Smart Decisions",
            title: "Help policymakers simulate and select effective waste strategies using data-driven tools.",
        }
    ];

    return (
        <div className='h-full w-full flex justify-center items-center bg-[#1c4b41]'>

            <Swiper
                spaceBetween={50}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                // pagination={{
                //     clickable: true,
                // }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 50,
                    },
                }}
                // navigation={true}
                modules={[Autoplay]}
                className="mySwiper h-full w-full"
            >
                {items.map((item, index) => (
                    <SwiperSlide key={index} className="h-[350px_!important] w-[400px_!important] ">
                        <div className="flex justify-center items-center  h-full w-full">
                            <div className="h-[200px_!important] w-[400px_!important] bg-[#69b31d] p-8 gap-5 flex flex-col items-center">
                                <h1 className='text-2xl text-white  font-[600] text-left w-full'>{item.heading}</h1>
                                <h1 className='text-[17px] font-light text-left text-[#ffffffa6]'>{item.title}</h1>
                                {/* <div className=' absolute top-[-20px] right-[-20px] w-14 h-14 bg-[#1a7431] rounded-full flex justify-center items-center'>{item.btn}</div> */}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

        </div>

    );
}