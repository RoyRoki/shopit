import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestHome } from '../../pages/guest/GuestHome'
import UnknownPath from '../../pages/other/UnknownPath'
import { LoginPage } from '../../pages/auth/login/LoginPage'
import { RegisterPage } from '../../pages/auth/register/RegisterPage'
import UserCartPage from '../../pages/user/cart/UserCartPage'

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
      </Routes>
    </div>
  )
}

export default HomeLayout
