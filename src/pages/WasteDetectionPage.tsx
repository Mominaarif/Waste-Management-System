import App1 from '@/components/FlaskApi'
import Header from '@/components/Header'

function WasteDetectionPage({open, setOpen}:any) {
  const title = "Solid Waste Detection"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <App1 />
    </div>
  )
}

export default WasteDetectionPage