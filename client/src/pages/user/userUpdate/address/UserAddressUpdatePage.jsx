import React, { useCallback, useEffect, useState } from "react";
import Navber from "../../../../components/home/navber/Navber";
import styles from "./UserAddressUpdatePage.module.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetails } from "../../../../features/user/UserDetailsSlice";
import { useForm } from "react-hook-form";
import { request } from "../../../../helper/AxiosHelper";
import { urls } from "../../../../util/URLS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { space } from "postcss/lib/list";
import { useNavigate } from "react-router-dom";
import PopupNotification from "../../../../components/popup/notification/PopupNotification";

const UserAddressUpdatePage = () => {
  const dispatch = useDispatch();
  const { userDto } = useSelector((state) => state.userDetails);
  const [addresses, setAddresses] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [popup, setPopup] = useState(null);
  
  // Fetch user details on mount
  useEffect(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  // Update addresses when user details change
  useEffect(() => {
    setAddresses(userDto.addresses || []);
  }, [userDto]);

  // Handle form submission for adding/updating an address
  const onSubmit = async (data) => {
    const isEditing = Boolean(editAddress?.id);

    const url = isEditing 
      ? `${urls.updateAddressById}${editAddress.id}` 
      : urls.addNewAddress;

    const method = isEditing ? "PUT" : "POST";

    try {
      await request(method, url, data);
      setPopup({
        message: isEditing ? "Address updated successfully!" : "Address added successfully!", 
        type: "success" 
      });
      reset();
      setShowForm(false);
      setEditAddress(null);
      dispatch(fetchUserDetails());
    } catch (error) {
      console.error(error);
      setPopup({ 
        message: isEditing ? "Failed to update address. Please try again." : "Failed to add address. Please try again.", 
        type: "error" 
      });
    }
  };

  // Handle editing an address @FIX editing a new created address cant show the default values
  const handleEdit = useCallback((address) => {
    setEditAddress(() => {
      setShowForm(true);
      return address;
    });
  }, []);

   // Handle removing an address
  const handleRemove = useCallback(async (address) => {
    try {
      await request(
        "DELETE",
        `${urls.deleteAddressById}${address.id}`
      );
      setPopup({ message: "Address removed successfully!", type: "success" });
      dispatch(fetchUserDetails());
    } catch (error) {
      console.error(error.response);
      setPopup({ message: "Failed to remove address. Please try again.", type: "error" });
    }
  }, [dispatch]);

   // Handle setting an address as default
  const handleSetDefault = useCallback(async (address) => {
    try {
      await request(
        "PUT",
        `${urls.setDefaultAddressById}${address.id}`
      );
      setPopup({ message: "Address set as default successfully!", type: "success" });
      dispatch(fetchUserDetails());
    } catch (error) {
      console.error(error.response);
      setPopup({ message: "Failed to set address as default. Please try again.", type: "error" });
    }
  }, [dispatch]);


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
          {` >`}
          <span
            onClick={() => {
              setShowForm(false);
            }}
          >
            Addresses
          </span>
        </div>
        {!showForm && (
          <>
            <div className={styles.box_wrap}>
              <div
                className={styles.add_address_box}
                onClick={() => {
                  reset();
                  setShowForm(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} className={styles.plus_icon} />
                <span>Add new address</span>
              </div>
              {addresses?.map((address) => (
                <div className={styles.address_box} key={address?.id}>
                  <div className={styles.info_box}>
                    <p>
                      <span>House No : </span>
                      {address.houseNo || ""}
                    </p>
                    <p>
                      <span>Street : </span>
                      {address.street || ""}
                    </p>
                    <p>
                      <span>City : </span>
                      {address.city || ""}
                    </p>
                    <p>
                      <span>State : </span>
                      {address.state || ""}
                    </p>
                    <p>
                      <span>PinCode : </span>
                      {address.pinCode || ""}
                    </p>
                    <p>
                      <span>Landmark : </span>
                      {address.landmark || ""}
                    </p>
                  </div>

                  <div className={styles.action_box}>
                    <button onClick={() => handleEdit(address)}>Edit</button>
                    <span>|</span>
                    <button onClick={() => handleRemove(address)}>
                      Remove
                    </button>
                    <span>|</span>
                    {userDto?.defaultAddressId === address.id ? (
                      <span>Default address</span>
                    ) : (
                      <button onClick={() => handleSetDefault(address)}>
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showForm && (
          <div className={styles.address_form_wrap}>
            <div className={styles.form_hide}>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowForm(false);
                  setEditAddress(null);
                  reset();
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className={styles.form_header}>
              {editAddress ? (
                <span>Edit your address</span>
              ) : (
                <span>Add a new address</span>
              )}
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>House No</label>
                  <input
                    type="text"
                    {...register("houseNo", {
                      required: "House No is required",
                    })}
                    defaultValue={editAddress?.houseNo || ""}
                  />
                  {errors.houseNo && (
                    <p className={styles.error}>{errors.houseNo.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>Street</label>
                  <input
                    type="text"
                    {...register("street", {
                      required: "Street is required",
                    })}
                    defaultValue={editAddress?.street || ""}
                  />
                  {errors.street && (
                    <p className={styles.error}>{errors.street.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>City</label>
                  <input
                    type="text"
                    {...register("city", {
                      required: "City is required",
                    })}
                    defaultValue={editAddress?.city || ""}
                  />
                  {errors.city && (
                    <p className={styles.error}>{errors.city.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>State</label>
                  <input
                    type="text"
                    {...register("state", {
                      required: "State is required",
                    })}
                    defaultValue={editAddress?.state || ""}
                  />
                  {errors.state && (
                    <p className={styles.error}>{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>PinCode</label>
                  <input
                    type="text"
                    maxLength={6}
                    {...register("pinCode", {
                      required: "Pin Code is required",
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: "Pin Code must be a 6-digit number",
                      },
                    })}
                    defaultValue={editAddress?.pinCode || ""}
                  />
                  {errors.pinCode && (
                    <p className={styles.error}>{errors.pinCode.message}</p>
                  )}
                </div>
              </div>

              <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                  <label>Landmark</label>
                  <input
                    type="text"
                    {...register("landmark", {
                      required: "Landmark is required",
                    })}
                    defaultValue={editAddress?.landmark || ""}
                  />
                  {errors.landmark && (
                    <p className={styles.error}>{errors.landmark.message}</p>
                  )}
                </div>
              </div>

              {editAddress && (
                <div className={styles.form_row}>
                  <div className={styles.form_input_box}>
                    <input
                      className={styles.input_default}
                      type="checkbox"
                      {...register("isDefault")}
                    />
                    <label>Set as Default</label>
                  </div>
                </div>
              )}

              <div className={styles.submit_box}>
                <button type="submit">
                  {editAddress ? "Update address" : "Add address"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default UserAddressUpdatePage;
