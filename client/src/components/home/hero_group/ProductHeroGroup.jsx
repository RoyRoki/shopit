import React from 'react'
import styles from './ProductHeroGroup.module.css'
import { useNavigate } from 'react-router-dom'

const ProductHeroGroup = () => {
      const navigate = useNavigate();

  return (
    <div className={styles.main_box}>
      <div className={styles.sub_hero_box}>
            <div className={styles.sub_hero_header}>
                  <h2>Top Favorites Loved by Customers</h2>
            </div>
            <div className={styles.sub_hero_wrap}>

                  <div key={1} className={styles.sub_hero} onClick={() => navigate("/home?key=bottle")}>
                        <div className={styles.sub_hero_img_box}
                                    style={{backgroundImage: 'url("https://shopitbuket.s3.ap-south-1.amazonaws.com/public/demo/heroProducts/bottle1.png" )'}}>
                        </div>
                        <div className={styles.sub_hero_info_box}>
                              <div className={styles.info_name}>
                                    <span>Water Bottles</span>
                              </div>
                              <div className={styles.info_offer}>
                                    <span>25% Off</span>
                              </div>
                        </div>
                  </div>

                  <div key={2} className={styles.sub_hero} onClick={() => navigate("/home?key=table+lamp")}>
                        <div className={styles.sub_hero_img_box}
                                    style={{backgroundImage: 'url("https://shopitbuket.s3.ap-south-1.amazonaws.com/public/demo/heroProducts/lamp1.png" )'}}>
                        </div>
                        <div className={styles.sub_hero_info_box}>
                              <div className={styles.info_name}>
                                   <span>Table Lamp</span>
                              </div>
                              <div className={styles.info_offer}>
                                    <span>30% Off</span>
                              </div>
                        </div>
                  </div>

                  <div key={3} className={styles.sub_hero} onClick={() => navigate("/home?key=moisturizer")}>
                        <div className={styles.sub_hero_img_box}
                              style={{backgroundImage: 'url("https://shopitbuket.s3.ap-south-1.amazonaws.com/public/demo/heroProducts/cream1.png")'}}>
                        </div>
                        <div className={styles.sub_hero_info_box}>
                              <div className={styles.info_name}>
                                    <span>Moisturizer</span>
                              </div>
                              <div className={styles.info_offer}>
                                    <span>15% Off</span>
                              </div>
                        </div>
                  </div>

                  <div key={4} className={styles.sub_hero} onClick={() => navigate("/home?key=diy")}>
                        <div className={styles.sub_hero_img_box} 
                              style={{backgroundImage: 'url("https://shopitbuket.s3.ap-south-1.amazonaws.com/public/demo/heroProducts/scikit.png")'}}>
                        </div>
                        <div className={styles.sub_hero_info_box}>
                              <div className={styles.info_name}>
                                    <span>DIY Science Kit</span>
                              </div>
                              <div className={styles.info_offer}>
                                    <span>Flat 50% Off</span>
                              </div>
                        </div>
                  </div>
            </div>
      </div>
      <div className={styles.main_hero_box} onClick={() => navigate("/home?key=headphone")}>
            <div className={styles.hero_img_box}
                  style={{backgroundImage: 'url("https://shopitbuket.s3.ap-south-1.amazonaws.com/public/demo/heroProducts/jbl1.png")'}}>
            </div>
            <div className={styles.hero_header}>
                  <span>Your Music, Your Way – JBL Headsets</span>
            </div>
      </div>
    </div>
  )
}

export default ProductHeroGroup
