import express from 'express';
import {
    createEmployerProfile,
    getEmployerProfile,
    updateEmployerProfile,
    getEmployers
} from '../controllers/employerController.js';
import { protect, authorize } from '../utils/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEmployers);

// Protected routes
router.use(protect);

router.post('/', authorize('employer'), createEmployerProfile);
router.get('/profile', authorize('employer'), getEmployerProfile);
router.put('/profile', authorize('employer'), updateEmployerProfile);

export default router;
