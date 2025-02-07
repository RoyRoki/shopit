import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCategories } from "../../../features/categories/categoriesSlice";
import styles from "./CategorySearch.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";

//@Fix
const CategorySearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [SearchParam] = useSearchParams();
  const { categories, loading } = useSelector((state) => state.categories);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!SearchParam.get("category_id")) {
      setIsOpen(false);
    }
  }, [SearchParam]);


  return (
    <div className={styles.main_wrap}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.show_btn} ${isOpen && styles.btn_open}`}
      >
        Categories
        {!isOpen ? (
          <FontAwesomeIcon icon={faCaretDown} />
        ) : (
          <FontAwesomeIcon icon={faCaretUp} />
        )}
      </button>

      {isOpen && (
        <div className={styles.category_wrap}>
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/home?category_id=${category.id}`)}
              className={styles.category}
            >
              {category.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySearch;
