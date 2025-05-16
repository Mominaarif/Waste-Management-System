import Header from '@/components/Header'
import Home2 from '@/components/Home2'

function HomPage2({open, setOpen}:any) {
  const title = "Waste Management"
  return (
    <div className="w-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <Home2 open={open} />
    </div>
  )
}

export default HomPage2