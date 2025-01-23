import React, { useEffect, useState } from 'react'
import styles from './StorePublicPage.module.css'
import { useNavigate } from 'react-router-dom';
import { publicRequest } from '../../../helper/AxiosHelper';
import { homeProductTypes, urls } from '../../../util/URLS';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, removeCurrentCacheKey } from '../../../features/home/productSlice';
import { fetchCategories } from '../../../features/categories/categoriesSlice';
import ProductHighlightCard from '../../cards/productHighlightCard/ProductHighlightCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faStore } from '@fortawesome/free-solid-svg-icons';

const StorePublicPage = ({ storeId }) => {

      const dispatch = useDispatch();
      const navigate = useNavigate();
      const [store, setStore] = useState([]);
      const [products, setProducts] = useState(null);
      const [heroDiv, setHeroDiv] = useState("p");

      const { categories } = useSelector((state) => state.categories);

      const { 
            currentCacheKeys, 
            error, 
            infos, 
            productsMap, 
            productIdsGroupsCache 
      } = useSelector((state) => state.homeProducts);


      const cacheKey = `${homeProductTypes.storeId}:${storeId}`;

      // For fetching the store data
      useEffect(() => {
            const fetchStore = async () => {
                  try {
                        const response = await publicRequest("GET", `${urls.fetchHomeStoreById}${storeId}`, {});
                        if(response.status === 200) {
                              setStore(response.data);
                        }
                  } catch (error) {
                        console.log(error);
                  }
            }
            fetchStore();
      }, [storeId]);

      // For fetching the Products
      useEffect(() => {
          if(!currentCacheKeys.includes(cacheKey)) {
                
                const fetchProductsByType = async () => {
                      dispatch(
                        fetchProducts(
                          {
                            type: homeProductTypes.storeId, 
                            query: storeId, 
                            info: {header: `For Store Id: ${storeId}`}
                          }
                        )
                      );
                }
                
                fetchProductsByType();
          }
    
          return () => {
                // Clean-up cacheKey on unmount
                dispatch(removeCurrentCacheKey(cacheKey));
          };

       }, [dispatch, storeId]);
    
      // For Set the products
      useEffect(() => {
          setProducts(productIdsGroupsCache[cacheKey]
            ?.map((id) => productsMap[id]) || []);
      }, [productsMap]);

      // For fetching the category
      useEffect(() => {
            if(categories?.length === 0) {
                  dispatch(fetchCategories());
            }
      }, [dispatch]);

  return (
    <div className={styles.main_page}>
      <div className={styles.store_main}>
            <div className={styles.store_wrap}>
                  <div className={styles.store_profile}>
                        <div className={styles.profile_banner_wrap}>
                              <div 
                                    className={styles.banner_frame}
                                    style={{
                                          backgroundImage: `url(${store.bannerUrl || 'banner/bd3.png'})`
                                    }}
                              ></div>
                        </div>
                        <div className={styles.profile_info_box}>
                              <div className={styles.logo_wrap}>
                                    <div
                                          className={styles.logo_frame}
                                          style={{
                                                backgroundImage: `url(${store.logoUrl || 'logo/lg1.png'})`
                                          }}
                                    ></div>
                              </div>
                              <div className={styles.info_wrap}>
                                    <div className={styles.name}>
                                          {`${store.name || "STORE NAME"}`}
                                    </div>
                                    <div className={styles.header}>
                                          {`${store.header || "BEST STORE HERE"}`}
                                    </div>
                              </div>
                              <div className={styles.contact_info}>
                                    <div className={styles.email}>
                                          {`${store.email || `${store.name}@gmail.com`}`}
                                    </div>
                                    <div className={styles.creation_data}>
                                          <span>{`Since ${new Date(store.createdAt).getFullYear()}`}</span>
                                    </div>
                              </div>
                        </div>
                  </div>
                  <div className={styles.store_nav_bar_wrap}>
                        <div className={styles.store_nav_bar}>
                              <div 
                                    onClick={() => setHeroDiv("p")} 
                                    className={styles.nav_option}
                              >
                                    <span 
                                          style={{border: `${heroDiv !== "p" ? "none" : ""}`}} 
                                    >
                                          <FontAwesomeIcon icon={faStore} />
                                          {`   Products`}
                                    </span>
                              </div>

                              <div
                                    onClick={() => setHeroDiv("a")} 
                                    className={styles.nav_option}
                                    
                              >
                                    <span 
                                          style={{border: `${heroDiv !== 'a' ? "none" : ""}`}} 
                                    >
                                          <FontAwesomeIcon icon={faCircleInfo} />
                                          {`  About`}
                                    </span>
                              </div>
                        </div>
                  </div>
            </div>
            <div className={styles.store_hero}>
                  {heroDiv === "p" && (
                        <div className={styles.store_products_box}>
                              <div className={styles.products_wrap}>
                                    { products?.map((product, index) => (
                                          <ProductHighlightCard key={index} product={product}/>
                                    ))}
                                    {/* Handle No Product (Show demo products) */}
                                    { products?.length === 0 && (
                                          <>
                                            <ProductHighlightCard product={{}} />                                            
                                            <ProductHighlightCard product={{}} />
                                          </>
                                    )}
                              </div>
                        </div>
                  )}
                  {heroDiv === "a" && (
                        <div className={styles.store_about_box}>
                              <div className={styles.description_box}>
                                    <span>Description</span>
                                    <div className={styles.description}>
                                          <p>{store.description}</p>
                                    </div>
                              </div>
                              <div className={styles.about_box}>
                                    <span>About</span>
                                    <p className={styles.about}>
                                          {store.about}
                                    </p>
                              </div>
                              <div className={styles.address_box}>
                                    <span>Address</span>
                                    <p className={styles.address}>
                                          {`State : ${store.state}`}
                                    </p>
                                    <p className={styles.address}>
                                          {`City : ${store.city}`}
                                    </p>
                                    <p className={styles.address}>
                                          {`Email : ${store.email}`}
                                    </p>
                                    <p className={styles.address}>
                                          {`Create At : ${store.createdAt}`}
                                    </p>
                              </div>
                        </div>
                  )}
            </div>
      </div>
    </div>
  )
}

export default StorePublicPage
