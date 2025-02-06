import React, { useCallback, useEffect, useState } from 'react'
import { request } from '../../../helper/AxiosHelper';
import { urls } from '../../../util/URLS';
import styles from './AdminOrdersPage.module.css'
import { adminOrdersState } from '../../../util/HERODIV';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faShip } from '@fortawesome/free-solid-svg-icons';
import StoreOrderCard from '../../../components/admin/cards/orderCard/StoreOrderCard';
import { orderStatus } from '../../../util/OrderStatus';

const AdminOrdersPage = () => {
      const [orders, setOrders] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [pageState, setPageState] = useState(adminOrdersState.new)

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

      const getOrders = (pageState) => {
            if(pageState === adminOrdersState.all) {
                  return orders;
            }
            else if(pageState === adminOrdersState.new) {
                  return orders.filter(order => order?.orderInfo?.orderStatus === orderStatus.confirm);
            }
            else if(pageState === adminOrdersState.shipped) {
                  return orders.filter(order => order?.orderInfo?.orderStatus === orderStatus.shipped);
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
          className={`${styles.action_btn} ${pageState === adminOrdersState.new && styles.action_btn_active}`}
          onClick={() => {setPageState(adminOrdersState.new)}}
        >
          <FontAwesomeIcon icon={faBoxes}/>
          New Orders
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
            <div className={styles.pend_wrap}>
                  {getOrders(pageState)?.map((order, index) => (
                        <StoreOrderCard  key={index} order={order} onShipped={handleShipped}/>
                  ))}
            </div>
      </div>
    </div>
  )
}

export default AdminOrdersPage
