import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
        required: true
    },
    companyDescription: {
        type: String,
        required: true
    },
    website: {
        type: String,
        trim: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String
    },
    inclusivityPrograms: [{
        type: String,
        enum: ['disability-friendly', 'veteran-program', 'return-to-work', 'retirement-transition']
    }],
    workplaceFeatures: {
        remoteWorkPolicy: {
            type: String,
            enum: ['remote-only', 'hybrid', 'flexible', 'on-site']
        },
        flexibleHours: Boolean,
        accessibilityFeatures: [String]
    }
}, {
    timestamps: true
});

const Employer = mongoose.model('Employer', employerSchema);
export default Employer;
