import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import UnknownPath from '../../pages/other/UnknownPath'
import UserHomePage from '../../pages/user/homePage/UserHomePage'
import UserCartPage from '../../pages/user/cart/UserCartPage'
import UserOrdersPage from '../../pages/user/order/UserOrdersPage'
import UserDetailsUpdatePage from '../../pages/user/userUpdate/auth/UserDetailsUpdatePage'
import UserAddressUpdatePage from '../../pages/user/userUpdate/address/UserAddressUpdatePage'
import UserWishListPage from '../../pages/user/wish/UserWishListPage'
import ForgetPasswordPage from '../../pages/user/userUpdate/auth/ForgetPasswordPage'
import OrderPaymentPage from '../../pages/user/payment/OrderPaymentPage'

const UserLayout = () => {
  return (
    <div>
      <Routes>
        <Route path='*' element={<UnknownPath />} />
        <Route path='/' element={<Navigate to={"/home"} replace />} />
        <Route path='/home' element={<UserHomePage />} />
        <Route path='/cart' element={<UserCartPage isLogged={true} />} />
        <Route path='/orders' element={<UserOrdersPage />} />
        <Route path='/payment' element={<OrderPaymentPage />} />
        <Route path='/security' element={<UserDetailsUpdatePage />} />
        <Route path='/addresses' element={<UserAddressUpdatePage />} />
        <Route path='/wishlist' element={<UserWishListPage />} />
        <Route path='/forget-pass' element={<ForgetPasswordPage />} />
        <Route path='/logout' element={<h1>Logout</h1>} />
      </Routes>
    </div>
  )
}

export default UserLayout
