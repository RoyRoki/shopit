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

const UserLayout = () => {
  return (
    <div>
      <Routes>
        <Route path='*' element={<UnknownPath />} />
        <Route path='/' element={<Navigate to={"/home"} replace />} />
        <Route path='/home' element={<UserHomePage />} />
        <Route path='/cart' element={<UserCartPage isLogged={true} />} />
        <Route path='/logout' element={<h1>Logout</h1>} />
        <Route path='/test' element={<TestPage />} />
      </Routes>
    </div>
  )
}

export default UserLayout
