import JobSeeker from '../model/JobSeeker.js';

// @desc    Create job seeker profile
// @route   POST /api/jobseekers
// @access  Private
export const createJobSeekerProfile = async (req, res) => {
    try {
        const {
            category,
            skills,
            experience,
            education,
            preferences,
            accessibility,
            availability
        } = req.body;

        // Check if profile already exists
        const existingProfile = await JobSeeker.findOne({ user: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        // Create profile
        const jobSeeker = await JobSeeker.create({
            user: req.user._id,
            category,
            skills,
            experience,
            education,
            preferences,
            accessibility,
            availability
        });

        res.status(201).json(jobSeeker);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get job seeker profile
// @route   GET /api/jobseekers/profile
// @access  Private
export const getJobSeekerProfile = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user._id });
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update job seeker profile
// @route   PUT /api/jobseekers/profile
// @access  Private
export const updateJobSeekerProfile = async (req, res) => {
    try {
        const profile = await JobSeeker.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (profile[key] !== undefined) {
                profile[key] = req.body[key];
            }
        });

        const updatedProfile = await profile.save();
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all job seekers (with filters)
// @route   GET /api/jobseekers
// @access  Private (Employer only)
export const getJobSeekers = async (req, res) => {
    try {
        const {
            skills,
            category,
            availability,
            preferredLocations,
            remoteWork
        } = req.query;

        let query = {};

        if (skills) {
            query.skills = { $in: skills.split(',') };
        }

        if (category) {
            query.category = category;
        }

        if (availability) {
            query['availability.immediate'] = availability === 'true';
        }

        if (preferredLocations) {
            query['preferences.preferredLocations'] = { $in: preferredLocations.split(',') };
        }

        if (remoteWork) {
            query['preferences.remoteWork'] = remoteWork === 'true';
        }

        const jobSeekers = await JobSeeker.find(query)
            .populate('user', 'firstName lastName email')
            .select('-resume -notes');

        res.json(jobSeekers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
