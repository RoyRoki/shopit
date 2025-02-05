import React, { useCallback, useEffect, useState } from 'react'
import { request } from '../../../helper/AxiosHelper';
import { urls } from '../../../util/URLS';
import styles from './AdminOrdersPage.module.css'
import { adminOrdersState } from '../../../util/HERODIV';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faShip } from '@fortawesome/free-solid-svg-icons';
import StoreOrderCard from '../../../components/admin/cards/orderCard/StoreOrderCard';

const AdminOrdersPage = () => {
      const [orders, setOrders] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [pageState, setPageState] = useState(adminOrdersState.pending)

      const fetchOrders = useCallback(async () => {
            try {
                  const response = await request("GET", urls.getAdminOrders);
                  setOrders(response.data);
            } catch (err) {
                  setLoading(false);
                  setError("error during fetch orders...");
            } finally {
                  setLoading(false);
            }
      }, [])

      const handleShipped = async (orderId) => {
            try {
                  const response = await request("PUT", `${urls.shippedOrderById}${orderId}`);
                  fetchOrders();
            } catch (error) {
                  setError(error);
                  console.log(error);
            }
      }

      useEffect(() => {
            fetchOrders();
      }, [fetchOrders]);

      if (loading) return <p>Loading orders...</p>;
      if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.main_page}>
      <div className={styles.action_wrap}>
        <div 
          className={`${styles.action_btn} ${pageState === adminOrdersState.pending && styles.action_btn_active}`}
          onClick={() => {setPageState(adminOrdersState.pending)}}
        >
          <FontAwesomeIcon icon={faBoxes}/>
          Pending Orders
        </div>
        <div 
          className={`${styles.action_btn} ${pageState === adminOrdersState.shipped && styles.action_btn_active}`}
          onClick={() => {setPageState(adminOrdersState.shipped)}}
        >
          <FontAwesomeIcon icon={faShip}/>
          Shipped Orders
        </div>
        <div 
          className={`${styles.action_btn} ${pageState === adminOrdersState.all && styles.action_btn_active}`}
          onClick={() => {setPageState(adminOrdersState.all)}}
        >
          <FontAwesomeIcon icon={faBoxes}/>
          All
        </div>
      </div>
      <div className={styles.hero_section}>
            {pageState === adminOrdersState.pending && (
                  <div className={styles.pend_wrap}>
                        {orders.map((order, index) => (
                              <StoreOrderCard  key={index} order={order} onShipped={handleShipped}/>
                        ))}
                  </div>
            )}

            {pageState === adminOrdersState.shipped && (
                  <div className={styles.ship_wrap}>
                        s
                  </div>
            )}

            {pageState === adminOrdersState.all && (
                  <div className={styles.all_wrap}>
                        a
                  </div>
            )}
      </div>
    </div>
  )
}

export default AdminOrdersPage
