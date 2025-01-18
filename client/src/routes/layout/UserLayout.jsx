import React from 'react'
import { Navigate, replace, Route, Routes } from 'react-router-dom'
import UserHome from '../../components/user/UserHome'
import { UserPage } from '../../pages/User'
import { userPath } from '../../util/PATHVALUE'
import ProductsListPage from '../../pages/ProductsListPage'
import StoreHomePage from '../../pages/StoreHomePage'
import ItemsBySearchPage from '../../pages/ItemsBySearchPage'
import ProductHeroPage from '../../pages/ProductHeroPage'
import UnknownPath from '../../pages/UnknownPath'
import UserHomePage from '../../pages/user/homePage/UserHomePage'
import UserCartPage from '../../pages/user/cart/UserCartPage'
import TestPage from '../../../test/page/TestPage'
import UserOrdersPage from '../../pages/user/order/UserOrdersPage'
import UserDetailsUpdatePage from '../../pages/user/userUpdate/auth/UserDetailsUpdatePage'
import UserAddressUpdatePage from '../../pages/user/userUpdate/address/UserAddressUpdatePage'
import UserWishListPage from '../../pages/user/wish/UserWishListPage'
import ForgetPasswordPage from '../../pages/user/userUpdate/auth/ForgetPasswordPage'

const UserLayout = () => {
  return (
    <div>
      <Routes>
        <Route path='*' element={<UnknownPath />} />
        <Route path='/' element={<Navigate to={"/home"} replace />} />
        <Route path='/home' element={<UserHomePage />} />
        <Route path='/cart' element={<UserCartPage isLogged={true} />} />
        <Route path='/orders' element={<UserOrdersPage />} />
        <Route path='/security' element={<UserDetailsUpdatePage />} />
        <Route path='/addresses' element={<UserAddressUpdatePage />} />
        <Route path='/wishlist' element={<UserWishListPage />} />
        <Route path='/forget-pass' element={<ForgetPasswordPage />} />
        <Route path='/logout' element={<h1>Logout</h1>} />
        <Route path='/test' element={<TestPage />} />
      </Routes>
    </div>
  )
}

export default UserLayout
