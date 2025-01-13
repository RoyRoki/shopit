import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { request } from "../../helper/AxiosHelper";
import { urls } from "../../util/URLS";

export const fetchUserDetails = createAsyncThunk(
      'user/fetchUserDetails',
      async (_, thunkAPI) => {
            try {
                  const response = await request("GET", urls.fetchUserDetails, {});
                  return response.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response.data);
            }
      }
);

const userDetailsSlice = createSlice({
      name: 'userDetails',
      initialState: {
            userDto: {},
            loading: false,
            error: null,
      },
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(fetchUserDetails.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchUserDetails.fulfilled, (state, action) => {
                        state.loading = false;
                        state.userDto = action.payload;
                        state.error = null;
                  })
                  .addCase(fetchUserDetails.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload || 'Failed to fetch user dto ';
                  })
      }
});

export default userDetailsSlice.reducer;