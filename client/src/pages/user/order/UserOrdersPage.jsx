import React, { useEffect, useState } from "react";
import styles from "./UserOrdersPage.module.css";
import Navber from "../../../components/home/navber/Navber";
import { request } from "../../../helper/AxiosHelper";
import { urls } from "../../../util/URLS";
import { replace, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus, faCaretDown, faCaretUp, faMobileScreenButton, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { userOrderPage } from "../../../util/HERODIV";
import { toDate } from "../../../util/dateUtils";
import AddressSelector from "../../../components/user/addressSelector/AddressSelector";
import { paymentType } from "../../../util/PaymentType";

const UserOrdersPage = ({ state }) => { 
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();

  const [cartSummary, setCartSummary] = useState(null);
  const [addressId, setAddressId] = useState(-1);
  const [payment_type, setPaymentType] = useState(paymentType.online)
  const [ordersList, setOrdersList] = useState(null);
  const [pageState, setPageState] = useState(
    state || userOrderPage.prevOrderList
  );

  const isSummary = SearchParams.get("summary");

  const [visibleDetailsIndex, setVisibleDetailsIndex] = useState(null);

  const action = async () => {
    if (pageState === userOrderPage.newOrderSum) {
      try {
        const response = await request("GET", urls.getUserCartSummary);
        // Set the summary
        if (response.status === 200) {
          setCartSummary(response.data);
        }
      } catch (error) {
        // If user don't have any address
        if (error.response && error.response.status === 422) {
          navigate("/addresses");
        } else {
          console.error("error : ", error);
        }
      }
    } else if (pageState === userOrderPage.prevOrderList) {
      try {
        const response = await request("GET", urls.userOrdersList);
        if (response.status === 200) {
          setOrdersList(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await request("POST", `${urls.placeOrder}?addressId=${addressId}&payment_type=${payment_type}`);

      if (response.status === 200) {
        if(payment_type === paymentType.caseOnDelivery) {
          action();
          setPageState(userOrderPage.prevOrderList);
        }
        else if(payment_type === paymentType.online) {
          navigate('/payment', {state: {orderId: response.data.id}}, replace);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    action();
  }, [pageState]);

  useEffect(() => {
    if (isSummary) {
      setPageState(userOrderPage.newOrderSum);
    }
  }, [SearchParams]);

  const handlePendingOrderDelete = async (orderId, message) => {
    try {
      const response = await request("PUT", `${urls.deletePendingOrder}${orderId}`, {message});
      if(response.status === 200) {
        // For reload
        action();
      }
    } catch(error) {
      console.log(error);
    }
  } 

  const confirmButtonText = () => {
    if(payment_type === paymentType.caseOnDelivery) {
      return 'Confirm Your Order Now';
    } else if(payment_type === paymentType.online) {
      return 'Pay Now To Confirm Your Order';
    }
  }

  return (
    <div className={styles.main_page}>
      {<Navber isLogged={true} />}

      {/* New Order Summary Page*/}
      {pageState === userOrderPage.newOrderSum &&
        (cartSummary ? (
          <div className={styles.summary_wrap}>
            <div className={styles.orderPerStore_wrap}>
              {cartSummary.orderSummaryPerStores?.map(
                (orderPerStore, index) => (
                  <div className={styles.per_store} key={index}>
                    <div className={styles.store_name}>
                      {orderPerStore.storeName}
                    </div>
                    <div className={styles.cart_items_wrap}>
                      {orderPerStore.cartItems?.map((cartItem, index) => (
                        <div className={styles.cartItem_wrap} key={index}>
                          <div className={styles.img_box}>
                            <div className={styles.img_wrap}>
                              {cartItem.product?.imageUrls?.length > 0 ? (
                                <div
                                  className={styles.img_frame}
                                  style={{
                                    backgroundImage: `url('${cartItem?.product?.imageUrls?.[0]}')`,
                                  }}
                                  onClick={() =>
                                    navigate(
                                      `/home?product_id=${cartItem?.product?.id}`
                                    )
                                  }
                                ></div>
                              ) : (
                                <div
                                  className={styles.demo_img_frame}
                                  onClick={() =>
                                    navigate(
                                      `/home?product_id=${cartItem?.product?.id}`
                                    )
                                  }
                                ></div>
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
                                <span style={{ color: "red" }}>
                                  Out of stock
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.price_box}>
                            <div className={styles.price_offer}>
                              {`${cartItem?.product?.discount * 100}% off`}
                            </div>
                            <div className={styles.price_final}>
                              {`₹${parseFloat(
                                cartItem?.product?.prices -
                                  cartItem?.product?.prices *
                                    cartItem?.product?.discount
                              )}`}
                            </div>
                            <div className={styles.price_mrp}>
                              {`M.R.P.: ₹${cartItem?.product?.prices || "000"}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.footer_box}>
                      <span>{`products cost: ₹${orderPerStore.storeSubtotal} + gst: ₹${orderPerStore.gstAmount} + delivery: ₹${orderPerStore.deliveryCost}`}</span>
                      <span>{`Subtotal (${orderPerStore.cartItems?.length} items) :  ₹${orderPerStore.total}`}</span>
                    </div>
                  </div>
                )
              )}
              <div className={styles.order_info_wrap}>
                <div>
                  <span>Cart Subtotal: </span>
                  <span>₹{cartSummary.cartSubtotal.toFixed(2)}</span>
                </div>
                <div>
                  <span>Total GST Amount: </span>
                  <span>₹{cartSummary.totalGstAmount.toFixed(2)}</span>
                </div>
                <div>
                  <span>Total Delivery Cost: </span>
                  <span>₹{cartSummary.totalDeliveryCost.toFixed(2)}</span>
                </div>
                <div className={styles.grand_total}>
                  <span>Grand Total: </span>
                  <span>₹{cartSummary.grandTotal.toFixed(2)}</span>
                </div>
                <div className={styles.change_address_wrap}>
                  <span>Delivery Address</span>
                  <AddressSelector onSelect={(id) => setAddressId(id)}/>
                </div>
                <div className={styles.payment_wrap}>
                  <span>Payment Type</span>
                  <div className={styles.payment_types}>
                    <div 
                      onClick={() => setPaymentType(paymentType.online)}
                      className={`${styles.pay_type} ${payment_type === paymentType.online ? styles.pay_type_active : styles.pay_type_inactive}`}
                    >
                      <span>online payment</span>
                      <FontAwesomeIcon icon={faMobileScreenButton}/>
                    </div>
                    <div 
                      onClick={() => setPaymentType(paymentType.caseOnDelivery)}
                      className={`${styles.pay_type} ${payment_type === paymentType.caseOnDelivery ? styles.pay_type_active : styles.pay_type_inactive}`}
                    >
                      <span>case on delivery</span>
                      <FontAwesomeIcon icon={faTruckFast}/>
                    </div>
                  </div>
                </div>
              </div>
              <div 
                className={`${styles.order_btn} ${payment_type === paymentType.online ? styles.online_pay_btn : payment_type === paymentType.caseOnDelivery ? styles.cod_pay_btn : ''}`}
              >
                <button
                  onClick={() => handlePlaceOrder()}
                >
                  {confirmButtonText()}
                </button>
              </div>     
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        ))}
        
      {/*  Already Ordered list */}
      {pageState === userOrderPage.prevOrderList && (
        <div className={styles.orders_list}>
          {ordersList ? (
            // Iterate over orders
            <div className={styles.order_wrap}>
              {ordersList.map((order, index) => (
                // For Each order
                <div className={`${styles.per_stores_wrap} ${order.orderStatus === 'CONFIRMED' ? styles.confirmed_order : ''}`} key={index}>
                  <div className={styles.order_info}>
                    <p>
                      <span>Order Id:</span> {order.id}
                    </p>
                    <p>
                      <span>Ordered Date:</span> {toDate(order.createdAt)}
                    </p>
                    <p>
                      <span>Grand Price:</span> {order.grandPrice}
                    </p>
                    <p className={styles.order_status}>
                      <span>Order Status:</span> {order.orderStatus}
                    </p>
                  </div>
                  <div 
                    className={styles.see_details_wrap}
                    onClick={(e) => {
                      setVisibleDetailsIndex(visibleDetailsIndex === index ? null : index);
                    }}
                  >
                   {visibleDetailsIndex === index ? (
                    <>
                      <span>hide details</span>
                      <FontAwesomeIcon icon={faCaretUp}/>
                    </>
                   ) : (
                    <>
                      <span>see details</span>  
                      <FontAwesomeIcon icon={faCaretDown}/>
                    </>
                   )}
                  </div>
                  <div className={styles.payment_wrap}>
                    {
                      order.orderStatus === 'PENDING' && (
                        <button onClick={() => navigate(`/payment`, { state: {orderId: order.id} })}>
                          Complete Payment
                        </button>
                      )
                    }
                  </div>
                  {/* Iterate store wise */}
                  {visibleDetailsIndex === index && (
                    <div className={styles.per_store_wrap}>
                      {order.orderPerStores.map((per_store, index) => (
                        // For Order Per Store
                        <div className={styles.per_store} key={index}>
                          <div className={styles.store_info}>
                            {`Store name: ${per_store.storeName}`}
                          </div>
                          {/* Iterate over all ordered products */}
                          <div className={styles.products_info}>
                            {per_store.orderItems.map((order_item, index) => (
                              // For Each Product
                              <div className={styles.order_item} key={index}>
                                <div className={styles.item_product__info}>
                                  {`Product Name: ${order_item.product.name}`}
                                </div>
                                <div className={styles.order_item_info}>
                                  {`Quantity: ${order_item.quantity}  Final price: ${order_item.finalPrice} `}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* @Todo fix the cancel system */}
                      {order.orderStatus === 'PENDING' && (
                        <button className={styles.cancel_pen_order} onClick={() => handlePendingOrderDelete(order.id, "Demo Message")}>cancel this pending order</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {ordersList.length === 0 && (
                //@Fix style it
                <div>
                  No Order
                </div>
              )}
            </div>
          ) : (
            <div>loading</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
