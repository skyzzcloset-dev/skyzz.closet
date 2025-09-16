import axios from "axios";

const API_URL = "http://localhost:3000/api/products";

const addProduct = async (productData) => {
  try {
    const res = await axios.post(API_URL, productData, {
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
const getAllProduct = () =>{

}
const updateProduct = () =>{

}
const deleteProduct = () =>{

}

const productsService = {
    addProduct , getProduct , getAllProduct , updateProduct , deleteProduct
}

export default productsService