import React from 'react'
import Hero from '../components/Hero'
import BestSellers from '../components/BestSellers'
import Recommended from '../components/Recommended'

const HomePage = () => {
  return (
    <div className='h-full'>
      <Hero />
      <div className='mt-20'>
        <BestSellers />
      </div>
      <div className='mt-20'>
        <Recommended />
      </div>
    </div>
  )
}

export default HomePage
