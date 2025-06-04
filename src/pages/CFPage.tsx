import NextPage from '@/components/CF_calculations'
import Header from '@/components/Header'

function  CFPage({open, setOpen}:any) {
  const title = "Carbon Footprint Calculation";
  return (
    <div className="w-full h-full">
      <Header setOpen={setOpen} open={open} title={title} />
      <NextPage />
    </div>
  );
}

export default  CFPage