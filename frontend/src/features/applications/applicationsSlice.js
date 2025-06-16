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

const applicationsSlice = createSlice({  name: 'applications',
  initialState: {
    applications: [],
    totalApplications: 0,
    statusCounts: {},
    statusCountsArray: [],
    isLoading: false,
    isError: false,
    message: ''
  },reducers: {
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchApplications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = '';
        state.applications = action.payload.applications;
        state.totalApplications = action.payload.totalApplications;
        state.statusCounts = action.payload.statusCounts;
        state.statusCountsArray = action.payload.statusCountsArray;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.applications = [];
      })
      // Handle updateApplicationStatus
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isError = false;
        state.message = '';
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { applicationId, newStatus } = action.payload;
        state.isError = false;
        state.message = '';
        state.applications = state.applications.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { clearError } = applicationsSlice.actions;

export default applicationsSlice.reducer;

// Selectors
export const selectApplications = (state) => state.applications.applications;
export const selectApplicationsLoading = (state) => state.applications.isLoading;
export const selectApplicationsError = (state) => state.applications.isError;
export const selectApplicationsMessage = (state) => state.applications.message;
export const selectTotalApplications = (state) => state.applications.totalApplications;
export const selectStatusCounts = (state) => state.applications.statusCounts;
export const selectStatusCountsArray = (state) => state.applications.statusCountsArray;
