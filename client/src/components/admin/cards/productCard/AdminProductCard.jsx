import React from 'react'
import styles from './AdminProductCard.module.css'
import ProductHeroTable from '../../../table/productTable/ProductHeroTable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faPhotoFilm } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const AdminProductCard = ({ product, onEdit, onMediaEdit, showHero }) => {
      const navigate = useNavigate();
      const toDate = (iso) => {
      return new Date(iso).toLocaleString("en-US", { 
            year: "numeric", 
            month: "long", 
            day: "numeric", 
            hour: "2-digit", 
            minute: "2-digit",
            hour12: true 
            });
      };
  return (
    <div className={styles.main_wrap}>
      <div className={styles.section1}>
            <div className={styles.basic_info} onClick={() => showHero(product)}>
                  <div className={styles.name}>
                   <span>{product.name || '~name~'}</span>
                  </div>
                  <div className={styles.description}>
                   <span>{product.description || '---'}</span>
                  </div>
                  <div className={styles.num_info}>
                        <p><span>prices : </span>₹{product.prices || '-001'}</p>
                        <p><span>discount : </span>{product.discount * 100 || '0.0'}%</p>
                        <p><span>Price With Discount : </span>₹{(product.prices * (1 - product.discount)).toFixed(2)}</p>
                        <p><span>stock : </span> {product.stock || '000'}</p>
                  </div>
            </div>
            <div className={styles.table_info}>
                  {
                        product.tableDto !== null ? (
                              <ProductHeroTable tableDto={product.tableDto || {headers: []}}/>
                        ) : (
                              <div className={styles.demo_table}>
                                    Add Table Now!
                              </div>
                        )
                  }
            </div>
                  <div className={styles.order_info}>
                        <p><span>length : </span>{product.length} cm</p>
                        <p><span>width : </span>{product.width} cm</p>
                        <p><span>height : </span>{product.height} cm</p>
                        <p><span>weight : </span>{product.weight} g</p>
                        <p><span>material : </span>{product.material}</p>
                  </div>
                  <div className={`${styles.active_wrap} ${product.isActive ? styles.active : styles.inactive }`}>
                        {product.isActive ? (
                              <span >Status : Active</span>
                        ) : (
                              <span >Status : Inactive</span>
                        )}
                  </div>
                  <div className={styles.time_info}>
                        <p><span>Product Id : </span>{product.id}</p>
                        <p><span>Updated At : </span>{toDate(product.updatedAt)}</p>
                        <p><span>Created At : </span>{toDate(product.createdAt)}</p>
                  </div>
      </div>
      <div className={styles.section2}>
            <div className={styles.category_info}>
               <h3>Categories</h3>
               <div className={styles.category_wrap}>
                  {
                    product.categories?.map((category, index) => (
                        <div className={styles.category} key={index}>
                              <span>{category.name}</span>
                        </div>
                    ))
                  }
               </div>
            </div>
            <div className={styles.keyword_info}>
                  <h3>Keywords</h3>
                  <div className={styles.keyword_wrap}>
                        {
                              product.keywords?.map((keyword, index) => (
                                <div className={styles.keyword} key={index}>
                                    <span>#{keyword.word}</span>
                                </div>
                              ))
                        }
                  </div>
            </div>
            <div className={styles.media_wrap}>
                  <div className={styles.image_info}>
                        <div className={styles.images_wrap}>
                              {product.imageUrls === null ? (
                              <>
                                    <div className={styles.no_image_wrap}>
                                          <div className={styles.no_image}>
                                                Add Image now!!
                                          </div>
                                    </div>
                              </>
                              ) : (
                                    
                                    product.imageUrls.map((url, index) => (
                                          <div className={styles.image_frame_wrap} key={index}>
                                                <div
                                                      className={styles.image_frame}
                                                      style={{backgroundImage: `url(${url})`}}
                                                ></div>
                                          </div>
                                    ))
                              )}
                        </div>
                  </div>
                  <div className={styles.video_info}>
                  </div>
                  <div className={styles.media_edit_wrap}>
                        <button onClick={() => onMediaEdit(product)}>
                              <FontAwesomeIcon icon={faPhotoFilm} />
                              {` edit`}
                        </button>
                  </div>
            </div>
      </div>
      <div className={styles.action_section}>
            <div className={styles.edit_btn_wrap} onClick={() => onEdit(product)}>
                  <FontAwesomeIcon icon={faEdit}/>
            </div>
      </div>
    </div>
  )
}

export default AdminProductCard
