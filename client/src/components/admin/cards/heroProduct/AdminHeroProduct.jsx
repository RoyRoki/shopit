import React, { useState } from 'react'
import styles from './AdminHeroProduct.module.css'
import AdminProductCard from '../productCard/AdminProductCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { request } from '../../../../helper/AxiosHelper'
import { urls } from '../../../../util/URLS'

const AdminHeroProduct = ({ product, onDelete }) => {

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await request("DELETE", `${urls.deleteProductById}${product.id}`);
      if(response.status === 200) {
        onDelete();
      }
      setDeleting(false);
    } catch (error) {
      console.error(error);
      setDeleting(false);
    }
  }
  return (
    <div className={styles.main_wrap}>
      <div className={`${styles.product_box} ${!deleting ? '' : styles.deleting}`}>
        <AdminProductCard product={product} />
      </div>
      <div className={styles.action_wrap}>
        <div className={styles.delete_btn}>
          <button onClick={() => handleDelete()}>
            <FontAwesomeIcon icon={faTrash} />
            <span>{deleting ? 'Deleting In Progress' : 'Delete Product'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminHeroProduct
