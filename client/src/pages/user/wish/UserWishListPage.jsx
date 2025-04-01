import React from 'react'
import styles from './UserWishListPage.module.css'
import { useNavigate } from 'react-router-dom'
import Navber from '../../../components/home/navber/Navber';

const UserWishListPage = () => {
  const navigate = useNavigate();

  return (
    <div>
        <Navber isLogged={true} />
    
        <div className={styles.header}>
          <span onClick={() => navigate("/home?profile_view=true")}>
            Profile
          </span>{" "}
          {` > `}
          <span
            onClick={() => {
              setShowForm(false);
            }}
          >
            UserWishListPage
          </span>
        </div>
      
    </div>
  )
}

export default UserWishListPage
