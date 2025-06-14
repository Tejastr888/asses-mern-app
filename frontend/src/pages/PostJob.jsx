import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const jobTypeOptions = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote'
];

const PostJobSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required'),
  description: Yup.string()
    .min(50, 'Description must be at least 50 characters')
    .required('Required'),
  location: Yup.string().required('Required'),
  jobType: Yup.string().required('Required'),
  salaryRange: Yup.string().required('Required'),
  requiredSkills: Yup.string().required('Required'),
});

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  if (user?.role !== 'employer') {
    return (
      <div className="text-center text-red-600 p-4">
        Access denied. Only employers can post jobs.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Post a New Job
          </h3>
          <div className="mt-5">
            <Formik
              initialValues={{
                title: '',
                description: '',
                location: '',
                jobType: '',
                salaryRange: '',
                requiredSkills: '',
              }}
              validationSchema={PostJobSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {
                  const jobData = {
                    ...values,
                    employer: user._id,
                    requiredSkills: values.requiredSkills.split(',').map(skill => skill.trim()),
                  };

                  await axios.post('/api/jobs', jobData);
                  navigate('/jobs');
                } catch (err) {
                  setStatus(err.response?.data?.message || 'Failed to post job');
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, status, isSubmitting }) => (
                <Form className="space-y-6">
                  {status && (
                    <div className="text-red-600 text-sm">
                      {status}
                    </div>
                  )}

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Job Title
                    </label>
                    <Field
                      name="title"
                      type="text"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Senior Software Engineer"
                    />
                    {errors.title && touched.title && (
                      <div className="text-red-600 text-sm mt-1">{errors.title}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      rows={4}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Describe the job responsibilities and requirements"
                    />
                    {errors.description && touched.description && (
                      <div className="text-red-600 text-sm mt-1">{errors.description}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <Field
                      name="location"
                      type="text"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., New York, NY or Remote"
                    />
                    {errors.location && touched.location && (
                      <div className="text-red-600 text-sm mt-1">{errors.location}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                      Job Type
                    </label>
                    <Field
                      name="jobType"
                      as="select"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a job type</option>
                      {jobTypeOptions.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </Field>
                    {errors.jobType && touched.jobType && (
                      <div className="text-red-600 text-sm mt-1">{errors.jobType}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700">
                      Salary Range
                    </label>
                    <Field
                      name="salaryRange"
                      type="text"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., $80,000 - $120,000/year"
                    />
                    {errors.salaryRange && touched.salaryRange && (
                      <div className="text-red-600 text-sm mt-1">{errors.salaryRange}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700">
                      Required Skills (comma-separated)
                    </label>
                    <Field
                      name="requiredSkills"
                      type="text"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., JavaScript, React, Node.js"
                    />
                    {errors.requiredSkills && touched.requiredSkills && (
                      <div className="text-red-600 text-sm mt-1">{errors.requiredSkills}</div>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Job'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
