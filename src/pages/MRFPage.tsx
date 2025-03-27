import React from 'react'
import Header from '@/components/Header'
import MRFDesign from '@/components/MRF'

function MRFPage({open, setOpen}:any) {
  const title = " Material Recovery Facility (MRF) Design"

  return (
    <div className="w-full">      
      <Header setOpen={setOpen} open={open} title={title}/>
      <MRFDesign />
    </div>
  )
}

export default MRFPage