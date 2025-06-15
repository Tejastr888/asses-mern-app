import React from 'react';

const JobFilters = ({ filters, onFilterChange, onClearFilters }) => {
  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-4">
        {/* Search and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="keyword"
            placeholder="Search by title, skills, or company..."
            value={filters.keyword}
            onChange={onFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="text"
            name="location"
            placeholder="Location..."
            value={filters.location}
            onChange={onFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Employment and Workplace Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="employmentType"
            value={filters.employmentType}
            onChange={onFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Employment Types</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="contract">Contract</option>
            <option value="temporary">Temporary</option>
            <option value="internship">Internship</option>
          </select>
          <select
            name="workplaceType"
            value={filters.workplaceType}
            onChange={onFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="all">All Workplace Types</option>
            <option value="remote">Remote</option>
            <option value="on-site">On-site</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Accessibility and Flexibility Options */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accommodations"
              checked={filters.accommodations}
              onChange={onFilterChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Workplace Accommodations Available
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="flexibleSchedule"
              checked={filters.flexibleSchedule}
              onChange={onFilterChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Flexible Schedule
            </span>
          </label>
        </div>

        {/* Salary Filter */}
        <div className="flex items-center gap-4">
          <input
            type="number"
            name="salaryMin"
            placeholder="Minimum Salary"
            value={filters.salaryMin}
            onChange={onFilterChange}
            className="w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobFilters;
