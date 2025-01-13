import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../features/home/productSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import ShowProductsByCategory from '../ShowProductsByCategory';
import { homeProductTypes, urls } from '../../util/URLS';
import LoadingComponent from '../LoadingComponent';
import StoreProduct from '../admin/StoreProduct';
import ProductHero from '../home/ProductHero';
import StoreShowCase from '../store/StoreShowCase'
import { publicRequest } from '../../helper/AxiosHelper';
import HomeStores from '../HomeStores';

const UserHome = ({ userDto }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if(categories?.length === 0) {
       dispatch(fetchCategories());
    }
    
  }, [dispatch]);
  
  return (
    <div>
      <div className='m-5'>
        <SearchBer />
      </div>
      <div className="categoryWise" key={userDto.id}>
          {categories?.map((category, index) => (
            <div className='border-dotted border-4 p-3 mt-10 mb-10 m-2 border-green-600' key={index}>
              <h1 className='text-lg font-semibold text-green-800 '>{category.name}</h1>
              <ShowProductsByCategory
                key={category.id}
                category_id={category.id}
              />  
            </div>
          ))}
      </div>
      <div className="storeslist">
          <HomeStores />
      </div>
      <hr />
      <hr />
    </div>
  )
}

export default UserHome



