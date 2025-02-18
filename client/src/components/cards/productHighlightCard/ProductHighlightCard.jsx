import React from 'react'
import styles from './ProductHighlightCard.module.css'
import { useNavigate } from 'react-router-dom'

const ProductHighlightCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.main_card} 
          onClick={() => navigate(`/home?product_id=${product.productId || '0'}`)}>
      <div className={styles.card_wrap}>
        <div className={styles.img_box}>
          <div
            className={
              `${styles.img_frame} 
               ${!product.imageUrls?.[0] ? styles.demo_img_frame : ""}`
            }
            style={{
              backgroundImage: `url(${product.imageUrls?.[0]})`
            }}
          >
          </div>
        </div>

        <div className={styles.info_box}>
          <div className={styles.name_line}>
            {product.productName || 'Product Name'}
          </div>
          <div className={styles.description_line}>
            {product.description || 'Product Description'}
          </div>
          <div className={styles.prices_info_wrap}>
            <div className={styles.final_price}>
            <p>{`₹${parseFloat(product.prices - product.prices * product.discount) || '000'}`}</p>
            </div>
            <div className={styles.offer_info}>
              <p className={styles.mrp_line}>{`M.R.P.: ₹${Number(product.prices).toFixed(2) || "000"}`}</p>
              <p className={styles.offer_line}>{`${Number(product.discount * 100).toFixed(2)}% off`}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductHighlightCard
