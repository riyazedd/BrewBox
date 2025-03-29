import React from 'react'
import Navbar from './components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import {motion} from 'motion/react'

const App = () => {
  const location=useLocation();
  return (
    <>
    <Navbar />
    <div>
    <motion.div key={location.pathname} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1}}>
      <Outlet />
      </motion.div> 
    </div>
    </>
  )
}

export default App
