import React, { useEffect, useState } from 'react'
import ProductShowCaseCart from './cards/productShowCard/ProductShowCaseCard'
import HomeProductsGroupInfo from './HomeProductsGroupInfo'
import { useDispatch, useSelector } from 'react-redux';
import { removeCurrentCacheKey } from '../features/home/productSlice';
import { fetchProducts } from '../features/home/productSlice';
import LoadingComponent from '../components/LoadingComponent'
import { useNavigate } from 'react-router-dom';
import { homeProductTypes } from '../util/URLS';

const ShowProductsByCategory = ({ category_id }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();

      const { currentCacheKeys, error, infos, productsMap, productIdsGroupsCache } = useSelector((state) => state.homeProducts);

      const [loading, setLoading] = useState(false);
      const [products, setProducts] = useState(null);

      const cacheKey = `${homeProductTypes.category}:${category_id}`;

      
      useEffect(() => {
            if(!currentCacheKeys.includes(cacheKey)) {
                  
                  const fetchProductsByType = async () => {
                        setLoading(true);
                        dispatch(fetchProducts({type: homeProductTypes.category, query: category_id, info: {header: `For category id: ${category_id}`}}));
                        setLoading(false);
                  }
                  
                  fetchProductsByType();
            }
      
            return () => {
                  // Clean-up cacheKey on unmount
                  dispatch(removeCurrentCacheKey(cacheKey));
            };

      }, [dispatch, category_id]);

      useEffect(() => {
            setProducts(productIdsGroupsCache[cacheKey]?.map((id) => productsMap[id]) || []);
      }, [productsMap]);
      
      const showProductHero = (product) => {
            navigate(`/product?product_id=${product.productId}`);
      }

      if(loading) {
            return (
                  <LoadingComponent loading={loading} />
            )
      }

  return (
    <div key={cacheKey}>
      { Array.isArray(products) && products.length > 0 ? (
            products?.map((product, index) => (
                  <button onClick={() => showProductHero(product)} key={`${cacheKey}:${index}`}>
                        <ProductShowCaseCart key={index} product={product} />
                  </button>
            )) 
      ) : (
            products  && (<h1>No Product Yet </h1>)
      )}

    </div>
  )
}

export default ShowProductsByCategory
