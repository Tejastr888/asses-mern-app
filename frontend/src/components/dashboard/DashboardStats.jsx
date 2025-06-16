import React from 'react';

const DashboardStats = ({ jobs, applications }) => {
  const activeJobs = jobs?.filter(job => job.status === 'published').length || 0;
  const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Active Job Posts</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{activeJobs}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Applications</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{applications?.length || 0}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
        <p className="mt-2 text-3xl font-semibold text-gray-900">{pendingApplications}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
