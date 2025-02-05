import React from 'react'
import styles from './OrderItemCard.module.css'

const OrderItemCard = ({ item }) => {
  return (
    <div className={styles.main_wrap}>
      <div className={styles.product_wrap}>
            <div className={styles.img_wrap}>
              {item.product.imageUrls?.slice(0,1).map((imageUrl, index) => (
                <div
                  key={index}
                  className={styles.img_frame}
                  style={{backgroundImage: `url(${imageUrl})`}}
                >
                </div>
              ))}
              { !item.product.imageUrl || item.product.imageUrl.length > 0 && (
                <div
                  className={styles.demo_img_frame}
                ></div>
              )}
            </div>
            <span>{item.product.name}</span>
      </div>
      <div className={styles.order_wrap}>
        <div className={styles.info_wrap}>
          <span><strong>Quantity: </strong>{item.quantity}</span>
          <span><strong>Final Price: </strong>₹{item.finalPrice}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderItemCard
