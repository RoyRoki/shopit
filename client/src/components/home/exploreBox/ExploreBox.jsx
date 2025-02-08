import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchCategories } from "../../../features/categories/categoriesSlice";
import styles from "./ExploreBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons/faCaretUp";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons/faAngleUp";


const ExploreBox = ({ isOpen, setIsOpen}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector((state) => state.categories);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const keywords = [
    {id: 1, word: "iphone"},
    {id: 2, word: "winter"}
  ];

  const stores = [
    {id: 1, name: "Toy shop"},
    {id: 2, name: "winter shop"}
  ]

  useEffect(() => {
    if (categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch]);

  return (
    <div 
      className={styles.main_wrap}
      ref={wrapperRef}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.show_btn} ${isOpen && styles.btn_open}`}
      >
        Explore
        <FontAwesomeIcon icon={faAngleDown} />
      </button>

      {isOpen && (
        <div className={styles.main_box}>

          <div className={styles.category_box}>
            <span>All Categories</span>
            <div className={styles.categories_wrap}>
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => {
                    navigate(`/home?category_id=${category.id}`);
                    setIsOpen(false);
                  }}
                  className={styles.link}
                >
                  {category.name}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.tags_box}>
              <span>Trending Tags</span>
              <div className={styles.tags_wap}>
              {keywords.map(keyword => (
                <div
                  key={keyword.id}
                  onClick={() => {
                    navigate(`/home?key=${keyword.word}`);
                    setIsOpen(false);
                  }}
                  className={styles.link}
                >
                  #{keyword.word}
                </div>
              ))}
              </div>
          </div>

          <div className={styles.store_box}>
              <span>Top Stores</span>
              {stores.map(store => (
                <div
                  key={store.id}
                  onClick={() => {
                    navigate(`/home?store_id=${store.id}`);
                    setIsOpen(false);
                  }}
                  className={styles.link}
                >
                  {store.name}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExploreBox;
