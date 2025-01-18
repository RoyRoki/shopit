import React, { useState } from 'react'
import styles from './ForgetPasswordPage.module.css'
import Navber from '../../../../components/home/navber/Navber'
import { replace, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { request } from '../../../../helper/AxiosHelper'
import { urls } from '../../../../util/URLS'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ForgetPasswordPage = () => {
      const navigate = useNavigate();
      const [isOtpSend, setOtpSend] = useState(false);
      const [using, setUsing] = useState({field: "mobile", value: ""});
      const [showPassword, setShowPassword] = useState(false);

      const {
            register,
            handleSubmit,
            reset
      } = useForm();

      const onSubmit = async (data) => {
            const requestData = {...data, [using.field]: using.value}
            try {
                  const response = await request("PUT", urls.updatePasswordVaiOtp, requestData);
                  if(response.status === 200) {
                        navigate("/security", replace);
                  } else {
                        console.log(response);
                  }
            } catch (error) {
                  console.error(error.response);
            }
      }

      const handleRequest = async (field, value) => {
            if(value.trim() === "") {
              alert("Please fill valid "+field);    
              return;
            } 
            try {
                  const response = await request("POST", `${urls.forgetPasswordRequest}${field}=${value}`);
                  if(response.status === 200) {
                        setOtpSend(true);
                  }
            } catch (error) {
                  console.error(error);
            }
      }

  return (
    <div>
      <Navber isLogged={true} />
      <div className={styles.main_container}>
            <div className={styles.header}>
                  <h1>Reset your password.</h1>
            </div>
            <div className={styles.form_wrap}>
                  {!isOtpSend ? (
                        <div className={styles.form_box}>
                              {using.field === "email" ? (
                                    <div className={styles.input_box}>
                                          <label>Email</label>
                                          <input 
                                                type="email" 
                                                value={using.value} 
                                                onChange={(e) => setUsing({field: "email", value: e.target.value})} 
                                          />                          
                                    </div>

                              ) : (
                                    <div className={styles.input_box}>
                                          <label>Mobile No</label>
                                          <input 
                                                type="text" 
                                                value={using.value}
                                                onChange={(e) => setUsing({field: "mobile" , value: e.target.value})}
                                          />
                                    </div>
                              )}
                        </div>
                  ) : (
                        <div className={styles.form_box}>
                              <div className={styles.input_box}>
                                    <label>{using.field === "email" ? 'Email' : 'Mobile No'}</label>
                                    <span>{using.value}</span>
                              </div>
                              <div className={styles.input_box}>
                                    <label>Otp</label>
                                    <input type="text" {...register("otp")} />
                              </div>
                              <div className={styles.input_box}>
                                    <label>New Password</label>
                                    <div className={styles.pass_box}>
                                          <input type={showPassword ? 'text' : 'password'}
                                                placeholder=' ' 
                                                {...register("newPassword")} />
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
                  )}

                  <div className={styles.action_box}>
                        {!isOtpSend ? (
                              <button onClick={() => handleRequest(using.field, using.value)}>Send Otp</button>
                        ) : (
                        <button onClick={handleSubmit(onSubmit)}>Update Password</button>   
                        )}
                  </div>
                  {!isOtpSend ? (
                        <div className={styles.other_action}>
                        {using.field === "mobile" ? (
                                    <button onClick={() => setUsing({field: "email", value: ""})}>Use email</button>
                        ) : (
                                    <button onClick={() => setUsing({field: "mobile", value: ""})}>Use mobile</button>
                        )} 
                        </div>
                  ) : (
                        <div className={styles.cancel_btn}>
                        <button onClick={() => {
                              setOtpSend(false);
                              setUsing({field: "mobile", value: ""});
                              reset()
                        }}>Cancel</button>  
                        </div>
                  )}
            </div>
      </div>
    </div>
  )
}

export default ForgetPasswordPage
