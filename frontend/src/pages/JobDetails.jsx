import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axios';
import JobBadge from '../components/jobs/JobBadge';
import { MdArrowBack, MdLocationOn, MdAttachMoney, MdAccessTime, MdBusinessCenter, MdDescription, MdLink } from 'react-icons/md';
import { BsBuildingsFill, BsCalendarCheck, BsShare, BsBriefcase, BsClockHistory } from 'react-icons/bs';
import { IoSchool, IoPeople, IoDocumentText } from 'react-icons/io5';
import { FaRegCheckCircle, FaHandHoldingHeart, FaRegClock } from 'react-icons/fa';
import { HiOfficeBuilding, HiCurrencyDollar, HiLocationMarker } from 'react-icons/hi';
import { AiFillCheckCircle, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiTime, BiCalendarAlt } from 'react-icons/bi';
import { RiUserHeartLine } from 'react-icons/ri';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobResponse, statusResponse] = await Promise.all([
          axiosInstance.get(`/api/jobs/${id}`),
          user?.role === 'jobseeker' ? axiosInstance.get(`/api/applications/status/${id}`) : null
        ]);

        setJob(jobResponse.data);
        if (statusResponse) {
          setApplicationStatus(statusResponse.data);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch job details');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setApplying(true);
      await axiosInstance.post('/api/applications', {
        jobId: id,
        coverLetter: applicationData.coverLetter,
      });
      navigate('/applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: salary.currency || 'USD',
      maximumFractionDigits: 0,
    });
    
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}${salary.isNegotiable ? ' (Negotiable)' : ''}`;
  };

  const formatLocation = (location) => {
    if (!location) return 'Not specified';
    if (location.remote) return `Remote (Based in ${location.city}, ${location.state}, ${location.country})`;
    return `${location.city}, ${location.state}, ${location.country}`;
  };

  const renderApplyButton = () => {
    if (!user) {
      return (
        <button
          onClick={() => navigate('/login')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Login to Apply
        </button>
      );
    }

    if (user.role !== 'jobseeker') {
      return null;
    }

    if (applicationStatus?.hasApplied) {
      return (
        <div className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-gray-50">
          <span className="mr-2">✓</span>
          Applied
          {applicationStatus.status !== 'pending' && ` • ${applicationStatus.status.charAt(0).toUpperCase() + applicationStatus.status.slice(1)}`}
        </div>
      );
    }

    if (!showApplicationForm) {
      return (
        <button
          onClick={() => setShowApplicationForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Apply Now
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <h3 className="text-xl text-gray-600">Job not found</h3>
        <Link to="/jobs" className="mt-4 text-indigo-600 hover:text-indigo-800">
          Browse other jobs →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back to jobs */}
      <Link
        to="/jobs"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <MdArrowBack className="h-5 w-5 mr-1" />
        Back to Jobs
      </Link>

      {/* Main Content */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {/* Header Section */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {job?.title}
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                {job?.employer.companyName}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <JobBadge type="primary" label={job?.employmentType} />
                <JobBadge type="success" label={job?.workplaceType} />
                {job?.flexibleSchedule && (
                  <JobBadge type="purple" label="Flexible Schedule" />
                )}
                {job?.accommodations?.available && (
                  <JobBadge type="warning" label="Accommodations Available" />
                )}
              </div>
            </div>
            {renderApplyButton()}
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-gray-50 px-4 py-5 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
            <HiLocationMarker className="h-6 w-6 text-indigo-500" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Location</div>
              <div className="text-sm text-gray-900">{formatLocation(job.location)}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
            <HiCurrencyDollar className="h-6 w-6 text-green-500" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Salary Range</div>
              <div className="text-sm text-gray-900">{formatSalary(job.salary)}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
            <BsBriefcase className="h-6 w-6 text-purple-500" />
            <div>
              <div className="text-xs text-gray-500 font-medium">Employment Type</div>
              <div className="text-sm text-gray-900">{job.employmentType}</div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MdBusinessCenter className="h-5 w-5 mr-2" />
            Requirements
          </h2>
          <div className="space-y-4">
            {job.requirements?.experience && (
              <div className="flex items-start">
                <BiTime className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Experience</h3>
                  <p className="text-sm text-gray-600">
                    Minimum: {job.requirements.experience.minimum} years
                    {job.requirements.experience.preferred && 
                      ` (${job.requirements.experience.preferred} years preferred)`}
                  </p>
                </div>
              </div>
            )}

            {job.requirements?.education && (
              <div className="flex items-start">
                <IoSchool className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Education</h3>
                  <p className="text-sm text-gray-600">
                    {job.requirements.education.level} in {job.requirements.education.field}
                  </p>
                </div>
              </div>
            )}

            {job.requirements?.skills?.length > 0 && (
              <div className="flex items-start">
                <FaRegCheckCircle className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.skills.map((skill, index) => (
                      <JobBadge key={index} type="primary" label={skill} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BsBuildingsFill className="h-5 w-5 mr-2" />
            Job Description
          </h2>
          <div className="prose max-w-none text-gray-700">
            {job.description}
          </div>
        </div>

        {/* Benefits Section */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaHandHoldingHeart className="h-5 w-5 mr-2 text-pink-500" />
              Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <AiFillCheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Environment Section */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <HiOfficeBuilding className="h-5 w-5 mr-2 text-blue-500" />
            Work Environment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <BiCalendarAlt className="h-5 w-5 text-indigo-500 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Schedule</h3>
                  <p className="text-sm text-gray-600">{job.flexibleSchedule ? 'Flexible working hours available' : 'Standard working hours'}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <IoPeople className="h-5 w-5 text-indigo-500 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Work Arrangement</h3>
                  <p className="text-sm text-gray-600">{job.workplaceType.charAt(0).toUpperCase() + job.workplaceType.slice(1)}</p>
                </div>
              </div>
            </div>

            {job.accommodations?.available && (
              <div className="flex items-start space-x-3">
                <RiUserHeartLine className="h-5 w-5 text-indigo-500 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Workplace Accommodations</h3>
                  <p className="text-sm text-gray-600">{job.accommodations.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Application Section */}
        {showApplicationForm && user?.role === 'jobseeker' && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <IoDocumentText className="h-5 w-5 mr-2 text-indigo-500" />
              Submit Your Application
            </h2>
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 flex items-center">
                  <MdDescription className="h-5 w-5 mr-2 text-gray-400" />
                  Cover Letter
                </label>
                <div className="mt-1">
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Tell us why you're a great fit for this position..."
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData(prev => ({
                      ...prev,
                      coverLetter: e.target.value
                    }))}
                    required
                  />
                </div>
              </div>              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {applying ? (
                    <>
                      <AiOutlineLoading3Quarters className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer Section */}
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FaRegClock className="h-4 w-4 mr-2" />
              Posted {new Date(job.publishedAt || job.createdAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  // You could add a toast notification here
                }}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
                title="Copy job URL to clipboard"
              >
                <BsShare className="h-4 w-4 mr-1" />
                Share Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
