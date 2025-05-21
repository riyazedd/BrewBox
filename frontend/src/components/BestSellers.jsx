import React, { useRef } from 'react';
import ProductCard from './ProductCard';
import { useGetProductsQuery } from '../slices/productApiSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // or use your own icons

const BestSellers = () => {
  const { data, isLoading, error } = useGetProductsQuery(1);
  const scrollRef = useRef();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const coffeeProducts = data?.products?.filter((p) => p.category === 'Coffee') || [];

  return (
    <div className="flex flex-col items-center w-full">
            <h1 className="text-4xl font-bold text-green-800 flex flex-col items-center">Best Sellers <span className='h-[6px] w-50 bg-green-800 rounded mt-1'></span></h1>


      {isLoading ? (
        <div><h1>Loading...</h1></div>
      ) : error ? (
        <div>{error.data?.message || error.error}</div>
      ) : (
        <div className="relative mt-10 mx-10">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-hidden gap-6 scroll-smooth w-full px-10"
          >
            {coffeeProducts.map((p) => (
              <div key={p._id} className="min-w-[250px] flex-shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BestSellers;
