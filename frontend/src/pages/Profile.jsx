import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../utils/axios';

const JobSeekerSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string(),
  skills: Yup.string().required('Required'),
  experience: Yup.string().required('Required'),
  education: Yup.string().required('Required'),
  bio: Yup.string().required('Required'),
});

const EmployerSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  companyName: Yup.string().required('Required'),
  industry: Yup.string().required('Required'),
  companySize: Yup.string().required('Required'),
  companyDescription: Yup.string().required('Required'),
  website: Yup.string().url('Invalid URL'),
});

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {        const response = await axiosInstance.get(
          user.role === 'employer'
            ? `/api/employers/profile`
            : `/api/jobseekers/profile`
        );
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-indigo-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  const isEmployer = user.role === 'employer';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEmployer ? 'Company Profile' : 'Professional Profile'}
          </h3>
          <div className="mt-5">
            <Formik
              initialValues={
                isEmployer
                  ? {
                      name: profile?.name || '',
                      email: profile?.email || '',
                      companyName: profile?.companyName || '',
                      industry: profile?.industry || '',
                      companySize: profile?.companySize || '',
                      companyDescription: profile?.companyDescription || '',
                      website: profile?.website || '',
                    }
                  : {
                      name: profile?.name || '',
                      email: profile?.email || '',
                      phone: profile?.phone || '',
                      skills: Array.isArray(profile?.skills) 
                        ? profile.skills.join(', ') 
                        : profile?.skills || '',
                      experience: profile?.experience || '',
                      education: profile?.education || '',
                      bio: profile?.bio || '',
                    }
              }
              validationSchema={isEmployer ? EmployerSchema : JobSeekerSchema}
              onSubmit={async (values, { setSubmitting, setStatus }) => {
                try {                  const endpoint = isEmployer
                    ? `/api/employers/profile`
                    : `/api/jobseekers/profile`;

                  const updatedValues = isEmployer
                    ? values
                    : {
                        ...values,
                        skills: values.skills.split(',').map((skill) => skill.trim()),
                      };

                  await axiosInstance.put(endpoint, updatedValues);
                  setStatus({ success: 'Profile updated successfully' });
                } catch (err) {
                  setStatus({ error: err.response?.data?.message || 'Failed to update profile' });
                }
                setSubmitting(false);
              }}
            >
              {({ errors, touched, status, isSubmitting }) => (
                <Form className="space-y-6">
                  {status?.error && (
                    <div className="text-red-600 text-sm">{status.error}</div>
                  )}
                  {status?.success && (
                    <div className="text-green-600 text-sm">{status.success}</div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <Field
                      name="name"
                      type="text"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-600 text-sm mt-1">{errors.name}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-600 text-sm mt-1">{errors.email}</div>
                    )}
                  </div>

                  {isEmployer ? (
                    // Employer-specific fields
                    <>
                      <div>
                        <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <Field
                          name="companyName"
                          type="text"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.companyName && touched.companyName && (
                          <div className="text-red-600 text-sm mt-1">{errors.companyName}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
                          Industry
                        </label>
                        <Field
                          name="industry"
                          type="text"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.industry && touched.industry && (
                          <div className="text-red-600 text-sm mt-1">{errors.industry}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
                          Company Size
                        </label>
                        <Field
                          name="companySize"
                          as="select"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501+">501+ employees</option>
                        </Field>
                        {errors.companySize && touched.companySize && (
                          <div className="text-red-600 text-sm mt-1">{errors.companySize}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
                          Company Description
                        </label>
                        <Field
                          name="companyDescription"
                          as="textarea"
                          rows={4}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.companyDescription && touched.companyDescription && (
                          <div className="text-red-600 text-sm mt-1">{errors.companyDescription}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                          Website
                        </label>
                        <Field
                          name="website"
                          type="url"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.website && touched.website && (
                          <div className="text-red-600 text-sm mt-1">{errors.website}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Job seeker-specific fields
                    <>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <Field
                          name="phone"
                          type="text"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.phone && touched.phone && (
                          <div className="text-red-600 text-sm mt-1">{errors.phone}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                          Skills (comma-separated)
                        </label>
                        <Field
                          name="skills"
                          type="text"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.skills && touched.skills && (
                          <div className="text-red-600 text-sm mt-1">{errors.skills}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                          Work Experience
                        </label>
                        <Field
                          name="experience"
                          as="textarea"
                          rows={4}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.experience && touched.experience && (
                          <div className="text-red-600 text-sm mt-1">{errors.experience}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                          Education
                        </label>
                        <Field
                          name="education"
                          as="textarea"
                          rows={4}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.education && touched.education && (
                          <div className="text-red-600 text-sm mt-1">{errors.education}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Professional Bio
                        </label>
                        <Field
                          name="bio"
                          as="textarea"
                          rows={4}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                        {errors.bio && touched.bio && (
                          <div className="text-red-600 text-sm mt-1">{errors.bio}</div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default Profile;
