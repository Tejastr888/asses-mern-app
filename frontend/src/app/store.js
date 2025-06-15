import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import applicationsReducer from '../features/applications/applicationsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
    },
});
