import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { publicRequest } from "../../helper/AxiosHelper";
import { urls } from "../../util/URLS";
import { data } from "react-router-dom";

export const fetchProducts = createAsyncThunk(
      'home/fetchProducts', 
      // ../products/{ids}?ids={1}
      async ({ type, query, info}, { rejectWithValue, getState }) => {
            const cacheKey = `${type}:${query}`;
            const state = getState().homeProducts;

            if(state.currentCacheKeys.includes(cacheKey)) {
                  // Already cached, return the cached data
                  return { cacheKey, data: state.productIdsGroupsCache[cacheKey].map((id) => state.productsMap[id]), info: state.infos[cacheKey] };
            }
            
            try {
                  const response = await publicRequest(
                        "GET", 
                        `${urls.fetchHomeProductsBy_}/${type}?${type}=${query}`,
                        {}
                  );
                  return { cacheKey, data: response.data, info };

            } catch (error) {
                  console.error(error);
                  return rejectWithValue(error.response.data || "Failed to fetch products.");
            }
      }
);

const initialState = {
            productsMap: {},  // key: product.id value: product
            productIdsGroupsCache: {},
            currentCacheKeys: [], // Tracks active cache keys
            infos: {}, // Store the info about the group of products
            loading: false,
            error: null,
      };


const ProductsSlice = createSlice({
      name: "products",
      initialState: initialState,
      reducers: {
            setCurrentCacheKey(state, action) {
                  // Add the new cacheKey if not already present
                  if(!state.currentCacheKeys.includes(action.payload)) {
                        state.currentCacheKeys.push(action.payload);
                  }   
            },
            removeCurrentCacheKey(state, action) {
                  if(state.currentCacheKeys.includes(action.payload)) {
                        state.currentCacheKeys.pop(action.payload);
                  }
            },
      },
      extraReducers: (builder) => {
            builder
                  .addCase(fetchProducts.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchProducts.fulfilled, (state, action) => {
                        const { cacheKey, data, info } = action.payload;

                        if(!state.currentCacheKeys.includes(cacheKey)) {
                              // Add the new cacheKey if not already present
                              state.currentCacheKeys.push(cacheKey);
                        }

                        data.forEach((product) => {
                              state.productsMap[product.productId] = product;
                        })
                        state.productIdsGroupsCache[cacheKey] = data.map((product) => product.productId);

                        state.infos[cacheKey] = info;
                        state.loading = false;
                  })
                  .addCase(fetchProducts.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.error.message || "Something went wrong.";
                  });
      },
});

export const { setCurrentCacheKey, removeCurrentCacheKey } = ProductsSlice.actions;
export default ProductsSlice.reducer;