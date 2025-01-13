import React, { useEffect, useState } from 'react'
import { request } from '../../helper/AxiosHelper';
import { urls } from '../../util/URLS';

const StoreOrders = () => {
      const [orders, setOrders] = useState(null);
      const [error, setError] = useState(null);

      useEffect(() => {
            const handleMount = async () => {
                  try {
                     const response = await request("GET", urls.fetchStoreOrders, {});
                     console.log("Fetching store orders: ", response);
                     if(response.status === 200) {
                        setOrders(response.data);
                        setError(null);
                     } else {
                        setError(response.data);
                     }
                  } catch (error) {
                        setError(JSON.stringify(error));
                  }
            }
            return () => handleMount();
      }, []);

  return (
    <div>
      <h1>Store Orders: </h1>
      <hr />
      {error && (
            <p>{error}</p>
      )}

      {orders === null ? (
            <div>
                   <p>{JSON.stringify(orders)}</p>
            </div>
      ) : (
            <p>No order</p>
      )}
     
    </div>
  )
}

export default StoreOrders