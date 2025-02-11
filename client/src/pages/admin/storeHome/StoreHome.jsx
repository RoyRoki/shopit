import React from "react";
import styles from "./StoreHome.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { adminHeroDiv } from "../../../util/HERODIV";

const StoreHome = ({ store, setHeroDiv }) => {
  return (
    <div className={styles.main_page}>
      <div className={styles.section1}>
        <div className={styles.store_info} onClick={() => setHeroDiv(adminHeroDiv.store)}>
          <div className={styles.store_profile}>
            <div className={styles.profile_banner_wrap}>
              <div
                className={styles.banner_frame}
                style={{
                  backgroundImage: `url(${
                    store.bannerUrl || "https://shopitbuket.s3.ap-south-1.amazonaws.com/public/banner/bd3.png"
                  })`,
                }}
              ></div>
            </div>
            <div className={styles.profile_info_box}>
              <div className={styles.logo_wrap}>
                <div
                  className={styles.logo_frame}
                  style={{
                    backgroundImage: `url(${store.logoUrl || "https://shopitbuket.s3.ap-south-1.amazonaws.com/public/logo/lg1.png"})`,
                  }}
                ></div>
              </div>
              <div className={styles.info_wrap}>
                <div className={styles.name}>
                  {`${store.name || "STORE NAME"}`}
                </div>
                <div className={styles.header}>
                  {`${store.header || "Add Header Now!"}`}
                </div>
              </div>
              <div className={styles.edit_wrap}>
                  <FontAwesomeIcon icon={faPen}/>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.resent_orders}>
          <div 
            className={styles.add_product_wrap}
            onClick={() => setHeroDiv(adminHeroDiv.addProduct)}
          >
            <div 
              className={styles.add_product_frame}
              style={{backgroundImage: 'url(https://shopitbuket.s3.ap-south-1.amazonaws.com/public/logo/add_product.png)'}}
            >
            </div>

            <div 
              className={styles.add_product_text_wrap} 
            >
              <span>Add New Product</span>
            </div>

          </div>
        </div>
      </div>
      <div className={styles.section2}>
        <div className={styles.statistic_wrap}>
          Store Analysis Under Development
        </div>
      </div>
    </div>
  );
};

export default StoreHome;
