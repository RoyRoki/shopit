import React from 'react'
import styles from './StoreShowCart.module.css'
import { useNavigate } from 'react-router-dom'

const StoreShowCart = ({ store }) => {
      const navigate = useNavigate();

  return (
    <div className={styles.main_wrap} onClick={() => navigate(`/home?store_id=${store.id}`) }>
                  <div className={styles.store_profile}>
                        <div className={styles.profile_banner_wrap}>
                              <div 
                                    className={styles.banner_frame}
                                    style={{
                                          backgroundImage: `url(${store.bannerUrl || 'banner/bd3.png'})`
                                    }}
                              ></div>
                        </div>
                        <div className={styles.profile_info_box}>
                              <div className={styles.logo_wrap}>
                                    <div
                                          className={styles.logo_frame}
                                          style={{
                                                backgroundImage: `url(${store.logoUrl || 'logo/lg1.png'})`
                                          }}
                                    ></div>
                              </div>
                              <div className={styles.info_wrap}>
                                    <div className={styles.name}>
                                          {`${store.name || "STORE NAME"}`}
                                    </div>
                                    <div className={styles.header}>
                                          {`${store.header || "BEST STORE HERE"}`}
                                    </div>
                              </div>
                        </div>
                  </div>
    </div>
  )
}

export default StoreShowCart
