import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { request } from '../../helper/AxiosHelper'
import { urls } from '../../util/URLS'
import Categories from '../Categories'

const CreateStore = ({ onComplete }) => {
      const {
            register,
            handleSubmit,
            watch,
            formState: { errors },
      } = useForm();

      const [formStep, setFormStep] = useState(1);
      const [selectedCategories, setSelectedCategories] = useState([]);

      const onSubmit = async (data) => {
            try {
                  const response = await request("POST", urls.createStore, {...data, categoryIds: selectedCategories});
                  if (response.status === 200) {
                        console.log("ok");
                        onComplete();
                  }
            } catch (error) {
                  console.error(error.response);
            }
      }



  return (
    <div className='register-form-div'>
      <form onSubmit={handleSubmit(onSubmit)}>
            <div className="step1" style={formStep === 1 ? {display: 'block'} : {display: 'none'}}>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("name")} />
                  <div className="underline"></div>
                  <label htmlFor="">Store Name</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("description")} />
                  <div className="underline"></div>
                  <label htmlFor="">Description</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("email")} />
                  <div className="underline"></div>
                  <label htmlFor="">Email</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("mobileNo")} />
                  <div className="underline"></div>
                  <label htmlFor="">Mobile NO</label>
            </div>
            </div>
            {/* <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("shippingType")} />
                  <div className="underline"></div>
                  <label htmlFor="">Shipping Type</label>
            </div>
            </div> */}

            </div>
            <div className="step2" style={formStep === 2 ? {display: 'block'} : {display: 'none'}}>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("houseNo")} />
                  <div className="underline"></div>
                  <label htmlFor="">HouseNo</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("street")} />
                  <div className="underline"></div>
                  <label htmlFor="">Street</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("city")} />
                  <div className="underline"></div>
                  <label htmlFor="">City</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("state")} />
                  <div className="underline"></div>
                  <label htmlFor="">State</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("pinCode")} />
                  <div className="underline"></div>
                  <label htmlFor="">PinCode</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("landmark")} />
                  <div className="underline"></div>
                  <label htmlFor="">Landmark</label>
            </div>
            </div>
            <div className="form-row">
                 <Categories onSelect={(arr) => setSelectedCategories(arr) } />
            </div>
      
            </div>
            {formStep === 2 &&
            <div className="form-row">
                  <div className="input-data">
                        <input className='submit-button' type="submit" value={"submit"}/>
                  </div>               
            </div>}

      </form>
      {formStep === 1 &&
            <button onClick={() => setFormStep(formStep+1)}>Next</button>}
      {formStep === 2 &&
            <button onClick={() => setFormStep(formStep-1)}>Back</button>}
      
    </div>
  )
}

export default CreateStore
