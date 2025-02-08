import React, { useEffect, useState } from 'react'
import styles from './BestProductsByCategory.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { removeCurrentCacheKey } from '../../../features/home/productSlice'; 
import { fetchProducts } from '../../../features/home/productSlice';
import { useNavigate } from 'react-router-dom';
import { homeProductTypes } from '../../../util/URLS'
import ProductShowCaseCard from '../../cards/productShowCard/ProductShowCaseCard';
import ProductShowCaseMiniCard from '../../cards/productMiniCard/ProductShowCaseMiniCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';

const BestProductsByCategory = ({ category_id, header, max }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const { 
            currentCacheKeys, 
            error, infos, 
            productsMap, 
            productIdsGroupsCache 
      } = useSelector((state) => state.homeProducts);
      const [products, setProducts] = useState(null);

      const cacheKey = `${homeProductTypes.category}:${category_id}`;

      useEffect(() => {
            if(!currentCacheKeys.includes(cacheKey)) {
                  
                  const fetchProductsByType = async () => {
                        dispatch(
                              fetchProducts(
                                    {
                                          type: homeProductTypes.category, 
                                          query: category_id, 
                                          info: {header: `For category id: ${category_id}`}
                                    }
                              )
                        )
                  }
                  
                  fetchProductsByType();
            }
      
            return () => {
                  // Clean-up cacheKey on unmount
                  dispatch(removeCurrentCacheKey(cacheKey));
            };

      }, [dispatch, category_id]);

      useEffect(() => {
            setProducts(
                  productIdsGroupsCache[cacheKey]
                  ?.map((id) => productsMap[id]) || []);
      }, [productsMap]);

      const showProductHero = (product) => {
            navigate(`/home?product_id=${product.productId}`);
      }

  return (
    <div className={styles.main_box} >
      <div className={styles.header_box} onClick={() => navigate(`/home?category_id=${category_id}`)}>
            <h2>{header || "Header"}<span>see more...</span></h2>
      </div>


      <div className={styles.products_wrap}>
            { Array.isArray(products) && products.length > 0 ? (
                  products?.slice(0,max || 4).map((product, index) => (
                        <div className={styles.product_box} key={index}>
                              <button 
                                    onClick={() => showProductHero(product)} 
                                    key={`${cacheKey}:${index}`}
                                    className={styles.product_btn_box}
                              >
                                    <div className={styles.product_show_card}>
                                          <ProductShowCaseMiniCard key={index} product={product} />
                                    </div>
                              </button>
                        </div>
                  )) 
            ) : (
                  <>
                        <div key={1} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>
                        <div key={2} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>
                        <div key={3} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>        
                        <div key={4} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>
                        <div key={5} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>
                        <div key={6} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div> 
                        <div key={7} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>
                        <div key={8} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>
                        <div key={9} className={`${styles.product_box} ${styles.product_box_empty}`}>                        
                        </div>        
                  </>
            )}
      </div>     
   

    </div>
  )
}

export default BestProductsByCategory
