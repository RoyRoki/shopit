import React, {useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context';
import { role } from '../util/ROLE';

function LogoutComponent() {
      const { handleProfileMode } = useContext(AuthContext);
      const navigate = useNavigate();

      const handleOnclick = (e) => {
            e.preventDefault();

            // Clear storage
            localStorage.clear();
            sessionStorage.clear();

            // Reset Role to guest
            handleProfileMode(role.guest);
            
            navigate("/");
      };

  return (
    <>
      <hr className='bg-black h-1 mt-10'/>
      <button className='bg-blue-600 text-white hover:bg-blue-700 rounded-sm m-5 p-2' onClick={handleOnclick}>Logout</button>
    </>
  )
}

export default LogoutComponent
