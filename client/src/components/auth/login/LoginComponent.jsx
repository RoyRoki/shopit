import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { get, useForm } from "react-hook-form";
import { request, publicRequest } from "../../../helper/AxiosHelper";
import { setAuthToken, setRefreshToken } from "../../../helper/TokenService";
import { AuthContext } from "../../../context";
import { loginVai } from "../../../util/LOGIN";
import { urls } from "../../../util/URLS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./LoginUI.module.css";
import PopupNotification from "../../popup/notification/PopupNotification";

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
  const [popup, setPopup] = useState(null);
  const [timer, setTimer] = useState(60);

  const updateCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart")) || {
      cartItems: [],
      totalCartPrice: 0,
    };
    const query = localCart.cartItems?.reduce((acc, cartItem) => {
      if (cartItem?.product?.id && cartItem?.quantity) {
        acc[cartItem.product.id] = cartItem.quantity;
      }
      return acc;
    }, {});
    try {
      const response = await request("PUT", urls.updateCart, query);
      if (response.status === 200) {
        localStorage.removeItem("cart");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const onSubmit = async (data) => {
    if (!isVaiOtp) {
      // Login using password
      const requestData = {
        mobileNo: data.mobileNo,
        email: data.email,
        password: data.password,
      };

      try {
        const response = await publicRequest(
          "POST",
          urls.loginPass,
          requestData
        );

        if (response.status === 200) {
          setPopup({ message: "Login Successful!", type: "success" });
          if (response.data.jwt) {
            setAuthToken(response.data.jwt);
          }
          if (response.data.refreshToken) {
            setRefreshToken(response.data.refreshToken);
          }
          await Promise.all([updateProfileMode(), updateCart()]);
          setTimeout(() => navigate("/"), 1000);
        }
      } catch (error) {
        console.error(error);
        setPopup({ message: "Login Failed. Try Again!", type: "error" });
      }
    } else {
      // Login Vai Otp service
      try {
        const response = await publicRequest("POST", urls.loginOtp, {
          mobileNo: data.mobileNo,
          email: data.email,
          otp: data.otp,
        });
        if (response.status === 200) {
          setPopup({ message: "Login Successful!", type: "success" });
          if (response.data.jwt) {
            setAuthToken(response.data.jwt);
          }
          if (response.data.refreshToken) {
            setRefreshToken(response.data.refreshToken);
          }
          await Promise.all([updateProfileMode(), updateCart()]);

          navigate("/");
        } else {
          setPopup({ message: "Login Failed. Try Again!", type: "error" });
        }
      } catch (error) {
        console.error(error);
        if (error?.response?.status === 401) {
          setPopup({ message: "OTP is invalid", type: "error" });
        } else {
          setPopup({
            message: "Something went wrong. Please try again!",
            type: "error",
          });
        }
      }
    }
  };

  const getOtp = async () => {
    try {
      let request = {};
      if (loginMth === loginVai.mobileotp) {
        const mobileNo = watch("mobileNo");

        if (!mobileNo || !/^[0-9]{10}$/.test(mobileNo)) {
          setPopup({ message: "Mobile No is not valid", type: "error" });
          return;
        }
        request = { mobileNo: mobileNo };
      } else if (loginMth === loginVai.emailotp) {
        const email = watch("email");

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setPopup({ message: "Email is not valid", type: "error" });
          return;
        }
        request = { email: email };
      }

      const response = await publicRequest(
        "POST",
        urls.loginOtpRequest,
        request
      );

      if(loginMth === loginVai.mobileotp && response.status === 200) {
        alert("Your OTP is: " + response.data.otp + "\n(Note: This is for development purposes only)");
      }

      if (response.status === 200) {
        setOtpSend(true);
        setTimer(60); // Reset timer when OTP is sent
        setPopup({ message: "OTP sent successfully!", type: "success" });
      } else {
        setPopup({
          message: "Failed to send OTP. Try again!",
          type: "error",
        });
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setPopup({ message: "We couldn't find your account.", type: "error" });
      } else {
        setPopup({ message: "Failed to send OTP. Try again!", type: "error" });
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isOtpSend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isOtpSend, timer]);

  return (
    <div className={styles.main_container}>
      {popup && (
        <PopupNotification
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
      <h2>Login Now</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {loginMth === loginVai.mobilepass && (
          <>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Phone No</label>
                <input
                  type="text"
                  maxLength={10}
                  {...register("mobileNo", {
                    required: "Mobile Number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                  }}
                />
                {errors.mobileNo && (
                  <p className={styles.error}>{errors.mobileNo.message}</p>
                )}
              </div>
            </div>

            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Password</label>
                <div className={styles.pass_box}>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Password cannot exceed 20 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
                      },
                    })}
                  />

                  {errors.password && (
                    <p className={styles.error}>{errors.password.message}</p>
                  )}

                  <span
                    className={`${
                      showPassword ? styles.pass_show : styles.pass_hide
                    }`}
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

        {loginMth === loginVai.emailpass && (
          <>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Email Id</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Password</label>
                <div className={styles.pass_box}>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Password cannot exceed 20 characters",
                      },
                      pattern: {
                        value:
                          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character",
                      },
                    })}
                  />
                  {errors.password && (
                    <p className={styles.error}>{errors.password.message}</p>
                  )}
                  <span
                    className={`${
                      showPassword ? styles.pass_show : styles.pass_hide
                    }`}
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
                <label>Phone No</label>
                <input
                  type="text"
                  maxLength={10}
                  {...register("mobileNo", {
                    required: "Mobile Number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Enter a valid 10-digit mobile number",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                  }}
                />
                {errors.mobileNo && (
                  <p className={styles.error}>{errors.mobileNo.message}</p>
                )}
              </div>
            </div>
            <div className={`${styles.form_row} ${styles.form_otp_row}`}>
              <div className={`${styles.form_input_box}`}>
                <label>Enter OTP</label>
                <input
                  type="text"
                  maxLength={4} // Ensures max 4 characters
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "Enter a valid 4-digit OTP",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                  }}
                />
                {errors.otp && (
                  <p className={styles.error}>{errors.otp.message}</p>
                )}
              </div>
              <div className={styles.get_otp_box}>
                {(loginMth === loginVai.emailotp ||
                  loginMth === loginVai.mobileotp) &&
                  (!isOtpSend ? (
                    <button
                      className={styles.get_otp_btn}
                      type="button"
                      onClick={getOtp}
                    >
                      Get OTP
                    </button>
                  ) : timer > 0 ? (
                    <button className={styles.get_otp_btn} disabled>
                      Resend OTP in {timer}s
                    </button>
                  ) : (
                    <button
                      className={styles.get_otp_btn}
                      type="button"
                      onClick={getOtp}
                    >
                      Resend OTP
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}
        {loginMth === loginVai.emailotp && (
          <>
            <div className={styles.form_row}>
              <div className={styles.form_input_box}>
                <label>Email</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Enter a valid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email.message}</p>
                )}
              </div>
            </div>
            <div className={`${styles.form_row} ${styles.form_otp_row}`}>
              <div className={`${styles.form_input_box}`}>
                <label>Enter OTP</label>
                <input
                  type="text"
                  maxLength={4} // Ensures max 4 characters
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^[0-9]{4}$/,
                      message: "Enter a valid 4-digit OTP",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                  }}
                />
                {errors.otp && (
                  <p className={styles.error}>{errors.otp.message}</p>
                )}
              </div>
              <div className={styles.get_otp_box}>
                {(loginMth === loginVai.emailotp ||
                  loginMth === loginVai.mobileotp) &&
                  (!isOtpSend ? (
                    <button
                      className={styles.get_otp_btn}
                      type="button"
                      onClick={getOtp}
                    >
                      Get OTP
                    </button>
                  ) : timer > 0 ? (
                    <button className={styles.get_otp_btn} disabled>
                      Resend OTP in {timer}s
                    </button>
                  ) : (
                    <button
                      className={styles.get_otp_btn}
                      type="button"
                      onClick={getOtp}
                    >
                      Resend OTP
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}

        <div className={styles.form_submit_box}>
          <button type="submit" className={styles.form_submit_button}>
            Login
          </button>
        </div>
      </form>

      <div className={styles.login_method_box}>
        {loginMth === loginVai.mobilepass && !isVaiOtp && (
          <button
            className={styles.login_mth_btn}
            onClick={() => setLoginMth(loginVai.emailpass)}
          >
            Use Email
          </button>
        )}
        {loginMth === loginVai.emailpass && !isVaiOtp && (
          <button
            className={styles.login_mth_btn}
            onClick={() => setLoginMth(loginVai.mobilepass)}
          >
            Use Mobile
          </button>
        )}

        {loginMth === loginVai.mobileotp && isVaiOtp && (
          <button
            className={styles.login_mth_btn}
            onClick={() => setLoginMth(loginVai.emailotp)}
          >
            Use Email
          </button>
        )}
        {loginMth === loginVai.emailotp && isVaiOtp && (
          <button
            className={styles.login_mth_btn}
            onClick={() => setLoginMth(loginVai.mobileotp)}
          >
            Use Mobile
          </button>
        )}

        {isVaiOtp ? (
          <button
            className={styles.login_mth_btn}
            onClick={() => {
              setIsVaiOtp(!isVaiOtp), setLoginMth(loginVai.mobilepass);
            }}
          >
            Vai Password
          </button>
        ) : (
          <button
            className={styles.login_mth_btn}
            onClick={() => {
              setIsVaiOtp(!isVaiOtp), setLoginMth(loginVai.mobileotp);
            }}
          >
            Vai Otp
          </button>
        )}
      </div>
    </div>
  );
};

export default LoginComponent;
