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
import FadeIn from './FadeIn';

export default function HomeService() {
    const items  = [
  <>
    To develop an <strong>integrated digital simulator</strong> for sustainability planning
  </>,
  <>
    To enable accurate <strong>carbon footprint assessment</strong> for projects and policies
  </>,
  <>
    To support <strong>social and economic impact</strong> analysis for holistic decision-making
  </>,
  <>
    To facilitate <strong>preliminary design</strong> modeling for sustainable infrastructure
  </>,
  <>
    To provide <strong>waste generation mapping</strong> for informed waste management strategies
  </>,
  <>
    To empower <strong>cities and stakeholders</strong> in designing cleaner, smarter, and resilient urban environments
  </>,
];


    return (
        <div className='h-full w-full flex justify-center items-center bg-[#386641]'>

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
                    // 640: {
                    //     slidesPerView: 2,
                    //     spaceBetween: 10,
                    // },
                    768:{
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    },
                }}
                // navigation={true}
                modules={[Autoplay]}
                className="mySwiper h-full w-full"
            >
                {items.map((item, index) => (
                          <FadeIn animation="animate__backInRight" delayClass="animate__delay-0s">

                    <SwiperSlide key={index} className="md:h-[350px_!important] h-[300px_!important] md:w-[400px_!important] w-[100%_!important]">
                        <div className="flex justify-center items-center  h-full w-full">
                            <div className="h-[200px_!important] w-[100%_!important] md:w-[400px_!important] bg-[#A7C957] p-8 gap-5 flex flex-col justify-center items-center">
                                {/* <h1 className='text-2xl text-white  font-[600] text-left w-full'>{item.heading}</h1> */}
                                <h1 className='text-[17px] text-left text-white'>{item}</h1>
                                {/* <div className=' absolute top-[-20px] right-[-20px] w-14 h-14 bg-[#1a7431] rounded-full flex justify-center items-center'>{item.btn}</div> */}
                            </div>
                        </div>
                    </SwiperSlide>
                    </FadeIn>
                ))}
            </Swiper>

        </div>

    );
}