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

// Protected routes - Employer only
router.use(protect);
router.use(authorize('employer'));

router.post('/', createJob);
router.get('/my-jobs', getMyJobs); // Move after the middleware setup
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;
