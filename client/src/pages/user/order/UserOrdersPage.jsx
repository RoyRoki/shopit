import React, { useEffect, useState } from 'react'
import styles from './UserOrdersPage.module.css'
import Navber from '../../../components/home/navber/Navber'
import { request } from '../../../helper/AxiosHelper';
import { urls } from '../../../util/URLS';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

const UserOrdersPage = () => {
  const navigate = useNavigate();
  const [cartSummary, setCartSummary] = useState(null);

  useEffect(() => {
    const action = async() => {
      try {
        const response = await request("GET", urls.getUserCartSummary);
        // Set the summary
        if(response.status === 200) {
          setCartSummary(response.data);
        }
      } catch (error) {
        // If user don't have any address
        if(error.response && error.response.status === 422) {
          navigate("/addresses")
        } else {
          console.error("error : ",error);
        }
      }
    }
    action();
  }, []);

  return (
    <div className={styles.main_page}>
      {(
        <Navber isLogged={true} />
      )}
      {cartSummary ? (
        <div className={styles.summary_wrap}>

          <div className={styles.orderPerStore_wrap}>
            {cartSummary.orderPerStore?.map((orderPerStore, index) => (

              <div className={styles.per_store} key={index}>
                <div className={styles.store_name}>
                  {orderPerStore.storeName}
                </div>
                <div className={styles.cart_items_wrap}>
                  {orderPerStore.cartItems?.map((cartItem, index) => (
                    <div className={styles.cartItem_wrap} key={index} >
                        <div className={styles.img_box}>
                            <div className={styles.img_wrap}>
                              { cartItem.product?.imageUrls?.length > 0 ? (
                                <div 
                                  className={styles.img_frame}
                                  style={{backgroundImage: `url('${cartItem?.product?.imageUrls?.[0]}')`}}
                                  onClick={() => navigate(`/home?product_id=${cartItem?.product?.id}`)}
                                ></div>
                              ) : (
                                <div 
                                    className={styles.demo_img_frame} 
                                    onClick={() => navigate(`/home?product_id=${cartItem?.product?.id}`)}
                                >
                                </div>
                              )}
                              <div className={styles.quantity_info}>
                                <span>{cartItem.quantity}</span>
                              </div>
                            </div>
                        </div>
                        <div className={styles.info_box}>
                          <div className={styles.info_name}>
                            {cartItem.product?.name || "Product Name"}
                          </div>
                          <div className={styles.info_stock}>
                              {cartItem?.isAvailable ? (
                                <span>In stock</span>
                              ) : (
                                <span style={{color: "red"}}>Out of stock</span>
                              )}
                          </div>
                        </div>
                        <div className={styles.price_box}>
                          <div className={styles.price_offer}>
                              {`${cartItem?.product?.discount * 100}% off`}
                          </div>
                          <div className={styles.price_final}>
                              {`₹${parseFloat(cartItem?.product?.prices - (cartItem?.product?.prices * cartItem?.product?.discount))}`}
                          </div>
                          <div className={styles.price_mrp}>
                              {`M.R.P.: ₹${cartItem?.product?.prices || '000'}`}
                          </div>
                        </div>

                    </div>
                  ))}
                </div>
              </div>

            ))}
          </div>

          <div className={styles.order_info_wrap}>
            <div>
              <span>Cart Subtotal:</span>
              <span>{cartSummary.cartSubtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Total GST Amount:</span>
              <span>{cartSummary.totalGstAmount.toFixed(2)}</span>
            </div>
            <div>
              <span>Total Delivery Cost:</span>
              <span>{cartSummary.totalDeliveryCost.toFixed(2)}</span>
            </div>
            <div>
              <span>Grand Total:</span>
              <span>{cartSummary.grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          Loading...
        </div>
      )}
    </div>
  )
}

export default UserOrdersPage
