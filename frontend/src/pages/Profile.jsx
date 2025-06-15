import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../utils/axios';

// Job Seeker validation schema
const JobSeekerSchema = Yup.object().shape({
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
    })
});

// Employer validation schema
const EmployerSchema = Yup.object().shape({
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
    workplaceFeatures: Yup.object().shape({
        remoteWorkPolicy: Yup.string().oneOf(['remote-only', 'hybrid', 'flexible', 'on-site']),
        flexibleHours: Yup.boolean(),
        accessibilityFeatures: Yup.array().of(Yup.string())
    })
});

const Profile = () => {
    const { user } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get(
                    user?.role === 'employer'
                        ? '/api/employers/profile'
                        : '/api/jobseekers/profile'
                );
                setProfile(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 404) {
                    // Profile doesn't exist yet - that's okay
                    setProfile(null);
                    setLoading(false);
                } else {
                    setError(err.response?.data?.message || 'Failed to fetch profile');
                    setLoading(false);
                }
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            const endpoint = user.role === 'employer' ? '/api/employers' : '/api/jobseekers';
            const method = profile ? 'put' : 'post';
            
            // Process skills and locations from string to array if needed
            if (user.role === 'jobseeker') {
                if (typeof values.skills === 'string') {
                    values.skills = values.skills.split(',').map(skill => skill.trim());
                }
                if (typeof values.preferences?.preferredLocations === 'string') {
                    values.preferences.preferredLocations = values.preferences.preferredLocations
                        .split(',')
                        .map(location => location.trim());
                }
            }

            const response = await axiosInstance[method](endpoint, values);
            setProfile(response.data);
            setStatus({ success: 'Profile saved successfully!' });
        } catch (err) {
            setStatus({ error: err.response?.data?.message || 'Failed to save profile' });
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const isEmployer = user?.role === 'employer';
    const initialValues = profile || (isEmployer ? {
        companyName: '',
        industry: '',
        companySize: '',
        companyDescription: '',
        website: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        workplaceFeatures: {
            remoteWorkPolicy: 'on-site',
            flexibleHours: false,
            accessibilityFeatures: []
        }
    } : {
        category: 'regular',
        skills: [],
        experience: [],
        education: [],
        preferences: {
            remoteWork: false,
            flexibleSchedule: false,
            preferredLocations: [],
            expectedSalary: {
                min: 0,
                max: 0,
                currency: 'USD'
            }
        }
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">
                {!profile ? 'Create Profile' : 'Edit Profile'}
            </h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    {error}
                </div>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={isEmployer ? EmployerSchema : JobSeekerSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, isSubmitting, status }) => (
                    <Form className="space-y-6">
                        {status?.error && (
                            <div className="text-red-600 bg-red-50 p-4 rounded">
                                {status.error}
                            </div>
                        )}
                        {status?.success && (
                            <div className="text-green-600 bg-green-50 p-4 rounded">
                                {status.success}
                            </div>
                        )}

                        {isEmployer ? (
                            // Employer Form Fields
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <Field
                                        name="companyName"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.companyName && touched.companyName && (
                                        <div className="text-red-600 text-sm mt-1">{errors.companyName}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                                    <Field
                                        name="industry"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.industry && touched.industry && (
                                        <div className="text-red-600 text-sm mt-1">{errors.industry}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Size</label>
                                    <Field
                                        as="select"
                                        name="companySize"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">Select company size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-500">201-500 employees</option>
                                        <option value="501-1000">501-1000 employees</option>
                                        <option value="1000+">1000+ employees</option>
                                    </Field>
                                    {errors.companySize && touched.companySize && (
                                        <div className="text-red-600 text-sm mt-1">{errors.companySize}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Description</label>
                                    <Field
                                        as="textarea"
                                        name="companyDescription"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.companyDescription && touched.companyDescription && (
                                        <div className="text-red-600 text-sm mt-1">{errors.companyDescription}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Website</label>
                                    <Field
                                        name="website"
                                        type="url"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.website && touched.website && (
                                        <div className="text-red-600 text-sm mt-1">{errors.website}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Policy</label>
                                    <Field
                                        as="select"
                                        name="workplaceFeatures.remoteWorkPolicy"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="remote-only">Remote Only</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="flexible">Flexible</option>
                                        <option value="on-site">On-site</option>
                                    </Field>
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <Field
                                            type="checkbox"
                                            name="workplaceFeatures.flexibleHours"
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Flexible Hours</span>
                                    </label>
                                </div>
                            </>
                        ) : (
                            // Job Seeker Form Fields
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <Field
                                        as="select"
                                        name="category"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="regular">Regular</option>
                                        <option value="career-break-returner">Career Break Returner</option>
                                        <option value="disabled">Person with Disability</option>
                                        <option value="veteran">Veteran</option>
                                        <option value="retiree">Retiree</option>
                                    </Field>
                                    {errors.category && touched.category && (
                                        <div className="text-red-600 text-sm mt-1">{errors.category}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Skills</label>
                                    <Field
                                        name="skills"
                                        as="textarea"
                                        placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.skills && touched.skills && (
                                        <div className="text-red-600 text-sm mt-1">{errors.skills}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                                    <FieldArray name="experience">
                                        {({ push, remove }) => (
                                            <div className="space-y-4">
                                                {values.experience.map((_, index) => (
                                                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                                                <Field
                                                                    name={`experience.${index}.title`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Company</label>
                                                                <Field
                                                                    name={`experience.${index}.company`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                                                <Field
                                                                    type="date"
                                                                    name={`experience.${index}.startDate`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                                                <Field
                                                                    type="date"
                                                                    name={`experience.${index}.endDate`}
                                                                    disabled={values.experience[index].isCurrentRole}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="flex items-center">
                                                                    <Field
                                                                        type="checkbox"
                                                                        name={`experience.${index}.isCurrentRole`}
                                                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                    />
                                                                    <span className="ml-2 text-sm text-gray-700">Current Role</span>
                                                                </label>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                                                <Field
                                                                    as="textarea"
                                                                    name={`experience.${index}.description`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            Remove Experience
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => push({
                                                        title: '',
                                                        company: '',
                                                        location: '',
                                                        startDate: '',
                                                        endDate: '',
                                                        description: '',
                                                        isCurrentRole: false
                                                    })}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                                >
                                                    Add Experience
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
                                    <FieldArray name="education">
                                        {({ push, remove }) => (
                                            <div className="space-y-4">
                                                {values.education.map((_, index) => (
                                                    <div key={index} className="p-4 border rounded-lg bg-gray-50">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Degree</label>
                                                                <Field
                                                                    name={`education.${index}.degree`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Institution</label>
                                                                <Field
                                                                    name={`education.${index}.institution`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Field of Study</label>
                                                                <Field
                                                                    name={`education.${index}.field`}
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
                                                                <Field
                                                                    type="number"
                                                                    name={`education.${index}.graduationYear`}
                                                                    min="1950"
                                                                    max="2030"
                                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                />
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                                                        >
                                                            Remove Education
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => push({
                                                        degree: '',
                                                        institution: '',
                                                        field: '',
                                                        graduationYear: new Date().getFullYear()
                                                    })}
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                                                >
                                                    Add Education
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>

                                <div className="border-t pt-6 mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="flex items-center">
                                                <Field
                                                    type="checkbox"
                                                    name="preferences.remoteWork"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Open to Remote Work</span>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="flex items-center">
                                                <Field
                                                    type="checkbox"
                                                    name="preferences.flexibleSchedule"
                                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">Flexible Schedule</span>
                                            </label>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Preferred Locations</label>
                                            <Field
                                                name="preferences.preferredLocations"
                                                as="textarea"
                                                placeholder="Enter locations separated by commas (e.g., New York, Remote, London)"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Minimum Salary</label>
                                                <Field
                                                    type="number"
                                                    name="preferences.expectedSalary.min"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Maximum Salary</label>
                                                <Field
                                                    type="number"
                                                    name="preferences.expectedSalary.max"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Currency</label>
                                                <Field
                                                    as="select"
                                                    name="preferences.expectedSalary.currency"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    <option value="USD">USD</option>
                                                    <option value="EUR">EUR</option>
                                                    <option value="GBP">GBP</option>
                                                    <option value="CAD">CAD</option>
                                                    <option value="AUD">AUD</option>
                                                </Field>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : (profile ? 'Update Profile' : 'Create Profile')}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Profile;
