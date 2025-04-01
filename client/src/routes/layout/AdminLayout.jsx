import React from 'react'
import { Route, Routes } from 'react-router-dom'
import UnknownPath from '../../pages/other/UnknownPath'
import HomeDashBoard from '../../pages/admin/homeDashBoard/HomeDashBoard'

const AdminLayout = () => {
  return (
    <div>
      <Routes>
            <Route path='*' element={<UnknownPath />} />
            <Route path='/home' element={<HomeDashBoard />} />
      </Routes>
    </div>
  )
}

export default AdminLayout
