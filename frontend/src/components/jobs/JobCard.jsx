import React from 'react';
import { Link } from 'react-router-dom';
import JobBadge from './JobBadge';

const JobCard = ({ job }) => {
  const formatLocation = (location) => {
    if (location.remote) return 'Remote';
    const parts = [location.city, location.state, location.country].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="relative flex flex-col bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
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
          <JobBadge type="primary" label={job.employmentType} />
          <JobBadge type="success" label={job.workplaceType} />
          <JobBadge type="info" label={formatLocation(job.location)} />
          {job.flexibleSchedule && (
            <JobBadge type="purple" label="Flexible Schedule" />
          )}
          {job.accommodations?.available && (
            <JobBadge type="warning" label="Accommodations Available" />
          )}
        </div>
        {job.salary && (
          <p className="mt-2 text-sm text-gray-600">
            Salary: {job.salary.min && `$${job.salary.min.toLocaleString()}`}
            {job.salary.max && ` - $${job.salary.max.toLocaleString()}`}
            {job.salary.isNegotiable && ' (Negotiable)'}
          </p>
        )}
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
  );
};

export default JobCard;
