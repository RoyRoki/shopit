import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../features/home/productSlice';
import { homeProductTypes } from '../util/URLS';
import ProductShowCaseCart from '../components/cards/productShowCard/ProductShowCaseCard';
import ShowProductByCategory from '../components/ShowProductsByCategory'
import { fetchCategories } from '../features/categories/categoriesSlice';

const ProductsListPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsMap, productIdsGroupsCache } = useSelector((state) => state.homeProducts);
  const { categories } = useSelector((state) => state.categories);

  const [cacheKey, setCacheKey] = useState();
  const keyword = searchParams.get('keyword');
  const category_id = searchParams.get('category_id');

  useEffect(() => {
    const handleFetch = async () => {
      if(keyword) {
        // List Products By keywords
        dispatch(
          fetchProducts({
            type: homeProductTypes.keyword,
            query: `${keyword}`,
            info: {header: `Products For #${keyword}`}
          })
        );
        setCacheKey(`${homeProductTypes.keyword}:${keyword}`);
      }
      if(categories?.length === 0) {
        dispatch(fetchCategories());
      }
    }

    handleFetch();

  }, [dispatch]);


  return (
    <div>

      { keyword && (
        <div key={keyword}>
          <h1 className='m-3 text-blue-500 text-xl'>{`Product For #${keyword}`}</h1>
          {productIdsGroupsCache[cacheKey]?.map((id) => (
            <button 
              key={id} 
              onClick={() => navigate(`/product?product_id=${id}`)}
            >
              <ProductShowCaseCart product={productsMap[id]}/>
            </button>
          ))}
        </div>
      )}

      { category_id && (
        <div>
          <div>
            <hr className='mt-3'/>
            <h1 className='text-2xl m-2 font-extrabold'>{`Search Product For `}{categories?.find((category) => category?.id === parseInt(category_id))?.name || 'NULL'}</h1>
            <hr />
          </div>
          <ShowProductByCategory category_id={category_id} />
        </div>
      )}
      
    </div>
  )
}

export default ProductsListPage
