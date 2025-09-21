import axios from 'axios'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const NewDrop = () => {
  const {items} = useSelector((state) => state.products)

  useEffect(() =>{
    const product = axios.fetch("")
  } , [])
  console.log(items);
  
  return (
    <div className='min-h-screen'>
      <div className='w-full'>
     <h1 className='text-center font-bold py-12 text-2xl lg:text-4xl'>New Drop</h1>

     <div>
      {/* {
        items.map((product , idx) =>(
          <img src={product.image} alt={product.name} />
        ))
      } */}
     </div>
      </div>
    </div>
  )
}

export default NewDrop
