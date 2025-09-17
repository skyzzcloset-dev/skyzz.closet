import axios from "axios";

const API_URL = "https://skyzz-closet.onrender.com/api/product/";

const addProduct = async (productData) => {
  try {
    const res = await axios.post(API_URL + "add", productData, {
      withCredentials: true, // keep if backend uses cookies
    });

    if (!res.data) {
      throw new Error("Something went wrong");
    }

    return res.data;
  } catch (error) {
   
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
}

const getProduct = () =>{

}

const getAllProduct = async () => {
  try {
    const res = await axios.get(API_URL + "getAll", {
      withCredentials: true,
    });

    if (!res.data) {
      throw new Error("Something went wrong");
    }

    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

const updateProduct = () =>{

}
const deleteProduct = () =>{

}

const productsService = {
    addProduct , getProduct , getAllProduct , updateProduct , deleteProduct
}

export default productsService