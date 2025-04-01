import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../features/categories/categoriesSlice';
import styles from './CategorySelector.module.css'

const CategorySelector = ({ onSelect, initialSelectedCategories }) => {

      const dispatch = useDispatch();
      const { categories, loading, error } = useSelector((state) => state.categories);
      const [selectedCategories, setSelectedCategories] = useState(initialSelectedCategories || []);

      useEffect(() => {
            if(categories?.length === 0) {
                  dispatch(fetchCategories());
            }
      }, [dispatch]);

      const handleCategoryToggle = (id) => {
            setSelectedCategories((prevSelected) => {
                  if(prevSelected.includes(id)) {
                        // Remove the id if it's already selected
                        return prevSelected.filter((categoryId) => categoryId !== id) /* if it is true then it include lese exclude */
                  } else {
                        return [...prevSelected, id];
                  }
            });
      };

      // Call the `onSelect` callback whenever `selectedCategories` changes
      const handleSelectionChange = () => {
            onSelect(selectedCategories);
      };

      // Trigger callback whenever the selection is updated
      useEffect(() => {
            handleSelectionChange();
      }, [selectedCategories]);

  return (
      <ul className={styles.wrap}>
            {categories.map((category) => (
                  <li key={category.id}>
                        <label>
                              <input
                                type='checkbox'
                                value={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onChange={() => handleCategoryToggle(category.id)}
                              />
                              {` ${category.name}`}
                        </label>
                  </li>
            ))}
      </ul>
  )
}

export default CategorySelector
