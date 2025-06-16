import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunks
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (role, { rejectWithValue }) => {
    try {
      if (role === 'employer') {
        const [jobsRes, applicationsRes] = await Promise.all([
          axiosInstance.get('/api/jobs/my-jobs'),
          axiosInstance.get('/api/applications/received')
        ]);
        return {
          jobs: jobsRes.data,
          applications: applicationsRes.data
        };
      } else {
        const applications = await axiosInstance.get('/api/applications/my-applications');
        return {
          applications: applications.data
        };
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'dashboard/updateStatus',
  async ({ applicationId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/applications/${applicationId}`, {
        status: newStatus
      });
      return { applicationId, newStatus, application: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    jobs: [],
    applications: [],
    loading: false,
    error: null,
    updateStatus: 'idle'
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard data
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.jobs) {
          state.jobs = action.payload.jobs;
        }
        state.applications = action.payload.applications;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update application status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.updateStatus = 'loading';
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        state.applications = state.applications.map(app =>
          app._id === action.payload.applicationId
            ? { ...app, status: action.payload.newStatus }
            : app
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearError } = dashboardSlice.actions;

export default dashboardSlice.reducer;

// Selectors
export const selectDashboardData = (state) => ({
  jobs: state.dashboard.jobs,
  applications: state.dashboard.applications
});
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;
