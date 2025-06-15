import * as Yup from 'yup';

export const JobSchema = Yup.object({
    title: Yup.string()
        .required('Job title is required')
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title must be less than 100 characters'),
    description: Yup.string()
        .required('Job description is required')
        .min(50, 'Description must be at least 50 characters'),
    requirements: Yup.object({
        skills: Yup.array()
            .of(Yup.string())
            .min(1, 'At least one skill is required'),
        experience: Yup.object({
            minimum: Yup.number()
                .min(0, 'Minimum experience cannot be negative')
                .required('Minimum experience is required'),
            preferred: Yup.number()
                .min(Yup.ref('minimum'), 'Preferred experience must be greater than minimum')
        }),
        education: Yup.object({
            level: Yup.string().required('Education level is required'),
            field: Yup.string()
        })
    }),
    employmentType: Yup.string()
        .required('Employment type is required')
        .oneOf(['full-time', 'part-time', 'contract', 'temporary', 'internship']),
    workplaceType: Yup.string()
        .required('Workplace type is required')
        .oneOf(['remote', 'on-site', 'hybrid']),
    location: Yup.object({
        city: Yup.string().when('workplaceType', {
            is: (val) => val !== 'remote',
            then: Yup.string().required('City is required for non-remote positions'),
            otherwise: Yup.string()
        }),
        state: Yup.string().when('workplaceType', {
            is: (val) => val !== 'remote',
            then: Yup.string().required('State is required for non-remote positions'),
            otherwise: Yup.string()
        }),
        country: Yup.string().required('Country is required'),
        remote: Yup.boolean()
    }),
    salary: Yup.object({
        min: Yup.number()
            .min(0, 'Minimum salary cannot be negative')
            .required('Minimum salary is required'),
        max: Yup.number()
            .min(Yup.ref('min'), 'Maximum salary must be greater than minimum')
            .required('Maximum salary is required'),
        currency: Yup.string().required('Currency is required'),
        isNegotiable: Yup.boolean()
    }),
    benefits: Yup.array().of(Yup.string()),
    flexibleSchedule: Yup.boolean(),
    accommodations: Yup.object({
        available: Yup.boolean(),
        description: Yup.string().when('available', {
            is: true,
            then: Yup.string().required('Please describe available accommodations'),
            otherwise: Yup.string()
        })
    }),
    status: Yup.string()
        .required('Status is required')
        .oneOf(['draft', 'published', 'closed', 'paused']),
    applicationDeadline: Yup.date()
        .min(new Date(), 'Deadline must be in the future')
        .required('Application deadline is required')
});
