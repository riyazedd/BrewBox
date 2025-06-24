import Hero from '../components/Hero'
import TopRated from '../components/TopRated.jsx'
import Recommended from '../components/Recommended'
import { useSelector } from 'react-redux'  // or your auth context

const HomePage = () => {
  // get user id from your auth state - adjust according to your setup
  const userLogin = useSelector((state) => state.auth)
  const userId = userLogin?.userInfo?._id

  return (
    <div className='h-full'>
      <Hero />
      <div className='mt-20'>
        {/* <ProductCarousel /> */}
        <TopRated />
      </div>
      <div className='mt-20'>
        {/* pass userId only if available */}
        {userId ? <Recommended userId={userId} /> : <p>Please login to see recommendations.</p>}
      </div>
    </div>
  )
}

export default HomePage
