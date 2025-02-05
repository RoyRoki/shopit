import React, { useState } from 'react'
import { get, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { request, publicRequest } from '../../../helper/AxiosHelper';
import { urls } from '../../../util/URLS';
import styles from './UserRegister.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const UserRegister = () => {

       const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
      } = useForm();

      const navigate = useNavigate();

      const [isOtpSend, setOtpSend] = useState(false);
      const [showPassword, setShowPassword] = useState(false);

      const onSubmit = async (data) => {
            try {
                  await verifyOtp(data);
                  const response = await publicRequest("POST", urls.userRegister, 
                        {userName: data.userName,
                         mobileNo: data.mobileNo,
                         email: data.email,
                         password: data.password,
                         });
                  if(response.status === 200) {
                        navigate('/login');
                  }
            } catch(errors) {
                  console.error(errors);
            }
      }

      const getOtp = async () => {
            const mobileNo = watch("mobileNo");
            
            if(!mobileNo || mobileNo === "") {
                  return;
            } else {

                  
                  console.log("send otp to ", mobileNo);
                  try {
                        const response = await publicRequest("POST", urls.generateOtpUnique, {mobileNo: mobileNo});
                        setOtpSend(true);
                        
                  } catch(error) {
                        console.error(error);
                  }
            }
      }

      const verifyOtp = async (data) => {
            try {
                  const response = await publicRequest("POST", urls.verifyOtp, {
                        otp: data.otp,
                        mobileNo: data.mobileNo,
                  });
            } catch(error) {
                  console.error(error);
            }
      }

  return (
      <div className={styles.main_container}>
            <h2>Join the Shopping Fun!</h2>
      <form onSubmit={handleSubmit(onSubmit)}> 
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label>Full Name</label>
                  <input type="text" placeholder=' ' {...register("userName")} />
            </div>
            </div>

            
            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Phone Number</label>
                  <input type="text" placeholder=' ' {...register("mobileNo")} />
            </div>                  
            </div>

            <div className={`${styles.form_row} ${styles.form_otp_row}`}>    
            <div className={`${styles.form_input_box}`}>
                  <label >OTP</label>
                  <input type="text" placeholder=' ' {...register("otp")} required />
            </div>
                  <div className={styles.get_otp_box}>
                  {
                        !isOtpSend ? (
                        <button className={styles.get_otp_btn} onClick={() => getOtp()} >Get Otp</button> 
                        ) : (
                        <button className={styles.get_otp_btn} onClick={() => getOtp()} >Resend Otp</button>
                        )
                  }
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
            </div>
            <div className={styles.form_submit_box}>
                  <button type='submit' className={styles.form_submit_button}>
                        Submit
                  </button>               
            </div>

      </form>

    </div>
  )
}

export default UserRegister
