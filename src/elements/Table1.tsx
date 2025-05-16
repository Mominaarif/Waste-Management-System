import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

// DataTables core and responsive
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';

import 'datatables.net';
import 'datatables.net-responsive-dt';

const Table1: React.FC = () => {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    // ✅ Use jQuery to initialize
    const table = $(tableRef.current!).DataTable({
      responsive: true,
    });

    return () => {
      table.destroy();
    };
  }, []);

  return (
    <div className="p-4">
      <table
        ref={tableRef}
        className="display nowrap"
        style={{ width: '100%' }}
      >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                    </tr>
                    <tr>
                        <td>Garrett Winters</td>
                        <td>Accountant</td>
                        <td>Tokyo</td>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table1;
