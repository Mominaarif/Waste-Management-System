import Header from '@/components/Header'
import Home from '@/components/Home'
import React from 'react'

function HomPage({open, setOpen}:any) {
  const title = "Waste Management Dashboard"
  return (
    <div className="w-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <Home />
    </div>
  )
}

export default HomPage