import React, { useEffect } from 'react'
import styles from './NewStorePage.module.css'
import CreateStore from '../../../components/admin/forms/createStore/CreateStore'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../../../features/user/UserDetailsSlice';

const NewStorePage = ({ onNewStoreCreated }) => {
      const dispatch = useDispatch();
      const { userDto, loading } = useSelector((state) => state.userDetails);

      useEffect(() => {
            const fetchAdminInfo = async () => {
                  dispatch(fetchUserDetails());
            }
            fetchAdminInfo();
      }, [dispatch]);

  return (
    <div className={styles.main_component}>
      <div className={styles.form_section}>
            <CreateStore onComplete={onNewStoreCreated} />
      </div>
      <div className={styles.other_section}>
            <div className={styles.banner_text_wrap}>
                  <span>
                  Hey <span className={styles.user_name}>{`${userDto?.userName || 'Admin'}`}</span>!
                  </span>
                  <span>
                  Welcome to <span className={styles.platform_name}>ShopIt</span>. 🎉 Let’s get started by creating your first store!
                  </span>
            </div>
            <div 
                  className={styles.banner_wrap}
                  style={{backgroundImage: "url(https://shopitbuket.s3.ap-south-1.amazonaws.com/public/banner/bd5.png)"}}
            >
            </div>
      </div>      
    </div>
  )
}

export default NewStorePage