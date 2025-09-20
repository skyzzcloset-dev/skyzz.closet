import React from "react";

const Table = ({columns, data}) => {
 return (
    <div className="overflow-x-auto my-5 rounded p-10 lg:mr-65">
      <table className="min-w-full border border-gray-200 text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col, cidx) => (
                  <td key={cidx} className="px-6 py-4">
                    {/* Dynamically access row values by column name */}
                    {row[col.toLowerCase()] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500 font-medium"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
