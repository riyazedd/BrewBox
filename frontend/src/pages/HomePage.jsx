import Hero from '../components/Hero'
import TopRated from '../components/TopRated.jsx'
import Recommended from '../components/Recommended'

const HomePage = () => {
  
  return (
    <div className='h-full'>
      <Hero />
      <div className='mt-20'>
        {/* <ProductCarousel /> */}
        <TopRated />
      </div>
      <div className='mt-20'>
        {/* pass userId only if available */}
        <Recommended />
      </div>
    </div>
  )
}

export default HomePage
