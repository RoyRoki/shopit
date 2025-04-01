import React, { useState } from "react";
import styles from "./ForgetPasswordPage.module.css";
import Navber from "../../../../components/home/navber/Navber";
import { replace, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { request } from "../../../../helper/AxiosHelper";
import { urls } from "../../../../util/URLS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopupNotification from "../../../../components/popup/notification/PopupNotification";

const ForgetPasswordPage = () => {
  const navigate = useNavigate();
  const [isOtpSend, setOtpSend] = useState(false);
  const [using, setUsing] = useState({ field: "mobile", value: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [popup, setPopup] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const requestData = { ...data, [using.field === 'mobile' ? 'mobileNo' : 'email']: using.value };
    try {
      const response = await request(
        "PUT",
        urls.updatePasswordVaiOtp,
        requestData
      );
      if (response.status === 200) {
        navigate("/security", replace);
      } else {
        setPopup({
          message: "Failed to update password!",
          type: "error",
        });
      }
    } catch (error) {
      setPopup({
        message: "Failed to update password!",
        type: "error",
      });
    }
  };

  const handleRequest = async (field, value) => {
    let data = {};

    if (field === "mobile" && (!value || !/^[0-9]{10}$/.test(value))) {
      setPopup({
        message: "Enter a valid 10-digit mobile number",
        type: "error",
      });
      return;
    }
    
    if (field === "email" && (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) {
      setPopup({
        message: "Enter a valid email address",
        type: "error",
      });
      return;
    }

    if(field === "mobile") {
      data = {'mobileNo': value};
    } else {
      data = {'email': value};
    }
    try {
      const response = await request(
        "POST",
        urls.forgetPasswordRequest,
        data
      );
      if (response.status === 200) {
        setPopup({ message: "OTP sent successfully!", type: "success" });
        setOtpSend(true);
      }
    } catch (error) {
      if(error?.response?.status === 401) {
        setPopup({ message: "We couldn't find your account.", type: "error" });        
      } else {
        setPopup({ message: "Failed to send OTP. Try again!", type: "error" });
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Navber isLogged={true} />
      <div className={styles.main_container}>
        {popup && (
          <PopupNotification
            message={popup.message}
            type={popup.type}
            onClose={() => setPopup(null)}
          />
        )}
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
            Reset your password
          </span>
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
                    onChange={(e) =>
                      setUsing({ field: "email", value: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div className={styles.input_box}>
                  <label>Mobile No</label>
                  <input
                    type="text"
                    value={using.value}
                    onChange={(e) => {
                      const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (inputValue.length <= 10) {
                        setUsing({ field: "mobile", value: inputValue });
                      }
                    }}
                    maxLength={10}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.form_box}>
              <div className={styles.input_box}>
                <label>{using.field === "email" ? "Email" : "Mobile No"}</label>
                <span>{using.value}</span>
              </div>
              <div className={styles.input_box}>
                <label>Otp</label>
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
              <div className={styles.input_box}>
                <label>New Password</label>
                <div className={styles.pass_box}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder=" "
                    {...register("newPassword", {
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

                {errors.newPassword && (
                  <p className={styles.error}>{errors.newPassword.message}</p>
                )}
              </div>
            </div>
          )}

          <div className={styles.action_box}>
            {!isOtpSend ? (
              <button onClick={() => handleRequest(using.field, using.value)}>
                Send Otp
              </button>
            ) : (
              <button onClick={handleSubmit(onSubmit)}>Update Password</button>
            )}
          </div>
          {!isOtpSend ? (
            <div className={styles.other_action}>
              {using.field === "mobile" ? (
                <button onClick={() => setUsing({ field: "email", value: "" })}>
                  Use email
                </button>
              ) : (
                <button
                  onClick={() => setUsing({ field: "mobile", value: "" })}
                >
                  Use mobile
                </button>
              )}
            </div>
          ) : (
            <div className={styles.cancel_btn}>
              <button
                onClick={() => {
                  setOtpSend(false);
                  setUsing({ field: "mobile", value: "" });
                  reset();
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
