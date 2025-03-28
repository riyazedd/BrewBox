import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements,RouterProvider,Route} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import CartPage from './pages/CartPage.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index="true" path='/' element={<HomePage title="shop" />}/>
      <Route path='/subscription' element={<SubscriptionPage title="subscription" />}/>
      <Route path='/about-us' element={<AboutUsPage title="about us" />}/>
      <Route path='/contact-us' element={<ContactUsPage title="contact us" />}/>
      <Route path='/cart' element={<CartPage title="Your Cart" />}/>
      <Route path='/product/:id' element={<ProductDetails />} title/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
