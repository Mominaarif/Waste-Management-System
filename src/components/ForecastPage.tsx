import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

// DataTables core and responsive
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.min.css';


import 'datatables.net';
import 'datatables.net-responsive-dt';

import { useLocation } from 'react-router-dom';

type ForecastedValues = {
    [category: string]: {
        [subtype: string]: number;
    };
};

const Forecast = ({ open }: any) => {
    const location = useLocation();
    const { forecastedValues, presentPopulation, forecastYear, name } = location.state || {};

    console.log("forecasted", forecastedValues);

    if (!forecastedValues) {
        return <div className="no-data">No forecast data available.</div>;
    }
        let n = name.toLowerCase();

    // ✅ FIXED: Provide explicit typing to Object.values() to avoid TS error
    const allSubtypes = Array.from(
        new Set(
            Object.values(forecastedValues as ForecastedValues)
                .flatMap((subtypes) => Object.keys(subtypes))
        )
    );
    console.log(allSubtypes)

    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        // ✅ Use jQuery to initialize
        const table1 = $(tableRef.current!).DataTable({
            responsive: true,
        });

        return () => {
            table1.destroy();
        };
    }, []);
    return (
        <div className="h-[calc(100vh-85px)] overflow-y-auto bg-white">
            <div className="pt-8 px-5 md:px-8">
                {/* <h1 className='text-3xl py-4 font-semibold text-gray-900 '>Results</h1> */}
                <div className="text-xl">
                    <h2><strong>Current Population:</strong> <span>{presentPopulation}</span></h2>
                    <h2><strong>Forecast Year:</strong> <span>{forecastYear}</span></h2>
                    <h2><strong>City Name: </strong><span className=' capitalize'>{n}</span></h2>
                </div>
            </div>
            <div className="pt-5 px-5 md:px-8">
                <table
                    ref={tableRef}
                    className=" display nowrap"
                    style={{ width: '100%' }}
                    >
                    <thead className=' text-white'>
                        <tr>
                            <th className='bg-[#386641_!important]'>Subtype</th>
                            {Object.keys(forecastedValues).map((category) => (
                                <th className='bg-[#386641_!important]' key={category}>{category.charAt(0).toUpperCase() + category.slice(1)} (Kg)</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allSubtypes.map((subtype) => (
                            <tr key={subtype}>
                                <td className='font-bold'>{subtype.charAt(0).toUpperCase() + subtype.slice(1)}</td>
                                {Object.keys(forecastedValues).map((category) => (
                                    <td className='' key={`${category}-${subtype}`}>
                                        {(forecastedValues[category]?.[subtype] ?? 0)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Forecast;
