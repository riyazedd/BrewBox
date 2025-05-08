import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div>
      <div className='relative'>
        <img src="/hero.jpg" className='w-full h-[600px]' />
        <div className='absolute inset-0 bg-black opacity-30' ></div>
        <div className='absolute inset-0 ml-20 p-10 w-[40%] flex flex-col justify-center items-start'>
            <p className='text-5xl font-bold text-white'>Freshly roasted coffee delivered at your doorstep.</p>
            <Link to='/shop'><button className='bg-green-800 px-4 py-3 text-white font-bold uppercase rounded mt-8 hover:cursor-pointer hover:bg-green-900 '>Visit Store</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
