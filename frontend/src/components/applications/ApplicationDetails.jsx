import React from 'react';

const ApplicationDetails = ({ application }) => {
  return (
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
  );
};

export default ApplicationDetails;
