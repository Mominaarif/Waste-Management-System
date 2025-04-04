import Header from '@/components/Header'
import Home2 from '@/components/Home2'
import React from 'react'

function HomPage2({open, setOpen}:any) {
  const title = "Waste Management Dashboard"
  return (
    <div className="w-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <Home2 />
    </div>
  )
}

export default HomPage2