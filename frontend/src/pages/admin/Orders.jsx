import React from 'react'
import { useSelector } from 'react-redux'



const Orders = () => {
  const {user} = useSelector((state) => state.auth)
  console.log(user);
  
  return (
    <>
      hi
    </>
  )
}

export default Orders
