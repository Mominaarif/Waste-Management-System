import GeneateMap from '@/components/GeneateMap'
import Header from '@/components/Header'

function GenerateMapPage({open, setOpen}:any) {
  const title = "Waste Generation Map"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <GeneateMap open={open} />
    </div>
  )
}

export default GenerateMapPage