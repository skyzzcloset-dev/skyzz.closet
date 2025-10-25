const Table = ({ columns, data, onUpdate, onDelete }) => {
  return (
    <div className="overflow-x-auto  rounded p-5 lg:mr-65">
      <table className="min-w-full border border-gray-200 text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-3">{col}</th>
            ))}
            {(onUpdate || onDelete) && <th className="px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col, cidx) => (
                  <td key={cidx} className="px-6 py-4">{row[col.toLowerCase()] ?? "—"}</td>
                ))}
                {(onUpdate || onDelete) && (
                  <td className="px-6 py-4 flex gap-2">
                    {onUpdate && (
                      <button
                        onClick={() => onUpdate(row)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
                      >
                        Update
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-6 text-gray-500 font-medium">
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
