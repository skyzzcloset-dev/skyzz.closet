import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProduct, updateProduct, deleteProduct } from "../../features/products/productSlice";
import Table from "../../ui/Tables";

const Products = () => {
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => { dispatch(getAllProduct()); }, [dispatch]);

  const handleUpdate = (row) => {
   const updatedData = {
    name: row.product,
    stock: row.inventory,
    brand: row.brand,
    category: row.category,
    images: row.image ? [row.image.props.src] : [],
  };

  dispatch(updateProduct({ id: row.id, productData: updatedData }));
  };

  const handleDelete = (row) => {
    console.log("Delete", row);
  };

  const columns = ["Image", "Product", "Inventory", "Status", "Brand", "Category"];
  const data = items.map((p) => ({
    image: <img className="w-12 h-12 object-cover rounded" src={p.images?.[0]?.url} />,
    product: p.name,
    inventory: p.stock,
    status: p.stock > 0 ? "In Stock" : "Out of Stock",
    brand: p.brand,
    category: p.category,
  }));

  return (
    <>
      <nav className="flex justify-between items-center  lg:mr-65 p-5">

      
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => navigate("/admin/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        >
          Add Product
        </button>
    
      </nav>

      <main className="p-4">
        <Table
          columns={columns}
          data={data}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </>
  );
};

export default Products;
