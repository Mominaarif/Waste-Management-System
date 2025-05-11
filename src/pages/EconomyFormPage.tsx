import React from 'react'
import Header from '@/components/Header'
import EconomyForm from '@/components/EconomyForm'
export default function EconomyFormPage({open, setOpen}:any) {
   const title = "Economic Analysis"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <EconomyForm open={open} />
    </div>
  )
}
