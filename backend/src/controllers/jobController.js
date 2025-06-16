import Job from '../model/Job.js';
import Application from '../model/Application.js';
import Employer from '../model/Employer.js';

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer only)
export const createJob = async (req, res) => {
    try {
        // Debug logs to check authentication and user data
        // console.log('Auth Header:', req.headers.authorization);
        // console.log('User Data:', req.user);
        // console.log('User ID:', req.user?._id);
        // console.log('User Role:', req.user?.role);
        
        if (!req.user) {
            console.log('No user found in request');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (req.user.role !== 'employer') {
            console.log('User role is not employer:', req.user.role);
            return res.status(403).json({ message: 'Only employers can create jobs' });
        }

        // First, find the employer profile for this user
        const employer = await Employer.findOne({ user: req.user._id });
        
        if (!employer) {
            console.log('No employer profile found for user:', req.user._id);
            return res.status(400).json({ 
                message: 'Employer profile not found. Please complete your employer profile first.'
            });
        }

        // console.log('Found employer profile:', employer);
        // console.log('Creating job with employer ID:', employer._id);
        
        const job = await Job.create({
            ...req.body,
            employer: employer._id, // Use the Employer document ID, not the User ID
            publishedAt: req.body.status === 'published' ? Date.now() : null
        });

        console.log('Created job:', job);

        // Fetch and log the created job with populated employer data
        const populatedJob = await Job.findById(job._id)
            .populate('employer', 'companyName location industry');
        
        // console.log('Populated job data:', populatedJob);

        res.status(201).json(populatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res) => {
    try {
        const { 
            keyword, 
            location, 
            employmentType, 
            workplaceType,
            accommodations,
            flexibleSchedule,
            salaryMin 
        } = req.query;

        let query = { status: 'published' };

        // Search by keyword in title, description, and required skills
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { 'requirements.skills': { $regex: keyword, $options: 'i' } }
            ];
        }

        // Filter by location
        if (location) {
            query['location.city'] = { $regex: location, $options: 'i' };
        }

        // Filter by employment type
        if (employmentType && employmentType !== 'all') {
            query.employmentType = employmentType;
        }

        // Filter by workplace type
        if (workplaceType && workplaceType !== 'all') {
            query.workplaceType = workplaceType;
        }

        // Filter by accommodations availability
        if (accommodations === 'true') {
            query['accommodations.available'] = true;
        }

        // Filter by flexible schedule
        if (flexibleSchedule === 'true') {
            query.flexibleSchedule = true;
        }

        // Filter by minimum salary
        if (salaryMin) {
            query['salary.min'] = { $gte: parseInt(salaryMin) };
        }

        const jobs = await Job.find(query)
            .populate({
                path: 'employer',
                select: 'companyName location'
            })
            .sort({ publishedAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('employer', 'companyName companyDescription location workplaceFeatures');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // If status is being changed to published, set publishedAt
        if (req.body.status === 'published' && job.status !== 'published') {
            req.body.publishedAt = Date.now();
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check ownership
        if (job.employer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Delete all applications for this job
        await Application.deleteMany({ job: job._id });
        
        await job.remove();
        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get employer's posted jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer only)
export const getMyJobs = async (req, res) => {
    try {        const jobs = await Job.find({ employer: req.user._id })
            .populate({
                path: 'employer',
                select: 'companyName location'
            })
            .select('title description location employmentType workplaceType status createdAt')
            .sort({ createdAt: -1 });

        // Get application counts for each job
        const jobsWithApplications = await Promise.all(jobs.map(async (job) => {
            const applicationCount = await Application.countDocuments({ job: job._id });
            return {
                ...job.toJSON(),
                applicationCount
            };
        }));

        res.json(jobsWithApplications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
