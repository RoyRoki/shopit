import React, { useEffect, useState } from 'react'
import styles from './HomeDashBoard.module.css'
import AdminSideMenu from '../../../components/admin/sideMenu/AdminSideMenu'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchAdminStore } from '../../../features/admin/adminStoreSlice'
import { adminHeroDiv, adminProductPageState } from '../../../util/HERODIV'
import NewStorePage from '../newStorePage/NewStorePage'
import StoreHome from '../storeHome/StoreHome'
import ProductPage from '../productPage/ProductPage'
import AdminStoreCard from '../../../components/admin/cards/storeCard/AdminStoreCard'
import AdminOrdersPage from '../ordersPage/AdminOrdersPage'

const HomeDashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [heroDiv, setHeroDiv] = useState(adminHeroDiv.home);

  const { 
      storeDto, 
      storeExists, 
      loading, 
      error 
  } = useSelector((state) => state.adminStore);

  useEffect(() => {
    const fetchStore = async () => {
      dispatch(fetchAdminStore());
    }
    fetchStore();
  }, [dispatch, heroDiv]);

  const handleStoreCreation = async () => {
    dispatch(fetchAdminStore());
  }

  const handleStoreUpdate = async () => {
    dispatch(fetchAdminStore());
  }

  return (
    <div className={styles.main}>
      <div className={styles.side_bar_wrap}>
            <AdminSideMenu curr={heroDiv} setHeroDiv={setHeroDiv} notify={true} />
      </div>
      <div className={styles.hero_section}>
        {heroDiv === adminHeroDiv.home && (
          !storeExists ? (
            <NewStorePage onNewStoreCreated={handleStoreCreation}/>
          ) : (
            <StoreHome store={storeDto} setHeroDiv={setHeroDiv} />
          )
        )}
        {heroDiv === adminHeroDiv.addProduct && (
          <ProductPage store={storeDto} state={adminProductPageState.addNewProduct}/>
        )}
        {heroDiv === adminHeroDiv.allProduct && (
          <ProductPage store={storeDto} state={adminProductPageState.allProducts}/>
        )}

        {heroDiv === adminHeroDiv.store && (
          <AdminStoreCard  store={storeDto} onUpdate={handleStoreUpdate}/>
        )}

        {heroDiv === adminHeroDiv.orders && (
          <AdminOrdersPage />
        )}
      </div>
    </div>
  )
}

export default HomeDashBoard
