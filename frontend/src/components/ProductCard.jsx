import React from 'react'
import {Link} from 'react-router-dom'
import Rating from './Rating.jsx'

const ProductCard = ({product}) => {
  return (
    <Link to={`/product/${product._id}`}>
        <div className='p-5 w-fit shadow rounded'>
            <img src={product.image} alt="coffee" className='w-70' />
            <div className='flex flex-col items-center gap-3'>
                <p className='text-lg font-[Poppins]'>{product.product_name}</p>
                <p className='text-base text-gray-600 font-[Poppins]'>{product.category}</p>
                <p className='text-lg text-green-800 font-bold'>Rs {product.min_price} - Rs {product.max_price}</p>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                <button className='px-5 py-3 bg-green-800 font-[Poppins] text-white font-bold'>Select Options</button>
            </div>
        </div>
    </Link>
  )
}

export default ProductCard
