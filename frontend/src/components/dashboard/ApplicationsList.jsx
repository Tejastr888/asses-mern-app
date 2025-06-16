import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ApplicationsList = ({ applications, onStatusUpdate, loading }) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-800'
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading applications...</div>;
  }

  return (
    <div className="space-y-4">
      {applications.slice(0, 5).map((app) => (
        <motion.div
          key={app._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b pb-4 last:border-0"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900">
                {app.jobSeeker?.user ? 
                  `${app.jobSeeker.user.firstName} ${app.jobSeeker.user.lastName}` : 
                  'Applicant'} - {app.job?.title || 'Job'}
              </h4>
              <p className="text-sm text-gray-500 mt-1">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${statusStyles[app.status]}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
              {app.status === 'pending' && onStatusUpdate && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onStatusUpdate(app._id, 'accepted')}
                    className="px-2 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onStatusUpdate(app._id, 'rejected')}
                    className="px-2 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      <Link to="/applications" className="text-indigo-600 hover:text-indigo-800 block text-sm">
        View all applications →
      </Link>
    </div>
  );
};

export default ApplicationsList;
