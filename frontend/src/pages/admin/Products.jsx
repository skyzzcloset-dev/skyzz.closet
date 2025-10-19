import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {
  getAllProduct,
  updateProduct,
  deleteProduct,
} from "../../features/products/productSlice";
import Table from "../../ui/Tables";

const Products = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {items} = useSelector((state) => state.products);

  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

  const handleEditClick = (p) => {
    setEditRowId(p._id);
    setEditedData({
      product: p.name,
      inventory: p.stock,
      price: p.price,
      category: p.category,
      brand: p.brand,
      description: p.description,
    });
  };

  const handleInputChange = (e, field) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = () => {
    const payload = {
      name: editedData.product,
      stock: Number(editedData.inventory),
      price: Number(editedData.price),
      category: editedData.category,
      brand: editedData.brand,
      description: editedData.description,
    };

    dispatch(updateProduct({id: editRowId, productData: payload}))
      .unwrap()
      .then(() => {
        dispatch(getAllProduct());
        setEditRowId(null);
        setEditedData({});
      });
  };

  const handleCancel = () => {
    setEditRowId(null);
    setEditedData({});
  };

  const handleDelete = (row) => {
    dispatch(deleteProduct(row.id))
      .unwrap()
      .then(() => dispatch(getAllProduct()));
  };

  const columns = [
    "Image",
    "Product",
    "Inventory",
    "Price",
    "Category",
    "Brand",
    "Description",
    "Status",
    "Actions",
  ];

  const data = items.map((p) => {
    const isEditing = editRowId === p._id;

    return {
      image: (
        <img
          className="w-12 h-12 object-cover rounded"
          src={p.images?.[0]?.url}
          alt={p.name}
        />
      ),
      id: p._id,
      product: isEditing ? (
        <input
          type="text"
          value={editedData.product}
          onChange={(e) => handleInputChange(e, "product")}
          className="border p-1 rounded w-full"
        />
      ) : (
        p.name
      ),
      inventory: isEditing ? (
        <input
          type="number"
          value={editedData.inventory}
          onChange={(e) => handleInputChange(e, "inventory")}
          className="border p-1 rounded w-20"
        />
      ) : (
        p.stock
      ),
      price: isEditing ? (
        <input
          type="number"
          value={editedData.price}
          onChange={(e) => handleInputChange(e, "price")}
          className="border p-1 rounded w-24"
        />
      ) : (
        p.price
      ),
      category: isEditing ? (
        <input
          type="text"
          value={editedData.category}
          onChange={(e) => handleInputChange(e, "category")}
          className="border p-1 rounded w-full"
        />
      ) : (
        p.category
      ),
      brand: isEditing ? (
        <input
          type="text"
          value={editedData.brand}
          onChange={(e) => handleInputChange(e, "brand")}
          className="border p-1 rounded w-full"
        />
      ) : (
        p.brand
      ),
      description: isEditing ? (
        <textarea
          value={editedData.description}
          onChange={(e) => handleInputChange(e, "description")}
          className="border p-1 rounded w-full"
        />
      ) : (
        p.description
      ),
      status: p.stock > 0 ? "In Stock" : "Out of Stock",
      actions: isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-2 py-1 rounded"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-400 text-white px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => handleEditClick(p)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete({id: p._id})}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ),
    };
  });

  return (
    <>
      
        <nav className="flex justify-between items-center p-5 px-5 lg:mr-65">
          <h1 className="text-2xl font-semibold">Products</h1>
          <button
            onClick={() => navigate("/admin/add")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          >
            Add Product
          </button>
        </nav>

        <main className="p-4">
          <Table columns={columns} data={data} />
        </main>
      
    </>
  );
};

export default Products;
