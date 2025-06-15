import * as Yup from 'yup';

export const JobSeekerSchema = Yup.object().shape({
    category: Yup.string()
        .required('Category is required')
        .oneOf(['regular', 'career-break-returner', 'disabled', 'veteran', 'retiree']),
    skills: Yup.array()
        .of(Yup.string())
        .min(1, 'At least one skill is required'),
    experience: Yup.array().of(
        Yup.object().shape({
            title: Yup.string().required('Job title is required'),
            company: Yup.string().required('Company name is required'),
            location: Yup.string(),
            startDate: Yup.date().required('Start date is required'),
            endDate: Yup.date().when('isCurrentRole', {
                is: false,
                then: Yup.date().min(Yup.ref('startDate'), 'End date must be after start date')
            }),
            description: Yup.string(),
            isCurrentRole: Yup.boolean()
        })
    ),
    education: Yup.array().of(
        Yup.object().shape({
            degree: Yup.string().required('Degree is required'),
            institution: Yup.string().required('Institution is required'),
            field: Yup.string().required('Field of study is required'),
            graduationYear: Yup.number()
                .required('Graduation year is required')
                .min(1950, 'Invalid year')
                .max(2030, 'Invalid year')
        })
    ),
    preferences: Yup.object().shape({
        remoteWork: Yup.boolean(),
        flexibleSchedule: Yup.boolean(),
        preferredLocations: Yup.array().of(Yup.string()),
        expectedSalary: Yup.object().shape({
            min: Yup.number().min(0),
            max: Yup.number().min(Yup.ref('min'), 'Maximum must be greater than minimum'),
            currency: Yup.string()
        })
    }),
    accessibility: Yup.object().shape({
        requirements: Yup.string(),
        accommodationsNeeded: Yup.array().of(Yup.string())
    }),
    availability: Yup.object().shape({
        immediate: Yup.boolean(),
        noticePeriod: Yup.number().min(0)
    }),
    resume: Yup.object().shape({
        url: Yup.string().url('Must be a valid URL'),
        updatedAt: Yup.date()
    })
});

export const EmployerSchema = Yup.object().shape({
    companyName: Yup.string().required('Company name is required'),
    industry: Yup.string().required('Industry is required'),
    companySize: Yup.string()
        .required('Company size is required')
        .oneOf(['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']),
    companyDescription: Yup.string().required('Company description is required'),
    website: Yup.string().url('Must be a valid URL'),
    location: Yup.object().shape({
        address: Yup.string(),
        city: Yup.string(),
        state: Yup.string(),
        country: Yup.string(),
        zipCode: Yup.string()
    }),
    socialMedia: Yup.object().shape({
        linkedin: Yup.string().url('Must be a valid URL'),
        twitter: Yup.string().url('Must be a valid URL'),
        facebook: Yup.string().url('Must be a valid URL')
    }),
    inclusivityPrograms: Yup.array()
        .of(Yup.string().oneOf([
            'disability-friendly',
            'veteran-program',
            'return-to-work',
            'retirement-transition'
        ])),
    workplaceFeatures: Yup.object().shape({
        remoteWorkPolicy: Yup.string().oneOf(['remote-only', 'hybrid', 'flexible', 'on-site']),
        flexibleHours: Yup.boolean(),
        accessibilityFeatures: Yup.array().of(Yup.string())
    })
});
