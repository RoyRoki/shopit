import React, { useEffect, useState } from 'react'
import Navber from '../../../../components/home/navber/Navber'
import styles from './UserAddressUpdatePage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserDetails } from '../../../../features/user/UserDetailsSlice'
import { useForm } from 'react-hook-form'
import { request } from '../../../../helper/AxiosHelper'
import { urls } from '../../../../util/URLS'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { space } from 'postcss/lib/list'
import { useNavigate } from 'react-router-dom'

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

  const onSubmit = async (data) => {
    try {
      if(editAddress && editAddress.id) {
        const response = await request("PUT", `${urls.updateAddressById}${editAddress.id}`, data);
      } else {
        const response = await request("POST", urls.addNewAddress, data);
      }
      dispatch(fetchUserDetails());
      setShowForm(false);
      setEditAddress(null);
      // Reset the form data
      reset();

    } catch (error) {
      console.error(error.response);
    }
  }

  const handleEdit = (address) => {
    setEditAddress(address);
    setShowForm(true);
  }

  const handleRemove = async (address) => {
    try {
      const response = await request("DELETE", `${urls.deleteAddressById}${address.id}`);
      dispatch(fetchUserDetails());
    } catch (error) {
      console.error(error.response);
    }
  }

  const handleSetDefault = async (address) => {
    try {
      const response = await request("PUT", `${urls.setDefaultAddressById}${address.id}`);
      dispatch(fetchUserDetails());
    } catch (error) {
      console.error(error.response);
    }
  }
  
  useEffect(() => {
    const action = async () => {
      dispatch(fetchUserDetails());
    }
    action();

  }, [dispatch]);

  useEffect(() => {
    setAddresses(userDto.addresses || []);
  }, [userDto]);

  return (
    <>
      <Navber isLogged={true} />
      
      <div className={styles.main_container}>
        <div className={styles.header}>
            <span onClick={() => navigate("/home?profile_view=true")}>Profile</span> {` >` } 
            <span onClick={() => {setShowForm(false)}}>Addresses</span>
        </div>
        {!showForm && (
          <>
            <div className={styles.box_wrap}>
              <div className={styles.add_address_box} onClick={() => (setShowForm(true))}>
                <FontAwesomeIcon icon={faPlus} className={styles.plus_icon} />
                <span>Add new address</span>
              </div>
              {addresses?.map((address) => (
                <div className={styles.address_box} key={address?.id}>
                  <div className={styles.info_box}>
                    <p><span>House No : </span>{address.houseNo || ""}</p>
                    <p><span>Street : </span>{address.street || ""}</p>
                    <p><span>City : </span>{address.city || ""}</p>
                    <p><span>State : </span>{address.state || ""}</p>
                    <p><span>PinCode : </span>{address.pinCode || ""}</p>
                    <p><span>Landmark : </span>{address.landmark || ""}</p>                
                  </div>

                  <div className={styles.action_box}>
                    <button onClick={() => handleEdit(address)}>Edit</button><span>|</span>
                    <button onClick={() => handleRemove(address)}>Remove</button><span>|</span>
                    {
                      userDto?.defaultAddressId === address.id ? (
                        <span>Default address</span>
                      ) : (
                        <button onClick={() => handleSetDefault(address)}>Set as Default</button>
                      )
                    }
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
                  <label >House No</label>
                  <input type="text" {...register("houseNo")} defaultValue={editAddress?.houseNo || ""} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Street</label>
                  <input type="text" {...register("street")} defaultValue={editAddress?.street || ""} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >City</label>
                  <input type="text" {...register("city")} defaultValue={editAddress?.city || ""} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >State</label>
                  <input type="text" {...register("state")} defaultValue={editAddress?.state || ""} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >PinCode</label>
                  <input type="text" {...register("pinCode")} defaultValue={editAddress?.pinCode || ""} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Landmark</label>
                  <input type="text" {...register("landmark")} defaultValue={editAddress?.landmark || ""} />
            </div>                  
            </div>

            {
              editAddress && (
                <div className={styles.form_row}>
                <div className={styles.form_input_box}>
                      <input className={styles.input_default} type="checkbox" {...register("isDefault")} />
                      <label >Set as Default</label>
                </div>                  
                </div>
              )
            }

            <div className={styles.submit_box}>
              <button type='submit'>{editAddress ? 'Update address' : 'Add address'}</button>
            </div>
          </form>
        </div>          
        )}

      </div>
    </>
  )
}

export default UserAddressUpdatePage
