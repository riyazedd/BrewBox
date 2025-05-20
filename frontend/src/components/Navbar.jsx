import {React,useState,useEffect} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import {CiShoppingCart, CiUser} from 'react-icons/ci'
import { useLogoutMutation } from '../slices/usersApiSlice'
import {logout} from '../slices/authSlice'
import { useSelector, useDispatch } from 'react-redux'

const Navbar = () => {
  const [active,setActive]= useState('home');
  const[firstname ,setFirstName]=useState();
  const {cartItems} = useSelector((state) => state.cart);
  const {userInfo} = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      const name = userInfo.name.split(' ');
      setFirstName(name[0]);
    }
  }, [userInfo]);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler=async()=>{
    try{
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login')
    }catch(err){
      console.log(err)
    }
  }
  
  return (
    <div className='w-full h-auto shadow-md flex items-center justify-between '>
        <Link to="/"><img src="/logo.png" alt="logo" className='w-30 ml-30' /></Link>
        <ul className='flex gap-10'>
            <Link to='/' onClick={()=>setActive('home')}><li className={`${active==='home' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>HOME</li></Link>
            <Link to='/shop' onClick={()=>setActive('shop')}><li className={`${active==='shop' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>SHOP</li></Link>
            <Link to='/subscription' onClick={()=>setActive('subscription')}><li className={`${active==='subscription' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>SUBSCRIPTION</li></Link>
            <Link to='/about-us' onClick={()=>setActive('about')}><li className={`${active==='about' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>ABOUT US</li></Link>
            <Link to='/contact-us' onClick={()=>setActive('contact')}><li className={`${active==='contact' ? 'underline underline-offset-4 font-bold text-green-900' : '' }`}>CONTACT US</li></Link>
        </ul>
        <div className='flex gap-6 text-3xl mr-30'>

        {userInfo ? (<div className="group relative inline-block">
         
          
          <CiUser className="cursor-pointer" />
          
          <div className="absolute top-5 right-0 mt-2 hidden w-40 rounded-md bg-white shadow-lg group-hover:block z-50">
            <ul className="py-1 text-lg text-gray-700">
            <p className="block px-4 py-2">Hello, {firstname}</p>
              {userInfo.isAdmin ? <>
                <li>
                <Link
                  to="/admin/productlist"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActive('')}
                >
                  Products
                </Link>
              </li>
              </> : <></>}
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setActive('')}
                >
                  Profile
                </Link>
              </li>
              <li>
              <Link
                  to="#"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>) : (<div className="group relative inline-block">
         
          
         <CiUser className="cursor-pointer" />
         
         <div className="absolute top-5 right-0 mt-2 hidden w-40 rounded-md bg-white shadow-lg group-hover:block z-50">
           <ul className="py-1 text-lg text-gray-700">
             <li>
               <Link
                 to="/login"
                 className="block px-4 py-2 hover:bg-gray-100"
                 onClick={() => setActive('')}
               >
                 Login
               </Link>
             </li>
             <li>
             <Link
                 to="/register"
                 className="block px-4 py-2 hover:bg-gray-100"
                 onClick={() => setActive('')}
               >
                 Register
               </Link>
             </li>
           </ul>
         </div>
       </div>)}
           
            <Link to='/cart' onClick={()=>setActive('')} className='relative'><CiShoppingCart  />
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
