import React, { useState } from 'react'
import styles from './AdminStoreCard.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { adminStorePage } from '../../../../util/HERODIV'
import StoreEditForm from '../../forms/storeEdit/StoreEditForm'
import { toDate } from '../../../../util/dateUtils'

const AdminStoreCard = ({ store, onUpdate }) => {
      const [pageState, setPageState] = useState(adminStorePage.home);

      const handleUpdate = () => {
            onUpdate();
            setPageState(adminStorePage.home);
      }

  return (
    <div className={styles.main_wrap}>

      {pageState === adminStorePage.home && (
        <div className={styles.store_info}>
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
            </div>
          </div>

          <div className={styles.store_description_box}>
            <h2>Description</h2>
            <p>{store.description}</p>
            <p><strong>Email:</strong> {store.email}</p>
            <p><strong>Mobile No:</strong> {store.mobileNo || "N/A"}</p>
            <p><strong>Shipping Type:</strong> {store.shippingType}</p>
          </div>

          <div className={styles.address_box}>
            <h3>Address</h3>
            <p>
              {store.houseNo}, {store.street}, {store.city}, {store.state} - {store.pinCode}
            </p>
            <p><strong>Landmark:</strong> {store.landmark}</p>
          </div>

          <div className={styles.category_box}>
            <h3>Categories</h3>
            <ul>
              {store.categories.map((category) => (
                <li key={category.id}>{category.name}</li>
              ))}
            </ul>
          </div>

          <div className={styles.time_info}>
                <p><span>Store Id: </span>{store.id}</p>
                <p><span>Created At: </span>{toDate(store.createdAt)}</p>
                <p><span>Updated At: </span>{toDate(store.updatedAt)}</p>
          </div>
          <div className={styles.edit_btn}>
                  <button onClick={() => setPageState(adminStorePage.edit)}>
                        <FontAwesomeIcon icon={faPen} />
                        <span>Edit Store</span>
                  </button>
          </div>
        </div>
      )}

      {pageState === adminStorePage.edit && (
         <div className={styles.edit_form_wrap}>
            <div className={styles.edit_header}>
                  <span>Edit Your Store</span>
            </div>
            <StoreEditForm store={store} onUpdate={handleUpdate} />
         </div>
      )}
    </div>
  )
}

export default AdminStoreCard
