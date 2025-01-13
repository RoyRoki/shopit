import React from 'react'
import BannerSlider from '../slider/BannerSlider'
import BestProductsByCategory from '../best_section/BestProductsByCategory'
import ProductHeroGroup from '../hero_group/ProductHeroGroup'
import ProductSubHeroGroup from '../sub_group/ProductSubHeroGroup'

import styles from './DefaultContainer.module.css'

const DefaultContainer = () => {
  return (
    <div className={styles.main_content}>
          <div className={styles.main_banner}>
          <BannerSlider />
          </div>
          <div className={styles.best_section}>
                <BestProductsByCategory category_id={1} header={"Best For Electronic"}/>
          </div>
          <div className={styles.best_section}>
                <BestProductsByCategory category_id={3} header={"Beauty, Food, Toys & more"}/>
          </div>
          <div className={styles.img_hero_group}>
                <ProductHeroGroup />
          </div>
          <div className={styles.img_sub_hero_groups}>
                <ProductSubHeroGroup key={1} />
                <ProductSubHeroGroup key={2} />
          </div>
    </div>  
  )
}

export default DefaultContainer
