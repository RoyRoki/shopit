import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Categories from '../Categories';
import KeywordsInput from '../KeywordsInput';
import { request } from '../../helper/AxiosHelper';
import { urls } from '../../util/URLS';

const AddProduct = ({ onComplete }) => {
      const {
            register,
            handleSubmit,
            watch,
            formState: {errors}
      } = useForm();

      const [categories, setCategories] = useState([]);
      const [keywords, setKeywords] = useState([]);

      const onSubmit = async (data) => {
            const requestData = {...data, categoryIds: categories, keywords: keywords};
            console.log(requestData);
            try {
                  const response = await request("POST", urls.AddProduct, requestData);
                  console.log(response.data);
                  if(response.status === 200) {
                        onComplete();
                  }
            } catch (error) {
                  console.error(error);
            }
      }

  return (
    <div className='register-form-div'>
      <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-row">
            <div className="input-data">
                  <input type="text" placeholder=' ' {...register("name")} />
                  <div className="underline"></div>
                  <label htmlFor="">Product Name</label>
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
                  <input type="number" step='any' placeholder=' ' {...register("prices")} />
                  <div className="underline"></div>
                  <label htmlFor="">Prices</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="number" step='any' placeholder=' ' {...register("discount")} />
                  <div className="underline"></div>
                  <label htmlFor="">Discount 100% is 1.0</label>
            </div>
            </div>
            <div className="form-row">
            <div className="input-data">
                  <input type="number" placeholder=' ' {...register("stock")} />
                  <div className="underline"></div>
                  <label htmlFor="">Stock</label>
            </div>
            </div>
            <div className="form-row">
                  <Categories onSelect={(ids) => setCategories(ids)} initialSelectedCategories={[]}/>
            </div>
            <div className="form-row min-h-[200px]">
                  <KeywordsInput  onSelect={(words) => setKeywords(words)} initialSelectedKeywords={[]}/>
            </div>
            <div className="form-row">
                  <div className="input-data">
                        <input className='submit-button' type="submit" value={"submit"}/>
                  </div>               
            </div>
      </form>
    </div>
  )
}

export default AddProduct
