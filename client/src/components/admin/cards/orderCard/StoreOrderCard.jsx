import React from 'react'
import styles from './StoreOrderCard.module.css'

import { toDate } from '../../../../util/dateUtils'
import OrderItemCard from '../orderItem/OrderItemCard'
import { orderStatus } from '../../../../util/OrderStatus'

const StoreOrderCard = ({ order, onShipped }) => {
      if(!order) {
            return <div>NO DATA</div>
      }
  return (
    <div className={styles.main_wrap}>
      <div className={styles.order_info_wrap}>
        <span><strong>Order Id: </strong>{order.orderInfo.id}</span>
        <span><strong>ordered date: </strong>{toDate(order.orderInfo.createdAt)}</span>
        <span><strong>Order Status: </strong>{order.orderInfo.orderStatus}</span>
      </div>
      <div className={styles.order_items_wrap}>
            {order.orderItems.map((orderItem, index) => (
                  <OrderItemCard item={orderItem} key={index} />
            ))}
      </div>
      <div className={styles.info_wrap}>
        <div className={styles.address_wrap}>
              <h2>Address: </h2>
              <div className={styles.address_info}>
                <p>house no: <span>{order.orderInfo.orderAddress.houseNo}</span></p>
                <p>street: <span>{order.orderInfo.orderAddress.street}</span></p>
                <p>city: <span>{order.orderInfo.orderAddress.city}</span></p>
                <p>state: <span>{order.orderInfo.orderAddress.state}</span></p> 
                <p>pin code: <span>{order.orderInfo.orderAddress.pinCode}</span></p>
                <p>landmark: <span>{order.orderInfo.orderAddress.landmark}</span></p>
              </div>
        </div>
        <div className={styles.customer_wrap}>
              <h2>Customer: </h2>
              <div className={styles.customer_info}>
                <p>email: <span>{order.customer.email}</span></p>
                <p>mobile: <span>{order.customer.mobileNo}</span></p>
              </div>  
        </div>
      </div>
      <hr />
      <div className={styles.others_info}>
        <span><strong>Payment Type: </strong>{order.orderInfo.paymentType}</span>
        <span><strong>Store SubTotal: </strong>₹{order.storeSubtotal}</span>
        <span><strong>Delivery Cost: </strong>₹{order.deliveryCost}</span>
        <span><strong>GST Amount: </strong>₹{order.gstAmount}</span>
        <div className={styles.total_wrap}>
            <span>Total: ₹{order.total}</span>
        </div>
      </div>
      <div className={styles.action_wrap}>
        {order.orderInfo.orderStatus === orderStatus.confirm && (
          <button
            className={styles.ship_button}
            onClick={() => onShipped(order.orderInfo.id)}
          >
            Mark as Shipped
          </button>
        )}
      </div>
    </div>
  )
}

export default StoreOrderCard
