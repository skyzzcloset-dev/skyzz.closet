import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProduct } from "../../features/products/productSlice";

const Products = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.products);
  const dispatch =  useDispatch()
  useEffect(() =>{
     dispatch(getAllProduct())
  },[dispatch])

  return (
    <>
      <nav>
        <button
          onClick={() => navigate("/admin/add")}
          className="border rounded-xl p-5"
        >
          Add Products
        </button>
      </nav>

      <main>
        <div className="overflow-x-auto my-5 rounded p-10 lg:mr-65">
          <table className="min-w-full border border-gray-200 text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Inventory</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Brand</th>
                <th className="px-6 py-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length > 0 ? (
                items.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-2">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0].url || product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      {product.name}
                    </td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">{product.category}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Products;
