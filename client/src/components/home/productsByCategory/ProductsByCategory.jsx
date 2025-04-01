import React, { useEffect, useState } from 'react'
import styles from './ProductsByCategory.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { homeProductTypes } from '../../../util/URLS';
import { fetchProducts, removeCurrentCacheKey } from '../../../features/home/productSlice';
import { fetchCategories } from '../../../features/categories/categoriesSlice';
import ProductHighlightCard from '../../cards/productHighlightCard/ProductHighlightCard';

const ProductsByCategory = ({ category_id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { categories } = useSelector((state) => state.categories);

    const { 
      currentCacheKeys, 
      error, 
      infos, 
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

    }, [dispatch, category_id, categories]);
    
      useEffect(() => {
          setProducts(productIdsGroupsCache[cacheKey]
            ?.map((id) => productsMap[id]) || []);
      }, [productsMap]);

      useEffect(() => {
            if(categories?.length === 0) {
                  dispatch(fetchCategories());
            }
      }, [dispatch]);

    const showProductHero = (product) => {
          navigate(`/home?product_id=${product.productId}`);
    }
  return (
    <div className={styles.main_box} >
      <div className={styles.header_box} onClick={() => navigate(`/home?category_id=${category_id}`)}>
          <h2>Products In {categories.find(cat => cat.id === parseInt(category_id))?.name || `Product In CategoryId: ${category_id}`}</h2>
      </div>
      <div className={styles.products_wrap}>
            { Array.isArray(products) && products.length > 0 ? (
                  products?.slice(0,10).map((product, index) => (
                        <ProductHighlightCard key={index} product={product}/>
                  )) 
            ) : (
                  <>
                        <div key={1} onClick={() => navigate("/home")} className={styles.demo_product_box}>                        
                        </div>     
                        <div key={21} onClick={() => navigate("/home")} className={styles.demo_product_box}>                        
                        </div>    
                        <div key={3} onClick={() => navigate("/home")} className={styles.demo_product_box}>                        
                        </div>    
                        <div key={4} onClick={() => navigate("/home")} className={styles.demo_product_box}>                        
                        </div>    
                        <div key={5} onClick={() => navigate("/home")} className={styles.demo_product_box}>                        
                        </div>    
                        <div key={6} onClick={() => navigate("/home")} className={styles.demo_product_box}>                        
                        </div> 
                  </>
            )}
      </div>        
    </div>
  )
}

export default ProductsByCategory
