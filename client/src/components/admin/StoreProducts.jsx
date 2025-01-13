import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStoreProducts } from '../../features/admin/storeProductsSlice'
import StoreProduct from './StoreProduct';

const StoreProducts = ({ onEditProduct}) => {
      const dispatch = useDispatch();
      const {products, error, loading} = useSelector((state) => state.storeProducts);

      useEffect(() => {
            const fetchProducts = async () => {
                  dispatch(fetchStoreProducts());
            }
            return () => fetchProducts();
      }, [dispatch]);

      if(Object.keys(products).length === 0) {
            return (
                  <div>
                        <p>No Product yet! Add new product now.</p>
                  </div>
            );
      }
      if(error) {
            return (
                  <div>
                        <p>Error ----- {error}</p>
                  </div>  
            )
            
      }
      if(loading) {
            return (
                  <div>
                        <p>loading........... . . .  .   .   .</p>
                  </div>                  
            )

      }

  return (
    <div>
      {products &&
            products.map((product) => {
            return (
                 <StoreProduct key={product.id} product={product} onEdit={onEditProduct}  /> );
            })
      }

    </div>
  )
}

export default StoreProducts
