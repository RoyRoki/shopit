import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../../../context';
import AdminRegister from '../../../components/auth/register/AdminRegister';
import UserRegister from '../../../components/auth/register/UserRegister';
import styles from './Register.module.css'
import Navber from '../../../components/home/navber/Navber';

export const RegisterPage = () => {
      const { auth } = useContext(AuthContext);
      const [SearchParams] = useSearchParams();
      const isAdmin = SearchParams.get('admin');
      const [isForAdmin, setIsForAdmin] = useState(false);
      const navigate = useNavigate();

      useEffect(() => {
            setIsForAdmin(isAdmin);
      }, [isAdmin]);

      return (
            <div className={styles.main}>
                  <Navber isLogged={false} />
                  <div className={styles.register_box}>
                        <div className={styles.box_wrap}>
                              {isForAdmin ? (
                                    <AdminRegister />
                              ) : (
                                    <UserRegister />
                              )}
                        </div>
                  </div>
            </div>
      );
};