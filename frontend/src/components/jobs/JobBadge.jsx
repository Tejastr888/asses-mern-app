import React from 'react';

const BADGE_STYLES = {
  primary: 'bg-indigo-100 text-indigo-800',
  success: 'bg-green-100 text-green-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800',
};

const JobBadge = ({ type = 'primary', label }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${BADGE_STYLES[type]}`}>
      {label}
    </span>
  );
};

export default JobBadge;
