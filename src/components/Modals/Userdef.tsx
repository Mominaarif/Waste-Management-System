import React from "react";


interface SubCategory {
  id: string;
  name: string;
  value: string;
}

interface GeneateMap1Props {
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  fPopulation: string;
  fForecast: string;
  fGrowthRate: string;
  fGenerationRate: string;
  fSubCategories: SubCategory[];
  roundedArea: number | undefined;
  newSubCatName: string;
  setNewSubCatName: React.Dispatch<React.SetStateAction<string>>;
  newSubCatValue: string;
  subCatError: string;  
  fName: string;
  totalSubCatValue: number;
  setNewSubCatValue: React.Dispatch<React.SetStateAction<string>>;
  handleAddSubCategory: () => void;
  // isPolygonDrawn: boolean;

}
const Userdef: React.FC<GeneateMap1Props> = ({
  handleSubmit,
  handleInputChange,
  roundedArea,
  fPopulation,
  fForecast,
  fGrowthRate,
  fGenerationRate,
  fSubCategories,
  newSubCatName,
  setNewSubCatName,
  newSubCatValue,
  setNewSubCatValue,
  handleAddSubCategory,
  subCatError,
  fName,
  totalSubCatValue
}: any) => {


  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box rounded-none h-[100vh] max-w-[100vw] w-[100vw]">
        <div className="pt-4 pb-2 bg-white px-5">
          <h3 className="text-lg font-semibold text-gray-900 w-full text-left pt-5">
            Waste Generation Parameter
          </h3>

          <form
            onSubmit={handleSubmit}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <div className="w-full h-full flex flex-col py-5 gap-5 items-start">
              <div className="w-full h-full grid grid-cols-3 gap-5 items-center justify-center">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <label className="block text-sm font-medium text-gray-900  pb-1 text-left w-full">
                    Area (m²):
                  </label>
                  <input
                    onChange={handleInputChange}
                    value={roundedArea ?? ""}
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div className="w-full h-full flex flex-col items-center justify-center">
                  <label className="block text-sm font-medium text-gray-900  pb-1 text-left w-full">
                    Area Name:
                  </label>
                  <input
                    type="text"
                    name="ucName"
                    value={fName ?? ""}
                    onChange={handleInputChange}
                    required
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>


                <div className="w-full h-full flex flex-col items-center justify-center">
                  <label className="block text-sm font-medium text-gray-900  pb-1 text-left w-full">
                    Population:
                  </label>
                  <input
                    type="number"
                    name="population"
                    value={fPopulation ?? ""}
                    onChange={handleInputChange}
                    required
                    className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-full grid grid-cols-3 gap-5 items-center justify-center">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <label className="block text-sm font-medium text-gray-900  pb-1 text-left w-full">
                  Growth Rate (%):
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  name="growthRate"
                  placeholder="0-100"
                  value={fGrowthRate ?? ""}
                  onChange={handleInputChange}
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="w-full h-full flex flex-col items-center justify-center">
                <label className="block text-sm font-medium text-gray-900  pb-1 text-left w-full">
                  Years To Forecast (years):
                </label>
                <input
                  type="number"
                  name="forecast"
                  placeholder="0-100"
                  min="0"
                  value={fForecast ?? ""}
                  onChange={handleInputChange}
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="w-full h-full flex flex-col items-center justify-center">
                <label className="block text-sm font-medium text-gray-900  pb-1 text-left w-full">
                  Generation Rate (kg/cap/day):
                </label>
                <input
                  type="number"
                  name="generationRate"
                  placeholder="0-100"
                  min="0"
                  value={fGenerationRate ?? ""}
                  onChange={handleInputChange}
                  className="block w-full border rounded-md border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="w-full h-full flex flex-col items-center justify-center pt-5">
              <label className="block text-sm font-medium text-gray-900 pb-1 w-full text-left">
                Waste Composition: <span className="text-red-500">{subCatError}</span>
              </label>
              <div className="w-full grid grid-cols-1 pt-2">
                <div className="grid grid-cols-3 w-full font-[600]">
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Component
                  </p>
                  <p className="block w-full bg-[#F2F2F2] border px-3 py-2  sm:text-sm">
                    Percentage (%)
                  </p>
                  <p></p>
                </div>
                {fSubCategories.map((ss: any) => (
                  <div className="grid grid-cols-3 w-full" key={ss.id}>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.name}
                    </p>
                    <p className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                      {ss.value}
                    </p>
                    <p></p>
                  </div>
                ))}
                <div className="grid grid-cols-3 w-full">
                  <input
                    type="text"
                    placeholder="Component Name"
                    value={newSubCatName ?? ""}
                    name="subCategoryName"
                    onChange={(e) => setNewSubCatName(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="%"
                    max={100}
                    min={0}
                    value={newSubCatValue ?? ""}
                    name="subCategoryValue"
                    onChange={(e) => setNewSubCatValue(e.target.value)}
                    className="block w-full border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                  <div className="flex items-center gap-2">
                    <p
                      onClick={handleAddSubCategory}
                      className="btn btn-primary bg-violet-700 border-0 text-sm/6 font-medium ml-2 text-white"
                    >
                      Add Component
                    </p>
                    <p  className="btn btn-primary bg-violet-700 border-0 text-sm/6 font-medium text-white">Total: {totalSubCatValue}</p>
                  </div>
                </div>
              </div>

              {/* <div className="overflow-x-auto w-full flex flex-col items-start">
                  <div className="mt-4 space-y-2">
                    <table className="table text-left w-[70vw_!important] ">
                      <thead>
                        <tr className="text-left">
                          <th
                            className="w-[10%_!important]"
                            style={{ textAlign: "left" }}
                          ></th>
                          <th
                            className="w-[35%_!important] text-left"
                            style={{ textAlign: "left" }}
                          >
                            Component
                          </th>
                          <th
                            className="w-[35%_!important] text-left"
                            style={{ textAlign: "left" }}
                          >
                            Percentage(%)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.subCategories.map((ss, id) => (
                          <tr className="" key={ss.id}>
                            <th style={{ textAlign: "left" }}>{id + 1}</th>
                            <td style={{ textAlign: "left" }}>{ss.name}</td>
                            <td
                              className="p-[0_!important]"
                              style={{ textAlign: "left" }}
                            >
                              <input
                                type="number"
                                min="0"
                                max="100"
                                placeholder="kg/day"
                                value={
                                  newSubCatValue ? newSubCatValue : ss.value
                                }
                                onChange={(e) =>
                                  setNewSubCatValue(e.target.value)
                                }
                                className="block w-full h-[38px_!important] text-gray-900 text-sm pl-2"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div> */}
            </div>

            <div className="flex w-full justify-end">
              <p
                 onClick={() => {
                  const modal = document.getElementById(
                    "my_modal_3"
                  ) as HTMLDialogElement | null;
                  if (modal) {
                    modal.close();
                  }
                }}
                className=" bg-violet-700 cursor-pointer text-white px-8 py-2 mt-5 text-sm rounded-md shadow-md hover:bg-violet-600"
              >
                Save
              </p> 
            </div>
          </form>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default Userdef;
