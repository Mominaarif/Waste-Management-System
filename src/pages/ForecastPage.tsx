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


import Forecast from '@/components/ForecastPage'
import Header from '@/components/Header'
import Home from '@/components/Home'
import React from 'react'

function HomPage({open, setOpen}:any) {
  const title = "Waste Forecasting"
  return (
    <div className="w-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <Forecast open={open} />
    </div>
  )
}

export default HomPage