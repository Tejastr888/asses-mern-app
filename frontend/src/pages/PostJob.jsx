import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { FaBriefcase } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { JobSchema } from '../components/jobs/validationSchema';
import { BasicJobInfo, RequirementsSection } from '../components/jobs/JobFormSections';
import { LocationAndSalarySection, BenefitsSection } from '../components/jobs/AdditionalSections';
import axiosInstance from '../utils/axios';

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [error, setError] = useState(null);

    const initialValues = {
        title: '',
        description: '',
        requirements: {
            skills: [],
            experience: {
                minimum: 0,
                preferred: 0
            },
            education: {
                level: '',
                field: ''
            }
        },
        employmentType: '',
        workplaceType: '',
        location: {
            city: '',
            state: '',
            country: '',
            remote: false
        },
        salary: {
            min: 0,
            max: 0,
            currency: 'USD',
            isNegotiable: false
        },
        benefits: [],
        flexibleSchedule: false,
        accommodations: {
            available: false,
            description: ''
        },
        status: 'draft',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    };

    const handleSubmit = async (values, { setSubmitting, setStatus }) => {
        try {
            // Process skills array if it's a string
            if (typeof values.requirements.skills === 'string') {
                values.requirements.skills = values.requirements.skills
                    .split(',')
                    .map(skill => skill.trim())
                    .filter(Boolean);
            }

            // Set location.remote based on workplaceType
            values.location.remote = values.workplaceType === 'remote';

            const response = await axiosInstance.post('/api/jobs', values);
            
            setStatus({ success: 'Job posted successfully!' });
            // Redirect to job details page after a brief delay
            setTimeout(() => {
                navigate(`/jobs/${response.data._id}`);
            }, 1500);
        } catch (err) {
            console.error('Error posting job:', err);
            setStatus({ error: err.response?.data?.message || 'Failed to post job' });
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaBriefcase className="text-indigo-600" />
                Post a New Job
            </h1>

            {error && (
                <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                    {error}
                </div>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={JobSchema}
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

                        <BasicJobInfo errors={errors} touched={touched} />
                        <RequirementsSection values={values} errors={errors} touched={touched} />
                        <LocationAndSalarySection values={values} errors={errors} touched={touched} />
                        <BenefitsSection values={values} errors={errors} touched={touched} />

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Application Deadline
                                    </label>
                                    <Field
                                        type="date"
                                        name="applicationDeadline"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    {errors.applicationDeadline && touched.applicationDeadline && (
                                        <div className="text-red-600 text-sm mt-1">{errors.applicationDeadline}</div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    <Field
                                        as="select"
                                        name="status"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="closed">Closed</option>
                                        <option value="paused">Paused</option>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Posting...</span>
                                        </>
                                    ) : (
                                        'Post Job'
                                    )}
                                </button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default PostJob;
