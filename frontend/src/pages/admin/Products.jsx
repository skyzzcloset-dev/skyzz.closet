import React from "react";

const Products = () => {
  return (
    <>
      <main>
        <div className="overflow-x-auto my-5 rounded p-10 lg:mr-65">
            <table className="min-w-full border border-gray-200 text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Product</th>
                  <th className="px-6 py-3">Inventory</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                
              </tbody>
            </table>
          </div>
      </main>
    </>
  );
};

export default Products;
