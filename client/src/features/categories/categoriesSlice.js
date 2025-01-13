import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest } from '../../helper/AxiosHelper'
import { urls } from '../../util/URLS'

// Async thunk for fetching categories
export const fetchCategories = createAsyncThunk(
      'categories/fetchCategories',
      async (_, thunkAPI) => {
            try {
                  const response = await publicRequest("GET", urls.fetchCategories, {});
                  return response.data;
            } catch (error) {
                  return thunkAPI.rejectWithValue(error.response.data);
            }
      }
);

const categoriesSlice = createSlice({
      name: 'categories',
      initialState: {
            categories: [],
            loading: false,
            error: null,
      },
      reducers: {},
      extraReducers: (builder) => {
            builder
                  .addCase(fetchCategories.pending, (state) => {
                        state.loading = true;
                        state.error = null;
                  })
                  .addCase(fetchCategories.fulfilled, (state, action) => {
                        state.loading = false;
                        state.categories = action.payload;
                  })
                  .addCase(fetchCategories.rejected, (state, action) => {
                        state.loading = false;
                        state.error = action.payload || 'Failed to fetch categories!';
                  });
      }
});

export default categoriesSlice.reducer;
