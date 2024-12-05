import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import Home from './page/Home'
import Cart from './page/Cart'
import About from './page/About'
import PlaceOrder from './page/PlaceOrder'
import Signin from './page/Signin'

function App() {

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] 1g:px-[9vw]'>
      <Routes>

        <Route path='/' element={<Home/>}/>
        <Route path='/products' element={<Products/>}/>
        <Route path='/Cart' element={<Cart/>}/>
        <Route path='/About' element={<About/>}/>
        <Route path='/Place-Order' element={<PlaceOrder/>}/>
        <Route path='/Signin' element={<Signin />} />
        <Route path='/orders' element={<Order/> } />

      </Routes>
      
    </div>
  )
}

export default App
