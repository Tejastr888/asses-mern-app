import mongoose from 'mongoose';

const jobSeekerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        enum: ['regular', 'career-break-returner', 'disabled', 'veteran', 'retiree'],
        required: true
    },
    skills: [{
        type: String,
        required: true
    }],
    experience: [{
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        description: String,
        isCurrentRole: Boolean
    }],
    education: [{
        degree: String,
        institution: String,
        field: String,
        graduationYear: Number
    }],
    resume: {
        url: String,
        updatedAt: Date
    },
    preferences: {
        remoteWork: {
            type: Boolean,
            default: false
        },
        flexibleSchedule: {
            type: Boolean,
            default: false
        },
        preferredLocations: [String],
        expectedSalary: {
            min: Number,
            max: Number,
            currency: {
                type: String,
                default: 'USD'
            }
        }
    },
    accessibility: {
        requirements: String,
        accommodationsNeeded: [String]
    },
    availability: {
        immediate: Boolean,
        noticePeriod: Number
    }
}, {
    timestamps: true
});

const JobSeeker = mongoose.model('JobSeeker', jobSeekerSchema);
export default JobSeeker;
