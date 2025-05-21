import Header from "@/components/Header";
import Landfills from "@/components/Landfills";

function LandfillsPage({ open, setOpen }: any) {
  const title = "Display Landfills";

  return (
    <div className="w-full">
      <Header setOpen={setOpen} open={open} title={title} />
      <Landfills />
    </div>
  );
}

export default LandfillsPage;
