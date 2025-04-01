import React from 'react'
import styles from './ProductMediaForm.module.css'
import ProductImageUpdateForm from './imageUpdate/ProductImageUpdateForm'

const ProductMediaForm = ({ product, onComplete }) => {

  return (
    <div className={styles.main_wrap}>
      <div className={styles.image_form_wrap}>
            <div className={styles.image_header}>
              Update Product Images
            </div>
            <ProductImageUpdateForm productId={product.id} savedUrls={product.imageUrls} onComplete={onComplete}/>
      </div>  
    </div>
  )
}

export default ProductMediaForm
