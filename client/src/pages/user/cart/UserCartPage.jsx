import React, { useEffect, useState } from 'react'
import styles from './UserCartPage.module.css'
import Navber from '../../../components/home/navber/Navber'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { homeProductTypes, urls } from '../../../util/URLS';
import { fetchProducts, removeCurrentCacheKey } from '../../../features/home/productSlice';
import ProductShowCaseMiniCard from '../../../components/cards/productMiniCard/ProductShowCaseMiniCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { request } from '../../../helper/AxiosHelper';
import { setCart } from '../../../features/user/UserCart';


const UserCartPage = ({ isLogged }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const { cart, loading, error } = useSelector((state) => state.userCart);  
          
          const handleDelete = (productId) => {
            // Delete In Local if user not login
            if(!isLogged) {
              const localCart =  JSON.parse(localStorage.getItem("cart")) || { cartItems: [], totalCartPrice: 0 };
              localCart.cartItems = localCart.cartItems.filter(
                  cartItem => String(cartItem?.product?.id) !== String(productId)
              );
              // Update cart total cart prices
              localCart.totalCartPrice = localCart.cartItems.reduce((total, cartItem) => {
                const productPrice = cartItem.product?.prices * (1 - cartItem.product?.discount || 0);
                return total +(productPrice * (cartItem.quantity || 0)) ;
              }, 0);

              localStorage.setItem("cart", JSON.stringify(localCart));
              dispatch(setCart(localCart));
            }

            // Delete In Backend
            else if(isLogged) {
              const action = async () => {
                const response = await request("DELETE", urls.updateCart, [productId]);
                if(response.status === 200) {
                    dispatch(setCart(response.data));
                }
              }
              action();
            }
          }
    
          const handleIncrement = (productId, prevQuantity) => {
            // Update In Local If User Not Login
            if(!isLogged) {
                const localCart =  JSON.parse(localStorage.getItem("cart")) || { cartItems: [], totalCartPrice: 0 };
                const existingCartItem = localCart.cartItems.find(cartItem => String(cartItem?.product?.id) === String(productId));
              if(existingCartItem) {
                  existingCartItem.quantity = prevQuantity + 1;
              }
              // Update cart total cart prices
              localCart.totalCartPrice = cart.cartItems.reduce((total, cartItem) => {
                  const productPrice = cartItem.product?.prices * (1 - cartItem.product?.discount || 0);
                  return total + productPrice * (cartItem?.quantity);
              }, 0);

              localStorage.setItem("cart", JSON.stringify(localCart));
              dispatch(setCart(localCart));
            }
            // Update In Backend
            else if(isLogged) {
              const action = async () => {
                const response = await request("PUT", urls.updateCart, {[productId] : 1} );
                if(response.status === 200) {
                  dispatch(setCart(response.data));
                }
              }
              action();
            }
          }
    
          const handleDecrement = (productId, prevQuantity) => {
            // Update In Local If User Not Login
            if(!isLogged) {
                const localCart =  JSON.parse(localStorage.getItem("cart")) || { cartItems: [], totalCartPrice: 0 };
                const existingCartItem = localCart.cartItems.find(cartItem => String(cartItem?.product?.id) === String(productId));
              if(existingCartItem) {
                  existingCartItem.quantity = prevQuantity - 1;
              }
              // Update cart total cart prices
              localCart.totalCartPrice = localCart.cartItems.reduce((total, cartItem) => {
                  const productPrice = cartItem.product?.prices * (1 - cartItem.product?.discount || 0);
                  return total + productPrice * (cartItem?.quantity);
              }, 0);
              localStorage.setItem("cart", JSON.stringify(localCart));
              dispatch(setCart(localCart));
            }
            // Update In Backend
            else if(isLogged) {
              const action = async () => {
                const response = await request("PUT", urls.updateCart, {[productId] : -1});
                if(response.status === 200) {
                  dispatch(setCart(response.data));
                }
              }
              action();
            }
          }

      useEffect(() => {
        if(!isLogged) {
          const cart = JSON.parse(localStorage.getItem("cart")) || { cartItems: [], totalCartPrice: 0 };
          dispatch(setCart(cart));
        }
        else if (isLogged) {
          const handleFetchCart = async () => {
            try {
              const response = await request("GET", urls.fetchCart);
              if(response.status === 200) {
                dispatch(setCart(response.data));
              }
            } catch (error) {
              console.error(error);
            }
          }
          handleFetchCart();
        }
      }, [dispatch, isLogged]);




  return (
    <div className={styles.main_page} >
      {(
            <Navber isLogged={isLogged} />
      )}
      <div className={styles.hero_box}>
        <div className={styles.cartItems_section}>
          <div className={styles.cart_header}>
              <h2>Shopping Cart</h2>
              <span>price</span>
          </div>
          <div className={styles.cartItems_wrap}>
          {cart.cartItems?.map((cartItem, index) => (
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
                  <div className={styles.info_store} onClick={() => navigate(`/home?store_id=${cartItem?.product?.storeId}`)}>
                      {`Store : ${cartItem?.product?.storeName || "Store Name"}`}
                  </div>
                  <div className={styles.item_control}>
                    <div className={styles.icon_control}>
                      { cartItem.quantity <= 1 ? (
                        <button className={styles.delete_btn} onClick={() => handleDelete(cartItem?.product?.id)}> 
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        ) : (
                        <button className={styles.decrement_btn} onClick={() => handleDecrement(cartItem?.product?.id, cartItem.quantity)}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      )}
                        <span>{cartItem.quantity || '0'}</span>
                        <button className={styles.increment_btn} onClick={() => handleIncrement(cartItem?.product?.id, cartItem.quantity)}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <div className={styles.text_control}>
                      <button onClick={() => handleDelete(cartItem?.product?.id)}>{"Delete"}</button>
                      <button>{"Save for later"}</button>
                      <button>{"See more like this"}</button>
                      <button onClick={() => navigator.clipboard.writeText(`${window.location.host}/home?product_id=${cartItem?.product?.id}`)}>{"Share"}</button>
                    </div>
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
          <div className={styles.footer_box}>
            <div className={styles.total_str}>
                {`Subtotal (${cart.cartItems?.length} items) :  ₹${cart.totalCartPrice}`}
            </div>
          </div>
        </div>
        <div className={styles.action_btn_box}>
            <div className={styles.action_btn_wrap}>
              {!isLogged ? (
                <div className={styles.guest_btn_wrap}>
                  <button 
                      onClick={() => navigate("/register")} 
                      className={styles.register_btn}
                  >Create New Account</button>

                  <button 
                      onClick={() => navigate("/login")} 
                      className={styles.login_btn}
                  >Login Now</button>
                </div>
              ) : (
                <div className={styles.user_btn_wrap}>
                  <button>Buy Now</button>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default UserCartPage
