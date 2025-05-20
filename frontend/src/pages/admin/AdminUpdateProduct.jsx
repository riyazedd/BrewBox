import { useState,useEffect } from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { useUpdateProductMutation, useGetProductDetailsQuery } from '../../slices/productApiSlice';
import { toast } from 'react-toastify';

const AdminUpdateProduct = () => {
  const {id:productId} = useParams();
  
  const [name,setName]=useState('');
  const [minPrice,setMinPrice]=useState(0);
  const [maxPrice,setMaxPrice]=useState(0);
  const [image,setImage]=useState('');
  const [category,setCategory]=useState('');
  const [countInStock,setCountInStock]=useState(0);
  const [description,setDecription]=useState('');

  const {data:product, isLoading,refetch,error} = useGetProductDetailsQuery(productId);
  const [updateProduct, {isLoading:loadingUpdate}] = useUpdateProductMutation();
  
  const navigate = useNavigate();

  useEffect(()=>{
    if(product){
      setName(product.product_name);
      setMinPrice(product.min_price);
      setMaxPrice(product.max_price);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDecription(product.description);
    }
  },[product])

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        product_name:name,
        min_price:minPrice,
        max_price:maxPrice,
        image:image,
        category:category,
        countInStock:countInStock,
        description:description
      }).unwrap();
      toast.success("Product Updated Successfully!");
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }

 
  return (
    <div className="mx-20 my-10">
      <Link to='/admin/productlist' className='bg-green-700 text-white px-2 py-1 rounded'>Go Back</Link>
      <h2 className="text-2xl font-bold mt-4 text-gray-700">Update Product Detail</h2>
      {loadingUpdate && <>Loading...</>}
      {isLoading ? <>Loading...</> : error ? <div className='text-red-500'>{error?.data?.message || error.error}</div> :
      <div className='flex items-center justify-between'>
        <form onSubmit={submitHandler} className='flex flex-col gap-4 w-1/2 mt-10 text-gray-700'>
          <div>
            <label htmlFor="name" className='text-lg font-semibold'>Product Name</label>
            <input type="text" id='name' value={name} onChange={(e)=>setName(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' />
          </div>
          <div>
            <label htmlFor="minPrice" className='text-lg font-semibold'>Min Price</label>
            <input type="number" id='minPrice' value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' />
          </div>
          <div>
            <label htmlFor="maxPrice" className='text-lg font-semibold'>Max Price</label>
            <input type="number" id='maxPrice' value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' />
          </div>
          {/* <div>
            <label htmlFor="image" className='text-lg font-semibold'>Image</label>
            <input type="file" id='image' onChange={(e)=>setImage(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' />
          </div> */}
          <div>
            <label htmlFor="category" className='text-lg font-semibold'>Category</label>
            <input type="text" id='category' value={category} onChange={(e)=>setCategory(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' /> 
          </div>
          <div>
            <label htmlFor="countInStock" className='text-lg font-semibold'>Count In Stock</label>
            <input type="number" id='countInStock' value={countInStock} onChange={(e)=>setCountInStock(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' />
          </div>
          <div>
            <label htmlFor="description" className='text-lg font-semibold'>Description</label>
            <textarea id='description' value={description} onChange={(e)=>setDecription(e.target.value)} className='border-2 border-gray-300 rounded px-2 py-1 w-full' />
          </div>
          <button className='bg-green-700 text-white px-4 py-2 rounded'>
            Update
          </button>
        </form>
        <div>
          {/* <img src={image} alt="product" /> */}
        </div>
      </div>
      }
    </div>
  );
};

export default AdminUpdateProduct;
