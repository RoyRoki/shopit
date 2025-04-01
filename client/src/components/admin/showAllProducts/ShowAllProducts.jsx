import React from 'react'
import styles from './ShowAllProducts.module.css'
import AdminProductCard from '../cards/productCard/AdminProductCard'

const ShowAllProducts = ({ products, onProductEdit, onMediaEdit, showHero }) => {
  return (
    <div className={styles.main_wrap}>
      {products?.length > 0 && products.map(((product, index) => (
        <div className={styles.product_box} key={index}>
          <AdminProductCard product={product} onEdit={onProductEdit} key={index} onMediaEdit={onMediaEdit} showHero={showHero} />
        </div>
      )))}
    </div>
  )
}

export default ShowAllProducts