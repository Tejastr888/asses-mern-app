import express from 'express';
import {
    createJobSeekerProfile,
    getJobSeekerProfile,
    updateJobSeekerProfile,
    getJobSeekers
} from '../controllers/jobSeekerController.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Job seeker routes
router.post('/', authorize('jobseeker'), createJobSeekerProfile);
router.get('/profile', authorize('jobseeker'), getJobSeekerProfile);
router.put('/profile', authorize('jobseeker'), updateJobSeekerProfile);

// Employer access to job seekers
router.get('/', authorize('employer'), getJobSeekers);

export default router;
