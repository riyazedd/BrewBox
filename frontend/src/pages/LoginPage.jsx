import {useState} from 'react'
import { Link } from 'react-router-dom'
import Banner from '../components/Banner'

const LoginPage = (props) => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

  return (
    <div>
      <Banner title={props.title} />

      <div className='flex flex-col items-center gap-5'>
        <form className='w-1/3 mt-10 flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600'  htmlFor="email">Email</label>
            <input className='border rounded p-2 text-lg' type="text" placeholder='example@gmail.com' value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='flex flex-col gap-2'>
            <label className='text-xl font-semibold text-gray-600' htmlFor="password">Password</label>
            <input className='border rounded p-2 text-lg' type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <button className='py-3 px-7 bg-green-800 text-lg text-white font-semibold rounded hover:bg-green-700 hover:cursor-pointer'>Login</button>
        </form>
        <div className='text-lg'>
            <p>New Customer? <Link to='/register' className='underline text-green-700'>Register</Link></p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
