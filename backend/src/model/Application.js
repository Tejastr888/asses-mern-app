import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    jobSeeker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobSeeker',
        required: true
    },    
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
        default: 'pending'
    },
    withdrawnBy: {
        type: String,
        enum: ['jobseeker', 'employer'],
    },
    withdrawnReason: {
        type: String
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn']
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reason: String,
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    coverLetter: {
        type: String
    },
    resume: {
        url: String,
        updatedAt: Date
    },
    answers: [{
        question: String,
        answer: String
    }],
    notes: [{
        content: String,
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    interviewSchedule: [{
        round: Number,
        dateTime: Date,
        type: {
            type: String,
            enum: ['phone', 'video', 'in-person']
        },
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled', 'rescheduled']
        },
        feedback: String
    }]
}, {
    timestamps: true
});

// Compound index to ensure one application per job per user
applicationSchema.index({ job: 1, jobSeeker: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
