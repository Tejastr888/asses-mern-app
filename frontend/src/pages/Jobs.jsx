import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import JobFilters from '../components/jobs/JobFilters';
import JobsList from '../components/jobs/JobsList';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    employmentType: 'all',
    workplaceType: 'all',
    accommodations: false,
    flexibleSchedule: false,
    salaryMin: '',
  });
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        // Only add filters that have values
        if (filters.keyword.trim()) {
          params.append('keyword', filters.keyword.trim());
        }
        if (filters.location.trim()) {
          params.append('location', filters.location.trim());
        }
        if (filters.employmentType !== 'all') {
          params.append('employmentType', filters.employmentType);
        }
        if (filters.workplaceType !== 'all') {
          params.append('workplaceType', filters.workplaceType);
        }
        if (filters.accommodations) {
          params.append('accommodations', 'true');
        }
        if (filters.flexibleSchedule) {
          params.append('flexibleSchedule', 'true');
        }
        if (filters.salaryMin) {
          params.append('salaryMin', filters.salaryMin);
        }

        const response = await axiosInstance.get(`/api/jobs?${params.toString()}`);
        setJobs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err?.response?.data?.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    // Use a debounce for text inputs to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      employmentType: 'all',
      workplaceType: 'all',
      accommodations: false,
      flexibleSchedule: false,
      salaryMin: '',
    });
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
              Browse through our inclusive job opportunities for all candidates
            </p>
          </div>
        </div>

        <JobFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
        
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <JobsList jobs={jobs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
