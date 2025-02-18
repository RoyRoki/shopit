import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context";
import Navber from "../../components/home/navber/Navber";

import styles from "./GuestHome.module.css";
import DefaultContainer from "../../components/home/DefaultContainer/DefaultContainer";
import ProductsByKeyword from "../../components/home/productsByKeyword/ProductsByKeyword";
import HeroProduct from "../../components/home/heroProduct/HeroProduct";
import ProductsByQuery from "../../components/home/productByQuery/ProductsByQuery";
import ProductsByCategory from "../../components/home/productsByCategory/ProductsByCategory";
import StorePublicPage from "../../components/store/publicPage/StorePublicPage";

export const GuestHome = () => {
  const { auth } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  // Get the specific container
  const [key, setKey] = useState(searchParams.get("key"));
  const [query, setQuery] = useState(searchParams.get("query"));
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id"));
  const [productId, setProductId] = useState(searchParams.get("product_id"));
  const [storeId, setStoreId] = useState(searchParams.get("store_id"));

  useEffect(() => {
    // Whenever searchParams changes, update the state
    setKey(searchParams.get("key"));
    setQuery(searchParams.get("query"));
    setCategoryId(searchParams.get("category_id"));
    setProductId(searchParams.get("product_id"));
    setStoreId(searchParams.get("store_id"));
  }, [searchParams]);


  return (
    <div className={styles.main}>
      <Navber className={styles.nav} isLogged={false} />
      <div className={styles.main_container}>
        {/* Products show by keyword */}
        {key && <ProductsByKeyword keyword={key} />}

        {/* Products show by Search query */}
        {query && (
          <ProductsByQuery query={query} />
          // @Todo search store also
        )}

        {/* Products show by Category */}
        {categoryId && <ProductsByCategory category_id={categoryId} />}

        {/* Products show by Id */}
        {productId && (
          <>
            <HeroProduct product_id={productId} />
            {/* <DefaultContainer withBanner={false} /> */}
          </>
        )}

        {/* Products show by Store id */}
        {storeId && <StorePublicPage storeId={storeId} />}

        {/*Default container*/}
        {!key && !query && !categoryId && !productId && !storeId && (
          <DefaultContainer withBanner={true} />
        )}
      </div>
    </div>
  );
};
