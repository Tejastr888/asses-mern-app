import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async (userRole, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        userRole === "employer"
          ? "/api/applications/received"
          : "/api/applications/me"
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications");
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, newStatus }, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/api/applications/${applicationId}`, {
        status: newStatus,
      });
      return { applicationId, newStatus };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update application status");
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchApplications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle updateApplicationStatus
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { applicationId, newStatus } = action.payload;
        state.applications = state.applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = applicationsSlice.actions;

export default applicationsSlice.reducer;

// Selectors
export const selectApplications = (state) => state.applications.applications;
export const selectApplicationsLoading = (state) => state.applications.loading;
export const selectApplicationsError = (state) => state.applications.error;
