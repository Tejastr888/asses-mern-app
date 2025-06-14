import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from '../components/Layout';
import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import JobList from '../pages/JobList';
import JobDetail from '../pages/JobDetail';
import ProfileJobSeeker from '../pages/ProfileJobSeeker';
import ProfileEmployer from '../pages/ProfileEmployer';
import PostJob from '../pages/PostJob';
import Applications from '../pages/Applications';

const AppRoutes = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public Routes */}
                <Route index element={<Home />} />
                <Route path="jobs" element={<JobList />} />
                <Route path="jobs/:id" element={<JobDetail />} />
                <Route
                    path="login"
                    element={!user ? <Login /> : <Navigate to="/" replace />}
                />
                <Route
                    path="register"
                    element={!user ? <Register /> : <Navigate to="/" replace />}
                />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route
                        path="profile"
                        element={
                            user?.role === 'jobseeker' ? (
                                <ProfileJobSeeker />
                            ) : (
                                <ProfileEmployer />
                            )
                        }
                    />
                    <Route
                        path="post-job"
                        element={
                            user?.role === 'employer' ? (
                                <PostJob />
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />
                    <Route path="applications" element={<Applications />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
