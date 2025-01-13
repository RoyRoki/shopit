import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductShowCaseCart from '../cards/productShowCard/ProductShowCaseCard';
import ShowTable from '../ShowTable';
import { fetchProducts } from '../../features/home/productSlice';
import { fetchCategories } from '../../features/categories/categoriesSlice';
import { homeProductTypes } from '../../util/URLS';
import ShareButton from '../ShareButton';
import KeywordsButtons from '../KeywordsButtons';
import { useNavigate } from 'react-router-dom';
import CategoryStringButton from '../CategoryStringButton';

const ProductHero = ({ id }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { productsMap } = useSelector((state) => state.homeProducts);

      const [heroProduct, setHeroProduct] = useState(productsMap[id] || null);
      const [heroImg, setHeroImg] = useState('');
      
      useEffect(() => {
        if(!heroProduct) {
          const handleFetch = async () => {
            dispatch(
              fetchProducts({
                type: homeProductTypes.productIds, 
                query: `${id}`, 
                info: {header: `Product Id: ${id}`}
              })
            );
            setHeroProduct(productsMap[id] || null);
          };
          
          handleFetch();
          
        }
      }, [dispatch, id, heroProduct, productsMap]);

      useEffect(() => {
        // Update hero Img when ever the heroProduct change
        if (heroProduct?.imageUrls?.length > 0) {
          setHeroImg(heroProduct.imageUrls[0]);
        }
      }, [heroProduct]);

      if(heroProduct === null) {
        return (
          <div>
            No Product Found!
          </div>
        )
      }

  return (
      (
        <div key={heroProduct?.productId} className='block gap-[20px] border-2 border-solid m-4 p-4 md:flex'>
          <CategoryStringButton categoryIds={heroProduct?.categoryIds || []} />
          <div className='m-5 grid'>
            <div>
              <img
                className='max-w-[100%] md:max-w-[500px]'
                src={heroImg || 'https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}
                alt={`Hero Product Img id: ${id}`} 
              />
            </div>
            <div className='flex gap-[5%] border-2 m-2 p-2'>
              {heroProduct?.imageUrls?.map((src) => (
                <div key={src} >
                  <img
                    onMouseEnter={() => setHeroImg(src)}
                    className='max-w-[100px] rounded-lg drop-shadow-lg'
                    src={src}
                    alt={`Hero Product Img id: ${id}`}
                  />       
                </div>
              ))}
            </div>
          </div>
          <div>
            <h1 className='text-lg font-extrabold'>{heroProduct.productName}</h1>

            <button onClick={() => navigate(`/store?id=${heroProduct.storeId || 0}`)}>
              <p className='text-lg text-green-600'>{`STORE : ${heroProduct.storeName}`}</p>
            </button>

            <div className='flex gap-5'>
              <h1 className='text-red-500 text-2xl font-bold'>{`-${heroProduct.discount * 100}%`}</h1>
              <h1 className='text-2xl'>{`${heroProduct.prices - heroProduct.prices * heroProduct.discount} ₹`}</h1>
            </div>
            <div className='mb-4'>
              <h1 style={{textDecoration: 'line-through'}}>{`M.R.P ${heroProduct.prices} ₹`}</h1>
              <p>Inclusive of all taxes</p>
            </div>
            <ShowTable tableDto={heroProduct.tableDto}/>
            <div className='mt-5'>
              <h2>About this item </h2>
              <p>{heroProduct.description}</p>
            </div>
            <div className='flex gap-5 m-2'>
              <button className='border-2 border-solid border-blue-400 rounded-xl p-3 bg-blue-300 text-lg m-2'>Buy Now</button>
              <button className='border-2 border-solid border-yellow-400 rounded-xl p-3 bg-yellow-300 text-lg m-2'>Add to cart</button>
            </div>
            <div>
              <KeywordsButtons keywords={heroProduct.keywords || []}/>
            </div>
          </div>
        </div>
      )
  )
}

export default ProductHero
