import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { request } from "../../helper/AxiosHelper";
import { urls } from "../../util/URLS";

export const fetchAdminStore = createAsyncThunk(
      'admin/fetchAdminStore',
      async(_, { thunkAPI } ) => {
            try {
                  const response = await request("GET", urls.fetchAdminStore, {});
                  return response.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response);
            }
      }
);

const AdminStoreSlice = createSlice({
      name: "adminStore",
      initialState: {
            storeDto: {},
            storeExists: false,
            loading: false,
            error: null,
      },
      reducers: {
            setStoreExists: (state, action) => {
                  state.storeExists = action.payload;
            },
            resetStore: (state) => {
                  state.storeDto = {};
                  state.storeExists = false;
                  state.loading = false;
                  state.error = null;
            },
      },
      extraReducers: (builder) => {
            builder
                  .addCase(fetchAdminStore.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchAdminStore.fulfilled, (state, action) => {
                        state.loading = false;
                        state.storeDto = action.payload;
                        state.storeExists = true;
                  })
                  .addCase(fetchAdminStore.rejected, (state, action) => {
                        state.loading = false;
                        state.storeExists = false;
                        state.error = action.payload || 'Error during fetch adminStore';
                  });
      }
});

export const { setStoreExists, resetStore } = AdminStoreSlice.actions;
export default AdminStoreSlice.reducer;