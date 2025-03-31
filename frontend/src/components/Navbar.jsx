import {React,useState} from 'react'
import { Link } from 'react-router-dom'
import {CiShoppingCart, CiUser} from 'react-icons/ci'
import { useSelector } from 'react-redux'

const Navbar = () => {
  const [active,setActive]= useState('');
  const {cartItems} = useSelector((state) => state.cart);
  // console.log(cartItems);
  return (
    <div className='w-full h-auto shadow-md flex items-center justify-between '>
        <Link to="/"><img src="/logo.png" alt="logo" className='w-30 ml-30' /></Link>
        <ul className='flex gap-10'>
            <Link to='/' onClick={()=>setActive('')}><li className={`${active==='' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>SHOP</li></Link>
            <Link to='/subscription' onClick={()=>setActive('subscription')}><li className={`${active==='subscription' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>SUBSCRIPTION</li></Link>
            <Link to='/about-us' onClick={()=>setActive('about')}><li className={`${active==='about' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>ABOUT US</li></Link>
            <Link to='/contact-us' onClick={()=>setActive('contact')}><li className={`${active==='contact' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>CONTACT US</li></Link>
        </ul>
        <div className='flex gap-6 text-3xl mr-30'>
            <CiUser />
            <Link to='/cart' onClick={()=>setActive('cart')} className='relative'><CiShoppingCart  />
            {cartItems.length > 0 && (
            <span className="absolute top-[-8px] right-[-8px] bg-red-600 text-white text-sm px-2 rounded-full">
              {cartItems.reduce((a,c)=>a+c.quantity,0)}
            </span>
          )}
            </Link>
        </div>
    </div>
  )
}

export default Navbar
