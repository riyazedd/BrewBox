import {useState, useEffect} from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import Banner from '../components/Banner'
import { useDispatch,useSelector } from 'react-redux'
import { useLoginMutation } from '../slices/usersApiSlice'
import {setCredentials} from '../slices/authSlice'
import { toast } from 'react-toastify'

const LoginPage = (props) => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login,{isLoading}]= useLoginMutation();

    const {userInfo} = useSelector((state)=>state.auth);

    const {search}=useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(()=>{
      if(userInfo){
        if(userInfo.isAdmin){
          navigate('/admin/dashboard');
        } else {
          navigate(redirect);
        }
      }
    },[userInfo,redirect,navigate]);

    const submitHandler= async (e)=>{
      e.preventDefault();
      try{
        const res = await login({email,password}).unwrap();
        dispatch(setCredentials({...res,}));
        if(res.isAdmin){
          navigate('/admin/dashboard');
        } else {
          navigate(redirect);
        }
        toast.success("Logged in Successfully")

      }catch(err){
        toast.error(err?.data?.message || err.error);
      }
    }

  return (
    <div>
      <Banner title={props.title} />
      <div className='flex flex-col items-center gap-5 px-4 sm:px-0'>
        <form onSubmit={submitHandler} className='w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mt-10 flex flex-col gap-6'>
          <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="email">Email</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="text" placeholder='example@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-lg sm:text-xl font-semibold text-gray-600' htmlFor="password">Password</label>
            <input className='border rounded p-2 text-base sm:text-lg' type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <button type='submit' className='py-3 px-7 bg-green-800 text-base sm:text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer'>Login</button>
        </form>
        <div className='text-base sm:text-lg'>
          <p>New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/'} className='underline text-green-700'>Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
