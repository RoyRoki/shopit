import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../context';
import { replace, useNavigate } from 'react-router-dom';
import { role } from '../../util/ROLE';

const UnknownPath = () => {
      const { auth } = useContext(AuthContext);
      const navigate = useNavigate();

      useEffect(() => {
        if(auth.profileMode === role.admin) {
          navigate("/home", replace);
        }
      }, [auth.profileMode, navigate]);

  return (
    <div>
      <h1>Unknown {auth.profileMode}</h1>
    </div>
  )
}

export default UnknownPath
