import { useState } from "react";
interface Capex {
    id: string;
    name: string;
    value: string;
}


interface FormData {
    capex: Capex[];
}

export default function EconomyForm({ open }: any) {
    const componentOptions = [
        "Land Acquisition",
        "Machinery and Equipment",
        "Construction & installation",
        "Engineering & design fees",
        "Permits, licenses, and legal fees",
        "Can add as many as user wants",
    ];

    const opexOptions = [
        "Salaries and labor",
        "Energy and utility costs",
        "Maintenance and spare parts",
        "Insurance, taxes, and admin costs",
        "Can add as many as user wants"
    ]

    const revenueOptions = [
        "Biogas to electricity",
        "Digestate as soil fertilizer",
        "Carbon Credits",
        "Can add as many as user wants"
    ]

    const [formData, setFormData] = useState<FormData>({
        capex: [],
    });

    const [formDataOpex, setFormDataOpex] = useState({
        opex: [],
        revenue: [],
    });

    const [totalSubCatValue, setTotalSubCatValue] = useState(0);
    const [discount, setDiscount] = useState(10);

    const handleComponentSelect = (e: any) => {
        const selectedName = e.target.value;
        if (!selectedName) return;

        const alreadyExists = formData.capex.some(
            (subCat) => subCat.name === selectedName
        );
        if (alreadyExists) return;

        const newComponent = {
            id: `s${formData.capex.length + 1}`,
            name: selectedName,
            value: "0",
        };

        const updated = [...formData.capex, newComponent];
        setFormData((prev) => ({
            ...prev,
            capex: updated,
        }));

        // Reset dropdown
        e.target.value = "";
    };

    const handleCapexValueChange = ({ name, value }: any) => {
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) return;

        const updated = formData.capex.map((subCat) =>
            subCat.name === name ? { ...subCat, value } : subCat
        );

        const total = updated.reduce(
            (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
            0
        );

        setFormData((prev) => ({
            ...prev,
            capex: updated,
        }));
        setTotalSubCatValue(total);
    };

    const handleRemoveCapex = (name: any) => {
        const updated = formData.capex.filter(
            (subCat) => subCat.name !== name
        );

        const total = updated.reduce(
            (sum, subCat) => sum + (parseFloat(subCat.value) || 0),
            0
        );

        setFormData((prev) => ({
            ...prev,
            capex: updated
        }));

        setTotalSubCatValue(total);
    };

    const [columns, setColumns] = useState(0);

    const handleComponentSelectOpex = (e: any) => {
        const selected = e.target.value;
        if (selected) {
            setFormDataOpex((prev: any) => ({
                ...prev,
                opex: [
                    ...prev.opex,
                    {
                        name: selected,
                        values: Array(columns + 1).fill(""), // create values array based on dynamic columns
                    },
                ],
            }));
        }
    };

    const handleColumnCountChange = (e: any) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            setColumns(val); // +1 as per your requirement
        }
    };

    const handleOpexValueChange = (componentName: any, colIndex: any, value: any) => {
        setFormDataOpex((prev: any) => ({
            ...prev,
            opex: prev.opex.map((item: any) =>
                item.name === componentName
                    ? {
                        ...item,
                        values: item.values.map((val: any, idx: any) =>
                            idx === colIndex ? value : val
                        ),
                    }
                    : item
            ),
        }));
    };

    const handleRemoveOpex = (name: any) => {
        setFormDataOpex((prev) => ({
            ...prev,
            opex: prev.opex.filter((item: any) => item.name !== name),
        }));
    };

    const handleComponentSelectRevenue = (e: any) => {
        const selected = e.target.value;
        if (selected) {
            setFormDataOpex((prev: any) => ({
                ...prev,
                revenue: [
                    ...prev.revenue,
                    {
                        name: selected,
                        values: Array(columns + 1).fill(""), // create values array based on dynamic columns
                    },
                ],
            }));
        }
    };

    const handleRevenueValueChange = (componentName: any, colIndex: any, value: any) => {
        setFormDataOpex((prev: any) => ({
            ...prev,
            revenue: prev.revenue.map((item: any) =>
                item.name === componentName
                    ? {
                        ...item,
                        values: item.values.map((val: any, idx: any) =>
                            idx === colIndex ? value : val
                        ),
                    }
                    : item
            ),
        }));
    };

    const handleRemoveRevenue = (name: any) => {
        setFormDataOpex((prev) => ({
            ...prev,
            revenue: prev.revenue.filter((item: any) => item.name !== name),
        }));
    };

    const [npv, setNpv] = useState(0);
    const [cumulativeCashFlows, setCumulativeCashFlows] = useState<number[]>([]);

    const calculateNPV = () => {
        const initialInvestment = totalSubCatValue;
        const cashFlows = [];
        const cumulativeCashFlows = [];
        let cumulative = -initialInvestment;

        for (let year = 0; year < columns; year++) {
            const yearlyRevenue = formDataOpex.revenue.reduce((sum, item: any) => sum + (parseFloat(item.values[year])) || 0, 0);
            const yearlyOpex = formDataOpex.opex.reduce((sum, item: any) => sum + (parseFloat(item.values[year])) || 0, 0);
            const netCashFlow = yearlyRevenue - yearlyOpex;

            cashFlows.push(netCashFlow);
            cumulative += netCashFlow;
            cumulativeCashFlows.push(cumulative);
        }

        // NPV calculation (existing logic)
        let npv = -initialInvestment;
        for (let year = 0; year < cashFlows.length; year++) {
            npv += cashFlows[year] / Math.pow(1 + (discount / 100), year + 1);
        }

        return { npv, cumulativeCashFlows, cashFlows }; // Return all data
    };
    return (
        <div className="w-full h-[calc(100vh-85px)] overflow-y-auto bg-white">
            <div className="">
                <div className="pt-8 bg-white">
                    <div className="border p-8 rounded-md">
                        <div className="border-b border-gray-900/10 pb-8 mb-4">
                            <h2 className="text-base/7 font-semibold text-gray-900">
                                Capital Cost (CAPEX)
                            </h2>
                            <div className="pt-5">
                                <div className="w-full space-y-4">
                                    {/* Dropdown always visible */}
                                    <select
                                        onChange={handleComponentSelect}
                                        className="block h-[38px] w-full border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                    >
                                        <option value="">Select Component</option>
                                        {componentOptions
                                            .filter(
                                                (option) =>
                                                    !formData.capex.some(
                                                        (subCat) => subCat.name === option
                                                    )
                                            )
                                            .map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                    </select>

                                    {formData.capex.length > 0 && (
                                        <table className="w-full border border-collapse border-gray-300 text-sm">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border p-2">Component</th>
                                                    <th className="border p-2">Rs.</th>
                                                    <th className="border p-2"></th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.capex.map((subCat, idx) => (
                                                    <tr key={idx}>
                                                        <td className="p-[0_!important] pl-[8px_!important]">
                                                            {subCat.name}
                                                        </td>
                                                        <td className="p-[0_!important]">
                                                            <input
                                                                type="number"

                                                                value={subCat.value}
                                                                onChange={(e) =>
                                                                    handleCapexValueChange({
                                                                        name: subCat.name,
                                                                        value: e.target.value,
                                                                    })
                                                                }
                                                                className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                                            />
                                                        </td>
                                                        <td><button
                                                            onClick={() => handleRemoveCapex(subCat.name)}
                                                            className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                                                        >
                                                            ✕
                                                        </button></td>
                                                    </tr>
                                                ))}

                                                <tr className="bg-gray-100 font-semibold">
                                                    <td className="border p-2">Total CAPEX</td>
                                                    <td className="border p-2">
                                                        {totalSubCatValue}
                                                    </td>
                                                    <th></th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}

                                </div>
                            </div>
                            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                                <div className="">
                                    <label className="block text-sm/6 font-medium text-gray-900 mt-5 mb-2">
                                        Expected Life of Project:
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            min="0"
                                            onChange={handleColumnCountChange}
                                            placeholder="Enter value"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <label className="block text-sm/6 font-medium text-gray-900 mt-5 mb-2">
                                        Discount:
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            value={discount}
                                            min="0"
                                            onChange={(e: any) => setDiscount(e.target.value)}
                                            placeholder="Enter value"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            <h2 className="text-base/7 font-semibold text-gray-900">
                                Operational Cost (OPEX)
                            </h2>

                            <div className="border-b border-gray-900/10 pb-8 mb-4">

                                <select
                                    onChange={handleComponentSelectOpex}
                                    className="block h-[38px] w-full mt-2 border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                >
                                    <option value="">Select Component</option>
                                    {opexOptions
                                        .filter(
                                            (option) =>
                                                !formDataOpex.opex.some((subCat: any) => subCat.name === option)
                                        )
                                        .map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </select>

                                {formDataOpex.opex.length > 0 && (
                                    <table className="w-full border border-collapse border-gray-300 text-sm mt-5">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border p-2" rowSpan={2}>Component</th>
                                                {Array.from({ length: columns }, (_, i) => (
                                                    <th key={i} className="border p-2">Year {i + 1}</th>
                                                ))}

                                                <th className="border p-2"></th>
                                            </tr>
                                            <tr>
                                                {Array.from({ length: columns }, (_, i) => (
                                                    <th key={i} className="border p-2">Rs.</th>
                                                ))}
                                                <th className="border p-2"></th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formDataOpex.opex.map((subCat: any, rowIdx: any) => (
                                                <tr key={rowIdx}>
                                                    <td className="p-[0_!important]">{subCat.name}</td>
                                                    {Array.from({ length: columns }, (_, colIdx) => (
                                                        <td key={colIdx} className="p-[0_!important]">
                                                            <input
                                                                type="number"
                                                                value={subCat.values[colIdx] || ""}
                                                                onChange={(e: any) =>
                                                                    handleOpexValueChange(
                                                                        subCat.name,
                                                                        colIdx,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="p-[0_!important]">
                                                        <button
                                                            onClick={() => handleRemoveOpex(subCat.name)}
                                                            className="text-red-500 hover:text-red-700 text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Row: Total per Column */}
                                            <tr className="bg-gray-50 font-semibold">
                                                <td className="border p-2">Total OPEX</td>
                                                {Array.from({ length: columns }, (_, colIdx) => {
                                                    const colTotal = formDataOpex.opex.reduce((sum: any, subCat: any) => {
                                                        const val = parseFloat(subCat.values?.[colIdx]) || 0;
                                                        return sum + val;
                                                    }, 0);
                                                    return (
                                                        <td key={colIdx} className="border p-2">
                                                            {colTotal}
                                                        </td>
                                                    );
                                                })}
                                                <td className="border p-2"></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            <h2 className="text-base/7 font-semibold text-gray-900">
                                Revenue
                            </h2>

                            <div className="">

                                <select
                                    onChange={handleComponentSelectRevenue}
                                    className="block h-[38px] w-full mt-2 border rounded-md px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                >
                                    <option value="">Select Component</option>
                                    {revenueOptions
                                        .filter(
                                            (option) =>
                                                !formDataOpex.opex.some((subCat: any) => subCat.name === option)
                                        )
                                        .map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                </select>

                                {formDataOpex.revenue.length > 0 && (
                                    <table className="w-full border border-collapse border-gray-300 text-sm mt-5">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border p-2" rowSpan={2}>Component</th>
                                                {Array.from({ length: columns }, (_, i) => (
                                                    <th key={i} className="border p-2">Year {i + 1}</th>
                                                ))}
                                                <th className="border p-2"></th>
                                            </tr>
                                            <tr className="bg-gray-100">
                                                {Array.from({ length: columns }, (_, i) => (
                                                    <th key={i} className="border p-2">Rs.</th>
                                                ))}
                                                <th className="border p-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formDataOpex.revenue.map((subCat: any, rowIdx: any) => (
                                                <tr key={rowIdx}>
                                                    <td className="p-[0_!important]">{subCat.name}</td>
                                                    {Array.from({ length: columns }, (_, colIdx) => (
                                                        <td key={colIdx} className="p-[0_!important]">
                                                            <input
                                                                type="number"
                                                                value={subCat.values[colIdx] || ""}
                                                                onChange={(e: any) =>
                                                                    handleRevenueValueChange(
                                                                        subCat.name,
                                                                        colIdx,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="text-center block h-[38px] w-full px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:ring-blue-500 md:text-sm"
                                                            />
                                                        </td>
                                                    ))}
                                                    <td className="p-[0_!important]">
                                                        <button
                                                            onClick={() => handleRemoveRevenue(subCat.name)}
                                                            className="text-red-500 hover:text-red-700 text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {/* Row: Total per Column */}
                                            <tr className="bg-gray-50 font-semibold">
                                                <td className="border p-2">Total OPEX</td>
                                                {Array.from({ length: columns }, (_, colIdx) => {
                                                    const colTotal = formDataOpex.revenue.reduce((sum: any, subCat: any) => {
                                                        const val = parseFloat(subCat.values?.[colIdx]) || 0;
                                                        return sum + val;
                                                    }, 0);
                                                    return (
                                                        <td key={colIdx} className="border p-2">
                                                            {colTotal}
                                                        </td>
                                                    );
                                                })}
                                                <td className="border p-2"></td>
                                            </tr>



                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div className=" flex justify-center">
                                <button
                                    className=" bg-blue-500 cursor-pointer text-white px-8 py-2 mt-8 rounded-md shadow-md hover:bg-blue-600"
                                    onClick={() => {
                                        const { npv, cumulativeCashFlows } = calculateNPV();
                                        setNpv(npv);
                                        setCumulativeCashFlows(cumulativeCashFlows);
                                    }}
                                >
                                    Calculate
                                </button>
                            </div>
                        </div>


                    </div>
                </div>

                {/* After the Calculate button */}
                {(npv !== null) && (
                    <div className="mt-8">
                        <h3 className="font-semibold">NPV Calculation Breakdown</h3>
                        <table className="w-full border-collapse border mt-4">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Component</th>
                                    {Array.from({ length: columns + 1 }, (_, i) => (
                                        <th key={i} className="border p-2">
                                            {i === 0 ? "Year 0 (Initial)" : `Year ${i}`}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* CAPEX Row */}
                                <tr>
                                    <td className="border p-2">CAPEX</td>
                                    <td className="border p-2 text-right">{-totalSubCatValue}</td>
                                    {Array.from({ length: columns }, (_, i) => (
                                        <td key={i} className="border p-2 text-right">-</td>
                                    ))}
                                </tr>
                                {/* OPEX Row */}
                                <tr>
                                    <td className="border p-2">OPEX</td>
                                    <td className="border p-2 text-right">-</td>
                                    {Array.from({ length: columns }, (_, i) => (
                                        <td key={i} className="border p-2 text-right">
                                            {formDataOpex.opex.reduce((sum, item: any) => sum + (parseFloat(item.values[i]) || 0), 0)}
                                        </td>
                                    ))}
                                </tr>
                                {/* Revenue Row */}
                                <tr>
                                    <td className="border p-2">Revenue</td>
                                    <td className="border p-2 text-right">-</td>
                                    {Array.from({ length: columns }, (_, i) => (
                                        <td key={i} className="border p-2 text-right">
                                            {formDataOpex.revenue.reduce((sum, item: any) => sum + (parseFloat(item.values[i]) || 0), 0)}
                                        </td>
                                    ))}
                                </tr>
                                {/* Net Cash Flow Row */}
                                <tr className="font-medium">
                                    <td className="border p-2">Net Cash Flow</td>
                                    <td className="border p-2 text-right">{-totalSubCatValue}</td>
                                    {Array.from({ length: columns }, (_, i) => (
                                        <td key={i} className="border p-2 text-right">
                                            {formDataOpex.revenue.reduce((sum, item: any) => sum + (parseFloat(item.values[i]) || 0), 0) -
                                                formDataOpex.opex.reduce((sum, item: any) => sum + (parseFloat(item.values[i]) || 0), 0)}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="border p-2">Cumulative Cash Flow</td>
                                    <td className="border p-2 text-right">{-totalSubCatValue}</td>
                                    {cumulativeCashFlows.map((value, i) => (
                                        <td key={i} className="border p-2 text-right">{value.toFixed(2)}</td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 font-bold">
                            NPV: {npv.toFixed(2)}
                        </div>
                    </div>
                )}


                <div className="bg-white w-full pt-2">
                    <p className=" text-center py-2 mt-0">Waste Management Tracking</p>
                </div>
            </div>
        </div>
    )
}
