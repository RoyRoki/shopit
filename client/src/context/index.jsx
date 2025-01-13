import React, { createContext, useState, useEffect } from "react";
import { role } from "../util/ROLE";
import { request } from "../helper/AxiosHelper";

// Fetch user Role from Backend
const fetchUserRole = async () => {
    const userRole = await request("GET", "/api/role", );
    console.log("from backend role is ",userRole.data);
    if(userRole.data === "ADMIN") return role.admin;
    if(userRole.data === "USER") return role.user;
    return role.guest;
}

// Default context values
const defaultAuthContext = {
  auth: { profileMode: role.guest },
  handleProfileMode: () => {},
};

// Create the context
export const AuthContext = createContext(defaultAuthContext);

// Context Provider Component - use to Wrap the application 
export const ContextProvider = ({ children }) => {  
  const [auth, setAuth] = useState({ profileMode: role.guest });

  useEffect(() => {

    let isMounted = true;

    const initializedRole = async () =>  {
      const cacheRole = sessionStorage.getItem("profileMode");
      console.log("in session storage role is ",cacheRole);
      if (cacheRole) {
        // use the cached Role if available
        setAuth({ profileMode: cacheRole });
      } else {
        // Fetch role if not in cache storage
        const userRole =  await fetchUserRole();
        if(isMounted) {
          // Only update state if component is still mounted
          setAuth({ profileMode: userRole });
          sessionStorage.setItem("profileMode", userRole);
        }
       
      }
    };

    initializedRole();
    // Cleanup function: runs when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileMode = (mode) => {
    if (mode) {
      sessionStorage.setItem("profileMode", mode); // Update session storage
      setAuth({ ...auth, profileMode: mode });
    }
  };

  const updateProfileMode = async () => {
        const userRole =  await fetchUserRole();
        setAuth({ profileMode: userRole });
        sessionStorage.setItem("profileMode", userRole);
  }

  return (
    <AuthContext.Provider value={{ auth, handleProfileMode, updateProfileMode }}>
      {children}
    </AuthContext.Provider>
  );
};
