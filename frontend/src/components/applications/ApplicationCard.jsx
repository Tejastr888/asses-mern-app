import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import ApplicantDetails from './ApplicantDetails';
import ApplicationDetails from './ApplicationDetails';

const ApplicationCard = ({ 
  application, 
  userRole,
  onStatusUpdate, 
  onWithdraw,
  onScheduleInterview
}) => {  const navigate = useNavigate();
  const isEmployer = userRole === 'employer';

  const handleViewJob = () => {
    navigate(`/jobs/${application.job._id}`);
  };

  const renderEmployerActions = () => {
    if (application.status === 'pending') {
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onStatusUpdate(application._id, 'accepted')}
            className="px-3 py-1 text-green-700 bg-green-100 rounded hover:bg-green-200"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusUpdate(application._id, 'rejected')}
            className="px-3 py-1 text-red-700 bg-red-100 rounded hover:bg-red-200"
          >
            Reject
          </button>
        </div>
      );
    }
    
    if (application.status === 'accepted' && !application.interview) {
      return (
        <button
          onClick={() => onScheduleInterview(application._id)}
          className="px-3 py-1 text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
        >
          Schedule Interview
        </button>
      );
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {application.job?.title}
            </h3>
            <StatusBadge status={application.status} />
          </div>
          
          <div className="flex flex-col gap-2">
            {isEmployer ? (
              <>
                <ApplicantDetails jobSeeker={application.jobSeeker} />
                <ApplicationDetails application={application} />
                {application.interview && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800">Interview Details</h4>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Date: {new Date(application.interview.date).toLocaleDateString()}</p>
                      <p>Time: {application.interview.time}</p>
                      <p>Location: {application.interview.location}</p>
                      {application.interview.notes && (
                        <p className="mt-1">Notes: {application.interview.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 text-gray-600">
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
                  <div className="mt-2">
                    <p className="font-medium text-gray-700">Cover Letter:</p>
                    <p className="mt-1 text-gray-600 line-clamp-3">{application.coverLetter}</p>
                  </div>
                )}
                {application.interview && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800">Interview Scheduled</h4>
                    <div className="mt-1 text-sm text-blue-700">
                      <p>Date: {new Date(application.interview.date).toLocaleDateString()}</p>
                      <p>Time: {application.interview.time}</p>
                      <p>Location: {application.interview.location}</p>
                      {application.interview.notes && (
                        <p className="mt-1">Notes: {application.interview.notes}</p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleViewJob}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Job Details
        </button>

        {isEmployer ? (
          renderEmployerActions()
        ) : (
          application.status === 'pending' && (
            <button
              onClick={() => onWithdraw(application._id)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Withdraw Application
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
