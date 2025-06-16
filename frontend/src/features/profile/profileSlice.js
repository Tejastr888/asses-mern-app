import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (role, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        role === 'employer' ? '/api/employers/profile' : '/api/jobseekers/profile'
      );
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null; // Profile doesn't exist yet
      }
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const saveProfile = createAsyncThunk(
  'profile/saveProfile',
  async ({ values, isNewProfile, role }, { rejectWithValue }) => {
    try {
      const baseEndpoint = role === 'employer' ? '/api/employers' : '/api/jobseekers';
      const response = isNewProfile
        ? await axiosInstance.post(baseEndpoint, values)
        : await axiosInstance.put(`${baseEndpoint}/profile`, values);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to save profile');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
    saveError: null,
    saveSuccess: false,
    savePending: false
  },  reducers: {
    resetSaveStatus: (state) => {
      state.saveStatus = 'idle';
      state.saveError = null;
      state.error = null;
    },
    clearSaveSuccess: (state) => {
      state.saveSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Save profile
      .addCase(saveProfile.pending, (state) => {
        state.savePending = true;
        state.saveError = null;
        state.saveSuccess = false;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.savePending = false;
        state.saveSuccess = true;
        state.data = action.payload;
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.savePending = false;
        state.saveError = action.payload;
      });
  }
});

export const { resetSaveStatus } = profileSlice.actions;
export default profileSlice.reducer;
