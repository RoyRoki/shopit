import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { get, useForm } from 'react-hook-form'
import { request, publicRequest } from '../../../helper/AxiosHelper'
import { setAuthToken, setRefreshToken } from '../../../helper/TokenService';
import { AuthContext } from '../../../context';
import { loginVai } from '../../../util/LOGIN'
import { urls } from '../../../util/URLS';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './LoginUI.module.css'

const LoginComponent = () => {

    const navigate = useNavigate();

    const { updateProfileMode } = useContext(AuthContext);
    const [isOtpSend, setOtpSend] = useState(false);
    const [isVaiOtp, setIsVaiOtp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
      } = useForm();

    const [loginMth, setLoginMth] = useState(loginVai.mobilepass);

    const updateCart = async () => {
      const localCart =  JSON.parse(localStorage.getItem("cart")) || { cartItems: [], totalCartPrice: 0 };
      const query = localCart.cartItems?.reduce((acc, cartItem) => {
            if (cartItem?.product?.id && cartItem?.quantity) {
                  acc[cartItem.product.id] = cartItem.quantity;
            }
            return acc;
      }, {});
      try {
            const response = await request("PUT", urls.updateCart, query);
            if(response.status === 200) {
            localStorage.removeItem("cart");
            }
      } catch (error) {
            console.log(error.response);
      }      
    }

    const onSubmit = async (data) => {
       if(!isVaiOtp) {
            const requestData = {mobileNo: data.mobileNo, email: data.email, password: data.password};
            try {
                  const response = await publicRequest("POST", urls.loginPass, requestData);
                  if(response.status === 200) {
                        if(response.data.jwt) {
                              setAuthToken(response.data.jwt);
                        }
                        if(response.data.refreshToken) {
                              setRefreshToken(response.data.refreshToken);
                        }
                        await updateProfileMode();
                        navigate("/");
                  }
                  updateCart();
            } catch (error) {
                  console.error(error);
            }
       } else {
            // Login Vai Otp service
            try {
                  const response = await publicRequest("POST", urls.loginOtp, {mobileNo: data.mobileNo, email: data.email, otp: data.otp});
                  if(response.status === 200) {
                        if(response.data.jwt) {
                              setAuthToken(response.data.jwt);
                        }
                        if(response.data.refreshToken) {
                              setRefreshToken(response.data.refreshToken);
                        }
                        await updateProfileMode();
                        navigate("/"); 
                  }
                  updateCart();
            } catch (error) {
                  console.error(error);
            }
       }
      
    }

    const getOtp = async () => {
        if(loginMth === loginVai.mobileotp) {
            const mobileNo = watch("mobileNo");
            
            if(!mobileNo || mobileNo === "") {
                  return;
            } else {

                  try {
                        const response = await publicRequest("POST", urls.generateOtp, {mobileNo: mobileNo});
                        setOtpSend(true);
                        
                  } catch(error) {
                        console.error(error);
                  }
            } 
        }
        if(loginMth === loginVai.emailotp) {
            const email = watch("email");

            if(!email || email === "") {
                console.log("email is empty");
                return;
            } else {

                console.log("send otp to ",email);
                try {
                    const response = await publicRequest("POST", urls.generateOtp, {email: email});
                    setOtpSend(true);
                } catch(error) {
                    console.error(error.response);
                }
            }
        }
           
      }

  return (
    <div className={styles.main_container}>
      <h2>Login Now</h2>
      <form onSubmit={handleSubmit(onSubmit)}> 

            {loginMth === loginVai.mobilepass && (
            <>
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Mobile No</label>
                  <input type="text" placeholder=' ' {...register("mobileNo")} />
            </div>                  
            </div> 
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Password</label>
                  <div className={styles.pass_box}>
                        <input type={showPassword ? 'text' : 'password'}
                              placeholder=' ' 
                              {...register("password")} />
                        <span
                              className={`${showPassword ? styles.pass_show : styles.pass_hide}`}
                              onMouseEnter={() => setShowPassword(true)}
                              onMouseLeave={() => setShowPassword(false)}
                        >
                        {showPassword ? (
                              <FontAwesomeIcon icon="fa-regular fa-eye" />
                        ) : (
                              <FontAwesomeIcon icon="fa-regular fa-eye-slash" />
                        )}
                        </span>
                  </div>
            </div>                  
            </div></>             
            )}

            {loginMth === loginVai.emailpass && (<>
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Email Id</label>
                  <input type="email" placeholder=' ' {...register("email")} />
            </div>                  
            </div>
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Password</label>
                  <div className={styles.pass_box}>
                        <input type={showPassword ? 'text' : 'password'}
                              placeholder=' ' 
                              {...register("password")}/>
                        <span
                              className={`${showPassword ? styles.pass_show : styles.pass_hide}`}
                              onMouseEnter={() => setShowPassword(true)}
                              onMouseLeave={() => setShowPassword(false)}
                        >
                        {showPassword ? (
                              <FontAwesomeIcon icon="fa-regular fa-eye" />
                        ) : (
                              <FontAwesomeIcon icon="fa-regular fa-eye-slash" />
                        )}
                        </span>
                  </div>
            </div>                  
            </div>
            </>            
            )}

            {loginMth === loginVai.mobileotp && (
            <>
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Mobile No</label>
                  <input type="text" placeholder=' ' {...register("mobileNo")} />
            </div>                  
            </div>
            <div className={`${styles.form_row} ${styles.form_otp_row}`}>    
            <div className={`${styles.form_input_box}`}>
                  <label>OTP</label>
                  <input type="text" placeholder=' ' {...register("otp")} required />
            </div>
                  <div className={styles.get_otp_box}>
                  {(loginMth === loginVai.emailotp || loginMth === loginVai.mobileotp) && (
                        !isOtpSend ? (
                        <button className={styles.get_otp_btn} onClick={() => getOtp()} >Get Otp</button> 
                        ) : (
                        <button className={styles.get_otp_btn} onClick={() => getOtp()} >Resend Otp</button>
                        )
                  )}
                  </div>
            </div>
            </>             
            )}
            {loginMth === loginVai.emailotp && (
            <>
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label>Email Id</label>
                  <input type="email" placeholder=' ' {...register("email")} />
            </div>                  
            </div>
            <div className={`${styles.form_row} ${styles.form_otp_row}`}>    
            <div className={`${styles.form_input_box}`}>
                  <label >OTP</label>
                  <input type="text" placeholder=' ' {...register("otp")} required />
            </div>
                  <div className={styles.get_otp_box}>
                  {(loginMth === loginVai.emailotp || loginMth === loginVai.mobileotp) && (
                        !isOtpSend ? (
                        <button className={styles.get_otp_btn} onClick={() => getOtp()} >Get Otp</button> 
                        ) : (
                        <button className={styles.get_otp_btn} onClick={() => getOtp()} >Resend Otp</button>
                        )
                  )}
                  </div>
            </div>
            </>             
            )}
            
            <div className={styles.form_submit_box}>
                  <button type='submit' className={styles.form_submit_button}>
                        Submit
                  </button>               
            </div>

      </form>

        <div className={styles.login_method_box}>
        {(loginMth === loginVai.mobilepass) && !isVaiOtp && (
            <button className={styles.login_mth_btn} onClick={() => setLoginMth(loginVai.emailpass)}>Use Email</button>
        )}
        {(loginMth === loginVai.emailpass) && !isVaiOtp && (
            <button className={styles.login_mth_btn} onClick={() => setLoginMth(loginVai.mobilepass)}>Use Mobile</button>
        )}

        {(loginMth === loginVai.mobileotp) && isVaiOtp && (
            <button className={styles.login_mth_btn}  onClick={() => setLoginMth(loginVai.emailotp)}>Use Email</button>
        )}
        {(loginMth === loginVai.emailotp) && isVaiOtp && (
            <button className={styles.login_mth_btn}  onClick={() => setLoginMth(loginVai.mobileotp)}>Use Mobile</button>
        )}
       
        {isVaiOtp ? (
                <button className={styles.login_mth_btn}  onClick={() => {setIsVaiOtp(!isVaiOtp), setLoginMth(loginVai.mobilepass)}}>Vai Password</button>
            ) : (
                <button className={styles.login_mth_btn}  onClick={() => {setIsVaiOtp(!isVaiOtp), setLoginMth(loginVai.mobileotp)}}>Vai Otp</button>   
            ) 
        }            
        </div>



    </div>
  );
};

export default LoginComponent;
