import React, { useContext, useEffect, useState } from "react";
import styles from "./HeroProduct.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../../features/home/productSlice";
import { homeProductTypes, urls } from "../../../util/URLS";
import {
  faCartShopping,
  faStore,
  faCircleCheck,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductHeroTable from "../../table/productTable/ProductHeroTable";
import KeywordsNavigationSet from "../../listAndControl/keywordsNav/KeywordsNavigationSet";
import { AuthContext } from "../../../context";
import { role } from "../../../util/ROLE";
import { request } from "../../../helper/AxiosHelper";
import { setCart } from "../../../features/user/UserCart";
import LoadingPage from "../../../pages/shopitHelp/loadingPage/LoadingPage"

const HeroProduct = ({ product_id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth } = useContext(AuthContext);
  const { productsMap, loading } = useSelector((state) => state.homeProducts);

  const [heroProduct, setHeroProduct] = useState(
    productsMap[product_id] || null
  );
  const [heroImg, setHeroImg] = useState("");
  const [cartNotifier, setCartNotifier] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [dropdown, setDropdown] = useState(false);

  const selectQuantity = (value) => {
    setQuantity(value);
    setDropdown(false);
  };

  const startNotifier = () => {
    setCartNotifier(true);
    setTimeout(() => {
      setCartNotifier(false);
    }, 5000);
  };

  useEffect(() => {

    // Then Fetch the product by id
    const handleFetch = async () => {
      // If product is not already in Redux state, fetch it again
      if(!productsMap[product_id]) {
        dispatch(
          fetchProducts({
            type: homeProductTypes.productIds,
            query: `${product_id}`,
            info: { header: `Product Id: ${product_id}` },
          })
        );
      }
      setHeroProduct(productsMap[product_id] || null);
    };

    handleFetch();

  }, [dispatch, product_id, productsMap]);

  useEffect(() => {
    // Update the heroImg when ever heroProduct change
    if (heroProduct?.imageUrls?.length > 0) {
      setHeroImg(heroProduct.imageUrls[0]);
    }
  }, [heroProduct]);

  const handleAddToCart = async (isBuy) => {
    if (!isBuy) {
      startNotifier();
    }
    // For Guest
    if (auth.profileMode === role.guest) {
      const cart = JSON.parse(localStorage.getItem("cart")) || {
        cartItems: [],
        totalCartPrice: 0,
      };
      const existingCartItem = cart.cartItems.find(
        (cartItem) =>
          String(cartItem?.product?.id) === String(heroProduct.productId)
      );

      if (existingCartItem) {
        existingCartItem.quantity = existingCartItem?.quantity + quantity;
        existingCartItem.isAvailable =
          heroProduct.stock >= existingCartItem?.quantity;
      } else {
        cart.cartItems.push({
          id: 0,
          quantity: quantity,
          isAvailable: heroProduct.stock >= quantity,
          product: {
            ...heroProduct,
            name: heroProduct.productName,
            id: heroProduct.productId,
          },
        });
      }

      // Update cart total cart prices
      cart.totalCartPrice = cart.cartItems.reduce((total, cartItem) => {
        const productPrice =
          cartItem.product?.prices * (1 - cartItem.product?.discount || 0);
        return total + productPrice * cartItem.quantity;
      }, 0);

      // Save the updated cart
      localStorage.setItem("cart", JSON.stringify(cart));
    }

    // For User
    else if (auth.profileMode === role.user) {
      const response = await request("PUT", urls.updateCart, {
        [product_id]: quantity,
      });
      if (response.status === 200) {
        dispatch(setCart(response.data));
      }
    }
  };

  const handleBuyNow = async () => {
    handleAddToCart(true);
    navigate("/cart");
  };

  if(loading || !heroProduct) {
    return <LoadingPage />
  }

  return (
    <div className={styles.main_wrap}>
      <div className={styles.main_container}>
        <div className={styles.categories_nav}></div>
        <div
          className={`${styles.cart_notifier_box} ${
            cartNotifier ? styles.notifier_show : styles.notifier_hide
          }`}
        >
          <div className={styles.highlight_box}>
            <div className={styles.highlight_img_wrap}>
              <div
                className={`${styles.hero_img_frame} ${
                  heroImg === "" ? styles.demo_hero_img : ""
                }`}
                style={{ backgroundImage: `url(${heroImg})` }}
              ></div>
            </div>
            <div className={styles.highlight_text_box}>
              <span className={styles.add_to_cart_span}>
                <FontAwesomeIcon icon={faCircleCheck} /> Added to cart
              </span>
              <span>
                Quantity
                {` ${quantity}`}
              </span>
            </div>
          </div>
          <div className={styles.action_box}>
            <div className={styles.action_btn_wrap}>
              <button
                className={styles.buy_btn}
                onClick={() => navigate("/cart")}
              >
                Proceed to Buy
              </button>
              <button
                className={styles.to_cart_btn}
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </button>
              {auth.profileMode === role.guest && (
                <div className={styles.auth_btn}>
                  <span>For best experience</span>
                  <a href="/login">sign in to your account</a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.hero_container}>
          <div className={styles.product_header}>
            <div className={styles.gallery_box}>
              <div className={styles.gallery_explorer}>
                {heroProduct?.imageUrls?.map((src, index) => (
                  <div
                    key={index}
                    className={styles.optional_img_frame}
                    style={{
                      backgroundImage: `url(${src})`,
                      border: `${
                        src === heroImg ? "2px" : "0px"
                      } solid var(--bs-tx2)`,
                    }}
                    onMouseEnter={() => setHeroImg(src)}
                  ></div>
                ))}
              </div>
              <div className={styles.hero_img_wrap}>
                <div
                  className={`${styles.hero_img_frame} ${
                    heroImg === "" ? styles.demo_hero_img : ""
                  }`}
                  style={{ backgroundImage: `url(${heroImg})` }}
                ></div>
              </div>
            </div>

            <div
              className={styles.select_quantity_option}
              onClick={() => setDropdown(!dropdown)}
            >
              <span>
                Quantity: <span>{quantity}</span>
                <FontAwesomeIcon icon={faCaretDown} />
              </span>
              {dropdown && (
                <div className={styles.dropdown}>
                  <ul className={styles.select_quantity}>
                    {[...Array(10)].map((_, index) => (
                      <li
                        key={index + 1}
                        role="option"
                        className={styles.a_dropdown_item}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectQuantity(index + 1);
                        }}
                      >
                        <span>{index + 1}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.button_box}>
              <button
                className={styles.btn_add_to_cart}
                onClick={() => handleAddToCart(false)}
                disabled={cartNotifier}
                style={{
                  backgroundColor: `${cartNotifier ? "#ffd81473" : "#ffd814"}`,
                }}
              >
                <FontAwesomeIcon icon={faCartShopping} />
                Add to cart
              </button>
              <button
                className={styles.btn_buy_now}
                onClick={() => handleBuyNow()}
              >
                <FontAwesomeIcon icon={faStore} />
                Buy Now
              </button>
            </div>
          </div>
          <div className={styles.product_meta}>
            <div className={styles.name_box}>
              {heroProduct?.productName || "Name"}
            </div>
            <div className={styles.special_text}>
              <div className={styles.offer_info_header}>
                <p>Special price</p>
              </div>
            </div>
            <div className={styles.prices_info}>
              <div className={styles.final_price}>
                <p>{`₹${
                  parseFloat(
                    heroProduct?.prices -
                      heroProduct?.prices * heroProduct?.discount
                  ) || "000"
                }`}</p>
              </div>
              <div className={styles.offer_info}>
                <p className={styles.mrp_line}>{`₹${Number(
                  heroProduct?.prices || 0
                ).toFixed(2)}`}</p>
                <p className={styles.offer_line}>{`${Number(
                  heroProduct?.discount * 100
                ).toFixed(2)}% off`}</p>
              </div>
            </div>
            <div className={styles.store_info}>
              <button
                onClick={() =>
                  navigate(`/home?store_id=${heroProduct.storeId}`)
                }
              >
                Store : {heroProduct?.storeName || "Store Name"}
              </button>
            </div>
            <div className={styles.table_info}>
              <p>Highlights</p>
              <ProductHeroTable tableDto={heroProduct?.tableDto || {}} />
            </div>
            <div className={styles.description}>
              <p>Description</p>
              <span>{heroProduct?.description || "Description"}</span>
            </div>
            <div className={styles.keyword_wrap}>
              <p>Explore More</p>
              <KeywordsNavigationSet keywords={heroProduct?.keywords || null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProduct;
