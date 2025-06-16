import React from 'react';
import StatusBadge from './StatusBadge';
import ApplicantDetails from './ApplicantDetails';
import ApplicationDetails from './ApplicationDetails';

const ApplicationCard = ({ 
  application, 
  isEmployer, 
  onStatusUpdate, 
  onWithdraw 
}) => {
  return (
    <li className="p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">
              {application.job?.title}
            </h3>
            <StatusBadge status={application.status} />
          </div>
          
          <div className="mt-2 flex flex-col gap-2 text-sm">
            {isEmployer ? (
              <>
                <ApplicantDetails jobSeeker={application.jobSeeker} />
                <ApplicationDetails application={application} />
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

        {/* Action Buttons */}
        {isEmployer && application.status === "pending" ? (
          <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-shrink-0 gap-2">
            <button
              onClick={() => onStatusUpdate(application._id, "accepted")}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Accept
            </button>
            <button
              onClick={() => onStatusUpdate(application._id, "rejected")}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reject
            </button>
          </div>
        ) : (
          !isEmployer && application.status === "pending" && (
            <div className="mt-4 sm:mt-0 sm:ml-6">
              <button
                onClick={() => onWithdraw(application._id)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Withdraw
              </button>
            </div>
          )
        )}
      </div>
    </li>
  );
};

export default ApplicationCard;
