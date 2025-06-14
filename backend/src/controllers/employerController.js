import Employer from '../model/Employer.js';

// @desc    Create employer profile
// @route   POST /api/employers
// @access  Private
export const createEmployerProfile = async (req, res) => {
    try {
        const {
            companyName,
            industry,
            companySize,
            companyDescription,
            website,
            location,
            socialMedia,
            inclusivityPrograms,
            workplaceFeatures
        } = req.body;

        // Check if profile already exists
        const existingProfile = await Employer.findOne({ user: req.user._id });
        if (existingProfile) {
            return res.status(400).json({ message: 'Profile already exists' });
        }

        // Create profile
        const employer = await Employer.create({
            user: req.user._id,
            companyName,
            industry,
            companySize,
            companyDescription,
            website,
            location,
            socialMedia,
            inclusivityPrograms,
            workplaceFeatures
        });

        res.status(201).json(employer);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get employer profile
// @route   GET /api/employers/profile
// @access  Private
export const getEmployerProfile = async (req, res) => {
    try {
        const profile = await Employer.findOne({ user: req.user._id });
        
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update employer profile
// @route   PUT /api/employers/profile
// @access  Private
export const updateEmployerProfile = async (req, res) => {
    try {
        const profile = await Employer.findOne({ user: req.user._id });

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

// @desc    Get all employers (with filters)
// @route   GET /api/employers
// @access  Public
export const getEmployers = async (req, res) => {
    try {
        const {
            industry,
            companySize,
            inclusivityPrograms,
            workplaceType
        } = req.query;

        let query = {};

        if (industry) {
            query.industry = industry;
        }

        if (companySize) {
            query.companySize = companySize;
        }

        if (inclusivityPrograms) {
            query.inclusivityPrograms = { $in: inclusivityPrograms.split(',') };
        }

        if (workplaceType) {
            query['workplaceFeatures.remoteWorkPolicy'] = workplaceType;
        }

        const employers = await Employer.find(query)
            .populate('user', 'firstName lastName email')
            .select('-socialMedia.linkedin -socialMedia.twitter -socialMedia.facebook');

        res.json(employers);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
