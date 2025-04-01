import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../../helper/AxiosHelper";
import { urls } from "../../util/URLS";

export const fetchUserCart = createAsyncThunk(
      'user/fetchUserCart',
      async (_, thunkAPI) => {
            try {
                  const response = await request("GET", urls.fetchCart);
                  return response.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response.data);
            }
      }
);

const userCartSlice = createSlice({
      name: 'userCart',
      initialState: {
            cart: { id: null, cartItems: [], totalCartPrice: 0 },
            loading: false,
            error: null,
      },
      reducers: {
            setCart(state, action) {
                  state.cart = action.payload;
            },
      },
      extraReducers: (builder) => {
            builder
                  .addCase(fetchUserCart.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchUserCart.fulfilled, (state, action) => {
                        state.loading = false;
                        state.cart = action.payload;
                        state.error = null;
                  })
                  .addCase(fetchUserCart.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload || 'Failed to load usr cart';
                  })
      }
});

export const { setCart } = userCartSlice.actions;
export default userCartSlice.reducer;