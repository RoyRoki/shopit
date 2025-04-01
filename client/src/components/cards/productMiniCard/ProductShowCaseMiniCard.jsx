import React from 'react'
import styles from './ProductMiniCard.module.css'

const ProductShowCaseMiniCard = ({ product }) => {
  return (
    <div className={styles.mini_card}>
      <div className={styles.img_wrap}>
            {(product.imageUrls?.[0]) && (
                <img 
                  src={product.imageUrls?.[0]}
                  alt={`product Image`}
                />
              )
            }
            {!product.imageUrls?.[0] && (
                  <div className={styles.no_img_box}>
                  </div>
            )}
      </div>
      <div className={styles.info_box}>
            <div className={styles.name_line}>
                {product.productName || 'Name'}
            </div>
            <div className={styles.prices_line}>
                  <p>{`₹${(product.prices - product.prices * product.discount) || '000'}`}</p>
            </div>
      </div>
    </div>
  )
}

export default ProductShowCaseMiniCard
