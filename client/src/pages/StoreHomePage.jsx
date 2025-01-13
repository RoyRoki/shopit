import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFetcher, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../features/home/productSlice';
import { homeProductTypes, urls } from '../util/URLS';
import { publicRequest } from '../helper/AxiosHelper';
import StoreShowCase from '../components/store/StoreShowCase'
import ProductHero from '../components/home/ProductHero';
import ProductShowCaseCart from '../components/cards/productShowCard/ProductShowCaseCard';

const StoreHomePage = () => {
      const [searchParams] = useSearchParams();
      const navigate = useNavigate();
      const dispatch = useDispatch();
      const { productsMap, productIdsGroupsCache } = useSelector((state) => state.homeProducts);

      const [store, setStore] = useState({});
      const [error, setError] = useState(null);

      const id = searchParams.get("id");
      const cacheKey = `${homeProductTypes.storeId}:${id || 0}`;

      useEffect(() => {
        if(id && !productIdsGroupsCache[cacheKey]) {
          dispatch(fetchProducts({
              type: homeProductTypes.storeId,
              query: `${id}`, 
              info: {header: `Store Id: ${id}`}
          }))
        }
      }, [dispatch]);

      useEffect(() => {
        if(id) {
          const handleFetch = async () => {
            try {
              const response = await publicRequest("GET", `${urls.fetchHomeStoreById}${id}`, {} );
              setStore(response.data);
            }
            catch (error) {
              setError(error.response);
            }
          }

          handleFetch();
        }
      }, []);


  return (
    <div>
      <StoreShowCase storeDto={store}/>
      {productIdsGroupsCache[cacheKey]
        ?.map((id) => (
          <button key={id} onClick={() => navigate(`/product?product_id=${id}`)}>
            <ProductShowCaseCart product={productsMap[id]}/>
          </button>
        ))
      }
    </div>
  )
}

export default StoreHomePage
