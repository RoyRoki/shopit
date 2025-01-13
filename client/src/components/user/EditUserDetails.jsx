import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import AddressInput from './AddressInput';
import { request } from '../../helper/AxiosHelper'
import { urls } from '../../util/URLS';

const EditUserDetails = ({ userDto, onComplete }) => {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [address, setAddress] = useState({ houseNo: '', street: '', city: '', state: '', pinCode: '', landmark: '' });

  const onSubmit = async (data) => {

    const requestData = {...data, address: address};
      try {
        const response = await request("PUT", urls.updateUserDetails, requestData );
        if(response.status === 200) {
          onComplete();
        } else {
          console.error(response.data);
        }
      } catch (error) {
        console.error(error.response);
      }
  }

  return (
    <div>
      <h1>Edit your details: </h1>
      <div className='register-form-div'>
        <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-row">
              <div className="input-data">
                    <input type="text" placeholder=' ' {...register("userName")} defaultValue={userDto.userName || ''} />
                    <div className="underline"></div>
                    <label htmlFor="">User Name</label>
              </div>
              </div>
              <div className="form-row">
              <div className="input-data">
                    <input type="text" placeholder=' ' {...register("email")} defaultValue={userDto.email}/>
                    <div className="underline"></div>
                    <label htmlFor="">Email</label>
              </div>
              </div>

              <AddressInput initialAddress={userDto.address || {}} onChange={(address) => setAddress(address)} />

              <div className="form-row">
                    <div className="input-data">
                          <input className='submit-button' type="submit" value={"Update"}/>
                    </div>               
              </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserDetails
