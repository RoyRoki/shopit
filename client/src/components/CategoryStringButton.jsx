import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories } from '../features/categories/categoriesSlice';
import { useNavigate } from 'react-router-dom';

const CategoryStringButton = ({ categoryIds }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { categories } = useSelector((state) => state.categories);

      useEffect(() => {
            if(categories?.length === 0) {
                  dispatch(fetchCategories());
            }
      }, [dispatch]);

  return (
    <div className='flex gap-3 absolute text-blue-600 text-sm'>
      {categories
            ?.filter(category => categoryIds.includes(category.id))
            ?.map((category) => (
                  <button key={category.id} onClick={() => navigate(`/products?category_id=${category.id}`)}>
                        {category.name}
                  </button>
            ))}
    </div>
  )
}

export default CategoryStringButton
