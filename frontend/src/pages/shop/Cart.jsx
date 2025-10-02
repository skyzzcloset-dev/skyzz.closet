import React from "react";
import {useSelector} from "react-redux";

const Cart = () => {
  const {cartItems} = useSelector((state) => state.cart);
  console.log(cartItems);
  
  return (
    <>
      <div className="h-150  flex items-center justify-center bg-gray-100 px-4">
        {cartItems.length > 0 ? <p>{cartItems.map((items) =>{
          <h1>{items.productId}</h1>
        })}</p> : <p>Cart is empty</p>}
      </div>
    </>
  );
};

export default Cart;
