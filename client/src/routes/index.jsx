import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../context";
import { AdminHome } from "../pages/Admin";
import { role } from "../util/ROLE";
import UserLayout from "./layout/UserLayout";
import HomeLayout from "./layout/HomeLayout";
import AboutPage from "../pages/shopitHelp/about/AboutPage"
import ContactUsPage from "../pages/shopitHelp/contactus/ContactUsPage"
import AdminLayout from "./layout/AdminLayout";

// Define routes based on role
const RootRoutes = () => {
  const { auth } = useContext(AuthContext);

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
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact_us" element={<ContactUsPage />} />

    </Routes>
  )
}

export default RootRoutes;
