import React, { useEffect, useState } from 'react'
import styles from './ProductsByKeyword.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../features/home/productSlice';
import { homeProductTypes } from '../../../util/URLS';
import ProductHighlightCard from '../../cards/productHighlightCard/ProductHighlightCard';

const ProductsByKeyword = ({ keyword }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
        productsMap, 
        productIdsGroupsCache 
      } = useSelector((state) => state.homeProducts);
  
  const [cacheKey, setCacheKey] = useState();

  useEffect(() => {
    const handleFetch = async () => {
      if(keyword) {
        // Fetch products by keyword
        dispatch(
          fetchProducts({
            type: homeProductTypes.keyword,
            query: `${keyword}`,
            info: {header: `Products For #${keyword}`}
          })
        );
        setCacheKey(`${homeProductTypes.keyword}:${keyword}`)
      }
    }
    handleFetch();
  }, [dispatch]);

  return (
    <div className={styles.main_box}>
      { keyword && (
        <div className={styles.products_show_box}>
          <div className={styles.products_show_header}>
            <span>{`Products For`} <span className={styles.tag}>#{keyword}</span>  </span>
          </div>
          <div className={styles.products_wrap}>

            {productIdsGroupsCache[cacheKey]?.map((id) => (
              <div key={id} className={styles.product_box}>
                <div className={styles.product_wrap}>

                  {productsMap[id] && (
                    <ProductHighlightCard key={id} product={productsMap[id]} />
                  )}

                  {/* If no product found by the ID then show dummy product */}
                  {!productsMap[id] && (
                    <div className={styles.no_product}></div>
                  )}

                </div>
              </div>
            ))}

            {/* If products null then show dummy Product */}
            {productIdsGroupsCache[cacheKey]?.length === 0 && (
              <div className={styles.product_box}>
                <div className={styles.no_product_wrap}>
                    <div className={styles.no_product}></div>
                    <div className={styles.no_product}></div>
                    <div className={styles.no_product}></div>
                    <div className={styles.no_product}></div>
                    <div className={styles.no_product}></div>
                    <div className={styles.no_product}></div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsByKeyword
