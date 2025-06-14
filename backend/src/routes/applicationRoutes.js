import express from 'express';
import {
    createApplication,
    getJobApplications,
    getMyApplications,
    updateApplicationStatus,
    scheduleInterview,
    withdrawApplication,
    getMyRecentApplications,
    getReceivedApplications,
    getDashboardData
} from '../controllers/applicationController.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Job seeker routes
router.post('/', authorize('jobseeker'), createApplication);
router.get('/me', authorize('jobseeker'), getMyApplications);
router.get('/my-applications', authorize('jobseeker'), getMyRecentApplications);
router.put('/:id/withdraw', authorize('jobseeker'), withdrawApplication);

// Employer routes
router.get('/job/:jobId', authorize('employer'), getJobApplications);
router.get('/received', authorize('employer'), getReceivedApplications);
router.put('/:id', authorize('employer'), updateApplicationStatus);
router.post('/:id/interview', authorize('employer'), scheduleInterview);

// Dashboard route
router.get('/dashboard', protect, getDashboardData);

export default router;
