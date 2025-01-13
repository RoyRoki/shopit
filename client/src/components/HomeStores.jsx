import React, { useEffect, useState } from 'react'
import { publicRequest } from '../helper/AxiosHelper';
import { urls } from '../util/URLS';
import StoreShowCase from './store/StoreShowCase';
import { useNavigate } from 'react-router-dom';

const HomeStores = () => {

      const navigate = useNavigate();
      const [stores, setStores] = useState([]);

      useEffect(() => {
            const fetchStore = async () => {
                  try {
                        const response = await publicRequest("GET", urls.fetchHomeStore, {});
                        setStores(response.data);
                  } catch (error) {
                        console.log(error);
                  }
            }
            fetchStore();
      }, []);

  return (
    <div>
      {stores?.map((store) => (
            <button key={store.id} onClick={() => navigate(`/store?id=${store.id}`)} >
                  <StoreShowCase storeDto={store} />
            </button>
      ))}
    </div>
  )
}

export default HomeStores
