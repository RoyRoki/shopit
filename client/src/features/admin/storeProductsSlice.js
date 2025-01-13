import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../helper/AxiosHelper";
import { urls } from "../../util/URLS";

export const fetchStoreProducts = createAsyncThunk(
      'admin/fetchStoreProducts',
      async(_, { thunkAPI }) => {
            try {
                  console.log("Try to fetch store products!");
                  const response = await request("GET", urls.fetchStoreProducts, {} );
                  console.log("After fetching store products: ",response.data);
                  return response.data.reverse(); // Show the latest product first
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response.data);
            }
      }
);

const StoreProductsSlice = createSlice({
      name: "storeProducts",
      initialState: {
            products: {},
            loading: false,
            error: null,
      },
      reducers: {

      },
      extraReducers: (builder) => {
            builder
                  .addCase(fetchStoreProducts.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                        state.products = {};
                  })
                  .addCase(fetchStoreProducts.fulfilled, (state, action) => {
                        state.loading = false;
                        state.error = null;
                        state.products = action.payload;
                  })
                  .addCase(fetchStoreProducts.rejected, (state, action) => {
                        state.loading = false;
                        state.products = {};
                        state.error = action.payload;
                  });
      },
});

export default StoreProductsSlice.reducer;