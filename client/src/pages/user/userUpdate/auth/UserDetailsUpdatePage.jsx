import React, { useEffect, useState } from "react";
import styles from "./UserDetailsUpdatePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../../../features/user/UserDetailsSlice";
import Navber from "../../../../components/home/navber/Navber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faFloppyDisk,
  faArrowRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../../helper/AxiosHelper";
import { urls } from "../../../../util/URLS";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { data, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PopupNotification from "../../../../components/popup/notification/PopupNotification";

const UserDetailsUpdatePage = () => {
  const dispatch = useDispatch();
  const { userDto, loading } = useSelector((state) => state.userDetails);
  const navigate = useNavigate();

  const [name, setName] = useState(userDto.userName || "");
  const [email, setEmail] = useState(userDto.email || "");
  const [mobile, setMobile] = useState(userDto.mobileNo || "");
  const [isOtpSend, setOtpSend] = useState(false);
  const [otp, setOtp] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [showPassword, setShowPassword] = useState({ old: false, new: false });
  const [popup, setPopup] = useState(null);

  const { 
      register, 
      watch, 
      reset, 
      handleSubmit,
      formState: { errors }
    } = useForm();


  // Update user name
  const handleSaveName = async () => {
    if (name === userDto.userName) {
      setEditingField(null);
      setPopup({ message: "Same name cannot be updated!", type: "error" });
      return;
    } else if (!/^[A-Za-z\s]{3,}$/.test(name)) {
      setPopup({
        message: "Name must contain at least 3 letters and only alphabets.",
        type: "error",
      });
      return;
    }
    try {
      const response = await request("PUT", urls.updateUserName, {"userName" : name});
      if (response.status === 200) {
        setPopup({ message: "Name updated successfully!", type: "success" });
        dispatch(fetchUserDetails());
        setEditingField(null);
      } else {
        setPopup({
          message: "Failed to update name. Please try again!",
          type: "error",
        });
        setEditingField(null);
      }
    } catch (error) {
      setPopup({
        message: "Failed to update name. Please try again!",
        type: "error",
      });
      console.error(error.response);
      setEditingField(null);
    }
  };

  // Fetch user details on mount
  useEffect(() => {
    const action = async () => {
      dispatch(fetchUserDetails());
    };
    action();
  }, [dispatch]);

  // Set user data
  useEffect(() => {
    setName(userDto.userName);
    setEmail(userDto.email);
    setMobile(userDto.mobileNo);
  }, [userDto]);

  // For user jump one edit to another
  useEffect(() => {
    setOtpSend(false);
    setOtp("");
    setName(userDto.userName);
    setEmail(userDto.email);
    setMobile(userDto.mobileNo);
  }, [editingField]);

  // Otp send request
  const handleOtpSend = async (field, value) => {
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setPopup({ message: "Invalid email format!", type: "error" });
      return;
    } else if (field === "mobile" && !/^\d{10}$/.test(value)) {
      setPopup({
        message: "Invalid mobile number! Must be 10 digits.",
        type: "error",
      });
      return;
    }

    try {
      let requestData = {};

      if(field === 'mobile') {
        requestData = {"mobileNo": value};
      } else {
        requestData = {"email": value};
      }

      await request("POST", urls.userUpdateRequest, requestData);
      setPopup({ message: "OTP sent successfully!", type: "success" });
      setOtpSend(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const key =
          field === "mobile" ? "Mobile No" : field === "email" ? "Email" : "";
        setPopup({
          message: `${key} Already Exist! Try with another ${key}`,
          type: "error",
        });
      } else {
        setPopup({ message: "Failed to send OTP. Try again!", type: "error" });
      }
    }
  };

  // Otp verify
  const handleVerify = async (field, value, otp) => {
    if (!/^\d{4}$/.test(otp)) {
      setPopup({ message: "OTP must be a 4-digit number.", type: "error" });
      return;
    }
    try {
      let requestData = {};
      if(field === 'mobile') {
        requestData = {"mobileNo" : value, "otp" : otp};
      } else {
        requestData = {"email" : value, "otp" : otp};
      }

      await request("PUT", urls.userContactUpdate, requestData);

      if (field === "email") {
        setPopup({ message: "Email updated successfully!", type: "success" });
      } else if (field === "mobile") {
        setPopup({
          message: "Mobile number updated successfully!",
          type: "success",
        });
      }

      dispatch(fetchUserDetails());
      setEditingField(null);
      setOtpSend(false);
      setOtp("");
    } catch (error) {
      setPopup({ message: "Update failed. Please try again.", type: "error" });
      console.error(error.response);
    }
  };

  // Password change request
  const handlePasswordChange = async (data) => {
    try {
      const response = await request("PUT", urls.updatePassword, data);
      setPopup({
        message: "Password updated successfully!",
        type: "success"
      });
      setEditingField(null);
      reset();
    } catch (error) {
      setPopup({
        message: "Failed to update password!",
        type: "error"
      });
      console.error(error.response.data);
    }
  };

  return (
    <>
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
              setEditingField(null);
            }}
          >
            Login & security
          </span>
        </div>
        <div className={styles.section}>
          <div className={styles.form_row}>
            <label>User Name</label>
            <div className={styles.form_input_box}>
              {editingField !== "name" ? (
                <span>{name}</span>
              ) : (
                <input
                  type="Name"
                  minLength={3}
                  maxLength={16}
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className={styles.button_wrap}>
            {editingField === "name" ? (
              <button onClick={handleSaveName}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                save
              </button>
            ) : (
              <button onClick={() => setEditingField("name")}>
                <FontAwesomeIcon icon={faPenToSquare} />
                edit
              </button>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.form_row}>
            <label>Email</label>
            <div className={styles.form_input_box}>
              {editingField !== "email" ? (
                <span>{email}</span>
              ) : !isOtpSend ? (
                <input
                  type="email"
                  placeholder="new email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <span>{email}</span>
              )}
            </div>
            {isOtpSend && editingField === "email" && (
              <div className={styles.otp_box}>
                <span>Otp sent to your email.</span>
                <input
                  type="text"
                  placeholder="OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={() => handleOtpSend("email", email)}>
                  Resend OTP
                </button>
              </div>
            )}
          </div>
          <div className={styles.button_wrap}>
            {editingField === "email" ? (
              isOtpSend ? (
                <button
                  onClick={() => handleVerify("email", email, otp)}
                  style={{ color: "var(--bs-blue)" }}
                >
                  <FontAwesomeIcon icon={faUser} />
                  verify
                </button>
              ) : (
                <button onClick={() => handleOtpSend("email", email)}>
                  <FontAwesomeIcon icon={faArrowRight} />
                  next
                </button>
              )
            ) : (
              <button onClick={() => setEditingField("email")}>
                <FontAwesomeIcon
                  icon={email && email.trim() !== "" ? faPenToSquare : faPlus}
                />
                {`${email && email.trim() !== "" ? "edit" : "add"}`}
              </button>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.form_row}>
            <label>Mobile</label>
            <div className={styles.form_input_box}>
              {editingField !== "mobile" ? (
                <span>{mobile}</span>
              ) : !isOtpSend ? (
                <input
                  type="text"
                  placeholder="mobile no"
                  onChange={(e) => setMobile(e.target.value)}
                />
              ) : (
                <span>{mobile}</span>
              )}
            </div>
            {isOtpSend && editingField === "mobile" && (
              <div className={styles.otp_box}>
                <span>Otp sent to your Mobile No.</span>
                <input
                  type="text"
                  placeholder="OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={() => handleOtpSend("mobile", mobile)}>
                  Resend OTP
                </button>
              </div>
            )}
          </div>
          <div className={styles.button_wrap}>
            {editingField === "mobile" ? (
              isOtpSend ? (
                <button
                  onClick={() => handleVerify("mobile", mobile, otp)}
                  style={{ color: "var(--bs-blue)" }}
                >
                  <FontAwesomeIcon icon={faUser} />
                  verify
                </button>
              ) : (
                <button onClick={() => handleOtpSend("mobile", mobile)}>
                  <FontAwesomeIcon icon={faArrowRight} />
                  next
                </button>
              )
            ) : (
              <button onClick={() => setEditingField("mobile")}>
                <FontAwesomeIcon
                  icon={mobile && mobile.trim() !== "" ? faPenToSquare : faPlus}
                />
                {`${mobile && mobile.trim() !== "" ? "edit" : "add"}`}
              </button>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.form_row}>
            <label>Password</label>
            <div className={styles.password_input_box}>
              {editingField !== "password" ? (
                <span>* * * * * * * *</span>
              ) : (
                <div className={styles.password_input_form}>
                  <form onSubmit={handleSubmit(handlePasswordChange)}>
                    <div className={styles.form_input_box}>
                      <span>Old Password</span>
                      <div className={styles.input_wrap}>
                        <input
                          type={showPassword.old ? "text" : "password"}
                          placeholder=""
                          {...register("oldPassword", {
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
                        {errors.oldPassword && (
                          <p className={styles.error}>
                            {errors.oldPassword.message}
                          </p>
                        )}
                        <span
                          className={`${
                            showPassword.old
                              ? styles.pass_show
                              : styles.pass_hide
                          }`}
                          onMouseEnter={() =>
                            setShowPassword({ ...showPassword, old: true })
                          }
                          onMouseLeave={() =>
                            setShowPassword({ ...showPassword, old: false })
                          }
                        >
                          {showPassword.old ? (
                            <FontAwesomeIcon icon="fa-regular fa-eye" />
                          ) : (
                            <FontAwesomeIcon icon="fa-regular fa-eye-slash" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className={styles.form_input_box}>
                      <span>New Password</span>
                      <div className={styles.input_wrap}>
                        <input
                          type={showPassword.new ? "text" : "password"}
                          placeholder=""
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
                        {errors.newPassword && (
                          <p className={styles.error}>
                            {errors.newPassword.message}
                          </p>
                        )}
                        <span
                          className={`${
                            showPassword.new
                              ? styles.pass_show
                              : styles.pass_hide
                          }`}
                          onMouseEnter={() =>
                            setShowPassword({ ...showPassword, new: true })
                          }
                          onMouseLeave={() =>
                            setShowPassword({ ...showPassword, new: false })
                          }
                        >
                          {showPassword.new ? (
                            <FontAwesomeIcon icon="fa-regular fa-eye" />
                          ) : (
                            <FontAwesomeIcon icon="fa-regular fa-eye-slash" />
                          )}
                        </span>
                      </div>
                    </div>
                  </form>
                  <div className={styles.forget_pass_wrap}>
                    <span onClick={() => navigate("/forget-pass")}>
                      Forget password
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.button_wrap}>
            {editingField === "password" ? (
              <button onClick={handleSubmit(handlePasswordChange)}>
                <FontAwesomeIcon icon={faFloppyDisk} />
                update
              </button>
            ) : (
              <button onClick={() => setEditingField("password")}>
                <FontAwesomeIcon icon={faPenToSquare} />
                change
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetailsUpdatePage;
