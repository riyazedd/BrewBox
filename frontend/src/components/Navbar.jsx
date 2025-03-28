import React from 'react'
import { Link } from 'react-router-dom'
import {CiShoppingCart, CiUser} from 'react-icons/ci'

const Navbar = () => {
  return (
    <div className='w-full h-auto shadow-md flex items-center justify-between'>
        <img src="/logo.png" alt="logo" className='w-30 ml-30' />
        <ul className='flex gap-10'>
            <Link to='/'><li>SHOP</li></Link>
            <Link to='/subscription'><li>SUBSCRIPTION</li></Link>
            <Link to='/about-us'><li>ABOUT US</li></Link>
            <Link to='/contact-us'><li>CONTACT US</li></Link>
        </ul>
        <div className='flex gap-6 text-3xl mr-30'>
            <CiUser />
            <Link to='/cart'><CiShoppingCart /></Link>
        </div>
    </div>
  )
}

export default Navbar
