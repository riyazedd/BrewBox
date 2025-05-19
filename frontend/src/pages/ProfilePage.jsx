import {useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useProfileMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import Banner from '../components/Banner'

const ProfilePage = (props) => {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");

    const dispatch = useDispatch();

    const {userInfo} = useSelector((state)=>state.auth);

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
       <div className='flex flex-col items-center gap-5 mb-10'>
        <form onSubmit={submitHandler} className='w-1/3 mt-10 flex flex-col gap-6'>
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
    </div>
  )
}

export default ProfilePage
