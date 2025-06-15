import React from 'react';
import JobCard from './JobCard';

const JobsList = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl text-gray-600">No jobs found matching your criteria</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobsList;
