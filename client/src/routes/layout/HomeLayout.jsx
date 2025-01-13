import React from 'react'
import { Navigate, replace, Route, Routes, useNavigate } from 'react-router-dom'
import ProductHeroPage from '../../pages/ProductHeroPage'
import { GuestHome } from '../../pages/guest/GuestHome'
import UnknownPath from '../../pages/UnknownPath'
import ProductsListPage from '../../pages/ProductsListPage'
import StoreHomePage from '../../pages/StoreHomePage'
import ItemsBySearchPage from '../../pages/ItemsBySearchPage'
import { LoginPage } from '../../pages/auth/LoginPage'
import { RegisterPage } from '../../pages/auth/RegisterPage'
import UserCartPage from '../../pages/user/cart/UserCartPage'

import TestPage from '../../../test/page/TestPage'

const HomeLayout = () => {
  return (
    <div>
      <Routes>
            <Route path='*' element={<UnknownPath />} />
            <Route path='/' element={<Navigate to={"/home"} replace />} />
            <Route path='/home' element={<GuestHome />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/cart' element={<UserCartPage isLogged={false} />} />
            <Route path='/test' element={<TestPage />} />
      </Routes>
    </div>
  )
}

export default HomeLayout
