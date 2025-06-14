import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: {
        skills: [{
            type: String,
            required: true
        }],
        experience: {
            minimum: Number,
            preferred: Number
        },
        education: {
            level: String,
            field: String
        }
    },
    employmentType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
        required: true
    },
    workplaceType: {
        type: String,
        enum: ['remote', 'on-site', 'hybrid'],
        required: true
    },
    location: {
        city: String,
        state: String,
        country: String,
        remote: Boolean
    },
    salary: {
        min: Number,
        max: Number,
        currency: {
            type: String,
            default: 'USD'
        },
        isNegotiable: Boolean
    },
    benefits: [{
        type: String
    }],
    flexibleSchedule: {
        type: Boolean,
        default: false
    },
    accommodations: {
        available: Boolean,
        description: String
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'closed', 'paused'],
        default: 'draft'
    },
    applicationDeadline: Date,
    publishedAt: Date,
    applicationsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for search functionality
jobSchema.index({
    title: 'text',
    description: 'text',
    'requirements.skills': 'text'
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
