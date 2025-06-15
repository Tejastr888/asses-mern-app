import express from 'express';
import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs
} from '../controllers/jobController.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.use(protect);

// Employer only routes
router.use(authorize('employer'));
router.get('/my-jobs', getMyJobs);
router.post('/', createJob);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
