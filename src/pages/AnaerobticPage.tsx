import AnaerobicDigesterCalculator from "@/components/Anaerobic";
import Header from "@/components/Header";
import React from "react";

function AnaerobticPage({ open, setOpen }: any) {
  const title = "Anaerobic Digester Design Calculator";

  return (
    <div className="w-full">
      {" "}
      <Header setOpen={setOpen} open={open} title={title} />
      <AnaerobicDigesterCalculator />
    </div>
  );
}

export default AnaerobticPage;
