import React, { useEffect, useState } from "react";
import styles from './UserDetailsUpdatePage.module.css'
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../../../features/user/UserDetailsSlice";
import Navber from '../../../../components/home/navber/Navber'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faFloppyDisk, faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { request } from "../../../../helper/AxiosHelper";
import { urls } from "../../../../util/URLS";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

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
  const [showPassword, setShowPassword] = useState({old: false, new: false});

  const {
    register,
    watch,
    reset,
    handleSubmit
  } = useForm();

  const handleSaveName = async () => {
    if(name === userDto.userName) {
      setEditingField(null);
      return;
    }
    try {
      const response = await request("PUT", `${urls.updateUserName}${(name)}`);
      if(response.status === 200) {
        dispatch(fetchUserDetails());
        setEditingField(null);
      } else {
        setEditingField(null);
      }
    } catch (error) {
      console.error(error.response);
      setEditingField(null);
    }
  }

  useEffect(() => {
    const action = async () => {
      dispatch(fetchUserDetails());
    }
    action();
  }, [dispatch]);

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

  const handleOtpSend = async (field, value) => {
    try {
      const response = await request("POST", `${urls.userUpdateRequest}${field}=${value}`);
      console.log(response.data);
      setOtpSend(true);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("The email or mobile number already exists.");
      }
      console.error(error);
    }
  }

  const handleVerify = async (field, value, otp) => {
    try {
      const api = `${urls.userEmailOrMobileUpdate}${field}?${field}=${value}&otp=${otp}`;
      const response = await request("PUT", api);
      dispatch(fetchUserDetails());
      setEditingField(null);
      setOtpSend(false);
      setOtp("");

    } catch (error) {
      console.error(error.response);
    }
  }

  const handlePasswordChange = async (data) => {
    try {
      const response = await request("PUT", urls.updatePassword, data);
      console.log(response.data);
      setEditingField(null);
      reset();
    } catch (error) {
      console.error(error.response.data);  
    }
  }
  return (
    <>
      <Navber isLogged={true} />
      <div className={styles.main_container}>
        <div className={styles.header}>
             <span onClick={() => navigate("/home?profile_view=true")}>Profile</span> {` > `} 
             <span onClick={() => { setEditingField(null) }}>Login & security</span>
        </div>
        <div className={styles.section}>
          <div className={styles.form_row}>
            <label>User Name</label>
            <div className={styles.form_input_box}>
              {editingField !== "name" ? (
                <span>{name}</span>
              ) : (
                <input type="Name" placeholder=" "  value={name} onChange={(e) => setName(e.target.value)} />
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
                <input type="email" placeholder="new email"  onChange={(e) => setEmail(e.target.value)} />
              ) : (
                <span>{email}</span>
              )}
            </div>
            {isOtpSend && editingField === "email"  && (
            <div className={styles.otp_box}>
              <span>Otp sent to your email.</span>
              <input type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
              <button onClick={() => handleOtpSend("email", email)}>Resend OTP</button>
            </div>              
            )}

          </div>
          <div className={styles.button_wrap}>
              {editingField === "email" ? 
                  isOtpSend? (
                  <button onClick={() => handleVerify("email", email, otp)} style={{color: "var(--bs-blue)"}}>
                    <FontAwesomeIcon icon={faUser} />
                  verify                    
                  </button>
                ) : (
                  <button onClick={() => handleOtpSend("email", email)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                    next
                  </button>
                ) : (
                <button onClick={() => setEditingField("email")}>
                  <FontAwesomeIcon icon={email && email.trim() !== "" ? faPenToSquare : faPlus} />
                  {`${email && email.trim() !== "" ? 'edit' : 'add'}`}
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
                <input type="text" placeholder="mobile no"  onChange={(e) => setMobile(e.target.value)} />
              ) : (
                <span>{mobile}</span>
              )}
            </div>
            {isOtpSend && editingField === "mobile" && (
            <div className={styles.otp_box}>
              <span>Otp sent to your Mobile No.</span>
              <input type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
              <button onClick={() => handleOtpSend("mobile", mobile)}>Resend OTP</button>
            </div>              
            )}

          </div>
          <div className={styles.button_wrap}>
              {editingField === "mobile" ? 
                  isOtpSend? (
                  <button onClick={() => handleVerify("mobile", mobile, otp)} style={{color: "var(--bs-blue)"}}>
                    <FontAwesomeIcon icon={faUser}/>
                  verify                    
                  </button>
                ) : (
                  <button onClick={() => handleOtpSend("mobile", mobile)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                    next
                  </button>
                ) : (
                <button onClick={() => setEditingField("mobile")}>
                  <FontAwesomeIcon icon={mobile && mobile.trim() !== "" ? faPenToSquare : faPlus} />
                  {`${mobile && mobile.trim() !== "" ? 'edit' : 'add'}`}
                </button>
              )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.form_row}>
            <label>Password</label>
            <div className={styles.password_input_box}>
              {editingField !== "password" ? (
                <span>* * * * * *</span>
              ) : (
                <div className={styles.password_input_form}>
                  <form onSubmit={handleSubmit(handlePasswordChange)}>
                    <div className={styles.form_input_box}>
                      <span>Old Password</span>
                      <div className={styles.input_wrap}>
                        <input 
                            type={showPassword.old ? 'text' : 'password'}
                            placeholder="" {...register("oldPassword")} 
                        />
                          <span
                                className={`${showPassword.old ? styles.pass_show : styles.pass_hide}`}
                                onMouseEnter={() => setShowPassword({...showPassword, old: true})}
                                onMouseLeave={() => setShowPassword({...showPassword, old: false})}
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
                            type={showPassword.new ? 'text' : 'password'}
                            placeholder="" {...register("newPassword")} 
                        />
                          <span
                                className={`${showPassword.new ? styles.pass_show : styles.pass_hide}`}
                                onMouseEnter={() => setShowPassword({...showPassword, new: true})}
                                onMouseLeave={() => setShowPassword({...showPassword, new: false})}
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
                    <span onClick={() => navigate("/forget-pass")}>Forget password</span>
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
