import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import applicationsReducer from '../features/applications/applicationsSlice';
import profileReducer from '../features/profile/profileSlice';
import jobsReducer from '../features/jobs/jobsSlice';

export const store = configureStore({    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
        profile: profileReducer,
        jobs: jobsReducer,
    },
});
