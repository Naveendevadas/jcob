import { useState } from 'react'

import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom'
import Home from './page/Home'
import Cart from './page/Cart'
import About from './page/About'
import PlaceOrder from './page/PlaceOrder'
import Signin from './page/Signin'
import Contact from './page/Contact'
import Product from './page/Product'
import Order from './page/Order'
import Collections from './page/Collections'
import Navbar from './Components/Navbar'

function App() {

  return (
    <>

      <Router>
      <Routes>
        


        <Route path='/' element={<Home/>}/>
        <Route path='/Collections' element={<Collections/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/Cart' element={<Cart/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Place-Order' element={<PlaceOrder/>}/>
        <Route path='/Signin' element={<Signin />} />
        <Route path='/orders' element={<Order/> } />
        <Route path='/contact' element={<Contact/>}/>

      </Routes>
      </Router>
    </>
  )
}

export default App
