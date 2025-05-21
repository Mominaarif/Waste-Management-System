// import React from 'react'
// import Header from '@/components/Header'
// import ForecastPage from '@/components/ForecastPage'

// export default function ForecastPage1({open, setOpen}:any) {
//       const title = "Waste Management Dashboard"

//   return (
//     <div className="w-full">
//         <Header setOpen={setOpen} open={open} title={title}/>
//         <ForecastPage open={open} />
//     </div>
//   )
// }


import CarbonFootprint from '@/components/Heatmap'
import Header from '@/components/Header'
import Home from '@/components/Home'
import React from 'react'

function HeatPage({open, setOpen}:any) {
  const title = "Carbon Footprint Calculator"
  return (
    <div className="w-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <CarbonFootprint open={open} />
    </div>
  )
}

export default HeatPage