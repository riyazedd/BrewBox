import {useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useProfileMutation } from '../slices/usersApiSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice'
import Banner from '../components/Banner'
import { FaTimes } from 'react-icons/fa'

const ProfilePage = (props) => {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    const dispatch = useDispatch();

    const {userInfo} = useSelector((state)=>state.auth);
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();


    const [updateProfile , {isLoading:loadingUpdateProfile}] = useProfileMutation();

    useEffect(()=>{
        if(userInfo){
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    },[userInfo.name, userInfo.email])

    const submitHandler= async(e)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error("Password donot match!");
        }else{
            try{
                const res = await updateProfile({_id:userInfo._id,name,email,password}).unwrap();
                dispatch(setCredentials(res));
                toast.success("Profile Updated Successfully");
            }catch(error){
                toast.error(error?.data?.message || error.error);
            }
        }
    }
  return (
    <div>
      <Banner title={props.title} />
       <div className='flex '>
        <div className='flex flex-col items-center gap-5 mb-10 w-1/2'>
        <form onSubmit={submitHandler} className='mt-10 flex flex-col gap-6 w-2/3'>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="name">Username</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='John Doe' value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="email">Email</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='example@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600' htmlFor="password">Password</label>
            <input className='border rounded p-2 text-lg' type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600' htmlFor="confirmPassword">Confirm Password</label>
            <input className='border rounded p-2 text-lg' type="password" placeholder='Re-enter Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
            </div>
            <button type='submit' className='py-3 px-7 bg-green-800 text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer'>Update</button>
            {loadingUpdateProfile && <>Loding...</> }
        </form>
      </div>
      <div className="md:col-span-9 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">My Orders</h2>
      {isLoading ? (
       <>Loading... </>
      ) : error ? (
        <>
          {error?.data?.message || error.error}
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 font-semibold">ID</th>
                <th className="px-4 py-2 font-semibold">DATE</th>
                <th className="px-4 py-2 font-semibold">TOTAL</th>
                <th className="px-4 py-2 font-semibold">DELIVERED</th>
                <th className="px-4 py-2 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order._id}</td>
                  <td className="px-4 py-2">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-4 py-2">Rs.{order.totalPrice.toFixed(2)}</td>
                  
                  <td className="px-4 py-2">
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-600" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/order/${order._id}`}
                      className="inline-block px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
       </div>
    </div>
  )
}

export default ProfilePage
