import Header from "@/components/Header";
import Landfill from "@/components/landfill";

function LandfillPage({ open, setOpen }: any) {
  const title = "Landfill Design";

  return (
    <div className="w-full">
      <Header setOpen={setOpen} open={open} title={title} />
      <Landfill />
    </div>
  );
}

export default LandfillPage;
