import React, { useState } from 'react'
import styles from './CreateStore.module.css'
import { useForm } from 'react-hook-form';
import { request } from '../../../../helper/AxiosHelper';
import CategorySelector from '../../../buttons/categorySelector/CategorySelector';
import { urls } from '../../../../util/URLS';

const CreateStore = ({ onComplete }) => {

  const [formStep, setFormStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
        register,
        handleSubmit,
        watch,
        reset,
        trigger,
        formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
        const requestData = {...data, categoryIds: selectedCategories }
        try {
              const response = await request("POST", urls.createStore, requestData);
              if (response.status === 200) {
                    console.log(response.data);
                    onComplete();
              }
        } catch (error) {
              console.error(error.response);
        }
  }

  const onNextStep = async () => {
    if (formStep === 1) {
      const isValid = await trigger(["name", "description", "email", "mobileNo"]); // Validate Step 1 fields
      if (isValid) {
        setFormStep(2);
      }
    }
  };

  return (
    <div className={styles.main_wrap}>
      <div className={styles.form_wrap}>
        <form>
          <div className={styles.step_1}  style={formStep === 1 ? {display: 'block'} : {display: 'none'}} >

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Store Name</label>
                  <input 
                        type="text" 
                        {...register("name", {
                              required: "Store name is required.",
                              minLength: {
                                    value: 8,
                                    message: "Store name must be at least 8 characters long."
                              },
                              maxLength: {
                                    value: 150,
                                    message: "Store name must be less then 150 characters long."
                              }
                              }
                        )} 
                  />
                  {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Description</label>
                  <textarea 
                        type="text" 
                        {...register("description", {
                              required: "Description is requited.",
                              minLength: {
                                    value: 50,
                                    message: "Description must be at least 50 characters long."
                              },
                              maxLength: {
                                    value: 250,
                                    message: "Description must be less then 250 characters long"
                              }
                        })} 
                  />
                  {errors.description && <p className={styles.error}>{errors.description.message}</p>}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Store's Email</label>
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
                  <label >Store's Mobile NO</label>
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
                  <label >Shipping Type</label>
                  <input type="text" value={"SELF"} {...register("shippingType")} />
            </div>                  
            </div> 
            <div className={styles.category_row}>
                  <h2>Store Type</h2>
                 <CategorySelector onSelect={(arr) => setSelectedCategories(arr) } />
            </div>
          </div>

          <div className={styles.step_2} style={formStep === 2 ? {display: 'block'} : {display: 'none'}} >

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >HouseNo</label>
                  <input
                    type="text"
                    {...register("houseNo", {
                      required: "House No is required",
                    })}
                  />
                  {errors.houseNo && (
                    <p className={styles.error}>{errors.houseNo.message}</p>
                  )}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Street</label>
                  <input
                    type="text"
                    {...register("street", {
                      required: "Street is required",
                    })}
                  />
                  {errors.street && (
                    <p className={styles.error}>{errors.street.message}</p>
                  )}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >City</label>
                  <input
                    type="text"
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  {errors.city && (
                    <p className={styles.error}>{errors.city.message}</p>
                  )}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >State</label>
                  <input
                    type="text"
                    {...register("state", {
                      required: "State is required",
                    })}
                  />
                  {errors.state && (
                    <p className={styles.error}>{errors.state.message}</p>
                  )}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >PinCode</label>
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
                  />
                  {errors.pinCode && (
                    <p className={styles.error}>{errors.pinCode.message}</p>
                  )}
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Landmark</label>
                  <input
                    type="text"
                    {...register("landmark", {
                      required: "Landmark is required",
                    })}
                  />
                  {errors.landmark && (
                    <p className={styles.error}>{errors.landmark.message}</p>
                  )}
            </div>                  
            </div> 
          </div>
        </form>
        <div className={styles.action_box}>
          {formStep === 1 &&
                <button onClick={onNextStep}>Next</button>}
          {formStep === 2 && (
            <>
              <button onClick={() => setFormStep(formStep -1)}>Back</button>
              <button className={styles.create_btn} onClick={handleSubmit(onSubmit)}>Create</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateStore
