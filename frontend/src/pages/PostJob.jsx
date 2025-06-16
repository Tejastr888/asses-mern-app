import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createJob, reset } from '../features/jobs/jobsSlice';
import { toast } from 'react-toastify';
import { jobValidationSchema } from '../components/jobs/validationSchema';

const PostJob = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.jobs
  );

  useEffect(() => {
    // Redirect if not logged in or not an employer
    if (!user || user.role !== 'employer') {
      toast.error('Only employers can post jobs');
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      navigate('/jobs');
      toast.success('Job posted successfully');
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, isSuccess, message, navigate, dispatch]);
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
      currency: 'USD'
    },
    benefits: [],
    status: 'published',
    flexibleSchedule: false
  };
  const formik = useFormik({
    initialValues,
    validationSchema: jobValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log('Form submission started', values);
      
      // Validate required fields
      if (!values.title || !values.description || !values.employmentType || !values.workplaceType) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      try {
        console.log('Dispatching createJob action');
        const result = await dispatch(createJob(values)).unwrap();
        console.log('Job created successfully:', result);
      } catch (error) {
        console.error('Error creating job:', error);
        setSubmitting(false);
        toast.error(error?.message || 'Error posting job');
      }
    },
  });

  const [newSkill, setNewSkill] = React.useState('');
  const [newBenefit, setNewBenefit] = React.useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !formik.values.requirements.skills.includes(newSkill.trim())) {
      formik.setFieldValue('requirements.skills', [...formik.values.requirements.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    formik.setFieldValue(
      'requirements.skills',
      formik.values.requirements.skills.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formik.values.benefits.includes(newBenefit.trim())) {
      formik.setFieldValue('benefits', [...formik.values.benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    formik.setFieldValue(
      'benefits',
      formik.values.benefits.filter((benefit) => benefit !== benefitToRemove)
    );
  };

  return (    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              id="description"
              name="description"
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Required Skills</label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formik.values.requirements.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 inline-flex items-center p-0.5 hover:bg-indigo-200 rounded-full"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="min-experience" className="block text-sm font-medium text-gray-700">Minimum Experience (years)</label>
                <input
                  type="number"
                  id="min-experience"
                  name="requirements.experience.minimum"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formik.values.requirements.experience.minimum}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label htmlFor="preferred-experience" className="block text-sm font-medium text-gray-700">Preferred Experience (years)</label>
                <input
                  type="number"
                  id="preferred-experience"
                  name="requirements.experience.preferred"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formik.values.requirements.experience.preferred}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="education-level" className="block text-sm font-medium text-gray-700">Education Level</label>
              <select
                id="education-level"
                name="requirements.education.level"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formik.values.requirements.education.level}
                onChange={formik.handleChange}
              >
                <option value="">Select Education Level</option>
                <option value="high_school">High School</option>
                <option value="bachelors">Bachelor's Degree</option>
                <option value="masters">Master's Degree</option>
                <option value="phd">Ph.D.</option>
              </select>
            </div>

            <div>
              <label htmlFor="education-field" className="block text-sm font-medium text-gray-700">Field of Study</label>
              <input
                type="text"
                id="education-field"
                name="requirements.education.field"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formik.values.requirements.education.field}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="employment-type" className="block text-sm font-medium text-gray-700">Employment Type</label>
              <select
                id="employment-type"
                name="employmentType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formik.values.employmentType}
                onChange={formik.handleChange}
              >
                <option value="">Select Employment Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="workplace-type" className="block text-sm font-medium text-gray-700">Workplace Type</label>
              <select
                id="workplace-type"
                name="workplaceType"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formik.values.workplaceType}
                onChange={formik.handleChange}
              >
                <option value="">Select Workplace Type</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          {formik.values.workplaceType !== 'remote' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="location.city"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formik.values.location.city}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  id="state"
                  name="location.state"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formik.values.location.state}
                  onChange={formik.handleChange}
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  id="country"
                  name="location.country"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formik.values.location.country}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="min-salary" className="block text-sm font-medium text-gray-700">Minimum Salary</label>
              <input
                type="number"
                id="min-salary"
                name="salary.min"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formik.values.salary.min}
                onChange={formik.handleChange}
              />
            </div>

            <div>
              <label htmlFor="max-salary" className="block text-sm font-medium text-gray-700">Maximum Salary</label>
              <input
                type="number"
                id="max-salary"
                name="salary.max"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={formik.values.salary.max}
                onChange={formik.handleChange}              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Benefits</label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Enter a benefit (e.g., Health Insurance)"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddBenefit}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formik.values.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {benefit}
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(benefit)}
                      className="ml-2 inline-flex items-center p-0.5 hover:bg-green-200 rounded-full"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="flexibleSchedule"
                name="flexibleSchedule"
                checked={formik.values.flexibleSchedule}
                onChange={formik.handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="flexibleSchedule" className="ml-2 block text-sm text-gray-900">
                Flexible Schedule
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
              ${formik.isValid ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400'}
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => {
              if (!formik.isValid) {
                toast.error('Please fill in all required fields correctly');
              }
            }}
          >
            {formik.isSubmitting ? 'Posting...' : 'Post Job'}
            {!formik.isValid && Object.keys(formik.errors).length > 0 && (
              <span className="ml-2 text-xs">(Form has errors)</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
