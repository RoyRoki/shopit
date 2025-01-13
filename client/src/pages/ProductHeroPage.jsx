import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ProductHero from '../components/home/ProductHero';

const ProductHeroPage = () => {
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get('product_id');

  return (
    <div>
      { product_id && (
        <ProductHero id={product_id} />
      )}
    </div>
  )
}

export default ProductHeroPage
