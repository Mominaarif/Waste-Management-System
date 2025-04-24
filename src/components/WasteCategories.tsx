import { X } from "lucide-react";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, User } from "firebase/auth";
import GeneateMap1 from "./Map1";
import Userdef from "./Modals/Userdef";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    initMap?: () => void;
  }
}

interface SubCategory {
  id: string;
  name: string;
  value: string;
}

interface MainCategory {
  id: string;
  name: string;
  isDone: boolean;
}

// interface WasteCategory {
//   checked: boolean;
//   subcategories: {
//     [key: string]: Subcategory;
//   };
// }

interface FormData {
  ucName: string;
  population: string;
  households: string;
  incomeGroup: string;
  growthRate: string;
  forecast: string;
  generationRate: string;
  area: string;
  //   wasteCategories: {
  mainCategories: MainCategory[];
  subCategories: SubCategory[];
  selectedSubcategories: Array<{
    mainCategoryId: string;
    subCategoryId: string;
    subCategory: SubCategory;
  }>;
  selectedOtherSubcategories: string[];
}

const containerStyle = {
  width: "calc(100% + (350px))",
  height: "60vh",
  top: "0",
  left: "-180px",
  // border: "2px solid #73AD21",
  zIndex: 1,
  boxSizing: "border-box",
};

const paragraphStyle = {
  fontFamily: "Open Sans",
  margin: 0,
  fontSize: 13,
};

const formLabelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 15px 0",
  display: "inline-block",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box",
};

const selectStyle = {
  width: "100%",
  padding: "8px",
  margin: "5px 0 15px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const checkboxStyle = {
  marginRight: "10px",
};

const submitButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "10px 15px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  width: "100%",
  fontSize: "16px",
};

export default function WasteCategories(open: any) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  );


  const location = useLocation();
  const formData1 = location.state;
  const [dataOption, setDataOption] = useState<number | undefined>();

  const [formData, setFormData] = useState<FormData>({
    ucName: "",
    households: "",
    incomeGroup: "",
    population: "",
    growthRate: "",
    forecast: "",
    generationRate: "",
    area: "",
    mainCategories: [
      { id: "biodegradables", name: "Biodegradables", isDone: false },
      { id: "combustibles", name: "Combustibles", isDone: false },
      { id: "recyclables", name: "Recyclables", isDone: false },
      { id: "residues", name: "Residues", isDone: false },
    ],
    subCategories: [],
    selectedSubcategories: [],
    selectedOtherSubcategories: [],
  });

  const getRemainingSubcategories = () => {
    const allSelected = [
      ...formData.selectedSubcategories,
      ...formData.selectedOtherSubcategories.map((id) => ({
        subCategoryId: id,
      })),
    ];
    const selectedIds = new Set(allSelected.map((item) => item.subCategoryId));
    return formData.subCategories.filter((sc) => !selectedIds.has(sc.id));
  };

  const firstThreeDone = formData.mainCategories
    .slice(0, 3)
    .every((mc:any) => mc.isDone);

  const handleCompleteCategory = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      mainCategories: prev.mainCategories.map((mc) =>
        mc.id === categoryId ? { ...mc, isDone: true } : mc
      ),
    }));
  };

  const handleDataOptionChange = () => {
    const selectedOption = (document.querySelector(
      'input[name="dataDef"]:checked'
    ) as HTMLInputElement).value;
    setDataOption(Number(selectedOption));
  };


  useEffect(() => {
    if (firstThreeDone) {
      const remaining = getRemainingSubcategories();
      setFormData((prev:any) => {
        const newIds = remaining
          .map((sub:any) => sub.id)
          .filter((id:any) => !prev.selectedOtherSubcategories.includes(id));

        return {
          ...prev,
          selectedOtherSubcategories: [
            ...prev.selectedOtherSubcategories,
            ...newIds,
          ],
        };
      });
    }
  }, [firstThreeDone]);

  const [newSubCatName, setNewSubCatName] = useState("");
  const [newSubCatValue, setNewSubCatValue] = useState("");
  const [subCatError, setSubCatError] = useState("");

  const handleAddSubCategory = () => {
    if (newSubCatName.trim() === "" || newSubCatValue.trim() === "") return;

    const newSubCategory = {
      id: `s${formData.subCategories.length + 1}`,
      name: newSubCatName.trim(),
      value: newSubCatValue.trim(),
    };

    setFormData((prev) => ({
      ...prev,
      subCategories: [...prev.subCategories, newSubCategory],
    }));

    // Clear inputs
    setNewSubCatName("");
    setNewSubCatValue("");
  };

  const isSubCategoryTotalValid = () => {
    const total = formData.subCategories.reduce((sum, sub) => {
      const num = parseFloat(sub.value);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

    return total === 100;
  };

  console.log(formData1.subCategories);
  return (
    <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white pt-10 px-5 md:px-8">
      <div className="border p-8 rounded-md">
          <div className="w-full h-full flex flex-col py-5 gap-5 items-start">  
            <button
            onClick={() => {
              const modal = document.getElementById(
                "my_modal_1"
              ) as HTMLDialogElement | null;
              if (modal) {
                modal.showModal();
              }
            }}
            className="bg-violet-700 text-sm not-last:cursor-pointer w-fit text-white px-8 py-2 mt-1 rounded-md shadow-xs hover:bg-violet-600"
          >
            Select The Area
          </button>  
            <div className="flex flex-col gap-1 items-start">  
              <p className="text-sm font-bold text-gray-900  pb-1 text-left w-full">
              Choose Data Source:
            </p>  
              <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="defaultDef"
                    name="dataDef"
                    type="radio"
                    value={0}
                    onChange={handleDataOptionChange}
                    aria-describedby="defaultDef-description"
                    className="radio radio-xs radio-info border"
                  />
                </div>
              </div>
              <div className="text-sm/6">
                <label
                  htmlFor="defaultDef"
                  className="font-medium text-gray-900"
                >
                  Default Data
                </label>
              </div>
            </div>  

              <div className="flex gap-3">
              <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                  <input
                    id="userDef"
                    name="dataDef"
                    type="radio"
                    value={1}
                    onChange={handleDataOptionChange}
                    aria-describedby="defaultDef-description"
                    className="radio radio-xs radio-info border"
                  />
                </div>
              </div>
              <div className="text-sm/6">
                <label htmlFor="userDef" className="font-medium text-gray-900">
                  User Define Data
                </label>
              </div>
            </div>  
            </div>  
          </div>  
        {formData1.subCategories.length > 0 && (
          <div className="">
            <p className="text-sm font-bold text-gray-900  pb-1 text-left w-full mb-3">
              Main Categories:
            </p>

            <div className="grid grid-cols-2 gap-5">
              {formData1.mainCategories.slice(0, 3).map((category:any) => (
                <div key={category.id} className="border">
                  <div className="flex justify-between items-center bg-violet-700 text-white border-b px-5 py-3">
                    <h2 className="text-sm font-medium text-left w-full">
                      {category.name}
                    </h2>
                    {!category.isDone && (
                      <button
                        onClick={() => handleCompleteCategory(category.id)}
                        className="underline text-sm cursor-pointer w-fit"
                      >
                        Done
                      </button>
                    )}
                  </div>

                  {!category.isDone ? (
                    <div className="space-y-2">
                      <div className=" flex flex-col">
                        {formData1.selectedSubcategories
                          .filter((ss:any) => ss.mainCategoryId === category.id)
                          .map((ss:any) => {
                            const sub = formData.subCategories.find(
                              (sc) => sc.id === ss.subCategoryId
                            );
                            return sub ? (
                              <div
                                key={sub.id}
                                className="text-sm flex justify-between items-center border-b px-5 py-2"
                              >
                                {sub.name}
                                <button
                                  className="text-xs text-red-500 w-[33px]"
                                  onClick={() =>
                                    setTimeout(() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        selectedSubcategories: prev.selectedSubcategories.filter(
                                          (s) => s.subCategoryId !== sub.id
                                        ),
                                      }));
                                    }, 500)
                                  }
                                >
                                  ✕
                                </button>
                              </div>
                            ) : null;
                          })}
                      </div>

                      <select
                        className="w-[calc(100%-20px)] text-sm px-5 py-2"
                        onChange={(e) => {
                          const subId = e.target.value;
                          const sub = formData1.subCategories.find(
                            (s:any) => s.id === subId
                          );
                          if (sub) {
                            setTimeout(() => {
                              setFormData((prev) => ({
                                ...prev,
                                selectedSubcategories: [
                                  ...prev.selectedSubcategories,
                                  {
                                    mainCategoryId: category.id,
                                    subCategoryId: sub.id,
                                    subCategory: sub,
                                  },
                                ],
                              }));
                            }, 500);
                          }
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Select subcategory
                        </option>
                        {formData1.subCategories
                          .filter(
                            (sc:any) =>
                              !formData.selectedSubcategories.some(
                                (ss) => ss.subCategoryId === sc.id
                              )
                          )
                          .map((sub:any) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                      </select>

                        <div className="mt-2 flex flex-wrap gap-2">
                      {formData.selectedSubcategories
                        .filter((ss) => ss.mainCategoryId === category.id)
                        .map((ss) => {
                          const sub = formData.subCategories.find(
                            (sc) => sc.id === ss.subCategoryId
                          );
                          return sub ? (
                            <div
                              key={sub.id}
                              className="badge badge-outline gap-1 flex items-center"
                            >
                              {sub.name}
                              <button
                                className="ml-1 text-xs text-red-500"
                                onClick={() =>
                                  setTimeout(() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      selectedSubcategories: prev.selectedSubcategories.filter(
                                        (s) => s.subCategoryId !== sub.id
                                      ),
                                    }));
                                  }, 500)
                                }
                              >
                                ✕
                              </button>
                            </div>
                          ) : null;
                        })}
                    </div>  
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {formData1.selectedSubcategories
                        .filter((ss:any) => ss.mainCategoryId === category.id)
                        .map((ss:any) => {
                          const sub = formData.subCategories.find(
                            (sc) => sc.id === ss.subCategoryId
                          );
                          return sub ? (
                            <div
                              key={sub.id}
                              className="text-sm flex justify-between items-center last:border-0 border-b px-5 py-2"
                            >
                              {sub.name}
                            </div>
                          ) : null;
                        })}
                    </div>
                  )}
                </div>
              ))}

              {firstThreeDone && (
                <div className="border">
                  <div className="">
                    <h2 className="text-sm font-normal text-left w-full flex justify-between items-center bg-violet-700 text-white border-b px-5 py-3">
                      Residues
                    </h2>

                      Selected Subcategories  
                    <div className="">
                      {formData.selectedOtherSubcategories.map((subId:any) => {
                        const sub = formData.subCategories.find(
                          (sc) => sc.id === subId
                        );
                        return sub ? (
                          <div
                            key={sub.id}
                            className="text-sm flex justify-between items-center last:border-0 border-b px-5 py-2"
                          >
                            <span className="flex-1">{sub.name}</span>
                              <input
                            type="number"
                            placeholder="kg"
                            value={sub.value || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                subCategories: prev.subCategories.map((sc) =>
                                  sc.id === sub.id
                                    ? { ...sc, value: e.target.value }
                                    : sc
                                ),
                              }))
                            }
                            className="input input-bordered input-sm w-20"
                          />
                          {/* <button
                            onClick={() => handleRemoveFromOther(sub.id)}
                            className="btn btn-circle btn-xs btn-ghost"
                          >
                            ✕
                          </button>   */}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

              <div className="">
            {formData.mainCategories.slice(0, 3).map((category) => (
              <div className="">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-sm font-normal text-gray-900  pb-1 text-left w-full">
                    {category.name}
                  </h2>
                  {!category.isDone && (
                    <button
                      onClick={() => handleCompleteCategory(category.id)}
                      className="bg-blue-500 text-sm not-last:cursor-pointer w-fit text-white px-4 py-2 mt-1 rounded-md shadow-xs hover:bg-blue-600"
                    >
                      Done
                    </button>
                  )}
                </div>

                {!category.isDone ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-x-9">
                      {formData.subCategories
                        .filter(
                          (sc) =>
                            !formData.selectedSubcategories.some(
                              (ss) => ss.subCategoryId === sc.id
                            )
                        )
                        .map((sub) => (
                          <div className="flex gap-2">
                            <div className="flex h-6 shrink-0 items-center">
                              <div className="group grid size-4 gap-4 grid-cols-1">
                                <input
                                  key={sub.id}
                                  id={sub.name}
                                  type="checkbox"
                                  value={sub.id}
                                  onChange={() =>
                                    setTimeout(() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        selectedSubcategories: [
                                          ...prev.selectedSubcategories,
                                          {
                                            mainCategoryId: category.id,
                                            subCategoryId: sub.id,
                                            subCategory: sub,
                                          },
                                        ],
                                      }));
                                    }, 1000)
                                  }
                                  className="checkbox checkbox-xs border text-blue-600"
                                />
                              </div>
                            </div>
                            <div className="text-sm/6">
                              <label
                                htmlFor={sub.name}
                                className="font-medium text-gray-900"
                              >
                                {sub.name}
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-x-9">
                        {formData.selectedSubcategories
                          .filter((ss) => ss.mainCategoryId === category.id)
                          .map((ss) => {
                            const sub = formData.subCategories.find(
                              (sc) => sc.id === ss.subCategoryId
                            );
                            return sub ? (
                              <>
                                <div className="flex gap-2" key={sub.id}>
                                  <div className="flex h-6 shrink-0 items-center">
                                    <div className="group grid size-4 gap-4 grid-cols-1">
                                      <input
                                        key={sub.id}
                                        id={sub.name}
                                        type="checkbox"
                                        checked={true}
                                        value={sub.id}
                                        onChange={() =>
                                          setTimeout(() => {
                                            setFormData((prev) => ({
                                              ...prev,
                                              selectedSubcategories: prev.selectedSubcategories.filter(
                                                (s) =>
                                                  s.subCategoryId !== sub.id
                                              ),
                                            }));
                                          }, 1000)
                                        }
                                        className="checkbox checkbox-xs border text-blue-600"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-sm/6">
                                    <label
                                      htmlFor={sub.name}
                                      className="font-medium text-gray-900"
                                    >
                                      {sub.name}
                                    </label>
                                  </div>
                                </div>
                              </>
                            ) : null;
                          })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-x-9 space-y-2">
                    {formData.selectedSubcategories
                      .filter((ss) => ss.mainCategoryId === category.id)
                      .map((ss) => {
                        const sub = formData.subCategories.find(
                          (sc) => sc.id === ss.subCategoryId
                        );
                        return (
                          <>
                            <div className="flex gap-2" key={sub?.id}>
                              <div className="flex h-6 shrink-0 items-center">
                                <div className="group grid size-4 gap-4 grid-cols-1">
                                  <input
                                    key={sub?.id}
                                    id={sub?.name}
                                    type="checkbox"
                                    checked={true}
                                    value={sub?.id}
                                    
                                    className="checkbox checkbox-xs border text-blue-600"
                                  />
                                </div>
                              </div>
                              <div className="text-sm/6">
                                <label
                                  htmlFor={sub?.name}
                                  className="font-medium text-gray-900"
                                >
                                  {sub?.name}
                                </label>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}

            {firstThreeDone && (
              <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                  <h2 className="text-sm font-normal text-gray-900  pb-1 text-left w-full">
                    Residues
                  </h2>

                  <div className="flex gap-2 mb-4">
                    <select
                      className="select select-bordered flex-1"
                      // onChange={(e) => handleOtherSelection(e.target.value)}
                      value=""
                    >
                      <option value="">Select remaining subcategories</option>
                      {getRemainingSubcategories().map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        const select = document.querySelector(
                          ".select"
                        ) as HTMLSelectElement;
                        if (select && select.value) {
                          // handleOtherSelection(select.value);
                          select.value = "";
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    {formData.selectedOtherSubcategories.map((subId) => {
                      const sub = formData.subCategories.find(
                        (sc) => sc.id === subId
                      );
                      return sub ? (
                        <div key={sub.id} className="flex items-center gap-2">
                          <span className="flex-1">{sub.name}</span>
                          <input
                            type="number"
                            placeholder="kg"
                            value={sub.value}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                subCategories: prev.subCategories.map((sc) =>
                                  sc.id === sub.id
                                    ? { ...sc, value: e.target.value }
                                    : sc
                                ),
                              }))
                            }
                            className="input input-bordered input-sm w-20"
                          />
                          <button
                            // onClick={() => handleRemoveFromOther(sub.id)}
                            className="btn btn-circle btn-xs btn-ghost"
                          >
                            ✕
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>  

              <ul>
            {formData.subCategories.map((sub) => (
              <li key={sub.id}>
                {sub.name} – Value: {sub.value}
              </li>
            ))}
          </ul>  
          </div>
        )}
      </div>

      
    </div>
  );
}
