import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Categories from '../Categories';
import KeywordsInput from '../KeywordsInput';
import ToggleButton from '../ToggleButton';
import ShowTable from '../ShowTable';
import { request } from '../../helper/AxiosHelper';
import { urls } from '../../util/URLS';
import TableInput from './TableInput';

const UpdateProduct = ({onComplete, product}) => {
      const {
            register,
            handleSubmit,
            watch,
            formState: { errors }
      } = useForm();

      const [categories, setCategories] = useState(product.categories?.map((category) => category.id) || []);
      const [keywords, setKeywords] = useState(product.keywords?.map((keyword) => keyword.word) || null);
      const [isActive, setIsActive] = useState(product.isActive || false);
      const [tableData, setTableData] = useState(product.tableDto || { headers: [], rows: [] });
      
      const onSubmit = async (data) => {
            const requestData = {...data,
                  categoryIds: categories,
                  keywords: keywords,
                  isActive: isActive,
                  table: tableData,
                  prices: parseFloat(data.prices),
                  discount: parseFloat(data.discount),
                  stock: parseInt(data.stock),
                  length: parseFloat(data.length),
                  width: parseFloat(data.width),
                  height: parseFloat(data.height),
                  weight: parseFloat(data.weight),};
            
            try {
                  const response = await request("PUT", `${urls.updateProductWithId}${product.id}`, requestData);
                  console.log(response);
                  if(response.status === 200) {
                        onComplete();
                  }
            } catch(error) {
                  console.log(error);
            }
      }

  return (
    <div className='register-form-div'>
      <h1>Update Your Product {"(Active Now!)"}</h1>
      <h3>Id: {product.id || "~null~"}</h3>

       <form onSubmit={handleSubmit(onSubmit)}>
             <div className="form-row">
             <div className="input-data">
                   <input type="text" placeholder=' ' {...register("name")} defaultValue={product.name || ''} />
                   <div className="underline"></div>
                   <label htmlFor="">Product Name</label>
             </div>
             </div>
             <div className="form-row">
             <div className="input-data">
                   <input type="text" placeholder=' ' {...register("description")} defaultValue={product.description || ''} />
                   <div className="underline"></div>
                   <label htmlFor="">Description</label>
             </div>
             </div>
             <div className="form-row">
             <div className="input-data">
                   <input type="number" step='any'  placeholder=' ' {...register("prices")} defaultValue={product.prices || 0}/>
                   <div className="underline"></div>
                   <label htmlFor="">Prices</label>
             </div>
             </div>
             <div className="form-row">
             <div className="input-data">
                   <input type="number" step='any'  placeholder=' ' {...register("discount")} defaultValue={product.discount  || 0}/>
                   <div className="underline"></div>
                   <label htmlFor="">Discount 100% is 1.0</label>
             </div>
             </div>
             <div className="form-row">
             <div className="input-data">
                   <input type="number" placeholder=' ' {...register("stock")} defaultValue={product.stock  || 0} />
                   <div className="underline"></div>
                   <label htmlFor="">Stock</label>
             </div>
             </div>
             <div className="form-row">
                   <Categories onSelect={(ids) => setCategories(ids)} initialSelectedCategories={categories}/>
             </div>
             <div className="form-row min-h-[200px]">
                   <KeywordsInput  onSelect={(words) => setKeywords(words)} initialSelectedKeywords={keywords || null}/>
             </div>

             <ToggleButton 
                  toggle={isActive} 
                  setToggle={() => setIsActive(!isActive)} 
                  forTrueText={'🟢Active'}
                  forFalseText={'🔴Inactive'}/>

             <TableInput tableDto={product.tableDto || null} onComplete={(table) => {console.info(table); setTableData(table)}} key={product.id}/>

              <span>In cm & g</span>
             <div className="form-row">
             <div className="input-data">
                   <input type="text" placeholder=' ' {...register("material")} defaultValue={product.material || ''} />
                   <div className="underline"></div>
                   <label htmlFor="">Material</label>
             </div>
             </div>

             <div className="form-row">
             <div className="input-data">
                   <input type="number" step='any'  placeholder=' ' {...register("length")} defaultValue={product.length  || 0}/>
                   <div className="underline"></div>
                   <label htmlFor="">length</label>
             </div>
             </div>

             <div className="form-row">
             <div className="input-data">
                   <input type="number" step='any'  placeholder=' ' {...register("width")} defaultValue={product.width  || 0}/>
                   <div className="underline"></div>
                   <label htmlFor="">width</label>
             </div>
             </div>
      
             <div className="form-row">
             <div className="input-data">
                   <input type="number" step='any'  placeholder=' ' {...register("height")} defaultValue={product.height  || 0}/>
                   <div className="underline"></div>
                   <label htmlFor="">height</label>
             </div>
             </div>

             <div className="form-row">
             <div className="input-data">
                   <input type="number" step='any'  placeholder=' ' {...register("weight")} defaultValue={product.weight  || 0}/>
                   <div className="underline"></div>
                   <label htmlFor="">weight</label>
             </div>
             </div>

             <div className="form-row">
                   <div className="input-data">
                         <input className='submit-button' type="submit" value={"Update"}/>
                   </div> 
             </div>             
       </form>
      
    </div>
  )
}

export default UpdateProduct