import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductShowCaseCart from '../components/cards/productShowCard/ProductShowCaseCard'
import HomeProductsGroupInfo from '../components/HomeProductsGroupInfo';
import { useDispatch, useSelector } from 'react-redux';
import { removeCurrentCacheKey } from '../features/home/productSlice';
import { fetchProducts } from '../features/home/productSlice';
import LoadingComponent from '../components/LoadingComponent'
import { useNavigate } from 'react-router-dom';
import { homeProductTypes, urls } from '../util/URLS';
import { publicRequest } from '../helper/AxiosHelper';
import StoreShowCase from '../components/store/StoreShowCase';

const categoriesBySearchPage = () => {
      const [searchParams] = useSearchParams();
      const query = searchParams.get('q');

      const dispatch = useDispatch();
      const navigate = useNavigate();

      const { currentCacheKeys, error, infos, productsMap, productIdsGroupsCache } = useSelector((state) => state.homeProducts);

      const [loading, setLoading] = useState(false);
      const [products, setProducts] = useState(null);
      const [stores, setStores] = useState(null);

      const cacheKey = `${homeProductTypes.searchQuery}:${query || "_"}`;

      useEffect(() => {
            if(!currentCacheKeys.includes(cacheKey) && query) {
                  
                  const fetchProductsByType = async () => {
                        setLoading(true);
                        dispatch(fetchProducts({type: homeProductTypes.searchQuery, query: query, info: {header: `For Search Query: ${query}`}}));
                        setLoading(false);
                  }
                  
                  fetchProductsByType();
            }
      
            return () => {
                  // Clean-up cacheKey on unmount
                  dispatch(removeCurrentCacheKey(cacheKey));
            };

      }, [dispatch, query]);

      useEffect(() => {
            setProducts(productIdsGroupsCache[cacheKey]?.map((id) => productsMap[id]) || []);
      }, [productsMap]);

      useEffect(() => {
            const fetchStores = async () => {
                  try {
                        const response = await publicRequest("GET", `${urls.fetchHomeStoreDtoByQuery}${query || "_"}`);
                        console.log(`${urls.fetchHomeStoreDtoByQuery}${query}`, response.data);
                        if(response.status === 200) {
                              setStores(response.data);
                        }
                  } catch (error) {
                        console.error(error.response);
                  }
            }
            fetchStores();
      }, [query, dispatch]);

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
      <div>
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

      <div>
            {stores?.length !== 0 ? stores?.map((store) => (
                  <button key={store.id} onClick={() => navigate(`/store?id=${store.id}`)} >
                        <StoreShowCase storeDto={store} />
                  </button>
            )) : (
                  <p>No store !</p>
            )}
      </div>

    </div>
  )
}

export default categoriesBySearchPage
