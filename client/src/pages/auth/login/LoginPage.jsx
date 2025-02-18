import React from 'react'
import styles from './Login.module.css'
import LoginComponent from '../../../components/auth/login/LoginComponent'
import Navber from '../../../components/home/navber/Navber';

export const LoginPage = () => {

      return (
            <div className={styles.main}>
                  <Navber isLogged={false} />
                  <div className={styles.login_box}>
                        <div className={styles.box_wrap}>
                              <LoginComponent />
                        </div>
                  </div>
            </div>
      )
};