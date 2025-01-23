import React, { useState } from 'react'
import styles from './CreateStore.module.css'
import { useForm } from 'react-hook-form';
import { request } from '../../../../helper/AxiosHelper';
import CategorySelector from '../../../buttons/categorySelector/CategorySelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { urls } from '../../../../util/URLS';

const CreateStore = ({ onComplete }) => {

  const [formStep, setFormStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
        register,
        handleSubmit,
        watch,
        reset,
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

  return (
    <div className={styles.main_wrap}>
      <div className={styles.form_wrap}>
        <form>
          <div className={styles.step_1}  style={formStep === 1 ? {display: 'block'} : {display: 'none'}} >

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Store Name</label>
                  <input type="text" {...register("name")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Description</label>
                  <textarea type="text" {...register("description")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Store's Email</label>
                  <input type="text" {...register("email")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Store's Mobile NO</label>
                  <input type="text" {...register("mobileNo")} />
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
                  <input type="text" {...register("houseNo")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Street</label>
                  <input type="text" {...register("street")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >City</label>
                  <input type="text" {...register("city")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >State</label>
                  <input type="text" {...register("state")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >PinCode</label>
                  <input type="text" {...register("pinCode")} />
            </div>                  
            </div> 

            <div className={styles.form_row}>
            <div className={styles.form_input_box}>
                  <label >Landmark</label>
                  <input type="text" {...register("landmark")} />
            </div>                  
            </div> 
          </div>
        </form>
        <div className={styles.action_box}>
          {formStep === 1 &&
                <button onClick={() => setFormStep(formStep+1)}>Next</button>}
          {formStep === 2 && (
            <>
              <button onClick={() => setFormStep(formStep-1)}>Back</button>
              <button className={styles.create_btn} onClick={handleSubmit(onSubmit)}>Create</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateStore
