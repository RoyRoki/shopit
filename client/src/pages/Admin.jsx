import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStore, setStoreExists, resetStore } from '../features/admin/adminStoreSlice';
import { fetchStoreProducts } from '../features/admin/storeProductsSlice';
import LogoutComponent from '../components/LogoutComponent';
import CreateStore from '../components/admin/CreateStore';
import MyStoreInfo from '../components/admin/MyStoreInfo';
import UpdateStore from '../components/admin/UpdateStore';
import ToggleButton from '../components/ToggleButton';
import AddProduct from '../components/admin/AddProduct';
import StoreProducts from '../components/admin/StoreProducts';
import { adminHeroDiv } from '../util/HERODIV';
import UpdateProduct from '../components/admin/UpdateProduct';
import StoreOrders from '../components/admin/StoreOrders';
import RecentProducts from '../components/admin/RecentProducts';

export const AdminHome = () => {
      const { auth, updateProfileMode } = useContext(AuthContext);
      const dispatch = useDispatch();
      const {storeDto, storeExists, loading, error} = useSelector((state) => state.adminStore);
      const [heroDiv, setHeroDiv] = useState(adminHeroDiv.home); // 0-none 1-addProduct 2-updateStore 3-allProduct 4-updateProduct
      const [productForEdit, setProductForEdit] = useState(null); // Product to be edit

      useEffect(() => {
            const fetchStore = async () => {
                  await updateProfileMode();
                  dispatch(fetchAdminStore());
            } 
            return () => fetchStore();
      }, [dispatch]);

      const onCompleteStoreCreation = () => {
            const loadStore = async () => {
                  dispatch(fetchAdminStore());
                  setHeroDiv(adminHeroDiv.home);
            }
            loadStore();
      }
      const onCompleteStoreUpdate = () => {
            const handleReset = async () => {
                  resetStore();
                  dispatch(fetchAdminStore());
                  setHeroDiv(adminHeroDiv.home);
            }
            handleReset();
      }
      const onCompleteAddProduct = () => {
            const handleReset = async () => {
                  dispatch(fetchStoreProducts());
                  setHeroDiv(adminHeroDiv.home);
            }
            handleReset();
      }
      const onCompleteProductUpdate = () => {
            const handleReset = async () => {
                  setProductForEdit(null);
                  dispatch(fetchStoreProducts());
                  setHeroDiv(adminHeroDiv.home);
            }
            handleReset();
      }
      const showAllProduct = (toggle) => {
            if(toggle === false) {
                  setHeroDiv(adminHeroDiv.home);
            }
            if(toggle === true) {
                  setHeroDiv(adminHeroDiv.allProduct);
            }           
      }
      const showStoreUpdateForm = (toggle) => {
            if(toggle === false) {
                  setHeroDiv(adminHeroDiv.home);
            }
            if(toggle === true) {
                  setHeroDiv(adminHeroDiv.storeUpdate);
            }           
      }
      const showAddProductForm = (toggle) => {
            if(toggle === false) {
                  setHeroDiv(adminHeroDiv.home);
            }
            if(toggle === true) {
                  setHeroDiv(adminHeroDiv.addProduct);
            }           
      }
      const showEditProduct = (productDto) => {
            console.info(productDto);
            setHeroDiv(adminHeroDiv.updateProduct);
            setProductForEdit(productDto);
      }

      if(storeExists) {
            if(loading) return <p>Loading .......</p>
            if(error) return <p>Error: {error}</p>
      }

      return (
            <> 
                  <h1>{auth.profileMode} home </h1>
                  {!storeExists &&
                        <CreateStore onComplete={onCompleteStoreCreation} />}
   
                  {storeExists && (
                        <div> 
                              <MyStoreInfo storeDto={storeDto || {}} />

                              <div className='grid grid-flow-col gap-6'>
                                    <ToggleButton 
                                          toggle={heroDiv === adminHeroDiv.home}
                                          setToggle={(toggle) => setHeroDiv(adminHeroDiv.home)}
                                          forTrueText={'🛖_Home'}
                                          forFalseText={'🛖 Home'}
                                    />
                                    <ToggleButton 
                                          toggle={heroDiv === adminHeroDiv.storeUpdate}
                                          setToggle={showStoreUpdateForm}
                                          forTrueText={'✖️ cancel'}
                                          forFalseText={'🪄 Edit Store'}
                                    />
                                    <ToggleButton 
                                          toggle={heroDiv === adminHeroDiv.addProduct}
                                          setToggle={showAddProductForm}
                                          forTrueText={'✖️ cancel'}
                                          forFalseText={'🪄 Add New Product'}
                                    />
                                    <ToggleButton 
                                          toggle={heroDiv === adminHeroDiv.allProduct}
                                          setToggle={showAllProduct}
                                          forTrueText={'✖️ cancel'}
                                          forFalseText={'🪄 show all Products'}
                                    />
                              </div>
                              {heroDiv === adminHeroDiv.home &&
                                    <div>
                                          <StoreOrders />
                                          <hr className='h-2 bg-black mt-5 mb-5' />
                                          <RecentProducts onEditProduct={showEditProduct}/>
                                    </div>}
                              {heroDiv === adminHeroDiv.storeUpdate &&
                                    <UpdateStore storeData={storeDto} onComplete={onCompleteStoreUpdate} />}

                              {heroDiv === adminHeroDiv.addProduct &&
                                    <AddProduct onComplete={onCompleteAddProduct} />}
                              
                              {heroDiv === adminHeroDiv.allProduct && 
                                    
                                    <div>
                                          <h2>Products In Your Store: </h2>
                                          <StoreProducts onEditProduct={showEditProduct} />
                                    </div>
                              }
                              {heroDiv === adminHeroDiv.updateProduct &&
                                    <UpdateProduct onComplete={onCompleteProductUpdate} product={productForEdit}/> }
                              
                        </div>
                        
                  )}
                  
                  <LogoutComponent />
            </>
      );
};

