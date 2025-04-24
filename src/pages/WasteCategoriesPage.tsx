import Header from '@/components/Header'
import WasteCategories from '@/components/WasteCategories'

function WasteCategoriesPage({open, setOpen}:any) {
  const title = "Waste Categorization"
  return (
    <div className="w-full h-full">
        <Header setOpen={setOpen} open={open} title={title}/>
        <WasteCategories open={open} />
    </div>
  )
}

export default WasteCategoriesPage