import React from 'react';

const ApplicantDetails = ({ jobSeeker }) => {
  if (!jobSeeker) return null;

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">Applicant Details</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
        <div>
          <span className="font-medium">Name: </span>
          {jobSeeker.user ? `${jobSeeker.user.firstName} ${jobSeeker.user.lastName}` : 'Unknown'}
        </div>
        <div>
          <span className="font-medium">Email: </span>
          {jobSeeker.user?.email || 'N/A'}
        </div>
        <div>
          <span className="font-medium">Category: </span>
          {jobSeeker.category ? jobSeeker.category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'N/A'}
        </div>
        <div>
          <span className="font-medium">Skills: </span>
          {jobSeeker.skills?.length > 0 ? jobSeeker.skills.join(', ') : 'No skills listed'}
        </div>
        {jobSeeker.preferences?.expectedSalary && (
          <div>
            <span className="font-medium">Expected Salary: </span>
            {`${jobSeeker.preferences.expectedSalary.currency} ${jobSeeker.preferences.expectedSalary.min.toLocaleString()} - ${jobSeeker.preferences.expectedSalary.max.toLocaleString()}`}
          </div>
        )}
        <div>
          <span className="font-medium">Remote Work: </span>
          {jobSeeker.preferences?.remoteWork ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetails;
