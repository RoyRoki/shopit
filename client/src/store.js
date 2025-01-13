import { configureStore } from "@reduxjs/toolkit";
import categoriesReducer from './features/categories/categoriesSlice'
import adminStoreReducer from './features/admin/adminStoreSlice'
import storeProductsReducer from './features/admin/storeProductsSlice'
import homeProductsReducer from './features/home/productSlice'
import userDetailsReducer from './features/user/UserDetailsSlice'
import userCartReducer from './features/user/UserCart'

const store = configureStore({
      reducer: {
            categories: categoriesReducer,
            adminStore: adminStoreReducer,
            storeProducts: storeProductsReducer,
            homeProducts: homeProductsReducer,
            userDetails: userDetailsReducer,
            userCart: userCartReducer,
            // add more reducer
      },
});

export default store;