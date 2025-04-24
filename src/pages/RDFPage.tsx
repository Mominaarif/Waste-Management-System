import React from 'react'
import Header from '@/components/Header'
import RDF from '@/components/RDF'

function RDFPage({open, setOpen}:any) {
    const title = "REFUSE DERIVED FUEL (RDF) PLANT Design"
  return (
    <div className="w-full"> 
      <Header setOpen={setOpen} open={open} title={title}/>
      <RDF />
      </div>
  )
}

export default RDFPage