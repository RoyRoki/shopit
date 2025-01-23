import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UnknownPath from '../../pages/UnknownPath'
import HomeDashBoard from '../../pages/admin/homeDashBoard/HomeDashBoard'
import { AdminHome } from '../../pages/Admin'

const AdminLayout = () => {
  return (
    <div>
      <Routes>
            <Route path='*' element={<UnknownPath />} />
            <Route path='/home' element={<HomeDashBoard />} />
            <Route path='/test' element={<AdminHome />} />
      </Routes>
    </div>
  )
}

export default AdminLayout
