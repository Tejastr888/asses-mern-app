import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchApplications,
  selectStatusCounts,
  selectTotalApplications,
} from "../features/applications/applicationsSlice";

const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  switch (status) {
    case "pending":
      return (
        <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
          Pending
        </span>
      );
    case "reviewed":
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
          Reviewed
        </span>
      );
    case "shortlisted":
      return (
        <span className={`${baseClasses} bg-green-100 text-green-800`}>
          Shortlisted
        </span>
      );
    case "rejected":
      return (
        <span className={`${baseClasses} bg-red-100 text-red-800`}>
          Rejected
        </span>
      );
    case "hired":
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-800`}>
          Hired
        </span>
      );
    case "withdrawn":
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          Withdrawn
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
          {status}
        </span>
      );
  }
};

const StatusFilter = ({ counts, currentStatus, onStatusChange }) => {
  const statuses = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'reviewed', label: 'Reviewed' },
    { key: 'shortlisted', label: 'Shortlisted' },
    { key: 'hired', label: 'Hired' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'withdrawn', label: 'Withdrawn' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {statuses.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onStatusChange(key)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentStatus === key
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
          {counts && key !== 'all' && (
            <span className="ml-1 text-xs">({counts[key] || 0})</span>
          )}
        </button>
      ))}
    </div>
  );
};

const Applications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications, isLoading, isError, message } = useSelector(
    (state) => state.applications
  );
  const statusCounts = useSelector(selectStatusCounts);
  const totalApplications = useSelector(selectTotalApplications);
  const [currentStatus, setCurrentStatus] = React.useState('all');
  const filteredApplications = React.useMemo(() => {
    if (currentStatus === 'all') return applications;
    return applications.filter(app => app.status === currentStatus);
  }, [applications, currentStatus]);

  useEffect(() => {
    if (user) {
      dispatch(fetchApplications(user.role));
    }
  }, [user, dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {message}</div>
      </div>
    );
  }

  if (totalApplications === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">No Applications Found</h2>
        <Link
          to="/jobs"
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Applications</h1>
        <div className="text-gray-500">
          Total Applications: <span className="font-semibold">{totalApplications}</span>
        </div>
      </div>

      <StatusFilter
        counts={statusCounts}
        currentStatus={currentStatus}
        onStatusChange={setCurrentStatus}
      />
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredApplications.map((application) => (
            <li key={application._id} className="hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900">
                      {application.job.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {application.job.employer?.companyName}
                    </p>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    {application.job.location && (
                      <p className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {application.job.location.city},{" "}
                        {application.job.location.country}
                      </p>
                    )}
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <svg
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {application.job.employmentType}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <svg
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Applied on{" "}
                    {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-2">
                  <Link
                    to={`/applications/${application._id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Applications;
