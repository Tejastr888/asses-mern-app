import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: 'all'
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const params = {
          ...(filters.keyword && { keyword: filters.keyword }),
          ...(filters.location && { location: filters.location }),
          ...(filters.jobType !== 'all' && { jobType: filters.jobType })
        };        const response = await axiosInstance.get('/api/jobs', { params });
        setJobs(response.data);
        setLoading(false);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err?.response?.data?.message || 'Failed to fetch jobs');
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Available Jobs</h1>
            <p className="mt-2 text-sm text-gray-700">
              Browse through our latest job opportunities
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="keyword"
              placeholder="Search by title or company..."
              value={filters.keyword}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              name="location"
              placeholder="Location..."
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              {jobs.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl text-gray-600">No jobs found matching your criteria</h3>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="relative flex flex-col bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {job.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {job.employer.companyName}
                        </p>
                        <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                          {job.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {job.jobType}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {job.location}
                          </span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Link
                          to={`/jobs/${job._id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
