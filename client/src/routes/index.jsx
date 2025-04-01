import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../context";
import { role } from "../util/ROLE";
import UserLayout from "./layout/UserLayout";
import HomeLayout from "./layout/HomeLayout";
import ContactUsPage from "../pages/shopitHelp/contactus/ContactUsPage"
import AdminLayout from "./layout/AdminLayout";
import TestPage from './../../test/page/TestPage'
import LoadingPage from "../pages/shopitHelp/loadingPage/LoadingPage";

// Define routes based on role
const RootRoutes = () => {
  const { auth } = useContext(AuthContext);

  // Show loading page while auth is being determined
  if (!auth || auth.loading) {
    return <LoadingPage />;
  } 

  return (
    <Routes>


      {/* Guest Routes */}
      {auth.profileMode === role.guest && (
        <>
          <Route path="*" element={<HomeLayout />} />
        </>
      )}

      {/* User Routes */}
      {auth.profileMode === role.user && (
        <>
          <Route path="*" element={<UserLayout />} />
        </>
      )}

      {/* Admin Routes */}
      {auth.profileMode === role.admin && <Route path="*" element={<AdminLayout />} />}

      {/* For Public pages*/}
      <Route path="/contact_us" element={<ContactUsPage />} />
      <Route path="/test" element={<TestPage />} />

    </Routes>
  )
}

export default RootRoutes;
