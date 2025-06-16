import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axios';

// Async thunks
export const fetchApplications = createAsyncThunk(
  'applications/fetchApplications',
  async ({ type = 'jobseeker', jobId } = {}, { rejectWithValue }) => {
    try {
      let url = '/api/applications';
      
      // Determine the correct endpoint
      switch (type) {
        case 'jobseeker':
          url += '/me';
          break;
        case 'received':
          url += '/received';
          break;
        case 'job':
          url += `/job/${jobId}`;
          break;
        default:
          url += '/me';
      }
      
      const response = await axiosInstance.get(url);

      // Handle the response data
      let applications = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          applications = response.data;
        } else if (response.data.applications) {
          applications = response.data.applications;
        } else if (typeof response.data === 'object') {
          applications = [response.data];
        }
      }

      return applications;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch applications");
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId, newStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/api/applications/${applicationId}`, {
        status: newStatus,
      });
      return { applicationId, newStatus, application: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update application status");
    }
  }
);

export const withdrawApplication = createAsyncThunk(
  'applications/withdraw',
  async (applicationId, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/api/applications/${applicationId}/withdraw`);
      return applicationId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to withdraw application");
    }
  }
);

export const scheduleInterview = createAsyncThunk(
  'applications/scheduleInterview',
  async ({ applicationId, interviewDetails }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/applications/${applicationId}/interview`,
        interviewDetails
      );
      return { applicationId, interview: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to schedule interview");
    }
  }
);

const applicationsSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [],
    totalApplications: 0,
    statusCounts: {},
    statusCountsArray: [],
    isLoading: false,
    isError: false,
    message: ''
  },
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Applications
      .addCase(fetchApplications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = '';
        
        // Ensure we have an array of applications
        const applications = action.payload || [];
        state.applications = applications;
        
        // Calculate status counts only if we have applications
        if (applications.length > 0) {
          state.statusCounts = applications.reduce((acc, app) => {
            if (app && app.status) {
              acc[app.status] = (acc[app.status] || 0) + 1;
            }
            return acc;
          }, {});
          
          state.statusCountsArray = Object.entries(state.statusCounts).map(([status, count]) => ({
            status,
            count
          }));
        } else {
          state.statusCounts = {};
          state.statusCountsArray = [];
        }
        
        state.totalApplications = applications.length;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "An error occurred while fetching applications";
        state.applications = [];
        state.statusCounts = {};
        state.statusCountsArray = [];
        state.totalApplications = 0;
      })
      // Update Status
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const { applicationId, newStatus, application } = action.payload;
        const index = state.applications.findIndex(app => app._id === applicationId);
        if (index !== -1) {
          state.applications[index] = application;
        }
        // Update status counts
        state.statusCounts = state.applications.reduce((acc, app) => {
          acc[app.status] = (acc[app.status] || 0) + 1;
          return acc;
        }, {});
        state.statusCountsArray = Object.entries(state.statusCounts).map(([status, count]) => ({
          status,
          count
        }));
      })
      // Withdraw Application
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex(app => app._id === action.payload);
        if (index !== -1) {
          state.applications[index].status = 'withdrawn';
          // Update status counts
          state.statusCounts = state.applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
          }, {});
          state.statusCountsArray = Object.entries(state.statusCounts).map(([status, count]) => ({
            status,
            count
          }));
        }
      })
      // Schedule Interview
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        const { applicationId, interview } = action.payload;
        const index = state.applications.findIndex(app => app._id === applicationId);
        if (index !== -1) {
          state.applications[index].interview = interview;
          state.applications[index].status = 'interviewed';
          // Update status counts
          state.statusCounts = state.applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
          }, {});
          state.statusCountsArray = Object.entries(state.statusCounts).map(([status, count]) => ({
            status,
            count
          }));
        }
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
