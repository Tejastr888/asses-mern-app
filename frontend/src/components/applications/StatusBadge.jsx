import React from 'react';

const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  switch (status) {
    case "pending":
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
    case "accepted":
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Accepted</span>;
    case "rejected":
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rejected</span>;
    case "withdrawn":
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Withdrawn</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

export default StatusBadge;
