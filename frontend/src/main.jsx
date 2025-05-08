import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, createRoutesFromElements,RouterProvider,Route} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store.js'
import './index.css'
import App from './App.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import ShopPage from './pages/ShopPage.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import SubscriptionPage from './pages/SubscriptionPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import ContactUsPage from './pages/ContactUsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ShippingPage from './pages/ShippingPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'

const router=createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index="true" path='/' element={<HomePage/>}/>
      <Route path='/shop' element={<ShopPage title="shop" />}/>
      <Route path='/subscription' element={<SubscriptionPage title="subscription" />}/>
      <Route path='/about-us' element={<AboutUsPage title="about us" />}/>
      <Route path='/contact-us' element={<ContactUsPage title="contact us" />}/>
      <Route path='/cart' element={<CartPage title="Your Cart" />}/>
      <Route path='/login' element={<LoginPage title="Login" />}/>
      <Route path='/register' element={<RegisterPage title="Sign Up" />}/>
      <Route path='/product/:id' element={<ProductDetails />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage title="Shipping"/>} />
        <Route path='/payment' element={<PaymentPage title="Payment"/>} />
      </Route>
      
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
