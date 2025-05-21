import Header from "@/components/Header";
import AddLandfills from "@/components/AddLandfills";

function AddLandfillsPage({ open, setOpen }: any) {
  const title = "Add Landfills";

  return (
    <div className="w-full">
      <Header setOpen={setOpen} open={open} title={title} />
      <AddLandfills />
    </div>
  );
}

export default AddLandfillsPage;
