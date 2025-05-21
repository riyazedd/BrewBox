import React from 'react'
import ProductCard from './ProductCard'
import { useGetProductsQuery } from '../slices/productApiSlice'

const Recommended = () => {

    const {data,isLoading,error}=useGetProductsQuery(1);
  return (
    <div className='flex flex-col items-center w-full'>
      <h1 className="text-4xl font-bold text-green-800 flex flex-col items-center">Recommended <span className='h-[6px] w-50 bg-green-800 rounded mt-1'></span></h1>
      <div>
        {isLoading ? (<div>Loading...</div>) : error ? (<div>{error.data?.message || error.error}</div>) : (<>
				<div className="flex justify-center">
				<div className="grid grid-cols-4 m-10 gap-10 w-full">
					{data.products.filter((p)=>p.category==='Coffee').map((p) => (
						<ProductCard product={p} key={p._id} />
					))}
				</div>
			</div>
			</>) }
      </div>
    </div>
  )
}

export default Recommended
