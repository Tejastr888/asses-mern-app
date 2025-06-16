import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axios";

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  switch (status) {
    case "pending":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    case "accepted":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Accepted</span>;
    case "rejected":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

const Applications = () => {
  const { user } = useSelector((state) => state.auth);
  const [applications, setApplications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get(
          user.role === "employer"
            ? "/api/applications/received"
            : "/api/applications/my-applications"
        );
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err.response?.data?.message || "Failed to fetch applications");
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleWithdraw = async (applicationId) => {
    try {
      await axiosInstance.put(`/api/applications/${applicationId}/withdraw`);
      
      // Update the application status in the local state
      setApplications(applications.map((app) =>
        app._id === applicationId ? { ...app, status: "withdrawn" } : app
      ));
    } catch (err) {
      console.error("Error withdrawing application:", err);
      setError(err.response?.data?.message || "Failed to withdraw application");
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axiosInstance.put(`/api/applications/${applicationId}/status`, {
        status: newStatus,
      });

      // Update the application status in the local state
      setApplications(applications.map((app) =>
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update application status");
    }
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.role === "employer" ? "Job Applications" : "My Applications"}
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {user.role === "employer"
              ? "View and manage applications for your job postings"
              : "Track your job applications and their status"}
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">
            No applications found.
            {user.role !== "employer" && (
              <Link
                to="/jobs"
                className="text-indigo-600 hover:text-indigo-800 ml-2"
              >
                Browse available jobs →
              </Link>
            )}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {applications.map((application) => (
              <li key={application._id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.job?.title}
                      </h3>
                      <StatusBadge status={application.status} />
                    </div>                    <div className="mt-2 flex flex-col gap-2 text-sm">
                      {user.role === "employer" ? (
                        <>
                          {/* Applicant Details Section */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Applicant Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
                              <div>
                                <span className="font-medium">Name: </span>
                                {application.jobSeeker?.user ? `${application.jobSeeker.user.firstName} ${application.jobSeeker.user.lastName}` : 'Unknown'}
                              </div>
                              <div>
                                <span className="font-medium">Email: </span>
                                {application.jobSeeker?.user?.email || 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Category: </span>
                                {application.jobSeeker?.category ? application.jobSeeker.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A'}
                              </div>
                              <div>
                                <span className="font-medium">Skills: </span>
                                {application.jobSeeker?.skills?.length > 0 
                                  ? application.jobSeeker.skills.join(', ') 
                                  : 'No skills listed'}
                              </div>
                              {application.jobSeeker?.preferences?.expectedSalary && (
                                <div>
                                  <span className="font-medium">Expected Salary: </span>
                                  {`${application.jobSeeker.preferences.expectedSalary.currency} ${application.jobSeeker.preferences.expectedSalary.min.toLocaleString()} - ${application.jobSeeker.preferences.expectedSalary.max.toLocaleString()}`}
                                </div>
                              )}
                              <div>
                                <span className="font-medium">Remote Work: </span>
                                {application.jobSeeker?.preferences?.remoteWork ? 'Yes' : 'No'}
                              </div>
                            </div>
                          </div>

                          {/* Application Details Section */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                            <div className="grid grid-cols-1 gap-2 text-gray-600">
                              <div>
                                <span className="font-medium">Applied on: </span>
                                {new Date(application.createdAt).toLocaleDateString()} at {new Date(application.createdAt).toLocaleTimeString()}
                              </div>
                              {application.coverLetter && (
                                <div>
                                  <span className="font-medium">Cover Letter:</span>
                                  <p className="mt-1 whitespace-pre-line">{application.coverLetter}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-4 text-gray-500">
                            <div>
                              <span className="font-medium">Company: </span>
                              {application.job?.employer?.companyName}
                            </div>
                            <div>
                              <span className="font-medium">Applied on: </span>
                              {new Date(application.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {application.coverLetter && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="font-medium">Cover Letter:</p>
                              <p className="mt-1 whitespace-pre-line">{application.coverLetter}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {user.role === "employer" && application.status === "pending" ? (
                    <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-shrink-0 gap-2">
                      <button
                        onClick={() => handleStatusUpdate(application._id, "accepted")}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application._id, "rejected")}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    user.role === "jobseeker" && application.status === "pending" && (
                      <div className="mt-4 sm:mt-0 sm:ml-6">
                        <button
                          onClick={() => handleWithdraw(application._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Withdraw
                        </button>
                      </div>
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Applications;
