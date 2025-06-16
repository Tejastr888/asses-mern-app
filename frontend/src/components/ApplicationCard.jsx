import React from 'react';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ApplicationCard = ({ application, onStatusUpdate, isEmployer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            <Link to={`/jobs/${application.job._id}`} className="text-indigo-600 hover:text-indigo-800">
              {application.job.title}
            </Link>
          </h3>
          <p className="text-gray-600 mb-2">
            {isEmployer ? (              <>Applicant: {application.jobSeeker?.user ? `${application.jobSeeker.user.firstName} ${application.jobSeeker.user.lastName}` : 'Unknown'}</>
            ) : (
              <>Company: {application.job.employer?.companyName}</>
            )}
          </p>
          <p className="text-sm text-gray-500">
            Applied on: {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      {isEmployer && application.status === 'pending' && (
        <div className="mt-4 space-x-2">
          <button
            onClick={() => onStatusUpdate(application._id, 'accepted')}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusUpdate(application._id, 'rejected')}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
