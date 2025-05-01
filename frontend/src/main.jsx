import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements,RouterProvider,Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index="true" path='/' element={<HomePage title="shop" />}/>
      <Route path='/subscription' element={<SubscriptionPage title="subscription" />}/>
      <Route path='/about-us' element={<AboutUsPage title="about us" />}/>
      <Route path='/contact-us' element={<ContactUsPage title="contact us" />}/>
      <Route path='/cart' element={<CartPage title="Your Cart" />}/>
      <Route path='/login' element={<LoginPage title="Login" />}/>
      <Route path='/register' element={<RegisterPage title="Sign Up" />}/>
      <Route path='/product/:id' element={<ProductDetails />} />
      
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
  <RouterProvider router={router} />
  </Provider>
    
  </StrictMode>,
)
