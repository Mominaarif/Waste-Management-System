import AddData from '@/components/AddData'
import Header from '@/components/Header'

function AddDataPage({open, setOpen}:any) {
  const title = "Add Data"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <AddData open={open} />
    </div>
  )
}

export default AddDataPage