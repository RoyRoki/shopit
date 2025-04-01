import React, { useEffect, useState } from 'react'
import styles from './ProductsByQuery.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { homeProductTypes, urls } from '../../../util/URLS';
import { fetchProducts, removeCurrentCacheKey } from '../../../features/home/productSlice';
import ProductHighlightCard from '../../cards/productHighlightCard/ProductHighlightCard';
import { publicRequest } from '../../../helper/AxiosHelper';
import StoreShowCart from '../../cards/storeShowCart/StoreShowCart';

const ProductsByQuery = ({ query }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentCacheKeys, productsMap, productIdsGroupsCache } = useSelector((state) => state.homeProducts);
  const cacheKey = `${homeProductTypes.searchQuery}:${query}`;
  const [products, setProducts] = useState(null);

  // @Todo separate Store result and product result
  const [stores, setStores] = useState(null);

  useEffect(() => {
    if(!currentCacheKeys.includes(cacheKey) && query) {

        const handleFetch= async () => {
          dispatch(
            fetchProducts({
              type: homeProductTypes.searchQuery,
              query: query,
              info: {header: `Products For Search : ${query}`}
            })
          )
        }
        handleFetch();
    }

    return () => {
      // Clean-up cacheKey on unmount
      dispatch(removeCurrentCacheKey(cacheKey));
    }
  }, [dispatch, query]);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await publicRequest("GET", `${urls.fetchHomeStoreDtoByQuery}${query}`);
        if(response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error(error.response);
      }
    }
    fetchStore();
  }, [query]);

  useEffect(() => {
    setProducts(productIdsGroupsCache[cacheKey]?.map((id) => productsMap[id]) || []);
  }, [productsMap, query]);

  return (
    <div className={styles.main_container}>
          <div className={styles.products_show_header}>
            <span>{`Showing ${(products?.length + stores?.length)} results for "${query}"`}</span>
          </div>
      { Array.isArray(products) && products.length > 0 ? (
        <div className={styles.main_wrap} >
            {products?.map((product, index) => (
              <div className={styles.card_wrap} key={index}>
                <ProductHighlightCard product={product} key={index} />
              </div>
            ))}
        </div>
      ) : stores?.length > 0 ? (
        <div className={styles.stores_box}>
            {stores?.map((store, index) => (
              <StoreShowCart store={store} key={index} />
            ))}
        </div>
      ) : (
          <div className={styles.no_card_wrap}>
            <div className={styles.demo_card}></div>
            <div className={styles.demo_card}></div>
            <div className={styles.demo_card}></div>
          </div>
      )}
    </div>
  )
}

export default ProductsByQuery
