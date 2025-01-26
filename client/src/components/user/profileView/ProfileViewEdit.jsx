import React from 'react'
import styles from './ProfileViewEdit.module.css'
import { useNavigate } from 'react-router-dom'

const ProfileViewEdit = () => {
      const navigate = useNavigate();
  return (
    <div className={styles.main_container}>
      <div className={styles.main_header}>
            <h1>Your Account</h1>
      </div>
      {(
            <div className={styles.action_buttons_wrap}>
                  <div className={styles.action_box} onClick={() => navigate('/orders')}>
                        <div className={styles.action_box_img_frame}
                        style={{backgroundImage: 'url(logo/orderbox.png)'}}
                        ></div>
                        <div className={styles.action_box_info}>
                              <h2>Your Orders</h2>
                              <span>Track, return, or buy things again</span>
                        </div>
                  </div>
                  <div className={styles.action_box} onClick={() => navigate('/security')}>
                        <div className={styles.action_box_img_frame}
                        style={{backgroundImage: 'url(logo/security.png)'}}
                        ></div>
                        <div className={styles.action_box_info}>
                              <h2>Login & security</h2>
                              <span>Edit email, name, and mobile number</span>
                        </div>
                  </div>      
                  <div className={styles.action_box} onClick={() => navigate('/addresses')}>
                        <div className={styles.action_box_img_frame}
                        style={{backgroundImage: 'url(logo/address.png)'}}
                        ></div> 
                        <div className={styles.action_box_info}>
                              <h2>Your Addresses</h2>
                              <span>Edit addresses for orders and gifts</span>
                        </div>                       
                  </div>
                  <div className={styles.action_box} onClick={() => navigate('/wishlist')}>
                        <div className={styles.action_box_img_frame}
                        style={{backgroundImage: 'url(logo/wish.png)'}}
                        ></div>
                        <div className={styles.action_box_info}>
                              <h2>Wish List</h2>
                              <span>View your wish list, buy now</span>
                        </div>
                  </div>
                  <div className={styles.action_box} onClick={() => navigate('/cart')}>
                        <div className={styles.action_box_img_frame}
                        style={{backgroundImage: 'url(logo/shoping.png)'}}
                        ></div>
                        <div className={styles.action_box_info}>
                              <h2>Your Cart</h2>
                              <span>View your cart, manage now</span>
                        </div>
                  </div>
                  
                  <div className={styles.action_box} onClick={() => navigate('/contact_us')}>
                        <div className={styles.action_box_img_frame}
                        style={{backgroundImage: 'url(logo/contact.png)'}}
                        ></div>
                        <div className={styles.action_box_info}>
                              <h2>Contact Us</h2>
                              <span>Contact our customer service via phone or chat</span>
                        </div>
                  </div>
            </div>
      )}
    </div>
  )
}

export default ProfileViewEdit
