import React, { useEffect, useState } from 'react'

const AddressInput = ({ initialAddress, onChange}) => {

  const [address, setAddress] = useState({ houseNo: '', street: '', city: '', state: '', pinCode: '', landmark: '' });
  
  useEffect(() => {
    onChange(address);
  }, [address]);

  return (
    <>
      <div className="form-row">
      <div className="input-data">
            <input 
              type="text" 
              placeholder=' ' 
              defaultValue={initialAddress.houseNo || ''} 
              onChange={(e) => {
                e.preventDefault();
                setAddress( {...address, houseNo: e.target.value} );
              }} 
            />
            <div className="underline"></div>
            <label htmlFor="">House No</label>
      </div>
      </div>
      <div className="form-row">
      <div className="input-data">
            <input 
              type="text" 
              placeholder=' ' 
              defaultValue={initialAddress.street || ''} 
              onChange={(e) => {
                e.preventDefault();
                setAddress( {...address, street: e.target.value} );
              }} 
            />
            <div className="underline"></div>
            <label htmlFor="">Street</label>
      </div>
      </div>
      <div className="form-row">
      <div className="input-data">
            <input 
              type="text" 
              placeholder=' ' 
              defaultValue={initialAddress.city || ''} 
              onChange={(e) => {
                e.preventDefault();
                setAddress( {...address, city: e.target.value} );
              }} 
            />
            <div className="underline"></div>
            <label htmlFor="">City</label>
      </div>
      </div>
      <div className="form-row">
      <div className="input-data">
            <input 
              type="text" 
              placeholder=' ' 
              defaultValue={initialAddress.state || ''} 
              onChange={(e) => {
                e.preventDefault();
                setAddress( {...address, state: e.target.value} );
              }} 
            />
            <div className="underline"></div>
            <label htmlFor="">State</label>
      </div>
      </div>
      <div className="form-row">
      <div className="input-data">
            <input 
              type="text" 
              placeholder=' ' 
              defaultValue={initialAddress.pinCode || ''} 
              onChange={(e) => {
                e.preventDefault();
                setAddress( {...address, pinCode: e.target.value} );
              }} 
            />
            <div className="underline"></div>
            <label htmlFor="">PinCode</label>
      </div>
      </div>
      <div className="form-row">
      <div className="input-data">
            <input 
              type="text" 
              placeholder=' ' 
              defaultValue={initialAddress.landmark || ''} 
              onChange={(e) => {
                e.preventDefault();
                setAddress( {...address, landmark: e.target.value} );
              }} 
            />
            <div className="underline"></div>
            <label htmlFor="">Landmark</label>
      </div>
      </div>
    </>
  )
}

export default AddressInput
