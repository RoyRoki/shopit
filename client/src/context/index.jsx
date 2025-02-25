import React, { createContext, useState, useEffect } from "react";
import { role } from "../util/ROLE";
import { request } from "../helper/AxiosHelper";

// Fetch user Role from Backend
const fetchUserRole = async () => {
    const userRole = await request("GET", "/api/role", );

    if(userRole.data === "ADMIN") return role.admin;
    if(userRole.data === "USER") return role.user;

    return role.guest;
}

// Default context values
const defaultAuthContext = {
  auth: { profileMode: role.guest, loading: true },
  handleProfileMode: () => {},
};

// Create the context
export const AuthContext = createContext(defaultAuthContext);

// Context Provider Component - use to Wrap the application 
export const ContextProvider = ({ children }) => {  
  const [auth, setAuth] = useState({ profileMode: role.guest, loading: true });

  useEffect(() => {

    let isMounted = true;

    const initializedRole = async () =>  {
      const cacheRole = sessionStorage.getItem("profileMode");
      if (cacheRole) {
        // use the cached Role if available
        setAuth({ profileMode: cacheRole, loading: false });
      } else {
        // Fetch role if not in cache storage
        const userRole =  await fetchUserRole();

        if(isMounted) {
          // Only update state if component is still mounted
          setAuth({ profileMode: userRole, loading: false  });
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
      setAuth({ ...auth, profileMode: mode, loading: false });
    }
  };

  const updateProfileMode = async () => {
        const userRole =  await fetchUserRole();
        setAuth({ profileMode: userRole, loading: false });
        sessionStorage.setItem("profileMode", userRole);
  }

  return (
    <AuthContext.Provider value={{ auth, handleProfileMode, updateProfileMode }}>
      {children}
    </AuthContext.Provider>
  );
};
