import {useState} from "react";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {
  addProduct,
  getAllProduct,
  reset,
} from "../../features/products/productSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const AddProduct = () => {
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset: resetForm,
  } = useForm();
  const sizes = ["XS", "S", "M", "L", "XL"];
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {isLoading, isError, isSuccess, message} = useSelector(
    (state) => state.products
  );

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large! Max 10MB.`);
      } else {
        validFiles.push(file);
      }
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const formData = new FormData();
    for (let key in data) formData.append(key, data[key]);
    images.forEach((img) => formData.append("images", img));

    try {
      const resultAction = await dispatch(addProduct(formData));
      if (addProduct.fulfilled.match(resultAction)) {
        toast.success("Product Created Successfully");
        resetForm();
        setImages([]);
        dispatch(reset());
        dispatch(getAllProduct());
        navigate("/admin/dashboard"); // redirect to products page
      } else {
        toast.error(resultAction.payload || "Failed to add product");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-6 mx-auto lg:mr-65 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-5">Add/Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="e.g. 'Minimalist Silk Kurta'"
          {...register("name", {required: "Name is required"})}
          className="w-full p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          placeholder="A short description of the product."
          {...register("description")}
          className="w-full p-2 border rounded"
        />

        {/* Price + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Price</label>
            <input
              type="number"
              name="price"
              placeholder=" ₹ 0.00"
              {...register("price", {required: "Price is required"})}
              className="w-full p-2 border rounded"
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="100"
              {...register("stock", {required: "Stock is required"})}
              className="w-full p-2 border rounded"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm">{errors.stock.message}</p>
            )}
          </div>
        </div>

        {/* Category + Brand */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Category</label>
            <select
              name="category"
              {...register("category", {required: "Category is required"})}
              className="w-full p-2 border rounded"
            >
              <option value="">Select category</option>
              <option value="Tops">Tops</option>
              <option value="Shirts">Shirts</option>
              <option value="Dress">Dress</option>
              <option value="Bottoms">Bottoms</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>
          <div>
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              placeholder="e.g. 'Aavani'"
              {...register("brand", {required: "Brand is required"})}
              className="w-full p-2 border rounded"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm">{errors.brand.message}</p>
            )}
          </div>
        </div>

        {/* Multiple Image Upload */}
        <div className="border-2 border-dashed p-6 rounded text-center">
          <input
            type="file"
            name="images"
            accept="image/png, image/jpeg, image/gif"
            multiple
            className="hidden"
            id="file-upload"
            onChange={handleImageChange}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-sm text-gray-600 flex flex-col items-center"
          >
            {images.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            ) : (
              <>
                <i className="ri-image-add-line text-3xl mb-2"></i>
                <span className="text-orange-500 font-medium">
                  Upload files
                </span>{" "}
                or drag and drop
                <br />
                <span className="text-gray-400 text-xs mt-1">
                  PNG, JPG, GIF up to 10MB each
                </span>
              </>
            )}
          </label>
        </div>

        {/* Sizes */}
        <div>
          <h2 className="font-semibold mb-2">Sizes</h2>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center gap-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name="sizes"
                  value={size}
                  {...register("sizes")}
                />
                <span className="px-2 py-1 border rounded">{size}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h2 className="font-semibold mb-2">Colors</h2>
          <input
            type="text"
            name="colors"
            placeholder="e.g. 'Red , Black , Blue'"
            {...register("colors", {required: "Colors are required"})}
            className="w-full p-2 border rounded"
          />
          {errors.colors && (
            <p className="text-red-500 text-sm">{errors.colors.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`w-full font-semibold py-2 px-4 rounded-lg transition my-3
              ${
                isSubmitting || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
        >
          {isSubmitting || isLoading ? "Loading" : "Save Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
