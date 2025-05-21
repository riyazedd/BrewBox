import Hero from '../components/Hero'
import TopRated from '../components/TopRated.jsx'
import Recommended from '../components/Recommended'
// import ProductCarousel from '../components/ProductCarousel'

const HomePage = () => {
  return (
    <div className='h-full'>
      <Hero />
      <div className='mt-20'>
        {/* <ProductCarousel /> */}
        <TopRated />
      </div>
      <div className='mt-20'>
        <Recommended />
      </div>
    </div>
  )
}

export default HomePage
