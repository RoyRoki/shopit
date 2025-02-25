import React, { useEffect, useState } from "react";
import { get, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { request, publicRequest } from "../../../helper/AxiosHelper";
import { urls } from "../../../util/URLS";
import styles from "./UserRegister.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopupNotification from "../../popup/notification/PopupNotification";

const UserRegister = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [isOtpSend, setOtpSend] = useState(false);
  const [timer, setTimer] = useState(60);
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(null);

  const onSubmit = async (data) => {
    try {
      // ✅ Verify OTP before proceeding
      const otpResponse = await verifyOtp(data);

      if (!otpResponse) return; // Stop execution if OTP is invalid

      // ✅ Register User
      const response = await publicRequest("POST", urls.userRegister, {
        userName: data.userName,
        mobileNo: data.mobileNo,
        email: data.email,
        password: data.password,
      });

      if (response.status === 200) {
        setPopup({ message: "Registration Successful!", type: "success" });
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setPopup({ message: "Registration Failed. Try Again!", type: "error" });
      }
    } catch (errors) {
      console.error(errors);
      setPopup({ message: "An error occurred. Try again!", type: "error" });
    }
  };

  const getOtp = async () => {
    const mobileNo = watch("mobileNo");

    // Validate mobile number
    if (!mobileNo || !/^[0-9]{10}$/.test(mobileNo)) {
      setPopup({
        message: "Enter a valid 10-digit mobile number",
        type: "error",
      });
      return;
    }

    try {
      const response = await publicRequest("POST", urls.generateOtpUnique, {
        mobileNo: mobileNo,
      });
      if (response.status === 200) {
        alert("Your OTP is: " + response.data.otp + "\n(Note: This is for development purposes only)");
        setOtpSend(true);
        setTimer(60); // Reset timer when OTP is sent
        setPopup({ message: "OTP sent successfully!", type: "success" });
      } else {
        setPopup({ message: "Failed to send OTP. Try again!", type: "error" });
      }
    } catch (error) {
      console.error(error);
      if (error?.response?.status === 409) {
        setPopup({
          message: "Mobile No Already Exist! Try with another number",
          type: "error",
        });
      } else {
        setPopup({ message: "Failed to send OTP. Try again!", type: "error" });
      }
    }
  };

  const verifyOtp = async (data) => {
    try {
      const response = await publicRequest("POST", urls.verifyOtp, {
        otp: data.otp,
        mobileNo: data.mobileNo,
      });

      if (response.status === 200) {
        return true; // ✅ OTP is valid, proceed with registration
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      setPopup({ message: "OTP is invalid", type: "error" });
      return false;
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
      <h2>Join the Shopping Fun!</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.form_row}>
          <div className={styles.form_input_box}>
            <label>Full Name</label>
            <input
              type="text"
              {...register("userName", {
                required: "Full Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Only alphabets and spaces are allowed",
                },
              })}
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, ""); // Remove non-alphabet characters
              }}
            />
            {errors.userName && (
              <p className={styles.error}>{errors.userName.message}</p>
            )}
          </div>
        </div>

        <div className={styles.form_row}>
          <div className={styles.form_input_box}>
            <label>Phone Number</label>
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
            {errors.otp && <p className={styles.error}>{errors.otp.message}</p>}
          </div>
          <div className={styles.get_otp_box}>
            {!isOtpSend ? (
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
        <div className={styles.form_submit_box}>
          <button type="submit" className={styles.form_submit_button}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegister;
