import Application from '../model/Application.js';
import Job from '../model/Job.js';

// @desc    Create job application
// @route   POST /api/applications
// @access  Private (Job Seeker only)
export const createApplication = async (req, res) => {
    try {
        const { jobId, coverLetter, answers } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user has already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            jobSeeker: req.user._id
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        const application = await Application.create({
            job: jobId,
            jobSeeker: req.user._id,
            coverLetter,
            answers,
            status: 'pending'
        });

        // Increment applications count on job
        await Job.findByIdAndUpdate(jobId, {
            $inc: { applicationsCount: 1 }
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
export const getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ job: req.params.jobId })
            .populate('jobSeeker', 'firstName lastName email')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all applications by a job seeker
// @route   GET /api/applications/me
// @access  Private (Job Seeker only)
export const getMyApplications = async (req, res) => {
    try {
        // Validate user exists and has jobSeeker role
        if (!req.user || req.user.role !== 'jobseeker') {
            return res.status(403).json({ message: 'Access denied. Job seeker access only.' });
        }

        console.log('Fetching applications for user:', req.user._id); // Debug log

        const applications = await Application.find({ jobSeeker: req.user._id })
            .populate({
                path: 'job',
                select: 'title location status jobType',
                populate: {
                    path: 'employer',
                    select: 'companyName'
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        console.log('Found applications:', applications.length); // Debug log
        res.json(applications);
    } catch (error) {
        console.error('Error in getMyApplications:', error); // Debug log
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get job seeker's recent applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
export const getMyRecentApplications = async (req, res) => {
    try {
        const applications = await Application.find({ jobSeeker: req.user._id })
            .populate({
                path: 'job',
                select: 'title status location jobType',
                populate: {
                    path: 'employer',
                    select: 'companyName'
                }
            })
            .select('status createdAt appliedAt')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private (Employer only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        if (notes) {
            application.notes.push({
                content: notes,
                author: req.user._id
            });
        }

        const updatedApplication = await application.save();
        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Schedule interview
// @route   POST /api/applications/:id/interview
// @access  Private (Employer only)
export const scheduleInterview = async (req, res) => {
    try {
        const { round, dateTime, type } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.interviewSchedule.push({
            round,
            dateTime,
            type,
            status: 'scheduled'
        });

        application.status = 'shortlisted';
        const updatedApplication = await application.save();

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Job Seeker only)
export const withdrawApplication = async (req, res) => {
    try {
        const { reason } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobSeeker.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        application.withdrawnBy = 'jobseeker';
        application.withdrawnReason = reason;
        application.status = 'withdrawn';

        const updatedApplication = await application.save();

        // Decrement applications count on job
        await Job.findByIdAndUpdate(application.job, {
            $inc: { applicationsCount: -1 }
        });

        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get employer's received applications
// @route   GET /api/applications/received
// @access  Private (Employer only)
export const getReceivedApplications = async (req, res) => {
    try {        // First, get all jobs posted by this employer
        const employerJobs = await Job.find({ employer: req.user._id }).select('_id');
        const jobIds = employerJobs.map(job => job._id);

        // Then find applications for these jobs
        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate('jobSeeker', 'name email phone')
            .populate({
                path: 'job',
                select: 'title status location jobType',
                populate: {
                    path: 'employer',
                    select: 'companyName'
                }
            })
            .select('status createdAt coverLetter')
            .sort({ createdAt: -1 });

        // Filter out applications for jobs that don't belong to this employer
        const validApplications = applications.filter(app => app.job);
        
        res.json(validApplications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get dashboard data
// @route   GET /api/applications/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        let dashboardData = {
            totalApplications: 0,
            recentApplications: [],
            applicationStats: {
                pending: 0,
                accepted: 0,
                rejected: 0
            }
        };

        if (userRole === 'jobseeker') {
            // Get applications submitted by the job seeker
            const applications = await Application.find({ applicant: userId })
                .populate({
                    path: 'job',
                    select: 'title company status'
                })
                .sort({ createdAt: -1 });

            dashboardData.totalApplications = applications.length;
            dashboardData.recentApplications = applications.slice(0, 5);
            
            // Calculate application stats
            applications.forEach(app => {
                dashboardData.applicationStats[app.status.toLowerCase()]++;
            });

        } else if (userRole === 'employer') {
            // Get applications received for employer's jobs
            const employerJobs = await Job.find({ employer: userId }).select('_id');
            const jobIds = employerJobs.map(job => job._id);
            
            const applications = await Application.find({ job: { $in: jobIds } })
                .populate({
                    path: 'job',
                    select: 'title'
                })
                .populate({
                    path: 'applicant',
                    select: 'name email'
                })
                .sort({ createdAt: -1 });

            dashboardData.totalApplications = applications.length;
            dashboardData.recentApplications = applications.slice(0, 5);
            
            // Calculate application stats
            applications.forEach(app => {
                dashboardData.applicationStats[app.status.toLowerCase()]++;
            });

            // Add additional employer-specific stats
            dashboardData.totalJobs = employerJobs.length;
            dashboardData.activeJobs = await Job.countDocuments({ 
                employer: userId,
                status: 'active'
            });
        }

        res.json(dashboardData);
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};
