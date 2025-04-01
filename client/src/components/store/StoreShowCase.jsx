import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/categories/categoriesSlice';

const StoreShowCase = ({ storeDto }) => {

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const [categoryString, setCategoryString] = useState('');

  useEffect(() => {
    if(categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  useEffect(() => {
    const categoryString = categories
      ?.filter((category) => storeDto?.categoryIds?.includes(category.id))
      ?.map((category) => category.name)
      ?.join(" > ");

    setCategoryString(categoryString);
  }, [dispatch]);

  return (
    <div className='border-2 border-solid border-blue-600 rounded-lg m-3 p-4'>
      <p>{categoryString}</p>
      <div className='flex gap-10'>
        <img 
          src={storeDto.logoUrl || 'https://static.vecteezy.com/system/resources/previews/020/662/330/non_2x/store-icon-logo-illustration-vector.jpg'} 
          alt={`Logo for ${storeDto.name}`} 
          className='w-20 h-20 rounded-full'
        />
        <div>
          <h1 className='text-2xl'>{storeDto.name}</h1>
          <p>{storeDto.email}</p>
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}

export default StoreShowCase


    // private Long id;
    // private String name;
    // private String email;
    // private String description;
    // private String state;
    // private String city;
    // private String logoUrl;
    // private String header;
    // private String about;
    // private Set<Long> categoryIds;
    // private LocalDateTime createdAt;